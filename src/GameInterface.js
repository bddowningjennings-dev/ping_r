import React, { Component } from 'react';

import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';

class GameInterface extends Component {
    render() {
        return (
            <main style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GameCanvas />
                    <GameControls />
                </section>
            </main>
        )
    }
}

export default GameInterface;