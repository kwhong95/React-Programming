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

## 3.2.2 리액트 요소가 돔 요소로 만들어지는 과정

- 리액트 요소는 트리(tree) 구조로 구성
    + 하나의 리액트 요소 트리는 시간에 따라 변화하는 화면의 한순간을 나타냄
- 렌더 단계(render phase) > 커밋 단계(commit phase) : 데이터 변경에 의한 화면 업데이트
    + 렌더 단계: 실제 돔에 반영할 변경 사항을 파악 단계(가상돔 : 변경 사항 파악)
    + 커밋 단계: 파악된 변경 사항을 실제 돔에 반영하는 단계
    + 실제 돔의 변경 사항을 최소화하기 위한 과정

#### 실제 돔으로 만드는 과정을 보여 줄 예제 코드
```js
function Todo({ title, desc }) {
    const [priority, setPriority] = React.useState('high');
    function onClick() {
        setPriority(priority === "high" ? "low" : "high");
    }
    return (
        <div>
            <Title title={title} />
            <p>{desc}</p>
            <p>{priority === 'high' ? "우선순위 높음" : "우선순위 낮음"}</p>
            <button onClick={onClick}>우선순위 변경</button>
        </div>
    );
}

const Ttile = React.memo(({ title }) => {
    return <p style={{ color: 'blue' }}>{title}</p> 
});

ReactDOM.render(
    <Todo title="리액트 공부하기" desc="실전 리액트 프로그래밍을 열심히 읽는다" />,
    document.getElementById('root'),
);
```

#### 첫 번째로 만들어지는 리액트 요소
```js
const initialElementTree = {
    type: Todo,
    props: {
        title: '리액트 공부하기',
        desc: '실전 리액트 프로그래밍을 열심히 읽는다',
    },
    // ...
}
```
#### Todo 컴포넌트 함수 호출 결과
```js
const elementTree = {
    type: 'div',
    props: {
        children: [
            {
                type: Title,
                props: {title: '리액트 공부하기'},
                // ...
            },
            {
                type: 'p',
                props: {children: '실전 리액트 프로그래밍을 열심히 읽는다.'},
                // ...
            },
            {
                type: 'p',
                props: {children: '우선순위 높음'},
                // ...
            },
            {
                type: 'button',
                props: {
                    onClick: function () {
                        /* Todo 컴포넌트의 onClick 함수 */
                    },
                    children: '우선순위 변경',
                },
                // ...
            },
        ],
    },
    // ...
};
```

- Title 컴포넌트가 존재 - 실제 돔 생성 불가능
- 리액트 요소 트리가 실제 돔으로 만들어지기 위해서는 모든 리액트 요소의 `type` 속성값이 문자열이여야 한다.(`type` 속성값: 문자열 - HTML 태그 변환 가능)
- 모든 컴포넌트 함수가 호출 되야 함

#### Title 컴포넌트 함수 호출 결과
```js
const elementTree = {
    type: 'div',
    props: {
        children: [
            {
                type: 'p',
                props: {
                    style: { color: 'blue' },
                    children: '리액트 공부하기',
                },
                // ...
            },
            {
                type: 'p',
                props: { children: '실전 리액트 프로그래밍을 열심히 읽는다.' },
                // ...
            },
            {
                type: 'p',
                props: { children: '우선순위 높음' },
                // ...
            },
            {
                type: 'button',
                props: {
                    onClick: function() {
                        /* Todo 컴포넌트의 onClick 함수 */
                    },
                    children: '우선순위 변경',
                }
            }
        ]
    }
}
```

#### 가상 돔
> 실제 돔을 만들 수 있는 리액트 요소 트리

- 최종 리액트 요소 트리를 생성하기 위해 치환되는 컴포넌트의 리액트 요소도 메모리에 유지됨
- 저장된 컴포넌트의 리액트 요소는 렌더 단계의 효율을 높이기 위해 사용
- 가상 돔은 UI 에서 변경된 부분을 빨리 찾기 위한 개념
- 컴포넌트의 리액트 요소도 가상 돔의 일부

#### `setPriority` 함수 호출 후 만들어진 리액트 요소 트리
```js
const elementTree = {
    type: 'div',
    props: {
        children: [
            {
                type: Title,
                props: { children: '리액트 공부하기' },
                // ...
            },
            {
                type: 'p',
                props: { children: '실전 리액트 프로그래밍을 열심히 읽는다.' },
                // ...
            },
            {
                type: 'p',
                props: { children: '우선순위 낮음' },
                // ...
            },
            // 아래 코드는 같음
        ]
    }
    
}
```

- Title 컴포넌트는 `React.memo`로 만들어졌고, 속성값이 변하지 않았기에 이전 결과가 재사용된다.
- 리액트 요소 > 파이버(fiber) 구조체로 변환 > `type`, `props` 속성값을 가짐
- 모든 `type` 속성값이 문자열이 될 때까지 연산
