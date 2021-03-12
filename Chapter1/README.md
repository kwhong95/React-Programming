# Chapter01 리액트 프로젝트 시작하기

## 1.1 리액트란 무엇인가?
> 페이스북에서 개발하고 관리하는 **UI 라이브러리**다.

### 가상 돔(virtual dom)
- UI를 빠르게 업데이트 
- 이전 UI 상태를 메모리에 유지해서, 변경될 UI의 최소 집합을 계산하는 기술

### 함수형 프로그래밍 적극 활용 - 조건 
- render 함수는 **순수 함수**로 작성한다
  + state 가 변하지 않으면 항상 같은 값을 반환
- state 는 **불변 변수**로 관리한다.
  + 컴포넌트 상태값을 수정할 때 기존 값을 변경하는 것이 아닌 **새로운 객체**를 생성
    
> 두 조건을 따르면 렌더링 성능을 크게 향상시킬 수 있다.

## 1.2 리액트 개발 환경 직접 구축하기
> 툴체인(toolchain)의 이해
> 바벨과 웹팩의 필요성의 이해

### 1.2.1 Hello World 페이지 만들기
> 리액트에는 다양한 외부 패키지가 존재  
> 초심자에게는 부담 > 외부 패키지 없이 리액트 페이지 구성해보기

아래의 4가지 리액트 자바스크립트 파일 다운
1. https://unpkg.com/react@16.14.0/umd/react.development.js
2. https://unpkg.com/react@16.14.0/umd/react.production.min.
3. https://unpkg.com/react-dom@16.14.0/umd/react-dom.development.js
4. https://unpkg.com/react-dom@16.14.0/umd/react-dom.production.min.js

- 1,3 : 개발 환경에서 사용되는 파일
- 2,4 : 배포 환경에서 사용되는 파일
- 1,2 : 플랫폼 구분 없이 공통으로 사용되는 리액트 핵심 기능(리액트 네이티브 포함)
- 3,4 : 웹에서만 사용되는 파일

```html
<html>
    <body>
        <h2>안녕하세요. 프론트엔드 웹 개발자 홍경원입니다.</h2> 
        <div id="react-root"></div> 1️⃣
        <script src="react.development.js"></script> 2️⃣
        <script src="react-dom.development.js"></script> ️️2️⃣
        <script src="simple1.js"></script> 3️⃣
    </body>
</html>
```
1️⃣ 리액트로 렌더링할 때 사용할 돔 요소, 리액트는 이 요소 안쪽에 새로운 돔 요소를 추가  
2️⃣ 앞에서 준비한 리액트 파일을 script 태그로 입력  
3️⃣ `simple1.js` 파일에 리액트 코드 작성

```js
function LikeButton() {
    const [liked, setLiked] = React.useState(false); 1️⃣
    const text = liked ? '좋아요 취소' : '좋아요'; 2️⃣
    return React.createElement( 3️⃣
        'button',
        { onClick: () => setLiked(!liked) }, 4️⃣
        text,
    );
}
const domContainer = document.querySelector('#react-root'); 5️⃣
ReactDOM.render(React.createElement(LikeButton), domContainer); 6️⃣
```
1️⃣ 초기값과 함께 컴포넌트의 상태값을 정의, React 변수는 `react.development.js` 파일에서 전역 변수로 생성  
2️⃣ 컴포넌트의 상태값에 따라 동적으로 버튼의 문구를 결정  
3️⃣ createElement 함수는 리액트 요소 반환
4️⃣ 버튼을 클릭하면 onClick 함수가 호출되고, 컴포넌트 상태값이 변경
5️⃣ `simple1.html`파일에 미리 생성한 돔 요소를 가져옴
6️⃣ `react-dom.development.js` 파일에서 전역 변수로 만든 ReactDOM 변수를 사용해서 만든 컴포넌트를 react-root 돔 요소에 붙힘

------

#### createElement 이해하기
> React.Create(component, props, ...children) => ReactElement

- 첫 번째 매개변수 component 는 일반적 문자열이나 리액트 컴포넌트
  + component 의 인수가 문자열이면 HTML 태그에 해당하는 돔 요소 생성 
  + 예를 들어, 문자열 p를 입력하면 HTML p 태그가 생성
- 두 번째 매개변수 props 는 컴포넌트가 사용하는 데이터
  + 돔 요소의 경우 style, className 등의 데이터 사용 가능
- 세 번째 매개변수 children 은 해당 컴포넌트가 감싸고 있는 내부의 컴포넌트를 가리킴
  + div 태그가 두개의 p고 태그를 감싸고 있는 경우
  ```html
  <div> 1️⃣
    <p>hello</p>
    <p>world</p>
  </div>
  
  createElement( 2️⃣
    'div',
    null,
    createElement('p', null, 'hello'),
    createElement('p', null, 'world'),
  )
  ```
1️⃣ 일반적인 HTML 코드
2️⃣ 같은 코드를 createElement 함수를 사용해서 작성

> 대부분의 리액트 개발자는 creatElement 를 직접 작성하지 않고 일반적으로 바벨의 도움을 받아 JSX 문법을 사용하며, 훨씬 가독성이 좋다.

-----

#### 여러 개의 돔 요소에 렌더링하기
```html
<html>
    <body>
        <h2>안녕하세요. 프론트엔드 웹 개발자 홍경원입니다.</h2>
        <div id="react-root1"></div> ----
        <!-- ... -->                    |
        <div id="react-root2"></div>    1️⃣
        <!-- ... -->                    |
        <div id="react-root3"></div> ----
        <script src="react.development.js"></script>
        <script src="react-dom.development.js"></script>
        <script src="simple2.js"></script> 2️⃣
    </body>
</html>
```
1️⃣ 기존 react-root 돔 요소를 지우고 세 개의 돔 요소 생성, 각 요소 사이에 다른 코드가 있다는 사실에 주목하며, 다른 코드가 없다면 HTML 에서는 하나의 요소만 만들고 리액트 코드에서 여러 개의 버튼을 구현하는게 낫다.  
2️⃣ 새로 만들 JS 파일 이름으로 변경

```js
// ... 
ReactDOM.render(
    React.createElement(LikeButton),
    document.querySelector('#react-root1'),
);
ReactDOM.render(
    React.createElement(LikeButton),
    document.querySelector('#react-root2'),
);
ReactDOM.render(
    React.createElement(LikeButton),
    document.querySelector('#react-root3'),
);

```
> 3개의 좋아요 버튼 확인!

### 1.2.2 바벨 사용해 보기
> 바벨(babel): JS 코드를 변환해 주는 컴파일러  

- 최신 JS 문법을 지원하지 않는 환경에서 최신 문법 사용 가능
- 코드에서 주석을 제거하거나 코드를 압축하는 용도로 사용 가능
- 리액트에서는 JSX 문법을 사용하기 위해 사용
  + JSX 문법으로 작성된 코드를 createElement 함수를 호출하는 코드로 변환
  
```js
function LikeButton() {
    const [liked, setLiked] = React.useState(false);
    const text = liked ? '좋아요 취소' : '좋아요';
    return React.createElement(
        'button',
        { onClick: () => setLiked(!liked) },
        text,
    );
}
function Container() {
    const [count, setCount] = React.useState(0);
    return React.createElement(
        'div',
        null,
        React.createElement(LikeButton),
        React.createElement(
            'div',
            { style: { marginTop: 20 } },
            React.createElement('span', null, '현재 카운트: '),
            React.createElement('span', null, count),
            React.createElement(
                'button',
                { onClick: () => setCount(count + 1) },
                '증가',
            ),
            React.createElement(
                'button',
                { onClick: () => setCount(count - 1) },
                '감소',
            ),
        ),
    );
}
const domContainer = document.querySelector('#react-root');
ReactDOM.render(React.createElement(Container), domContainer);
```
- 단순한 기능인데 UI 코드가 상당히 복잡, 바벨을 통해 개선 가능
- 기존 LikeButton 코드가 Container 로 변경, 대신 Container 컴포넌트 내부에서 사용 

-----

#### JSX 문법 사용해 보기
```js
function Container() {
    const [count, setCount] = React.useState(0);
    return (
        <div>
            <LikeButton />
            <div style={{ marginTop: 20 }}>
                <span>현재 카운트: </span>
                <span>{count}</span>
                <button onClick={() => setCount(count + 1)}>증가</button>
                <button onClick={() => setCount(count - 1)}>감소</button>
            </div>
        </div>
    );
}
```
> JSX 문법을 사용하니 가독성이 훨씬 좋다.

#### JSX 문법 알아보기
> HTML 태그를 사용하는 방식과 유사 / createElement 함수를 사용해서 작성하는 것보다 간결하고 가독성도 좋다. HTML 태그와 가장 큰 차이는 속성값을 작성하는 방법에 있다.

- 이벤트 처리 함수는 브라우저마다 다르게 동작할 수 있기 때문에 리액트와 같은 라이브러리를 사용하지 않을 때 주의해야 하지만, 리엑트에서는 브라우저와 상관 없이 이벤트 객체(SyntheticEvent)를 전달
- JS 에서는 속성 이름에 대시(-)로 연결되는 이름을 사용하기 힘들기에 카멜 케이스(camel case)를 이용

----
#### JSX 문법을 바벨로 컴파일 하기 
> 바벨을 npm 으로 설치하자
```
npm install @babel/core @babel/cli @babel/preset-react
```
- @babel-cli : 커맨드 라인에서 바벨을 실행할 수 있는 바이너리 파일 존재
- @babel/preset-react : JSX 로 작성된 코드를 `createElement`함수를 이용한 코드로 변환해 주는 바벨 플러그인 존재

*바벨 플러그인과 프리셋*   
  
바벨은 JS 파일을 입력으로 받아서 또 다른 JS 파일을 출력으로 준비한다.  
이렇게 변환해 주는 작업은 플러그인(Plugin) 단위로 이루어지며, 그 수 만큼 플러그인 수를 사용한다.
이런 플러그인의 집합을 프리셋(preset)이라고 하며, 바벨에서는 코드를 압축하는 플러그인을 모아 놓은 babel-preset-minify 를 제공한다.  
@babel/preset-react 는 리액트 애플리케이션을 만들 때 필요한 플러그인을 모아 놓은 프리셋이다.

> 설치된 패키지로 JS 파일 변환
```
npx babel --watch src --out-dir . --presets @babel/preset-react
```

npx 명령어는 외부 패키지에 포함된 실행 파일을 실행할 때 사용  
외부 패키지의 실행 파일은 `./node_modules/.bin/` 밑에 저장  
따라서 `npx babel`은 `./node_modules/.bin/babel`을 입력하는 것과 비슷  
위 명령어를 사용하면 src 폴더에 있는 모든 JS 파일을 `@babel/preset-react` 프리셋을 이용하여 변환 후 현재 폴더에 같은 이름의 JS 파일을 생성  
watch 모드로 실행했기 때문에 JS 파일을 수정할 때마다 자동으로 변환 후 저장

### 1.2.3 웹팩의 기본 개념 이해하기
> JS 로 만든 프로그램을 배포하기 좋은 형태로 묶어 주는 도구.

#### 전통적인 방식으로 개발된 웹사이트의 HTML 코드
```html
<html>
    <head>
      <script type="text/javascript" src="javascript_file_1.js"></script>
      <script type="text/javascript" src="javascript_file_2.js"></script>
      <!-- ... -->
      <script type="text/javascript" src="javascript_file_999.js"></script>
    </head>
    <!-- ... -->
</html>
```
기존 방식의 계속 늘어나는 JS 파일을 관리하기 힘듬  
파일 간의 의존성 떄문에 선언되는 순서를 신경 써야 함  
선언된 JS 파일이 앞에 선언된 파일에서 생성한 전역 변수를 덮어쓰는 위험 존재...

*JS의 모듈 시스템*
  
ES6 부터 모듈 시스템이 언어 차원에서 지원  
대표적인 JS 모듈 시스템 : `commonJS`   
내보내고 가져다 쓸 수 있도록 구현된 시스템이 모듈 시스템이라 한다.
------

- 웹팩은 ESM(ES6의 모듈 시스템)과 commonJS 를 모두 지원
- 예전 버전의 브라우저에서도 동작하는 JS 코드를 만듬

*ESM 문법 익히기*
```js
export default function func1() {} //  1️⃣
export function  func2() {}  
export const variable1 = 123; //  2️⃣
export let variable2 = 'hello';

// file2.js 파일
import myFunc1, { func2, variable1, variable2 } from './file1.js'; // 3️⃣

// file3.js 파일
import { func2 as myFunc2 } from './file1.js'; // 4️⃣
```

- 1️⃣,2️⃣ 코드를 내보낼 때는 `export` 키워드를 사용
- 3️⃣ 코드를 사용하는 쪽에서 `import`, `from` 키워드를 사용
- 1️⃣ `default` 키워드는 한 파일에서 한번만 사용 가능
- 3️⃣ `default` 키워드로 내보내진 코드는 괄호 없이 가져올 수 있고, 원하는 대로 이름 설정이 가능
- 1️⃣ 코드에서 내보낸 `func1` 함수는 3️⃣ 코드에서 myFunc1 이라는 이름으로 가져 옴
- 3️⃣ `default` 키워드 없이 내보내진 코드는 괄호를 사용해 가져옴(가져오거나 내보낼 때 사용된 이름 그대로)
- 4️⃣ 원한다면 as 키워드를 이용해서 이름 변경이 가능ㄴ
