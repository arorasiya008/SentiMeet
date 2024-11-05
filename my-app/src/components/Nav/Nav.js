import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { setIsSignIn } from "../../store/actions";
import { refresh, signOut } from "../../utils/fetchUserApi";
import Modal from "../Modal/Modal";
import Avatar from "./Avatar";
import "./Nav.css";

const Nav = ({ isSignIn, setIsSignInAction, avatar }) => {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to track drawer visibility

  const logoHandler = () => {
    history.push("/");
  };

  const signInHandler = () => history.push("/signIn");
  const joinPageHandler = () => history.push("/join");
  const hostPageHandler = () => history.push("/join?host=true");
  const profileHandler = () => history.push("/profile");
  const recordingHandler = () => history.push("/recording");

  const signOutHandler = async () => {
    try {
      const response = await signOut();
      if (response.ok) {
        setIsSignInAction(false);
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const refreshHandler = async () => {
    try {
      const response = await refresh();
      setIsSignInAction(response.ok);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    refreshHandler();
  }, []);

  // Drawer component
  const Drawer = () => (
    <div className="nav-drawer">
      <div className="drawer-item" onClick={profileHandler}>
        Profile
      </div>
      <div className="drawer-item" onClick={signOutHandler}>
        Sign Out
      </div>
    </div>
  );

  return (
    <div className="navigator-container">
      <div className="nav-logo" onClick={logoHandler}>
        <span className="nav-logo-text">SentiMeet</span>
      </div>

      <div className="nav-actions">
        <div className="nav-action-btn nav-join-btn" onClick={joinPageHandler}>
          <i className="fas fa-user-plus"></i> Join
        </div>
        <div className="nav-action-btn host-btn" onClick={hostPageHandler}>
          <i className="fas fa-users"></i> Host
        </div>
        {isSignIn ? (
          <div className="nav-profile">
            <div onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              <Avatar key={Math.random()} avatar={avatar} />
            </div>
            {isDrawerOpen && <Drawer />} {/* Conditionally render Drawer */}
          </div>
        ) : (
          <div className="nav-signIn-Up" onClick={signInHandler}>
            <i className="fas fa-sign-in-alt"></i> Sign In / Up
          </div>
        )}
      </div>

      {openModal && (
        <Modal
          modalTitle="Message"
          modalBody="Log out success! Redirecting to home page"
          btnHandler={() => {
            history.push("/");
            setOpenModal(false);
          }}
          btnText="OK"
        />
      )}
    </div>
  );
};

const mapStoreStateToProps = (state) => ({
  isSignIn: state.isSignIn,
});

const mapDispatchToProps = (dispatch) => ({
  setIsSignInAction: (isSignIn) => dispatch(setIsSignIn(isSignIn)),
});

export default connect(mapStoreStateToProps, mapDispatchToProps)(Nav);
