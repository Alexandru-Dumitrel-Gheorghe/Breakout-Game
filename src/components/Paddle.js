// src/components/Paddle.js
import React from "react";
import styles from "../styles/Paddle.module.css";

function Paddle({ x, width }) {
  return (
    <div
      className={styles.paddle}
      style={{
        left: `${x}px`,
        width: `${width}px`,
      }}
    />
  );
}

export default Paddle;
