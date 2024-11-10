import React, { useState } from "react";
import RecordStartImg from "../../../../assets/images/record_start.svg";
import RecordStopImg from "../../../../assets/images/record_stop.svg";
import { connect } from "react-redux";
import { setIsRecording } from "../../../../store/actions";
import { toggleScreenRecording } from "../../../../utils/webRTCApi";
import { sendRecordingStatus } from "../../../../utils/webSocketApi";
import RecordRTC from "recordrtc";
import Modal3 from "../../../../components/Modal/Modal3";
import Modal from "../../../../components/Modal/Modal";
import loadingImg from "../../../../assets/images/sing-in-loading.png";
import { useHistory } from "react-router-dom";

const RecordBtn = (props) => {
  const {
    isSignIn,
    isRecording,
    setIsRecordingAction,
    screenStream,
    streamRecorder,
    setStreamRecorder,
  } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [openAccessModal, setOpenAccessModal] = useState(false);
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [recordingResponse, setRecordingResponse] = useState("");

  const handler = async () => {
    if (isSignIn) {
      if (!isRecording) {
        const recorder = RecordRTC(screenStream, {
          type: "video",
          mimeType: "video/webm;codecs=vp8",
        });
        sendRecordingStatus(!isRecording);
        toggleScreenRecording(!isRecording, recorder);
        setIsRecordingAction(!isRecording);
        setStreamRecorder(recorder);
      } else {
        setLoading(true);
        sendRecordingStatus(!isRecording);
        try {
          const response = await toggleScreenRecording(
            !isRecording,
            streamRecorder
          );

          if (response.error) {
            setRecordingResponse(response.message);
          }
        } catch (error) {
          console.log("error: ", error);
        } finally {
          setLoading(false);
          setOpenRecordingModal(true);
          setIsRecordingAction(!isRecording);
          setStreamRecorder(null);
        }
      }
    } else {
      setOpenAccessModal(true);
    }
  };

  function signInBtnHandler() {
    setOpenAccessModal(false);
    history.push("/signin");
  }
  function checkBtnHandler() {
    setOpenAccessModal(false);
  }
  function checkRecordingHandler() {
    setOpenRecordingModal(false);
  }

  
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIsRecordingAction: (isRecording) =>
      dispatch(setIsRecording(isRecording)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(RecordBtn);
