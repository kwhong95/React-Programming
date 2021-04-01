# 6.2 리덕스의 주요 개념 이해하기
<img width="768" alt="스크린샷 2021-04-01 오후 4 47 19" src="https://user-images.githubusercontent.com/70752848/113261197-2256c500-930a-11eb-9026-77e4bdc293d4.png">

## 6.2.1 액션
> `type` 속성값을 가진 자바스크립트 객체, 액션 객체를 `dispatch` 메서드에 넣어서 호출하면 리덕스는 상태값 변경을 위한 과정을 수행

#### 액션을 발생시키는 예제 코드
```js
store.dispatch({ type: 'ADD', title: '영화 보기', priority: 'high' });
store.dispatch({ type: 'REMOVE', id: 123 });
store.dispatch({ type: 'REMOVE_ALL' });
```

- 각 액션은 고유한 `type` 속성값을 사용해야 하는데 `ADD`라는 단어 하나만으로 중복 가능성이 높음

#### 액션 타입을 유일한 값으로 만들기 위해 접두사 이용하기
```js
store.dispatch({ type: 'todo/ADD', title: '영화 보기', priority: 'high' });
store.dispatch({ type: 'todo/REMOVE', id: 123 });
store.dispatch({ type: 'todo/REMOVE_ALL' });
```

- `dispatch` 메서드를 호출할 때 직접 액션 객체를 입력하는 방법은 사용하지 않는 게 좋음
- `todo/ADD` 액션의 경우 `title`, `priority` 라는 속성값이 항상 존재하도록 강제할 필요가 있음

#### 액션 생성자 함수의 예
```js
function addTodo({ title, priority }) {
  return { type: 'todo/ADD', title, priority };
}
function removeTodo({ id }) {
  return { type: 'todo/REMOVE', id };
}

function removeAllTodo() {
  return { type: 'todo/REMOVE_ALL' };
}

store.dispatch(addTodo({ title: '영화 보기', priority: 'high }));
store.dispatch(removeTodo({ id: 123 }));
store.dispatch(removeAllTodo());
```

- 세 개의 액션 생성자 함수를 정의, 필요한 인수와 함께 호출하면 항상 같은 구조의 액션 객체가 생성, 나중에 액션 객체의 구조를 변경할 때는 액션 생성자 함수만 수정
- `dispatch` 메서드를 호출할 때는 액션 생성자 함수를 이용

#### 액션 타입은 변수로 만들어 관리한다
```js
export const ADD = 'todo/ADD';
export const REMOVE = 'todo/REMOVE';
export const REMOVE_ALL = 'todo/REMOVE_ALL';

export function addTodo({ title, priority }) {
  return { type: 'ADD', title, priority };
}

export function removeTodo({ id }) {
  return { type: 'REMOVE', id };
}

export function removeAllTodo() {
  return { type: 'REMOVE_ALL };
}
```

- `type` 이름을 상수 변수로 만듬, 이 변수는 리듀서에서도 필요하기 떄문에 `export` 키워드를 이용해 외부에 오출
- 액션 생성자 함수도 외부에서 호출해야 하므로 외부로 노출
- 리덕스의 세가지 원칙에 위배되지 않으므로 액션 생성자 함수에서는 부수 효과를 발생 시켜도 ㄱㅊ

## 6.2.2 미들웨어
> 미들웨어(middleware)는 리듀서가 액션을 처리하기 전에 실행되는 함수

- 디버깅 목적으로 상태값 변경 시 로그를 출력하거나, 리듀서에서 발생한 예외를 서버로 전송하는 등의 목적으로 미들웨어를 활용

#### 미들웨어의 기본 구조
```js
const myMiddleware = store => next => action => next(action);
```

미들웨어는 함수 세 개가 중첩된 구조로 되어 있음.

#### 화살표 함수를 사용하지 않은 미들웨어 코드
```js
const myMiddleware = function(store) {
  return function(next) {
    return function(action) {
      return next(action);
    }
  }
}
```

- 미들웨어는 스토어와 액션 객체를 기반으로 필요한 작업을 수행 가능
- `next` 함수를 호출하면 다른 미들웨어 함수가 호출되면서 최종적으로 리듀서 함수가 호출

#### 미들웨어를 설정하는 방법
```js
import { createStore, applyMiddleware } from 'redux';
const middleware1 = store => next => action => {
  console.log('middleware1 start');
  const result = next(action);
  console.log('middleware1 end');
  return result;
};
const middleware2 = store => next => aciton => {
  console.log('middleware2 start');
  const result = next(action);
  console.log('middleware2 end');
  return result;
};
const myReducer = (state, action) => {
  console.log('myReducer');
  return state;
};
const store = createStore(myReducer, applyMiddleware(middleware1, middleware2));
store.dispatch({ type: 'someAction' });
```

- 간단한 두 개의 미들웨어가 정의
- 아무 일도 하지 않는 리듀서를 정의
- `applyMiddleware` 함수를 이용해서 미들웨어가 입력된 스토어 생성

#### 미들웨어의 실행 순서
```js
middleware1 start
middleware2 start
myReducer
middleware2 end
middleware1 end
```

### 리덕스의 `applyMiddleware` 함수
#### `applyMiddleware` 함수의 내부 구현
```js
const applyMiddleware = (...middlewares) => createStore => (..args) => {
  const store = createStore(...args);
  const funcsWithStore = middlewares.map(middleware => middleware(store));
  const chainedFunc = funcsWithStore.reduce(a, b) => next => a(b(next));
  
  return {
    ...store,
    dispatch: chainedFunc(store.dispatch),
  };
};
```

1) 입력된 `createStore` 함수를 호출해서 스토어 생성
2) 생성된 스토어와 함께 미들웨어의 첫 번째 함수를 호출
- 첫 번째 함수를 호출하면 `next` 매개변수를 갖는 두 번째 함수가 생성
- `funcsWithStore`의 모든 함수는 클로저를 통해 `store` 객체에 접근 가능
3) 모든 미들웨어의 두 번째 함수를 체인으로 연결
- 미들웨어가 세 개였다면 `chainedFunc` 함수는 `next => a(b(c(next)));`와 같음
4) 외부에 노출되는 스토어의 `dispatch` 메서드는 미들웨어가 적용된 버전으로 변경
- 미들웨어가 두 개였다면 `a(b(store.dispatch))` 와 같음
- 사용자가 `dispatch` 메서드를 호출하면 첫 번째 미들웨어 함수부터 실행
- 마지막 미들웨어가 `store.dispatch` 메서드를 호출

#### `dispatch` 메서드의 내부 구현
```js
function dispatch(action) {
  currentState = currentReducer(currentState, action);
  for (let i = 0; i < listeners.length; i++) {
    listeners[i]();
  }
  return action;
}
```
1) 리듀서 함수를 호출해서 상태값 변경
2) `dispatch` 메서드가 호출될 때마다 등록된 모든 이벤트 처리 함수를 호출
- 상태값이 변경되지 않아도 이벤트 처리함수를 호출 (주목!)
- 상태값 변경을 검사하는 코드는 각 이벤트 처리 함수에서 구현해야 함
- `react-redux` 패키지의 `connect` 함수에서는 자체적으로 상태값 변경을 검사

