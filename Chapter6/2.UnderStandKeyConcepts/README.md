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

