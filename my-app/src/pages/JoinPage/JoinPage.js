import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { setIsRoomHost, setRoomId } from "../../store/actions";
import JoinContent from "./JoinContent";
import "./JoinPage.css";
import JoinTitle from "./JoinTitle";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer";
import { refresh } from "../../utils/fetchUserApi";
import image1 from "../../assets/images/join.png";
import image2 from "../../assets/images/host.png";

const JoinPage = (props) => {
  const { setIsRoomHostAction, setRoomIdAction } = props;
  const search = useLocation().search;
  const history = useHistory();
  const isHost = new URLSearchParams(search).get("host");
  useEffect(() => {
    // First effect: check sign-in and set host/room status
    const isHost = new URLSearchParams(search).get("host");
    const linkRoomId = new URLSearchParams(search).get("roomId");

    async function checkSignIn() {
      try {
        const response = await refresh();
        if (response.ok) {
          if (isHost) {
            setIsRoomHostAction(true);
          } else {
            setIsRoomHostAction(false);
            setRoomIdAction(linkRoomId);
          }
        } else {
          history.push("/signin");
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
    checkSignIn();
  }, [search, setIsRoomHostAction, setRoomIdAction, history]);

  useEffect(() => {
    const slider = document.querySelector(".slider");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const slides = document.querySelectorAll(".slide");
    const slideIcons = document.querySelectorAll(".slide-icon");
    const numberOfSlides = slides.length;
    let slideNumber = 0;

    //image slider next button
    nextBtn.addEventListener("click", () => {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
      slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
      });

      slideNumber++;

      if (slideNumber > numberOfSlides - 1) {
        slideNumber = 0;
      }

      slides[slideNumber].classList.add("active");
      slideIcons[slideNumber].classList.add("active");
    });

    //image slider previous button
    prevBtn.addEventListener("click", () => {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
      slideIcons.forEach((slideIcon) => {
        slideIcon.classList.remove("active");
      });

      slideNumber--;

      if (slideNumber < 0) {
        slideNumber = numberOfSlides - 1;
      }

      slides[slideNumber].classList.add("active");
      slideIcons[slideNumber].classList.add("active");
    });

    //image slider autoplay
    let playSlider;

    let repeater = () => {
      playSlider = setInterval(function () {
        slides.forEach((slide) => {
          slide.classList.remove("active");
        });
        slideIcons.forEach((slideIcon) => {
          slideIcon.classList.remove("active");
        });

        slideNumber++;

        if (slideNumber > numberOfSlides - 1) {
          slideNumber = 0;
        }

        slides[slideNumber].classList.add("active");
        slideIcons[slideNumber].classList.add("active");
      }, 4000);
    };
    repeater();

    //stop the image slider autoplay on mouseover
    slider.addEventListener("mouseover", () => {
      clearInterval(playSlider);
    });

    //start the image slider autoplay again on mouseout
    slider.addEventListener("mouseout", () => {
      repeater();
    });
  }, []);

  return (
    <>
      <Nav />
      <div className="join-container">
      <div className="left-section">
          <div className="join-box">
            <JoinTitle newIsHost={isHost} />
            <JoinContent key={Math.random()} newIsHost={isHost} />
          </div>
        </div>

        <div className="right-section">
          {/* You can place the slider component here */}
          <div className="slider">
          <div className="screen-2-bottom-container slide active">
          <div className="screen-2-bottom-set-container">
            <div className="screen-2-bottom-title-container">
              <div className="screen-2-bottom-title">
              AI-Driven Insights for Every Call
              </div>
              <div className="screen-2-bottom-description">
              Connect and collaborate while sensing the mood in real time.
              </div>
            </div>
            <div className="screen-2-bottom-img-container">
              <img
                className="screen-2-bottom-demo-img"
                src={image1}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="screen-2-bottom-container slide ">
          <div className="screen-2-bottom-set-container">
            <div className="screen-2-bottom-title-container">
              <div className="screen-2-bottom-title">Direct Connections, Zero Third Parties</div>
              <div className="screen-2-bottom-description">
              With SentiMeet's P2P technology, enjoy <br></br>secure conversations without any intermediaries.
              </div>
            </div>
            <div className="screen-2-bottom-img-container">
              <img
                className="screen-2-bottom-demo-img"
                src={image2}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="navigation">
          <div className="fas fa-chevron-left prev-btn">{"<"}</div>
          <div className="fas fa-chevron-right next-btn">{">"}</div>
        </div>
        <div className="navigation-visibility">
          <div className="slide-icon active"></div>
          <div className="slide-icon"></div>
          
        </div>
            {/* Your slider images and icons here */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// props subscribe state, auto update if state updated
const mapStoreStateToProps = (state) => {
  return {
    ...state,
  };
};

// props can direct use action
const mapDispatchToProps = (dispatch) => {
  return {
    setIsRoomHostAction: (isHost) => dispatch(setIsRoomHost(isHost)),
    setRoomIdAction: (roomId) => dispatch(setRoomId(roomId)),
  };
};

export default connect(mapStoreStateToProps, mapDispatchToProps)(JoinPage);
