import {
  setAttendCount,
  setInitLoading,
  setMessages,
  setVideoRegionHeight,
  setVideoRegionWidth,
} from "../store/actions";
import store from "../store/store";
import { hostMeeting, joinMeeting } from "./webSocketApi";
import Peer from "simple-peer-light";
import * as webSocketApi from "./webSocketApi";
import { fetchTURNCredentials, getTURNCredentials } from "./turnServerApi";
import { storeMicIntervalData } from "../pages/RoomPage/StreamRegion/Btns/MicBtn";
import { postRecording } from "./fetchUserApi";
import * as peerDOMHandler from "./peerDOMHandler";

let localStream;
let shareStream;
//-----------------start call--------------------------------------------------
export const previewCall = async (constrain) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constrain);
    console.log("receive local stream success!");
    return localStream;
  } catch (error) {
    console.log("error: ", error);
  }
};
export const startCall = async (isHost, username, roomId = "", avatar) => {
  try {
    await fetchTURNCredentials();

    //selfSocketId not update yet
    const selfSocketId = store.getState().selfSocketId;

    console.log(selfSocketId);
    console.log("Hi startCall");

    //observe the room-page-panel-I as video region height and width size
    const videoRegionContainerEl = document.querySelector(".room-page-panel-I");
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        store.dispatch(setVideoRegionHeight(entry.contentRect.height));
        store.dispatch(setVideoRegionWidth(entry.contentRect.width));
      }
    });
    observer.observe(videoRegionContainerEl);

    //create dom
    peerDOMHandler.addStream(
      isHost,
      localStream,
      selfSocketId,
      username,
      avatar
    );
    store.dispatch(setInitLoading(false)); //disable loading svg

    isHost
      ? hostMeeting(isHost, username, avatar)
      : joinMeeting(isHost, username, roomId, avatar);
  } catch (error) {
    console.log(`startCall error: ${error}`);
  }
};
//-----------------peer connection--------------------------------------------------
let peers = {}; //{[{socketId:socketId}, ....]}
//allow us get internet connection info
const getConfiguration = () => {
  const turnIceServers = getTURNCredentials();
  if (turnIceServers) {
    console.log("add TURN server to iceServers");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        ...turnIceServers,
      ],
    };
  } else {
    console.warn("STUN server only");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

const messengerChannel = "messenger";

export const newPeerConnect = (
  connUserSocketId,
  username,
  isMakeConnection
) => {
  const configuration = getConfiguration();
  
  //all user except you
  peers[connUserSocketId] = new Peer({
    initiator: isMakeConnection,
    config: configuration,
    stream: localStream, //attendee's localStream
    channelName: messengerChannel,
  });
  peers[connUserSocketId].on("error", (err) => {
    //bypass simple peer bug
    if (err.error.message !== "User-Initiated Abort, reason=Close called") {
      console.log("error: ", err);
    }
  });

  peers[connUserSocketId].on("signal", (data) => {
    //webRTC offer, answer, ice candidates
    // I set peers[connUserSocketId](new comer) receive signal event
    // send my signal data to peers[connUserSocketId]
    console.log("signal");

    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
      username: username,
    };
    webSocketApi.signalPeerData(signalData);
  });

  peers[connUserSocketId].on("stream", (stream) => {
    console.log("new stream");

    const attendees = store.getState().attendees;
    let newComerIsHost = false;
    let newComerAvatar = "";
    //connUserSocketId is new comer, create new comer dom
    attendees.forEach((attendee) => {
      if (attendee.socketId === connUserSocketId) {
        newComerIsHost = attendee.isHost;
        newComerAvatar = attendee.avatar;
      }
    });
    peerDOMHandler.addStream(
      newComerIsHost,
      stream,
      connUserSocketId,
      username,
      newComerAvatar
    );
  });
  let initializePeer = peers[connUserSocketId];
  peers[connUserSocketId].on("connect", () => {
    //once connect, those initial state should update
    //send my current status let new comer modify my state and vice versa.
    webSocketApi.sendVideoTrackStateToPeer(connUserSocketId);
    webSocketApi.sendAudioTrackStateToPeer(connUserSocketId);
    webSocketApi.sendSharingStateToPeer(connUserSocketId);
    webSocketApi.sendRecordingStateToPeer(connUserSocketId);

    const isShare = store.getState().isShare;
    if (isShare) {
      initialReplaceStreamTrack(shareStream, initializePeer);
    }
  });
};
//-----------------inform all peers, need to remove dom--------------------------------------------------
export function removePeerConnection(data) {
  const { socketId } = data;

  const videoContainerEl = document.querySelector(
    `#video-container-${socketId}`
  );
  const videoElementEl = document.querySelector(`#video-${socketId}`);
  if (videoContainerEl && videoElementEl) {
    const tracks = videoElementEl.srcObject.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    videoElementEl.srcObject = null;
    videoElementEl.remove();
    videoContainerEl.remove();

    if (peers[socketId]) {
      peers[socketId].destroy();
      delete peers[socketId];
    }
  }

  const attendCount = store.getState().attendCount;
  store.dispatch(setAttendCount(attendCount - 1));
  console.log("attendee counts", attendCount - 1);
}

// attendee receive new comer's signal and id , note that here socket id is new comer's
// this is the end of signaling, then push to peer array
export function signalingDataHandler(data) {
  peers[data.connUserSocketId].signal(data.signal);
}

/////////////////////buttons////////////////////////////////////////////////////////////////////////////////
export function togglePreviewMicBtn(isMuted) {
  //if isMute = true => enabled = false
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;
}

export function toggleMicBtn(isMuted) {
  //if isMute = true => enabled = false
  localStream.getAudioTracks()[0].enabled = isMuted ? false : true;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 1024;

  const source = audioContext.createMediaStreamSource(localStream);
  const gainNode = audioContext.createGain();

  gainNode.gain.value = 700; // Increase the gain by 700x
  source.connect(gainNode);
  gainNode.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const audioLevels = [];

  let detectMic = window.setInterval(() => {
    analyser.getByteTimeDomainData(dataArray);
    //audio level: 0~255, mic off=128
    const audioLevel =
      dataArray.reduce((sum, value) => sum + value) / dataArray.length;
    audioLevels.push(audioLevel);

    //use moving average to prevent level sudden drop.
    if (audioLevels.length >= 5) {
      // audio average level in 1 second
      const averageAudioLevel =
        audioLevels.reduce((sum, value) => sum + value) / audioLevels.length;
      //mic off=128
      const threshold = 128;
      let result = "not speaking";
      if (averageAudioLevel > threshold) {
        result = "speaking";
      } else {
        result = "not speaking";
      }
      //remove first element
      audioLevels.splice(0, audioLevels.length - 5);

      if (
        result === "speaking" ||
        result !== storeMicIntervalData.previousResult
      ) {
        //send to peer
        //speaking data pass, and no speaking only 1 time
        const micData = {
          result: result,
          avgAudioLevel: averageAudioLevel,
        };
        console.log(micData);
        webSocketApi.sendMicDataThroughDataChannel(micData);
      }

      storeMicIntervalData.previousResult = result;
    }
  }, 200);

  if (isMuted) {
    const resetMicData = {
      result: "not speaking",
      avgAudioLevel: 128,
    };
    webSocketApi.sendMicDataThroughDataChannel(resetMicData);
    audioContext.close();
    clearInterval(detectMic);
    clearInterval(storeMicIntervalData.id); //clear previous id
  } else {
    storeMicIntervalData.id = detectMic; //remember id wait for next time delete it
  }
}

export function toggleCamBtn(isCamOff) {
  localStream.getVideoTracks()[0].enabled = isCamOff ? false : true;
}

export function toggleScreenSharing(isShare, shareScreenStream) {
  if (isShare) {
    shareStream = shareScreenStream;
    replaceStreamTrack(shareScreenStream);
  } else {
    shareStream = null;
    replaceStreamTrack(localStream);
  }
}

//-----------------for new comer getting the screen sharing stream--------------------------------------------------
function initialReplaceStreamTrack(stream = null, initializePeer) {
  for (let peersTrack in initializePeer.streams[0].getTracks()) {
    for (let shareTrack in stream.getTracks()) {
      if (
        initializePeer.streams[0].getTracks()[peersTrack].kind ===
        stream.getTracks()[shareTrack].kind
      ) {
        initializePeer.replaceTrack(
          initializePeer.streams[0].getTracks()[peersTrack],
          stream.getTracks()[shareTrack],
          initializePeer.streams[0]
        );
        break;
      }
    }
  }
}
//-----------------replace by screen sharing stream--------------------------------------------------
function replaceStreamTrack(stream = null) {
  for (let socketId in peers) {
    for (let peersTrack in peers[socketId].streams[0].getTracks()) {
      for (let shareTrack in stream.getTracks()) {
        if (
          peers[socketId].streams[0].getTracks()[peersTrack].kind ===
          stream.getTracks()[shareTrack].kind
        ) {
          peers[socketId].replaceTrack(
            peers[socketId].streams[0].getTracks()[peersTrack],
            stream.getTracks()[shareTrack],
            peers[socketId].streams[0]
          );
          break;
        }
      }
    }
  }
}
//-----------------recording part--------------------------------------------------
let recorderBackup = null;
export async function toggleScreenRecording(isRecording, recorder) {
  try {
    if (isRecording) {
      recorderBackup = recorder;
      startRecording(recorder);
    } else {
      const response = await stopRecording(recorderBackup);
      return response;
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

function startRecording(recorder) {
  recorder.startRecording();
}

//need to use promise to await it fulfill, then return the resolve value
//so toggleScreenRecording can await stopRecording's response
async function stopRecording(recorder) {
  if (recorder) {
    return new Promise((resolve, reject) => {
      recorder.stopRecording(async function () {
        const blob = await recorder.getBlob();
        const roomId = store.getState().roomId;
        const selfSocketId = store.getState().selfSocketId;
        let formData = new FormData();
        formData.append("file", blob, `${roomId}-${selfSocketId}.webm`);
        formData.append("fileType", `${blob.type}`);
        formData.append("roomId", `${roomId}`);
        const response = await postRecording(formData);
        recorderBackup = null;
        //if success, resolve function will return response
        resolve(response);
      });
    });
  }
}

//-----------------update messages state--------------------------------------------------
export function appendNewMessage(newMessageData) {
  //get the messages state from redux
  const messages = store.getState().messages;
  //append new message to messages
  store.dispatch(setMessages([...messages, newMessageData]));
}
