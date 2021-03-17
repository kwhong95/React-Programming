# 3.4 ContextAPI 로 데이터 전달하기
> 컴포넌트의 중첩 구조가 복잡한 상황에서도 비교적 쉽게 데이터 전달이 가능

#### ContextAPI 를 사용하지 않은 코드
```js
function App() {
    return (
        <div>
            <div>상단 메뉴</div>
            <Profile username='mike' />
            <div>하단 메뉴</div>
        </div>
    );
}

function Profile({ username }) {
    return (
        <div>
            <Greeting username={username} />
            {/* ... */}
        </div>
    );
}

function Greeting({ usename }) {
    return <p>{`${usename}님 안녕하세요`}</p>;
}
```

## 3.4.1 ContextAPI 이해하기
#### ContextAPI 를 사용한 코드
```js
const UserContext = React.createContext('');

function App () {
    return (
        <div>
            <UserContext.Provider value='mike'>
                <div>상단 메뉴</div>
                <Profile />
                <div>하단 메뉴</div>
            </UserContext.Provider>
        </div>
    );
}

function Profile() {
    return (
        <div>
            <Greeting />
            {/* ... */}
        </div>
    );
}

function Greeting() {
    return (
        <UserContext.Consumer>
            {username => <p>{`${username}님 안녕하세요`}</p>}
        </UserContext.Consumer>
    );
}
```
- `createContext` 함수의 구조
```js
React.createContext(defaultValue) => { Provider, Consumer }
```
- `Provider`: 데이터 전달
- `Consumer`: 데이터 사용
- `Consumer` 컴포넌트는 데이터를 찾기 위해 상위로 올라가면서 가장 가까운 `Provider` 컴포넌트를 찾음
- 찾지 못할 시 기본값이 사용됨
- `Provider` 컴포넌트의 속성값 변경 시 하위의 모든 `Consumer` 컴포넌트는 다시 렌더링
- 중간에 위치한 컴포넌트의 렌더링 여부와 상관없이 `Consumer` 컴포넌트는 다시 렌더링

#### Profile 컴포넌트가 다시 렌더링 되지 않도록 `React.memo`를 사용한 코드
```js
function App() {
    const [username, setUsername] = useState('');
    return (
        <div>
            <UserContext.Provider value={username}>
                <Profile />
            </UserContext.Provider>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
        </div>
    );
}

const Profile = React.memo(() => {
    return (
        <div>
            <Greeting />
            {/* ... */}
        </div>
    );
});

function Greeting() {
    return (
        <UserContext.Consumer>
            {username => <p>{`${username}님 안녕하세요`}</p>}
        </UserContext.Consumer>
    );
}
```
- Profile 컴포넌트 > `React.memo` > 속성값이 없어 최초 한 번만 렌더링
- Profile 컴포넌트의 렌더링 여부와 상관없이 Greeting 컴포넌트의 Consumer 컴포넌트는 다시 렌더링
- 즉, 중간 컴포넌트의 렌더링 여부와 상관없이 Provider 컴포넌트로 새로운 데이터 입력 시 Consumer 컴포넌트가 다시 렌더링되는 것이 보장됨
