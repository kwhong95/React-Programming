# 3.3 리액트 훅 기초 익히기
> 함수형 컴포넌트에 기능을 추가할 때 사용하는 함수

## 3.3.1 상태값 추가하기: `useState`

### 배치로 처리되는 상태값 변경 함수
> 리액트는 가능하다면 상태값 변경을 배치(batch)로 처리

#### 상태값 변경 함수를 연속해서 호출하는 코드
```js
function MyComponent() {
    const [count, setCount] = useStat({ value: 0 });
    function onClick() {
        setCount({ value: count.value + 1 });
        setCount({ value: count.value + 1 });
    }
    console.log('render called');
    return (
        <div>
            <h2>{count.value}</h2>
            <button onClick={onClick}>증가</button>
        </div>
    );
}
```
- `count.value` 상태값을 두 번 증가시키려고 했으나 한 번만 적용 > 상태값 변경 함수가 비동기로 동작하기 때문
-  리액트는 효율적인 렌더링을 위해 여러 개의 상태값 변경 요청 > 배치로 처리 

---

### 상태값 변경 함수에 함수 입력하기
#### 상태값 변경 함수의 인수로 함수를 사용한 코드
```js
function MyComponent() {
    const [count, setCount] = useState(0);
    function onClick() {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
    }
    // ...
}
```
- 상태값 변경 함수로 입력된 함수는 자신이 호출 되기 직전의 상태값을 매개변수로 받음
- 따라서 `count` 상태값은 2만큼 증가

### 호출 순서가 보장되는 상태값 변경 함수
> 비동기로 처리되나, 그 순서가 보장됨
#### 호출 순서가 보장되는 상태값 변경 함수
```js
function MyComponent() {
    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    function onClick() {
        setCount1(count1 + 1);
        setCount2(count2 + 1);
    }
    const result = count1 >= count2;
    // ...
}
```
- `count1` > `count2` 순으로 증가
- 호출 순서대로 상태값 변경되기 때문에 `result` 변수는 항상 `true`

### `useState` 훅 하나로 여러 상태값 관리하기
> 상태값 변경 함수는 이전 상태값을 덮어쓴다.

#### 하나의 `useState` 훅으로 여러 상대 값 관리하기
```js
import React, { useState } from 'react';

function Profile() {
    const [state, setState] = useState({ name: '', age: 0 });
    return (
        <div>
            <p>{`name is ${state.name}`}</p>
            <p>{`age is ${stae.age}`}</p>
            <input
                type="text"
                value={state.name}
                onChange={e => setState({ ...state, name: e.target.value })}
            />
            <input 
                type="number"
                value={state.age}
                onChange={e => setState({ ...state, age: e.target.value })}
            />
        </div>
    )
}
```
- 두 상태값을 하나의 객체로 관리
- 이전 상태값을 덮어쓰기 때문에 `...state`와 같은 코드가 필요
- 상태값을 하나의 객체를 관리할 때는 `useReducer` 사용 권장

---

### 상태값 변경이 배치로 처리되지 않는 경우
> 리액트 외부에서 관리되는 이벤트 처리 함수의 경우 상태값 변경이 배치로 처리되지 않음

```js
function MyComponent() {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
        function onClick() {
            setCount(prev => prev + 1);
            setCount(prev => prev + 1);
        }
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    }, []);
    console.log('render called');
}
```
- 배치로 동작히지 않기 때문에, 두번 호출됨

#### `unstable_batchedUpdates`를 이용해서 상태값 변경을 배치로 처리하기
```js
function onClick() {
    ReactDOM.unstable_batchedUpdates(() => {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
    });
}
```
- 안정화 되지 않은 API 는 아님

## 3.3.2 컴포넌트에서 부수 효과 처리하기: `useEffect`
> 함수 실행 시 함수 외부의 상태를 변경하는 연산을 부수 효과라고 함

#### `useEffect` 훅의 사용 예

```js
import React, {useState, useEffect}  from "react";

function MyComponent() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `업데이트 횟수: ${count}`;
    });
    return <button onClick={() => setCount(count + 1)}>증가</button>
}
```
- 부수 효과 함수는 렌더링 결과가 실제 돔에 반영된 후 호출
- 버튼 클릭 시 다시 렌더링되고, 렌더링이 끝나면 부수 효과 함수가 호출

---

### 컴포넌트에서 API 호출하기
#### `useEffect` 훅에서 API 호출하기

```js
import React, {useEffect, useState} from "react";

function Profile({ userId }) {
    const [user, setUser] = userState(null);
    useEffect(
        () => {
            getUserApi(userId).then(data => setUser(data));
        },
        [userId],
    );
    return (
        <div>
            {!user && <p>사용자 정보를 가져오는 중...</p>}
            {user && (
                <>
                    <p>{`name is ${user.name}`}</p>
                    <p>{`age is ${user.age}`}</p>
                </>
            )}
        </div>
    );
}
```
- 부수 효과 함수는 렌더링할 때마다 호출 > API 통신을 불필요하게 많이 함
- 두 번째 매개변수로 배열을 입력 > 배열의 값이 변경되는 경우에만 함수가 호출(의존성 배열)

---

### 이벤트 처리 함수를 등록하고 해제하기
#### `useEffect` 훅을 이용해서 이벤트 처리 함수를 등록하고 해제하기

```js
import React, { useEffect, useState } from "react";

function WidthPrinter() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return <div>{`width is ${width}`}</div>;
}
```

## 3.3.3 훅 직접 만들기
> 리액트가 제공하는 훅을 이용해 커스텀(custom) 훅 생성이 가능

### `useUser` 커스텀 훅
```js
function useUser(userId) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        getUserApi(userId).then(data => setUser(data));
    }, [userId]);
    return user;
}

function Profile({ userId }) {
    const user = useUser(userId);
    // ...
}
```

### `useWindowWidth` 커스텀 훅

```js
import { useEffect, useState } from "react";

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);
    return width;
}
function WidthPrinter() {
    const width = useWindowWidth();
    return <div>{`width is ${width}`}</div>
}
```

---

### `useMounted` 커스텀 훅
> 마운트란 컴포넌트의 첫 번째 렌더링 결과가 실제 돔에 반영된 상태

```js
function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}
```

## 3.3.4 훅 사용 시 지켜야 할 규칙
> 두 규칙을 지켜야 리액트가 각 훅의 상태를 제대로 기억할 수 있다.

- 규칙 1: 하나의 컴포넌트에서 훅을 호출하는 순서는 항상 같아야 한다.
- 규칙 2: 훅은 함수형 컴포넌트 또는 커스텀 훅 안에서만 호출되어야 한다.

#### 훅 사용시 `규칙 1`을 위반한 경우
```js 
function MyComponent() {
    const [value, setValue] = useState(0);
    if (value === 0) {
        const [v1, setV1] = useState(0);
    } else {
        const [v1, setV1] = useState(0);
        const [v2, setV2] = useState(0);
    }
    // ...
    for (let i = 0; i < value; i++) {
        const [num, setNum] = useState(0);
    }
    // ...
    function fun1() {
        const [num, setNum] = useState(0);
    }
    // ...
}
```

- 조건에 따라 훅을 호출하면 순서가 보장되지 않음
- 루프 안에서 훅을 호출하는 것 또한 마찬가지
- `func1`  함수가 언제 호출될지 알 수 없음

---

### 훅의 호출 순서가 같아야 하는 이유
#### 여러 개의 훅 사용하기
```js
function Profile() {
    const [age, setAge] = useState(0);
    const [name, setName] = useState('');
    // ...
    useEffect(() => {
        // ...
        setAge(27);
    }, []);
}
```
- 리액트가 상태값을 구분할 수 있는 유일한 정보는 훅이 사용된 순서
- 만약 조건문에 의해 `setAge` 함수가 실행되지 않는다면 `name` 이 `27` 로 설정되는 버그가 발생

---

### 리액트가 내부적으로 훅을 처리하는 방식
#### 의사코드(pseudo-code) 로 표현한 리액트 내부 코드
```js
let hooks = null;

export function useHook() { // 1
    // ...
    hooks.push(hookData); // 2
}

function process_a_component_rendering(component) { // 3
    hooks = []; // 4 
    component(); // 5
    let hooksForThisComponent = hooks; // 6
    hooks = null;
    // ...
}
```

1. 리액트가 내장하고 있는 훅!
2. 각 훅 함수에서는 `hooks` 라는 배열에 자신의 데이터를 추가
3. 렌더링 과정에서 하나의 컴포넌트를 처리하는 함수
4. `hooks`를 빈 배열로 추가
5. 컴포넌트 내부에서 훅을 사용한 만큼 `hooks` 배열에 데이터가 추가
6. 생성된 배열을 저장하고 `hooks` 변수를 초기화

> 이처럼 리액트는 훅이 사용된 순서를 저장하고 배열에 저장된 순서를 기반으로 훅을 관리함