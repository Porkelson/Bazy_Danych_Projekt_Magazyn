import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loader-text">Proszę czekać...</p>
    </div>
  );
};

export default Loader;
