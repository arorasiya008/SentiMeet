import React from "react";
import { useHistory } from "react-router-dom";

const Btn = ({ text, handler, cancel = true }) => {
  const btnClassName = cancel ? "join-cancel-btn" : "join-btn btn-not-allowed";
  return (
    <div onClick={handler} className={btnClassName}>
      {text}
    </div>
  );
};

const JoinBtns = ({ newIsHost, handler }) => {
  //handler name need to be same as Btn defined.... or it will pass undefined
  const btnText = newIsHost ? "Host" : "Join";
  const history = useHistory();
  const cancelHandler = () => {
    history.push("/");
  };
  return (
    <div className="join-btn-container">
      <br></br>
      <Btn text={btnText} handler={handler} cancel={false} />
      <br></br>
      <Btn text="Cancel" handler={cancelHandler} cancel={true} />
    </div>
  );
};

export default JoinBtns;
