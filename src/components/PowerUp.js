// src/components/PowerUp.js
import React from "react";
import styles from "../styles/PowerUp.module.css";

// Returns a different emoji for each power-up type
function getIconFromType(type) {
  switch (type) {
    case "LIFE":
      return "❤️";       // life
    case "WIDE":
      return "↔️";       // widened paddle
    case "SHRINK":
      return "↕️";       // shrunken paddle
    case "EXTRABALL":
      return "🟢";       // extra ball
    default:
      return "❓";
  }
}

function PowerUp({ powerUp }) {
  return (
    <div
      className={styles.powerUp}
      style={{
        left: `${powerUp.x}px`,
        top: `${powerUp.y}px`,
        width: `${powerUp.width}px`,
        height: `${powerUp.height}px`,
      }}
    >
      {getIconFromType(powerUp.type)}
    </div>
  );
}

export default PowerUp;
