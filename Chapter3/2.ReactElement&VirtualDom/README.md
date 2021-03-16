# 3.2 리액트 요소와 가상 돔
- 리액트 요소(element): 리액트가 UI를 표현하는 수단
- 렌더링 성능을 위해 **가상 돔(virtual DOM)** 을 활용
    + 빠른 렌더링을 위해 돔 변경을 최소화
    + 이전과 이후의 가상 돔을 비교해서 변경된 부분만 실제 돔에 반영
    
## 3.2.1 리액트 요소 이해하기
> `createElement` 함수 : 리액트 요소 반환

#### JSX 코드가 `creatElement` 함수를 사용하는 코드로 변경된 예
```js
const element = <a href="http://google.com">Click here</a>;
const element = React.createElement(
    'a',
    { href: 'http://google.com' },
    'Click here',
);
```

#### 리액트 요소의 구조
```js
const element = (
    <a key="key1" style={{ width: 100 }} href="http://google.com">
        Click here
    </a>
);
console.log(element);
const consoleLogResult = {
    type: 'a',
    key: 'key1',
    ref: null,
    props: {
        href: 'http://google.com',
        style: {
            width: 100,
        },
        children: 'Click here',
    },
    // ...
};
```

#### JSX 코드에서 태그 사이에 표현식을 넣은 코드
```js
const element = <h1>제 나이는 {20 + 7} 세입니다</h1>;
console.log(element);
const consoleLogResult = {
    type: 'h1',
    props: { children: ['제 나이는 ', 25, ' 세입니다'] },
    // ...
};
```

#### 컴포넌트가 리액트 요소로 사용된 예
```js
function Title({ title, color }) {
    return <p style={{ color }}>{title}</p>
}
const element = <Title title="안녕하세요" color="blue" />;
console.log(element);
const consoleLogResult = {
    type: Title,
    props: { title: '안녕하세요', color: 'bule' },
    // ...
};
```

#### 리액트 요소는 불변 객체이다
```js
const element = <a href="http://google.com">Click me</a>;
element.type = 'b'; // 에러 발생
```

#### `RenderDOM.render` 함수는 주기적으로 호출하는 코드
```js
let seconds = 0;
function update() {
    seconds += 1;
    const element = (
        <div>
            <h1>안녕하세요</h1>
            <h2>지금까지 {seconds}초가 지났습니다.</h2>
        </div>
    );
    ReactDOM.render(element, document.getElementById('root'));
}

setInterval(update, 1000);
```
