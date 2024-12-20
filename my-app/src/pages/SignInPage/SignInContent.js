import React, { useState } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import { signIn } from "../../utils/fetchUserApi";
import SignInBtns from "./SignInBtns";
import SignInInput from "./SignInInput";
import { connect } from "react-redux";
import { setAvatar, setIsSignIn, setUsername } from "../../store/actions";
import { useHistory } from "react-router-dom";
import * as validFormat from "../../utils/validFormat";
import loadingImg from "../../assets/images/sing-in-loading.png";
import googleImg from "../../assets/images/google_login.png";
import signin from "../../assets/images/signin.png";

const SignInContent = (props) => {
  const { setIsSignInAction, setUsernameAction, setAvatarAction } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInErr, setSignInErr] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const signInHandler = async () => {
    if (
      !validFormat.validateEmail(email) ||
      !validFormat.validatePassword(password)
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await signIn({
        email: email,
        password: password,
      });

      if (response.ok) {
        setIsSignInAction(true);
        setUsernameAction(response.data.username);
        setAvatarAction(response.data.avatar);
        history.push("/");
      }
      if (response.error) {
        setIsSignInAction(false);
        setSignInErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  };

  const switchToSignUp = () => {
    history.push("/signup");
  };

  function keyDownHandler(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        validFormat.validateEmail(email) &&
        validFormat.validatePassword(password)
      ) {
        signInHandler();
      }
    }
  }

  return (
    <div className="main-container-in-2"> {/* Add a unique class for styling */}
      {/* Main sign-in container */}
            {/* Left section for sign-up form */}
      <div className="left-section-signin">
       <div className="sign-in-container">
        <div className="sign-in-title">Sign In</div>
        <SignInInput
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          keyDownHandler={keyDownHandler}
        />
        <div className="sign-in-error-container">
          <ErrorMessages errMsg={signInErr} />
        </div>
  
        <div className="btn-and-loading-container">
          <SignInBtns handler={signInHandler} />
          {loading && (
            <img src={loadingImg} className="sign-in-up-loading" alt="" />
          )}
        </div>
        <div className="google-auth-container">
          <div className="google-auth-text">Or sign in with your Google account</div>
          <div className="google-img-container">
            <a href={`${process.env.REACT_APP_API_URL}/api/auth/google`}>
              <img src={googleImg} className="google-img" alt="" />
            </a>
          </div>
        </div>
        <div className="switch-sign-up" onClick={switchToSignUp}>
          First time visit? Sign up now!
        </div>
       </div>
      </div>
      {/* Right section to display the image */}
      <div className="right-section">
        <img src={signin} alt="Sign-up illustration" />
      </div>
    </div>
  );  
};

//props subscript state, auto update if state updated
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};
// props can direct use action
const mapDispatchToProps = (dispatch) => {
  return {
    setIsSignInAction: (isSignIn) => dispatch(setIsSignIn(isSignIn)),
    setUsernameAction: (username) => dispatch(setUsername(username)),
    setAvatarAction: (avatar) => dispatch(setAvatar(avatar)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(SignInContent);
