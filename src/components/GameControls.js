import React, { Component } from 'react';

import './GameControls.css'

// const GameControls = props => {
class GameControls extends Component {
    render() {

        const { startGame, setValue, setColor, running, paused, togglePause, errorMsgs } = { ...this.props }
        const { paddle1Color, paddle2Color, ballColor } = { ...this.props }
        const pauseText = paused ? 'Resume Game' : 'Pause Game'
        const errorContent = (
            <div className='error'>
                { errorMsgs.map((err, i) => {
                    try {
                        return <p key={i}>{err.msg}</p>
                    } catch(err) { }
                    }) 
                }
            </div>
        )
        const setup = (
            <div className='setup'>
                { errorContent }            
                <input
                    onChange={setValue}
                    placeholder='Set Max Score (default: 10)'
                    name='maxScore'
                />
                <input
                    onChange={setValue} placeholder='Set Ball Velocity (default: 1; range: 1-3)'
                    name='velocity'
                />
                <div onClick={()=>this.player1Color.click()} >
                    Set Player1 Paddle Color:
                    <div className='color-selected' style={{'backgroundColor':`${paddle1Color}`}}></div>
                    <input
                        className='hidden'
                        ref={input => this.player1Color = input}
                        onChange={setColor} 
                        type="color"
                        name="paddle1Color"
                    />
                </div>
                <div onClick={()=>this.player2Color.click()}>
                    Set Player2 Paddle Color:
                    <div className='color-selected' style={{'backgroundColor':`${paddle2Color}`}}></div>
                    <input
                        className='hidden'
                        onChange={setColor}
                        ref={input => this.player2Color = input}
                        type="color"
                        name="paddle2Color"
                    />
                </div>
                <div onClick={()=>this.ballColor.click()}>
                    Set Ball Color:
                    <div className='color-selected' style={{'backgroundColor':`${ballColor}`}}></div>
                    <input
                        className='hidden'
                        onChange={setColor}
                        ref={input => this.ballColor = input}
                        type="color"
                        name="ballColor"
                    />
                </div>
                <button onClick={startGame}>Start Game</button>
            </div>
        )
        return (
            <article>
                { !running && setup }
                { running && <button onClick={togglePause}>{pauseText}</button>}
                
            </article>
        )
    }
}

export default GameControls;