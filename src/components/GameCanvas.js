import React, { Component } from "react";
import './GameCanvas.css';

import axios from 'axios';

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const initializeState = props => {
  return {};
};

class GameCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = initializeState(this.props);
    // this.deadBalls = [];
  }

  componentDidMount() {
    // this._initializeGameCanvas();
  };
  async componentWillReceiveProps(nextProps) {
    const { running } = { ...this.props }
    if (nextProps.running !== running) {
      if (nextProps.running) {
        this._initializeGameCanvas()
        this.pollData(nextProps.running)
      }
    }
  }
  pollData = async (running) => {
    if (!running) return
    const options = {
      method: 'GET',
      url: 'https://wwwforms.suralink.com/pong.php?accessToken=pingPONG',
    };
    const { data } = await axios(options);
    const { gameData } = data;
    let { newDelay, ball, paddle1, paddle2 } = gameData;

    // console.log(newDelay);
    // console.log(gameData);
    this.updateBall(ball);
    this.updatePlayer1(paddle1);
    this.updatePlayer2(paddle2);
    this._drawRender();

    await sleep(newDelay);
    this.pollData(this.props.running);
  };

  resetData = () => {
    const { velocity, paddle1Color, paddle2Color, ballColor, ballType } = { ...this.props };
    let size = ballType.split(' ')[0];
    if (size === 'large') {
      size = 35;
    } else {
      size = 15;
    };
    const basePlayer1 = {
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: paddle1Color,
      velocityY: 2,
    };
    const basePlayer2 = {
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: paddle2Color,
      velocityY: 2,
    };
    const baseBall = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: size,
      height: size,
      color: ballColor,
      velocityX: velocity,
      velocityY: velocity,
    };
    this.updateBall(baseBall);
    this.updatePlayer1(basePlayer1);
    this.updatePlayer2(basePlayer2);
    this._drawRender();
  };

  updateBall = ball => {
    if (ball.color) this.gameBall.color = ball.color
    if (ball.color && ball.color.hex) this.gameBall.color = `#${ball.color.hex}`;
    if (ball.velocityX) {
      if (this.gameBall.velocityX < 0) {
        this.gameBall.velocityX = -ball.velocityX;
      } else {
        this.gameBall.velocityX = ball.velocityX;
      };
    };
    if (ball.velocityY)  {
      if (this.gameBall.velocityY < 0) {
        this.gameBall.velocityY = -ball.velocityY;
      } else {
        this.gameBall.velocityY = ball.velocityY;
      };
    }
    if (ball.width) this.gameBall.width = ball.width;
    if (ball.height) this.gameBall.height = ball.height;
  }
  updatePlayer1 = paddle1 => {
    if (paddle1.color) this.player1.color = paddle1.color
    if (paddle1.color && paddle1.color.hex) this.player1.color = `#${paddle1.color.hex}`;
    if (paddle1.height) this.player1.height = paddle1.height;
    if (paddle1.width) this.player1.width = paddle1.width;
    if (paddle1.velocityY) this.player1.velocityY = paddle1.velocityY;
  }
  updatePlayer2 = paddle2 => {
    if (paddle2.color) this.player2.color = paddle2.color
    if (paddle2.color && paddle2.color.hex) this.player2.color = `#${paddle2.color.hex}`;
    if (paddle2.height) this.player2.height = paddle2.height;
    if (paddle2.width) this.player2.width = paddle2.width;
    if (paddle2.velocityY) this.player2.velocityY = paddle2.velocityY;
  }
  launchTurtle = async () => {
    const sign = () => (Math.random() <= 0.5 ? -1 : 1);
    this.turtle.x = Math.random() * (this.canvas.width - 20) + 20;
    this.turtle.y = Math.random() * (this.canvas.height - 20) + 20;
    this.turtle.velocityX = sign() * (Math.random() * (2) + 2);
    this.turtle.velocityY = sign() * (Math.random() * (2) + 2);
    await sleep(1600);
    const { turtlesAllTheWayDown } = { ...this.state }
    if (turtlesAllTheWayDown) this.launchTurtle()
  }
  toggleTurtlesAllTheWayDown = e => {
    e && e.preventDefault()
    this.setState(prevState => ({ ...prevState, turtlesAllTheWayDown: !prevState.turtlesAllTheWayDown }), () => {
      const { turtlesAllTheWayDown } = { ...this.state }
      if (turtlesAllTheWayDown) this.launchTurtle()
    })
  }
  _initializeGameCanvas = () => {
    const { velocity, paddle1Color, paddle2Color, ballColor, ballType } = { ...this.props };
    let size = ballType.split(' ')[0];
    if (size === 'large') {
      size = 35;
    } else {
      size = 15;
    };

    // initialize canvas element and bind it to our React class
    this.canvas = this.refs.pong_canvas;
    this.ctx = this.canvas.getContext("2d");

    // declare initial variables
    this.p1Score = 0;
    this.p2Score = 0;
    this.keys = {};

    // add keyboard input listeners to handle user interactions
    window.addEventListener("keydown", e => {
      this.keys[e.keyCode] = 1;
      if (e.target.nodeName !== "INPUT") e.preventDefault();
    });
    window.addEventListener("keyup", e => delete this.keys[e.keyCode]);

    // instantiate our game elements
    this.player1 = new this.GameClasses.Box({
      x: 10,
      y: 200,
      width: 15,
      height: 80,
      color: paddle1Color,
      velocityY: 2,
    });
    this.player2 = new this.GameClasses.Box({
      x: 725,
      y: 200,
      width: 15,
      height: 80,
      color: paddle2Color,
      velocityY: 2,
    });
    this.boardDivider = new this.GameClasses.Box({
      x: this.canvas.width / 2 - 2.5,
      y: -1,
      width: 5,
      height: this.canvas.height + 1,
      color: "#FFF"
    });
    this.gameBall = new this.GameClasses.Box({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      width: size,
      height: size,
      color: ballColor,
      velocityX: velocity,
      velocityY: velocity,
    });
    this.turtle = new this.GameClasses.Box({
      x: this.canvas.width + 120,
      y: this.canvas.height + 120,
      width: 12,
      height: 12,
      color: '#8DB86B',
      velocityX: -0.2,
      velocityY: -0.2,
    });
    // start render loop
    this._renderLoop();
  };

  // recursively process game state and redraw canvas
  _renderLoop = () => {
    const { maxScore, endGame, paused, ai, level } = { ...this.props }

    let mod = 1;
    if (level === 'hard') mod = 4;
    if (level === 'easy') mod = 0.5;
    
    if (paused) return this.frameId = window.requestAnimationFrame(this._renderLoop);
    if (Math.max(this.p1Score, this.p2Score) >= maxScore) {
      endGame();
      return
    };
    // this.player1.color = paddle1Color;
    // this.player2.color = paddle2Color;
    // this.gameBall.color = ballColor;
    this._ballCollisionY();
    this._userInput();
    // this._userInput(this.player2);
    ai && this._aiInput(mod);
    this.frameId = window.requestAnimationFrame(this._renderLoop);
  };

  // watch ball movement in Y dimension and handle top/bottom boundary collisions, then call _ballCollisionX
  _ballCollisionY = () => {
    if (
      this.gameBall.y + this.gameBall.velocityY <= 0 ||
      this.gameBall.y + this.gameBall.velocityY + this.gameBall.height >=
        this.canvas.height
    ) {
      this.gameBall.velocityY = this.gameBall.velocityY * -1;
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    this._ballCollisionX();
  };

  // watch ball movement in X dimension and handle paddle collisions and score setting/ball resetting, then call _drawRender
  _ballCollisionX = () => {
    const { velocity } = { ...this.props }
    let hit = 'none';
    if ((this.gameBall.x + this.gameBall.velocityX <=
        this.player1.x + this.player1.width) &&
        (this.gameBall.y + this.gameBall.velocityY > this.player1.y) &&
        (this.gameBall.y + this.gameBall.velocityY <=
          this.player1.y + this.player1.height)) {
            hit = 'player1';
          }
    if ((this.gameBall.x + this.gameBall.width + this.gameBall.velocityX >= this.player2.x) && 
        (this.gameBall.y + this.gameBall.velocityY > this.player2.y) &&
        (this.gameBall.y + this.gameBall.velocityY <= this.player2.y + this.player2.height)) {
            hit = 'player2';
    }
    if (hit !== 'none') {
      this.gameBall.velocityX = this.gameBall.velocityX * -1;
      if (hit === 'player1') {
        if (87 in this.keys) {
          this.gameBall.velocityY -= this.player1.velocityY * 0.25;
        } else if (83 in this.keys) {
          this.gameBall.velocityY += this.player1.velocityY * 0.25;
        }
      } else if (hit === 'player2') {
        if (38 in this.keys) {
          this.gameBall.velocityY -= this.player2.velocityY * 0.25;
        } else if (40 in this.keys) {
          this.gameBall.velocityY += this.player2.velocityY * 0.25;
        }
      }

    } else if (
      this.gameBall.x + this.gameBall.velocityX <
      this.player1.x - this.player1.width
    ) {
      this.p2Score += 1;
      this.gameBall.x = this.canvas.width/2;
      this.gameBall.y = this.canvas.height/2;
      this.gameBall.velocityX = velocity;
      // this.deadBalls.push(this.gameBall);
      // this.gameBall = new this.GameClasses.Box({
      //   x: this.canvas.width / 2,
      //   y: this.canvas.height / 2,
      //   width: 15,
      //   height: 15,
      //   color: ballColor,
      //   velocityX: velocity,
      //   velocityY: velocity
      // });
    } else if (
      this.gameBall.x + this.gameBall.velocityX >
      this.player2.x + this.player2.width
    ) {
      this.p1Score += 1;
      this.gameBall.x = this.canvas.width/2;
      this.gameBall.y = this.canvas.height/2;
      this.gameBall.velocityX = -velocity;
      // this.deadBalls.push(this.gameBall);
      // this.gameBall = new this.GameClasses.Box({
      //   x: this.canvas.width / 2,
      //   y: this.canvas.height / 2,
      //   width: 15,
      //   height: 15,
      //   color: ballColor,
      //   velocityX: -velocity,
      //   velocityY: velocity
      // });
    } else {
      this.gameBall.x += this.gameBall.velocityX;
      this.gameBall.y += this.gameBall.velocityY;
    }
    if ((this.turtle.x < this.canvas.width + 80 && this.turtle.x > -80) && (this.turtle.y < this.canvas.height + 80 && this.turtle.y > -80)) {
      this.turtle.x += this.turtle.velocityX;
      this.turtle.y += this.turtle.velocityY;
    }

    if ((this.turtle.x < this.gameBall.x + this.gameBall.width + 60 && this.turtle.x > this.gameBall.x - 60) && (this.turtle.y < this.gameBall.y + this.gameBall.height + 60 && this.turtle.y > this.gameBall.y - 60)) {
      this.gameBall.velocityX = this.turtle.velocityX;
      this.gameBall.velocityY = this.turtle.velocityY;
      // this.gameBall.x = this.turtle.x;
      // this.gameBall.y = this.turtle.y;
    }

    this._drawRender();
  };

  // clear canvas and redraw according to new game state
  _drawRender = () => {
    const { ballType } = { ...this.props }
    const shape = ballType.split(' ')[1]
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._displayScore1();
    this._displayScore2();
    this._drawBox(this.player1);
    this._drawBox(this.player2);
    this._drawBox(this.boardDivider);
    this._drawBox(this.turtle);
    if (shape === 'block') {
      this._drawBox(this.gameBall);
    } else {
      this._drawCircle(this.gameBall);
    }
  };

  // take in game object and draw to canvas
  _drawBox = box => {
    this.ctx.fillStyle = box.color;
    this.ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  _drawCircle = ball => {
    this.ctx.fillStyle = ball.color;
    this.ctx.beginPath();
    this.ctx.arc(ball.x + ball.width/2, ball.y + ball.height/2, ball.width/1.5, ball.height, Math.PI*2, true);
    this.ctx.fill();
  }

  // render player 1 score
  _displayScore1 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(
      this.p1Score,
      this.canvas.width / 2 - (this.p1Score > 9 ? 55 : 45),
      30
    );
  };

  // render player 2 score
  _displayScore2 = () => {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillText(this.p2Score, this.canvas.width / 2 + 33, 30);
  };

  _aiInput = mod => {
    if (this.gameBall.y > this.player2.y) {
      if (
        this.player2.y + this.player2.height + this.player2.velocityY <
        this.canvas.height
      )
        this.player2.y += (this.player2.velocityY * mod);
    } else if (this.gameBall.y < this.player2.y) {
      if (this.player2.y - this.player2.velocityY > 0)
        this.player2.y -= (this.player2.velocityY * mod);
    }
  }

  //track user input
  _userInput = () => {
    const { ai } = { ...this.props }
    if (87 in this.keys) {
      if (this.player1.y - this.player1.velocityY > 0)
        this.player1.y -= this.player1.velocityY;
    } else if (83 in this.keys) {
      if (
        this.player1.y + this.player1.height + this.player1.velocityY <
        this.canvas.height
      )
        this.player1.y += this.player1.velocityY;
    }
    if (!ai) {
      if (38 in this.keys) {
        if (this.player2.y - this.player2.velocityY > 0)
          this.player2.y -= this.player2.velocityY;
      } else if (40 in this.keys) {
        if (
          this.player2.y + this.player2.height + this.player2.velocityY <
          this.canvas.height
        )
          this.player2.y += this.player2.velocityY;
      }
    }
  };

  GameClasses = (() => {
    return {
      Box: function Box(opts) {
        let { x, y, width, height, color, velocityX, velocityY } = opts;
        this.x = x || 10;
        this.y = y || 10;
        this.width = width || 40;
        this.height = height || 50;
        this.color = color || "#FFF";
        this.velocityX = velocityX || 2;
        this.velocityY = velocityY || 2;
      }
    };
  })();

  render() {
    const { running } = { ...this.props }
    const { turtlesAllTheWayDown } = { ...this.state }
    const Aux = props => props.children
    let buttons
    let launchTurtleText = turtlesAllTheWayDown ? 'Send the Gravity Turtle Away on an Errand' : 'Launch the Gravity Turtle'
    if (running) {
      buttons = (
        <Aux>
          <button onClick={this.resetData}>Reset Paddles and Ball</button>
          <button onClick={this.toggleTurtlesAllTheWayDown}>{launchTurtleText}</button>
        </Aux>

      )
    }
    return (
      <div className='GameCanvas'>
        <canvas
          id="pong_canvas"
          ref="pong_canvas"
          width="750"
          height="500"
          style={{ background: "#12260e", border: "4px solid #FFF" }}
        />
        { buttons }
      </div>
    );
  }
}

export default GameCanvas;
