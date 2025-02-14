# Breakout Game in React

This project is a modern take on the classic Breakout game, built using React. It features multiple levels with increasing difficulty, dynamic ball speed adjustments, power-ups, and sound effects for an engaging gameplay experience.

## Features

- **Multiple Levels**  
  The game includes 4 distinct levels defined in the `src/levels/levels.js` file. Each brick is specified by its position (`x`, `y`), dimensions (`width`, `height`), and durability (`hits`). As you progress through the levels, the layout and required hits to destroy the bricks become more challenging.

- **Dynamic Ball Speed**  
  The ball's speed increases with each level, making the gameplay progressively more difficult.

- **Power-Ups**  
  Occasionally, destroying a brick may drop a power-up that can:
  - Grant extra lives,
  - Increase the paddle width,
  - Spawn extra balls,
  - Shrink the paddle.  
  These power-ups add an extra layer of strategy to the game.

- **Sound Effects**  
  Audio feedback is provided for key game events:
  - **Paddle Hit:** When the ball collides with the paddle.
  - **Brick Hit:** When a brick is struck.
  - **Lose Life:** When the ball goes out of bounds.
  - **Level Complete:** When all bricks in a level are destroyed.
  - **Game Over:** When the player runs out of lives.  
  Sound files are stored in the `public/sounds/` directory and are triggered using the HTML5 Audio API.

- **Responsive Design**  
  The game board automatically adjusts its dimensions based on the window size to work well on different screen sizes.

- **Immersive Controls**  
  The paddle is controlled with the mouse. The cursor is hidden over the game board for a more immersive experience.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/my-breakout-game.git
   cd my-breakout-game
