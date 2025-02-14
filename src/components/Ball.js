// src/components/Ball.js
import React from "react";
import styles from "../styles/Ball.module.css";

function Ball({ position }) {
  // position: { x, y }, ignoring dx, dy when displaying
  return (
    <div
      className={styles.ball}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
}

export default Ball;
