import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signUp } from "../../utils/fetchUserApi";
import SignUpBtns from "./SignUpBtns";
import SignUpInput from "./SignUpInput";
import { useHistory } from "react-router-dom";
import * as validFormat from "../../utils/validFormat";
import loadingImg from "../../assets/images/sing-in-loading.png";
import Modal from "../../components/Modal/Modal";
import "./SignUpContent.css";
import signup from "../../assets/images/wel.png";


const SignUpContent = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpErr, setSignUpErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();

  async function signUpHandler() {
    if (
      !validFormat.validateEmail(email) ||
      !validFormat.validatePassword(password) ||
      !validFormat.validateUsername(username)
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await signUp({
        username: username,
        email: email,
        password: password,
      });
      if (response.ok) {
        setOpenModal(true);
      }
      if (response.error) {
        setSignUpErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  }

  const switchToSignIn = () => {
    setOpenModal(false);
    history.push("/signin");
  };

  function keyDownHandler(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        validFormat.validateEmail(email) &&
        validFormat.validatePassword(password) &&
        validFormat.validateUsername(username)
      ) {
        signUpHandler();
      }
    }
  }
  return (
    <div className="main-container">
      {/* Left section for sign-up form */}
      <div className="left-section-signup">
        <div className="sign-in-up-container-3">
          <div className="sign-in-up-title">Sign Up</div>
          <SignUpInput
            className="template-input"
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            keyDownHandler={keyDownHandler}
          />
          <div className="sign-in-up-format-fail">
            <ErrorMessages errMsg={signUpErr} />
          </div>
  
          <div className="btn-and-loading-container">
            <SignUpBtns handler={signUpHandler} />
            {loading && (
              <img src={loadingImg} className="sign-in-up-loading" alt="loading" />
            )}
          </div>
  
          <div className="switch-sign-in-up" onClick={switchToSignIn}>
            Already have an account? Sign in now!
          </div>
        </div>
      </div>
  
      {/* Right section to display the image */}
      <div className="right-section">
        <img src={signup} alt="Sign-up illustration" />
      </div>
  
      {/* Modal for sign-up success */}
      {openModal && (
        <Modal
          className="modal-content"
          modalTitle="Message"
          modalBody="Sign up success, will redirect to sign in page"
          btnHandler={switchToSignIn}
          btnText="OK"
        />
      )}
    </div>
  );
  
  
  
};


export default SignUpContent;