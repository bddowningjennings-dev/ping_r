import React, { Component } from 'react';
import './GameInterface.css'

import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';

const initializeState = props => {
    return {
        running: false,
        paused: false,
        maxScore: 10,
        velocity: 1,
        paddle1Color: '#FFF',
        paddle2Color: '#FFF',
        ballColor: '#FFF',
        ballType: 'small block',
        errorMsgs: [],
    }
}

class GameInterface extends Component {
    constructor(props) {
        super(props);
        this.state = initializeState(this.props);
    }
    startGame = () => {
        this.setState(prevState => ({ ...prevState, running: true }))
    }
    togglePause = () => {
        this.setState(prevState => ({ ...prevState, paused: !prevState.paused }))
    }
    endGame = () => {
        this.setState(prevState => ({ ...prevState, running: false }))
    }
    setValue = e => {
        e && e.preventDefault()
        const { target } = { ...e }
        let value = Number(target.value), others, newError
        const { errorMsgs } = { ...this.state }
        if (`${[target.name]}` === 'maxScore') {
            if (value <= 0 || isNaN(value)) {
                value = 10
                others = errorMsgs.filter(msg => msg && msg.type !== 'maxScore')
                newError = {type: 'maxScore', msg: `Out of bounds max score value (allowed > 0) - setting to default of ${value}`}
            } else {
                others = errorMsgs.filter(msg => msg && msg.type !== 'maxScore')
            }
        }
        if (`${[target.name]}` === 'velocity') {
            if (value < 1 || value > 3 || isNaN(value)) {
                value = 1
                others = errorMsgs.filter(msg => msg && msg.type !== 'velocity')
                newError = {type: 'velocity', msg: `Out of bounds velocity value (allowed 1-3) - setting to default of ${value}`}
            } else {
                others = errorMsgs.filter(msg => msg && msg.type !== 'velocity')
            }
        }
        this.setState(prevState => ({ ...prevState, [target.name]: value, errorMsgs: [newError, ...others] }))
    }
    setColor = e => {
        e && e.preventDefault()
        const { target } = { ...e }
        this.setState(prevState => ({ ...prevState, [target.name]: target.value }))
    }
    setBallShape = (name, state) => {
        this.setState(prevState => ({ ...prevState, [name]: state.value }))
    }
    render() {
        const { maxScore, velocity, paddle1Color, paddle2Color, ballColor, ballType } = { ...this.state };
        const { running, paused, errorMsgs } = { ...this.state };
        const gameCanvasProps = {
            running,
            velocity,
            paddle1Color,
            paddle2Color,
            ballColor,
            ballType,
            paused,
            maxScore: maxScore || 10,
            endGame: this.endGame,
        };
        const gameControlsProps = {
            running,
            paused,
            paddle1Color,
            paddle2Color,
            ballColor,
            ballType,
            errorMsgs,
            passState: this.setBallShape,
            startGame: this.startGame,
            togglePause: this.togglePause,
            setValue: this.setValue,
            setColor: this.setColor,
        };

        return (
            <main>
                <section>
                    <GameCanvas {...gameCanvasProps} />
                    <GameControls {...gameControlsProps} />
                </section>
            </main>
        )
    }
}

export default GameInterface;