import React, { useState } from 'react';

export default function ToDoList() {
    const [todos, setTodos] = useState([]);
    const onClick = () => {
        import('./Todo').then(({ Todo }) => {
            const position = todos.length + 1;
            const newTodo = <Todo key={position} title={`할 일 ${position}`} />;
            setTodos([...todos, newTodo]);
        });
    };
    return (
        <div>
            <button onClick={onClick}>할 일 추가</button>
            {todos}
        </div>
    )
}
