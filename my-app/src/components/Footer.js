import React from "react";
import linkedInImg from "../assets/images/linkedin_icon.png";
import githubImg from "../assets/images/github_icon.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-text">Copyright ©2024 SentiMeet-project</div>
      <div className="footer-icons-container">
        <a
          className="footer-icon-link"
          href="https://github.com/arorasiya008/SentiMeet"
        >
          <div className="footer-icon-container">
            <img className="footer-icon" src={githubImg} alt="" />
          </div>
        </a>
        <a
          className="footer-icon-link"
          href="https://www.linkedin.com/in/sathwika-marivada"
        >
          <div className="footer-icon-container">
            <img className="footer-icon" src={linkedInImg} alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Footer;
