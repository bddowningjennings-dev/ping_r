import React from 'react';

const GameControls = props => {
    const { startGame, setValue, setColor } = { ...props }
    return (
        <article>
            <button onClick={startGame}>Start Game</button>
            <input onChange={setValue} placeholder='Set Max Score' name='maxScore'></input>
            <input onChange={setValue} placeholder='Set Ball Velocity' name='velocity'></input>
            <input onChange={setColor} type="color" name="paddle1Color"></input>
            <input onChange={setColor} type="color" name="paddle2Color"></input>
            <input onChange={setColor} type="color" name="ballColor"></input>
            
        </article>
    )
}

export default GameControls;