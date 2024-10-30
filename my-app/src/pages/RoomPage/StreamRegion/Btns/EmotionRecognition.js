import React, { useRef, useState, useEffect } from "react";
import DetectionImg from "../../../../assets/images/image.png";

const EMOTION_API_URL = "http://localhost:5000/analyze_emotion";

const EmotionDetectBtn = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const videoRef = useRef(null);
  const intervalIdRef = useRef(null); // Reference to store interval ID
  const streamRef = useRef(null); // Reference to store media stream

  const captureTab = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
      });
      videoRef.current.srcObject = captureStream;
      streamRef.current = captureStream; // Store stream to stop later
    } catch (err) {
      console.error("Error capturing browser tab: ", err);
    }
  };

  const startEmotionDetection = () => {
    if (!isDetecting) {
      captureTab();
      intervalIdRef.current = setInterval(() => {
        captureAndSendFrame();
      }, 1000);
      setIsDetecting(true);
    } else {
      // Stop detecting and clear data
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setIsDetecting(false);
      setEmotions([]);
      
      // Stop video stream to release resources
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const captureAndSendFrame = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) { // Check if video is ready
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL("image/jpeg");

      if (imageSrc) {
        try {
          const response = await fetch(EMOTION_API_URL, {
            method: "POST",
            body: createFormData(imageSrc),
          });
          const data = await response.json();
          if (response.ok) {
            setEmotions(data.emotions);
          } else {
            console.error("Error detecting emotions: ", data.error);
          }
        } catch (err) {
          console.error("Error fetching emotion data: ", err);
        }
      }
    }
  };

  const createFormData = (imageSrc) => {
    const formData = new FormData();
    const imageBlob = dataURLToBlob(imageSrc);
    formData.append("image", imageBlob);
    return formData;
  };

  const dataURLToBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      clearInterval(intervalIdRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="function-btn-container">
      <div className="predict-container" onClick={startEmotionDetection}>
        <img
          className="chat-btn-img function-btn-img"
          src={DetectionImg}
          alt="Start Detection"
        />
        <div className="function-btn-name">
          {isDetecting ? "Stop Detection" : "Start Detection"}
        </div>
        <video ref={videoRef} style={{ display: "none" }} autoPlay />
      </div>

      {/* Display Detected Emotions */}
      <div className="emotion-display">
        {isDetecting && emotions.length > 0 &&
          emotions.map((emotionData, index) => (
            <div
            key={index}
            style={{
              position: "absolute",
              top: `${emotionData.face_position.y}px`, // Position based on face location
              left: `${emotionData.face_position.x}px`, // Position based on face location
              transform: "translate(-50%, -100%)", // Center the label above the face
              border: "2px solid red",
              padding: "5px",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Optional: add background for readability
              fontSize: "14px",
              }}
            >
              {emotionData.emotion}
            </div>
          ))}
      </div>
    </div>
  );
};

export default EmotionDetectBtn;
