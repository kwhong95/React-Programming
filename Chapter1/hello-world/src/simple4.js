function Container() {
    const [count, setCount] = React.useState(0);
    return (
        <div>
            <div style={{ marginTop: 20 }}>
                <span>현재 카운트: </span>
                <span>{count}</span>
                <button onClick={() => setCount(count + 1)}>증가</button>
                <button onClick={() => setCount(count - 1)}>감소</button>
            </div>
        </div>
    );
}

ReactDOM.render(React.createElement(Container), document.querySelector('#react-root'))