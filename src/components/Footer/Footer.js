import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <p>
        Copyright © <Link>upGrad</Link> {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;
