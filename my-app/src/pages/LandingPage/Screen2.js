import React, { useEffect } from "react";
import streamImg from "../../assets/images/landing-page-stream.svg";
import chatImg from "../../assets/images/landing-page-chat.svg";
import shareScreenImg from "../../assets/images/share_screen.svg";
import tensorflowImg from "../../assets/images/tensorflow_on.svg";
import demoBasicImg from "../../assets/images/image1.jpg";
import demoRecordingImg from "../../assets/images/image2.jpg";
import demoDetectImg from "../../assets/images/image3.jpg";


const Screen2 = () => {
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
  });
  return (
    <div className="screen-2">
      <div className="screen-2-top-container">
        <div className="screen-2-top-title">SentiMeet</div>
        <div className="screen-2-top-description">
        Solutions for modern team collaboration
        </div>
      </div>
      <div className="slider">
        <div className="screen-2-bottom-container slide active">
          <div className="screen-2-bottom-set-container">
            <div className="screen-2-bottom-title-container">
              <div className="screen-2-bottom-title">
                Real time streaming platform
              </div>
              <div className="screen-2-bottom-description">
                Make an instant connection with others
              </div>
            </div>
            <div className="screen-2-bottom-feature-list-container">
              <div className="screen-2-bottom-feature-container">
                <img
                  className="screen-2-bottom-feature-icon"
                  src={streamImg}
                  alt=""
                />
                <div className="screen-2-bottom-text">Real time streaming</div>
              </div>
              <div className="screen-2-bottom-feature-container">
                <img
                  className="screen-2-bottom-feature-icon"
                  src={chatImg}
                  alt=""
                />
                <div className="screen-2-bottom-text">Real time messaging</div>
              </div>
            </div>
            <div className="screen-2-bottom-img-container">
              <img
                className="screen-2-bottom-demo-img"
                src={demoBasicImg}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="screen-2-bottom-container slide ">
          <div className="screen-2-bottom-set-container">
            <div className="screen-2-bottom-title-container">
              <div className="screen-2-bottom-title">Easy work</div>
              <div className="screen-2-bottom-description">
                Share your screen with others and make work easier
              </div>
            </div>
            <div className="screen-2-bottom-feature-list-container">
              <div className="screen-2-bottom-feature-container">
                <img
                  className="screen-2-bottom-feature-icon"
                  src={shareScreenImg}
                  alt=""
                />
                <div className="screen-2-bottom-text">Screen sharing</div>
              </div>
              
            </div>
            <div className="screen-2-bottom-img-container">
              <img
                className="screen-2-bottom-demo-img"
                src={demoRecordingImg}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="screen-2-bottom-container slide ">
          <div className="screen-2-bottom-set-container">
            <div className="screen-2-bottom-title-container">
              <div className="screen-2-bottom-title">Real-Time Sentiment Analysis</div>
              <div className="screen-2-bottom-description">
              Capture your emotions instantly, bridging the gap between <br></br>virtual interactions and genuine connections.
              </div>
            </div>
            <div className="screen-2-bottom-feature-list-container">
              <div className="screen-2-bottom-feature-container">
                <img
                  className="screen-2-bottom-feature-icon"
                  src={tensorflowImg}
                  alt=""
                />
                <div className="screen-2-bottom-text">Emotion detection</div>
              </div>
            </div>
            <div className="screen-2-bottom-img-container">
              <img
                className="screen-2-bottom-demo-img-tf"
                src={demoDetectImg}
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
          <div className="slide-icon"></div>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
