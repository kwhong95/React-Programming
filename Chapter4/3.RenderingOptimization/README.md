# 4.3 렌더링 속도를 올리기 위한 성능 최적화 방법
> 리액트 실행 시 가장 많은 CPU 리소스를 사용하는 것은 **렌더링** 이다.

**리액트는 UI 라이브러리**
>  화면을 그리고 또 그린다
- 데이터(속성값 & 상태값)와 컴포넌트 함수로 화면을 그림
- 대부분 연산은 컴포넌트 함수의 실행과 가상 돔에서 발생

**최초 렌더링 이후 또는 데이터 변경시 렌더링 단계**
1) 이전 렌더링 결과를 재사용할지 판단 (`React.memo`)
2) 컴포넌트 함수를 호출
3) 가상 돔끼리 비교해서 변경된 부분만 실제 돔의 반영

> 평상시 개발 시 최적화 고민없이 코딩 후 성능 이슈 발생 시 고민하자!

## 4.3.1 `React.memo` 로 렌더링 결과 재사용하기
> 속성값 비교 함수가 호출

#### `React.memo` 함수 사용의 예
```js
function MyComponent(props) {
    // ...
}
function isEqual(prevProps, nextProps) {
    // true 또는 false를 반환
}
React.memo(MyComponent, isEqual);
```

- 두 번째 매개변수로 **속성값 비교 함수**를 입력
    + 속성값 비교 함수에서 참을 반환하면 이후 단계를 생략하고 이전 렌더링 결과를 재사용
    + 비교 함수 미입력시 얕은(shallow) 비교를 수행
    
#### 특정 속성값의 변경 전과 변경 후
```js
const prevProps = {
    todos: [
        { title: 'fix bug', priority: 'high' },
        { title: 'meeting with jone', priority: 'low' },
        // ...
    ],
    // ...
};
const nextProps = {
    todos: [
        { title: 'fix bug', priority: 'high' },
        { title: 'metting with jone', priority: 'high' },
        // ...
    ],
    // ...
};
```

- 두 번째 객체의 `priority` 속성값이 변경
- `todos`를 수정 가능한 객체로 관리하면 변경 여부 판단 시 단순무식(brute force) 비교하는 수 밖에 없음

#### 속성값을 불변 객체로 관리했을 때 변경 여부 확인하기
```js
prevProps.todos !== nextProps.todos
```
- 속성값을 **불변 객체**로 관리했다면 단순 비교만으로 변경을 판단할 수 있어 렌더링 성능에 큰 도움이 됨


---

### 리액트에서 속성값의 변경 여부를 계산하는 알고리즘
> `React.memo`로 속성값 비교 함수를 입력하지 않은 기본 제공 함수

#### 불변 객체로 관리 시 최상위 객체의 참조값만 비교하면 값의 변경 유무 파악 가능
```js
prevObj === nextObj
```

#### 리액트 속성값의 변경 여부를 판단하기 위해 속성값에 직접 연결된 모든 속성을 비교
```js
prevProps.prop1 === nextProps.prop1 &&
    prevProps.prop2 === nextProps.prop2 // && ... 
```

#### JSX 문법이 `createElement`로 변환된 코드
```js
function Parent() {
    return <Child name="mike" age={23} />;
}
function Child() {
    return React.createElement(Child, { name: 'mike', age: 23 });
}
```
- `creatElement` 변환 코드를 보면 렌더링할 때마다 새로운 속성값 객체가 생성
- 객체 내부 속성값이 변경되지 않아도 최상위 객체의 참조값은 항상 변경됨
