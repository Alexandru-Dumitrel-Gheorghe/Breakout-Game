// src/components/Brick.js
import React from "react";
import styles from "../styles/Brick.module.css";

function Brick({ brick }) {
  // brick: { x, y, hits, width, height }
  // hits = number of hits remaining
  // we can color the brick differently depending on the hits value
  const colorClass = brick.hits > 2 
    ? styles.brickTough
    : brick.hits === 2 
      ? styles.brickMedium
      : styles.brickNormal;

  return (
    <div
      className={`${styles.brick} ${colorClass}`}
      style={{
        left: `${brick.x}px`,
        top: `${brick.y}px`,
        width: `${brick.width}px`,
        height: `${brick.height}px`,
      }}
    >
      {/* optional: display the number of hits */}
      {/* {brick.hits} */}
    </div>
  );
}

export default Brick;
