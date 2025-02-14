// src/App.js
import React from "react";
import GameBoard from "./components/GameBoard";
import styles from "./styles/App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>React Breakout Advanced</h1>
      <GameBoard />
    </div>
  );
}

export default App;
