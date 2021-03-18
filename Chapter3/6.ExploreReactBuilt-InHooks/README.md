# 3.6 리액트 내장 훅 살펴보기
## 3.6.1 Consumer 컴포넌트 없이 콘텍스트 사용하기: `useContext`
> Consumer 컴포넌트를 사용하지 않고도 부모 컴포넌트로부터 전달된 콘텍스트 데이터를 사용할 수 있다.

#### 훅을 사용하지 않고 콘텍스트 API 사용하기
```js
const UserContext = React.createContext();
const user = { name: 'mike', age: 23 };

function ParentComponent() {
    return (
        <UserContext.Provider value={user}>
            <ChildComponent />
        </UserContext.Provider>
    );
}

function ChildComponent() {
    // ...
    return (
        <UserContext.Consumer>
            {user => (
                <>
                    <p>{`name is ${user.name}`}</p>
                    <p>{`age is ${user.age}`}</p>
                </>
            )}
        </UserContext.Consumer>
    );
}
```
- 부모 컴포넌트에서는 Provider 컴포넌트로 데이터 전달
- 자식 컴포넌트에서는 Consumer 컴포넌트를 통해 데이터 사용
- 한계점: Consumer 컴포넌트 안쪽에서만 데이터 접근이 가능

#### `useContext` 훅 사용하기
```js
function ChildComponent() {
    const user = React.useContext(UserContext);
    console.log(`user: ${user.name}, ${user.age}`);
    // ...
}
```
- JSX 부분이 다소 복잡해지나, `useContext`훅은 사용하기 간편

## 3.6.2 렌더링과 무관한 값 저장하기: `useRef`
> 컴포넌트 내부에서 생성되는 값 중에는 렌더링과 무관한 값을 저장한다

#### `useRef` 훅을 이용해서 이전 상태값 저장하기
```js
import React, { useState, useRef, useEffect } from 'react';

function Profile() {
    const [age, setAge] = useState(20);
    const prevAgeRef = useRef(20);
    useEffect(
        () => {
            prevAgeRef.current = age;
        },
        [age],
    );
    const prevAge = prevAgeRef.current;
    const text = age === prevAge ? 'same': age > prevAge ? 'older' : 'younger';
    return (
        <div>
            <p>{`age ${age} is ${text} than age ${prevAge}`}</p>
            <button
                onClick={() => {
                    const age = Math.floor(Math.random() * 50 + 1);
                    setAge(age);
                }}
            >
                나이 변경
            </button>
        </div>
    )
}
```
> `useState` 훅도 변수로 사용이 가능하나, 컴포넌트의 생명 주기와 밀접하게 연관되어 있어 렌더링과 무관한 값을 저장하기엔 적합하지 않다.

- `age`의 이전 상태값을 저장하기 위한 용도로 `useRef` 훅 사용
- `age` 값이 변경되면 그 값을 `prevAgeRef` 에 저장
- `age`의 이전 상태값을 이용
- `age`가 변경되어 다시 렌더링할 때 `prevAge` 는 `age`의 이전 상태값을 나타냄
- 렌더링이 끝나면 `prevAgeRef`는 `age`의 최신 상태값으로 변경