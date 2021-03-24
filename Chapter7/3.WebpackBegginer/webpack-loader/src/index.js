import React from 'react';
import ReactDom from 'react-dom';
import './App.css';
import Icon from './icon.png';
import Json from './data.json';
import Text from './data.txt';

function App() {
    return (
        <div className="container">
            <h3 className="title">webpack example</h3>
            <div>{`name: ${Json.name}, age: ${Json.age}`}</div>
            <div>{`text: ${Text}`}</div>
            <img src={Icon} />
        </div>
    );
}

ReactDom.render(<App />, document.getElementById('root'));