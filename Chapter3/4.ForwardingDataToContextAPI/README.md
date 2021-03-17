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

## 3.4.2 Context API 활용하기
> 여러 Context 객체를 중첩해서 사용, Consumer 컴포넌트를 사용하는 하위 컴포넌트에서 Context 데이터를 수정

### 여러 Context 를 중첩해서 사용하기
```js
const UserContext = React.createContext('');
const ThemeContext = React.createContext('dark');

function App() {
    return (
        <div>
            <ThemeContext.Provider value='light'>
                <UserContext.Provider value='mike'>
                    <div>상단 메뉴</div>
                    <Profile />
                    <div>하단 메뉴</div>
                </UserContext.Provider>
            </ThemeContext.Provider>
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
        <ThemeContext.Consumer>
            {theme => (
                <UserContext.Consumer>
                    {username => (
                        <p
                            style={{ color: theme === 'dark' ? 'gray' : 'green' }}
                        >{`${username}님 안녕하세요`}</p>
                    )}
                </UserContext.Consumer>
            )}
        </ThemeContext.Consumer>
    );
}
```

- 두 개의 Provider & Consumer 컴포넌트 중첩 사용 가능
- 렌더링 성능상이점이 없으나 데이터의 종류별로 Context 를 생성하면 렌더링 성능상 이점이 있다.
- 데이터 변경 시 해당 Consumer 컴포넌트만 렌더링 되기 때문

---

### 하위 컴포넌트에서 Context 데이터를 수정하기
> 상태를 변경하는 디스패치(dispatch) 함수로 여러 컴포넌트에서 데이터 변경 할 수 있음

#### Context 데이터를 수정할 수 있는 함수 전달하기
```js
const UserContext = React.createContext({ username: '', helloCount: 0 });
const SetUserContext = React.createContext(() => {});

function App() {
    const [user, setUser] = useState({ username: 'mike', helloCount: 0 });
    return (
        <div>
            <SetUserContext.Provider value={setUser}>
                <UserContext.Provider value={user}>
                    <Profile />
                </UserContext.Provider>
            </SetUserContext.Provider>
        </div>
    )
}
```

#### 하위 컴포넌트에서 콘텍스트 데이터 수정하기
```js
function Greeting() {
    return (
        <SetUserContext.Consumer>
            {setUser => (
                <UserContext.Consumer>
                    {({ username, helloCount }) => (
                        <React.Fragment>
                            <p>{`${username}님 안녕하세요`}</p>
                            <p>{`인사 횟수: ${helloCount}`}</p>
                            <button
                                onClick={() => 
                                    setUser({ username, helloCount: helloCount + 1 })
                                }
                            >
                                인사하기
                            </button>
                        </React.Fragment>
                    )}
                </UserContext.Consumer>
            )}
        </SetUserContext.Consumer>
    )
}
```

- `helloCount` 속성만 변경하는데도, 사용자 데이터를 만들어서 `setUser` 함수에 입력해야 하는 단점

## 3.4.3 Context API 사용시 주의할 점

### 불필요한 렌더링이 발생하는 경우
```js
const UserContext = React.createContext({ username: '' });

function App() {
    const [username, setUsername] = useState('');
    return (
        <div>
            <UserContext.Provier value={{ username }}>
                // ...
```

- Context 데이타로 객체 전달 > 렌더링 시 새로운 객체 생성 

#### 불필요한 렌더링이 발생하지 않는 코드
```js
function App() {
    const [user, setUser] = useState({ username: '' });
    return (
        <div>
            <UserContext.Provider value={user}>
                // ...
```

### Provider 컴포넌트를 찾지 못하는 경우
> 적절한 위치에서 사용하지 않으면 큰 텍스트 데이터가 전달되지 않음

#### Consumer 컴포넌트가 Provider 컴포넌트를 찾지 못하는 경우
```js
const UserContext = React.createContext('unknown');

function App() {
    <div>
        <UserContext.Provider value='mike'>
            {/* ... */}
        </UserContext.Provider>
        <Profile />
    </div>
}
```