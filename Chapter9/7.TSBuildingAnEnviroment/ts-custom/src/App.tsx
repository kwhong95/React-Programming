import React from 'react';
<<<<<<< HEAD
import { getValue } from './legacy';

function App({ name, age }: { name: string; age: number }) {
    const value = getValue();
    console.log(value.toFixed());
=======

function App({ name, age }: { name: string; age: number }) {
>>>>>>> 0107ee59d8c4fbebe86b53a66f3a372d60303023
    return (
        <div>
            <p>{name}</p>
            <p>{age}</p>
        </div>
    )
}

export default App;