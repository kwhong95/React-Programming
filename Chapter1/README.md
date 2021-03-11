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