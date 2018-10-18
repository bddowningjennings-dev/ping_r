import React, { Component } from 'react';
import './GameInterface.css'

import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';

const initializeState = props => {
    return {
        running: false,
        maxScore: 10,
        velocity: 1,
        paddle1Color: '#FFF',
        paddle2Color: '#FFF',
        ballColor: '#FFF'
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
    endGame = () => {
        this.setState(prevState => ({ ...prevState, running: false }))
    }
    setValue = e => {
        e && e.preventDefault()
        const { target } = { ...e }
        let value = Number(target.value)
        if (`${[target.name]}` === 'maxScore' && (value === 0 || isNaN(value))) value = 10
        if (`${[target.name]}` === 'velocity' && (value < 1 || value > 3 || isNaN(value))) value = 1
        this.setState(prevState => ({ ...prevState, [target.name]: value }))
    }
    setColor = e => {
        e && e.preventDefault()
        const { target } = { ...e }
        this.setState(prevState => ({ ...prevState, [target.name]: target.value }))
    }
    render() {
        const { running, maxScore, velocity, paddle1Color, paddle2Color, ballColor } = { ...this.state };
        const gameCanvasProps = {
            running,
            velocity,
            paddle1Color,
            paddle2Color,
            ballColor,
            maxScore: maxScore || 10,
            endGame: this.endGame,
        };
        const gameControlsProps = {
            startGame: this.startGame,
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