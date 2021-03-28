import React from 'react';
import { getValue } from './legacy';

function App({ name, age }: { name: string; age: number }) {
    const value = getValue();
    console.log(value.toFixed());
    return (
        <div>
            <p>{name}</p>
            <p>{age}</p>
        </div>
    )
}

export default App;