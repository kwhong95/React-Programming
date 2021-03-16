# 3.1 상태값과 속성값으로 관리하는 UI 데이터
> 리액트는 UI 데이터를 관리하는 방법을 제공한다.

- 상탯값 : 컴포넌트 내부에서 관리
- 속성값 : 부모 컴포넌트에서 내려주는 값
- UI 데이터가 변경되면 리액트가 컴포넌트 함수를 이용해서 화면을 자동으로 갱신

## 3.1.1 리액트를 사용한 코드의 특징
#### UI 라이브러리를 사용하지 않은 코드
```html
<html>
  <body>
    <div class="todo">
        <h3>할일 목록</h3>
        <ul class="list"></ul>
        <input class="desc" type="text" />
        <button onclick="onAdd()">추가</button>
        <button onclick="onSaveToServer()">서버에 저장</button>
    </div>
    <script>
        let currentId = 1;
        const toDoList = [];
        function onAdd() {
            const inputEl = document.querySelector('.todo .desc');
            const todo = { id: currentId desc: inputEl.value };
            toDoList.push(todo);
            currentId += 1;
            const elemList = document.querySelector('.todo .list');
            const liEl = makeTodoElement(todo);
            elemList.appendChild(liEl);
        }
        function makeTodoElement(todo) {
            const liEl = document.createElement('li');
            const spanEl = document.createElement('span');
            const buttonEl = document.createElement('button');
            spanEl.innerHTML = todo.desc;
            buttonEl.innerHTML = '삭제';
            buttonEl.dataset.id = todo.id;
            buttonEl.onclick = onDelete;
            liEl.appendChild(spanEl);
            liEl.appendChild(buttonEl);
            return liEl;
        }
        function onDelete(e) {
            const id = Number(e.target.dataset.id);
            const index = toDoList.findIndex(item => item.id === id);
            if (index >= 0) {
                totoList.splice(index, 1);
                const elemList = document.querySelector('.todo .list');
                const liEl = e.target.parentNode
                elemList.removeChild(liEl);
            }
        }
        function onSaveToServer() {
            // todoList 전송
        }
    </script>
  </body>
</html>
```

#### 리액트로 작성한 코드
```js
function MyComponent() {
    const [desc, setDesc] = useState('');
    const [currentId, setCurrentId] = useState(1);
    const [todoList, setTodoList] = useState([]);
    function onAdd() {
         const todo = { id: currentId, desc };
         setCurrentId(currentId + 1);
         setTodoList([...todoList, todo]);
    }
    function onDelete() {
        const id = Number(e.target.dataset.id);
        const newTodoList = todoList.filter(todo => todo.id !== id);
        setTodoList(newTodoList);
    }
    function onSaveToServer() {
        // TodoList 전송
    }
    return (
        <div>
            <h3>할 일 목록</h3>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id}>
                        <span>{todo.desc}</span>
                        <button data-id={todo.id} onClick={onDelete}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} />
            <button onClick={onAdd}>추가</button>
            <button onClick={onSaveToServer}>서버에 저장</button>
        </div>
    )
}
 ```
- 위 코드는 화면을 어떻게 그리는지 나타냄 > **명령형(imperative) 프로그래밍**
- 아래 코드는 화면에 무엇을 그리는지 나타냄 > **선언형(declarative) 프로그래밍**
- 추상화: `명령형 < 선언형 ` ->  비즈니스 로직에 좀 더 집중 가능

## 3.1.2 컴포넌트의 속성값과 상태값
### 속성값과 상태값으로 관리하는 UI 데이터
> 컴포넌트의 상태값: 컴포넌트가 관리하는 데이터  
> 컴포넌트의 속성값: 부모 컴포넌트로부터 전달받는 데이터

#### 컴포넌트의 상태값을 사용하지 않은 코드
```js
let color = 'red';
function  MyComponent() {
    function onClick() {
        color = 'bule';
    }
    return (
        <button style={{ backgroundColor: color }} onClick=={onClick}>
            좋아요
        </button>
    );
}
```

#### 컴포넌트의 상태값을 사용하는 코드

```js
import React, {useState} from "react";

function MyComponent() {
    const [color, setColor] = useState('red');
    function onClick() {
        setColor('blue');
    }
    return(
        <button style={{ backgroundColor: color }} onClick={onClick}>
            좋아요
        </button>
    )
}
```

#### 속성값을 이용한 코드
```js
function Title(props) {
    return <p>{props.title}</p>;
}
```

#### 부모 컴포넌트에서 속성값을 내려 주는 코드
```js
function Todo() {
    const [count, setCount] = React.useState(0);
    function onClick() {
        setCount(count + 1);
    }
    return (
        <div>
            <Title title={`현재 카운트: ${count}`} />
            <button onClick={onClick}>증가</button>
        </div>
    );
}
```

#### `React.meno` 를 사용한 코드
> `title` 속성값이 변경될 때만 렌더링되길 원할 때
```js
function Title(props) {
    return <p>{props.title}</p>;
}
export default React.memo(Title);
```

#### 사용된 컴포넌트 별로 관리되는 상태값
```js
function App() {
    return (
        <div>
            <MyComponent />
            <MyComponent />
        </div>
    );
}
```
---
### 불변 객체로 관리하는 속성값과 상태값
> 속성값은 **불변(immutable) 변수**이지만 상태값은 아니다.  
> 하지만 **불변 변수**로 관리하는 게 좋다.
#### 속성값 변경을 시도하는 코드
```js
function Title(props) {
    props.title = 'abc';
    // ...
}
```

#### 상태값을 직접 수정하는 코드
```js
function MyComponent() {
    const [count, setCount] = useState({ value: 0 });
    function onClick() {
        count.value = 2;
        // ...
        setCount(count );
    }
}
```

- 상태값을 직접 수정할 수 있지만 화면이 갱신되지 않음(리액트 인식 X)
- 상태값 또한 불변 변수로 관리하는 것이 좋음(코드의 복잡성 낮아짐)