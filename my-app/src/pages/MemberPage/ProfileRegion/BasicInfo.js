import React, { useState } from "react";
import peopleImg from "../../../assets/images/people.svg";
import editImg from "../../../assets/images/edit.svg";
import ErrorMessages from "../../../components/ErrorMessages";
import { connect } from "react-redux";
import { setAvatar, setDefaultUsername } from "../../../store/actions";
import UsernameInput from "./UsernameInput";
import Modal from "../../../components/Modal/Modal";
import Modal2 from "../../../components/Modal/Modal2/Modal2";
import { patchAvatar, patchUsername } from "../../../utils/fetchUserApi";
import * as validFormat from "../../../utils/validFormat";
import loadingImg from "../../../assets/images/sing-in-loading.png";

const BasicInfo = (props) => {
  const {
    defaultUsername,
    email,
    avatar,
    setDefaultUsernameAction,
    setAvatarAction,
  } = props;
  const [newUsername, setNewUsername] = useState("");
  const [changeNameErr, setChangeNameErr] = useState("");
  const [changeAvatarErr, setChangeAvatarErr] = useState("");
  const [openUsernameModal, setOpenUsernameModal] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const [openAvatarErrorModal, setOpenAvatarErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  function closeUsernameModal() {
    setOpenUsernameModal(false);
    setNewUsername("");
    //username valid effect remove
    const usernameInputContainerEl = document.querySelector(
      ".change-username-input-container"
    );
    if (usernameInputContainerEl) {
      const usernameInputEl =
        usernameInputContainerEl.querySelector(".template-input");
      usernameInputEl.classList.remove("sign-in-up-format-success");
    }
  }

  function closeAvatarModal() {
    setOpenAvatarModal(false);
  }

  function closeAvatarErrorModal() {
    setOpenAvatarErrorModal(false);
  }
  function closeCropModal() {
    setOpenCropModal(false);
  }
  function changeAvatarPanel() {
    setOpenCropModal(true);
  }
  async function uploadAvatar() {
    //check if upload file exist
    if (!preview) {
      setOpenCropModal(false);
      setOpenAvatarErrorModal(true);
      setChangeAvatarErr("file empty! please upload image and crop it.");
      return;
    }

    setAvatarLoading(true);
    const tempData = preview.split(";");
    const contentType = tempData[0].split(":")[1];
    const imageData = tempData[1].split(",")[1];
    const inputData = { contentType: contentType, imageData: imageData };

    try {
      const response = await patchAvatar(inputData);
      if (response.ok) {
        const avatarUrl = response.data.Url;
        setAvatarAction(avatarUrl);
        setPreview(null);
        setOpenCropModal(false);
        setOpenAvatarModal(true);
      }
      if (response.error) {
        setOpenCropModal(false);
        setOpenAvatarErrorModal(true);
        setChangeAvatarErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }

    setAvatarLoading(false);
  }

  async function changeNameHandler() {
    if (!validFormat.validateUsername(newUsername)) {
      return;
    }

    setLoading(true);
    try {
      const response = await patchUsername({
        username: newUsername,
      });
      if (response.ok) {
        setDefaultUsernameAction(newUsername);
        setOpenUsernameModal(true);
      }
      if (response.error) {
        setChangeNameErr(response.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
    setLoading(false);
  }

  return (
    <div className="basic-info-container">
      <div className="basic-info-region-I">
        {avatar ? (
          <img className="basic-info-avatar" src={avatar} alt="" />
        ) : (
          <img className="basic-info-avatar" src={peopleImg} alt="" />
        )}
        <div className="basic-info-edit-container" onClick={changeAvatarPanel}>
          <img className="basic-info-edit" src={editImg} alt="" />
        </div>
      </div>
      <div className="basic-info-region-II-III-container">
        <div className="basic-info-region-II">
          <div className="basic-info-title">
            Username
            <div className="basic-info-username">{defaultUsername}</div>
            <UsernameInput
              newUsername={newUsername}
              setNewUsername={setNewUsername}
            />
          </div>
          <div className="basic-info-title">
            E-mail 
            <div className="basic-info-email"><br></br>{email}</div>
          </div>
          <div className="basic-info-error-message">
            <ErrorMessages errMsg={changeNameErr} />
          </div>
        </div>
        <div
          className="basic-info-region-III basic-info-username-edit-btn"
          onClick={changeNameHandler}
        >
          SAVE
          {loading && (
            <img src={loadingImg} className="change-loading" alt="" />
          )}
        </div>
      </div>

      {openUsernameModal && (
        <Modal
          modalTitle="Message"
          modalBody="Username changed successfully!"
          btnHandler={closeUsernameModal}
          btnText="OK"
        />
      )}
      {openCropModal && (
        <Modal2
          modalTitle="Change Avatar"
          modalBody="only allowed .jpg/png file and less than 1MB"
          uploadBtnHandler={uploadAvatar}
          closeBtnHandler={closeCropModal}
          btnText="Upload"
          preview={preview}
          setPreview={setPreview}
          loading={avatarLoading}
        />
      )}

      {openAvatarErrorModal && (
        <Modal
          modalTitle="Error Message"
          modalBody={changeAvatarErr}
          btnHandler={closeAvatarErrorModal}
          btnText="OK"
        />
      )}
    </div>
  );
};

const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDefaultUsernameAction: (defaultUsername) =>
      dispatch(setDefaultUsername(defaultUsername)),
    setAvatarAction: (avatar) => dispatch(setAvatar(avatar)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(BasicInfo);
