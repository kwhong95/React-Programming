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

## 3.6.3 메모이제이션 훅: `useMemo`, `useCallback`
> 이전 값을 기억해서 성능을 최적화한다

### `useMemo`
> 계산량이 많은 함수의 반환값을 재활용하는 용도로 사용

```js
import React, { useMemo } from "react";
import { runExpensiveJob } from './util';

function MyComponent({ v1, v2 }) {
    const value = useMemo(() => runExpensiveJob(v1, v2), [v1, v2]);
    return <p>{`value is ${vale}`}</p>;
}
```
- 첫 번째 매개변수로 함수를 입력 > 함수의 반환 값을 **기억**
- 두 번째 매개변수는 의존성 배열 > 변경되지 않으면 이전 반환 값을 **재사용**
- 배열의 값 변경 시 > 입력된 함수를 실행시키고 그 반환값을 **기억**

### `useCallback`
> `lodash` 라이브러리의 메모이제이션과 비슷, 렌더링 성능을 위해 제공

#### `useCallback` 훅이 필요한 예
```js
import React, { useState } from "react";
import { saveToServer } from './util';
import UserEdit from './UserEdit';

function Profile() {
    const [name, setName] = useState('');
    const [age, setAge] = useSTate(0);
    return (
        <div>
            <p>{`name is ${name}`}</p>
            <p>{`age is ${age}`}</p>
            <UserEdit 
                onSave={() => saveToServer(name, age)}
                setName={setName}
                setAge={setAge}
            />
        </div>
    );
}
```
- **Profile 컴포넌트**가 렌더링될 때마다 **UserEdit 컴포넌트**의 `onSave` 속성값으로 새로운 함수가 입력
- `useMemo` 훅을 사용해도 `onSave` 속성값이 항상 변경되어 **불필요한 렌더링**이 발생
- `onSave` 속성값은 `name`이나 `age` 값이 변경되지 않으면 항상 같아야 함

#### `useCallback`훅 사용하기
```js
// ...
function  Profile() {
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const onSave = useCallback(() => saveToServer(name, age), [name, age]);
    return (
        <div>
            <p>{`name is ${name}`}</p>
            <p>{`age is ${age}`}</p>
            <UserEdit onSave={onSave} setName={setName} setAge={setAge} />
        </div>
    );
}
```
- 이전 `onSave` 속성값으로 전달했던 것과 같은 함수를 `useCallback` 훅의 첫번째 매개변수로 입력
- `useCallback` 훅의 두 번째 매개변수는 **의존성 배열** > 변경되지 않으면 이전 생성 함수가 재사용

## 3.6.4 컴포넌트의 상태값을 리덕스처럼 관리하기: `useReducer`
```js
import React, { useReducer } from 'react';

const INITIAL_STATE = { name: 'empty', age: 0 };
function reducer(state, action) {
    switch (action.type) {
        case 'setName':
            return { ...state, name: action.name };
        case 'setAge':
            return { ...state, age: action.age };
        default:
            return state;
    }
}

function Profile() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    return (
        <div>
            <p>{`name is ${state.name}`}</p>
            <p>{`age is ${state.age}`}</p>
            <input 
                type="text"
                value={state.name}
                onChange={e =>
                    dispatch({ type: 'setName', name: e.currentTarget.value })
                }
            />
            <input 
                type="number"
                value={state.age}
                onChange={e => dispatch({ type: 'setAge', age: e.curruntTarget.value })}
            />
        </div>
    );
}
```

- 리덕스의 리듀서와 같은 방식으로 작성
- `useReducer` 훅의 매개변수로 앞에서 작성한 리듀서와 초기 상태값을 입력
- 상태값과 `dispatch` 함수를 차례대로 반환

### 트리의 깊은 곳으로 이벤트 처리 함수 전달하기

#### `useReducer` 훅과 `ContextAPI` 를 이용해서 이벤트 처리 함수 전달하기
```js
// ...
export const ProfileDispatch = React.createContext(null);
// ...
function Profile() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    return (
        <div>
            <p>{`name is ${state.name}`}</p>
            <p>{`age is ${state.age}`}</p>
            <ProfileDispatch.Provider value={dispatch}>
                <SomeComponent />
            </ProfileDispatch.Provider>
        </div>
    )
}
```
- `dispatch` 함수를 전달해 주는 콘텍스트 객체를 생성
- `Provider`를 통해 `dispatch` 함수를 데이터로 전달
- **SomeComponent** 하위의 모든 컴포넌트에서는 `dispatch`를 호출 가능
- `useReducer` 훅의 `dispatch` 함수는 값이 변하지 않는 특징이 있어 불필요하게 자주 렌더링되지 않음

