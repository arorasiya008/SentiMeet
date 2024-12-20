import React from "react";
import landingPageImg1 from "../../assets/images/landing-page-use-1.jpg";
import landingPageImg2 from "../../assets/images/landing-page-use-2.jpg";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const Screen1 = ({ isSignIn }) => {
  let history = useHistory();
  function pushToSignInHandler() {
    history.push("/signin");
  }
  function pushToSignUpHandler() {
    history.push("/signup");
  }
  function hostHandler() {
    history.push("/join?host=true");
  }
  function joinHandler() {
    history.push("/join");
  }
  return (
    <div className="screen-1">
      <div className="screen-1-inner-container">
        <div className="screen-1-left-container">
          <div className="screen-1-title">
            <span className="screen-1-keyword">SentiMeet: </span>
            <br></br>
            Connect Beyond the Surface
          </div>
          <div className="screen-1-description">
            <div>Feel the mood, read the room, and strengthen connections with </div>
            <div>sentiment-driven insights.</div>
          </div>
          <div className="screen-1-btn-container">
            {isSignIn ? (
              <>
                <div className="screen-1-host-btn" onClick={hostHandler}>
                  Host a meeting
                </div>
                <div className="screen-1-join-btn" onClick={joinHandler}>
                  Join the meeting
                </div>
              </>
            ) : (
              <>
                <div
                  className="screen-1-sign-in-btn"
                  onClick={pushToSignInHandler}
                >
                  Sign In
                </div>
                <div
                  className="screen-1-sign-up-link"
                  onClick={pushToSignUpHandler}
                >
                  No account? Sign Up Here
                </div>
              </>
            )}
          </div>
        </div>
        <div className="screen-1-right-container">
          <div>
            <img className="screen-1-img-1" src={landingPageImg1} alt="" />
          </div>
          <div>
            <img className="screen-1-img-2" src={landingPageImg2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

export default connect(mapStoreStateToProps)(Screen1);
