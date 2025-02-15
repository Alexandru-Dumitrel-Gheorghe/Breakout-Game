// src/components/Brick.js
import React from "react";
import styles from "../styles/Brick.module.css";

function Brick({ brick }) {
  // brick: { x, y, hits, width, height }
  // Determine the color class based on the number of hits remaining.
  const colorClass =
    brick.hits > 2
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
      {/* Optionally display brick hits */}
      {/* {brick.hits} */}
    </div>
  );
}

export default Brick;
