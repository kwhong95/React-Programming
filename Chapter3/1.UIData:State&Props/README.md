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
