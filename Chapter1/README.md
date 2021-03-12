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
- 4️⃣ 원한다면 as 키워드를 이용해서 이름 변경이 가능

### 1.2.4 웹팩 사용해 보기
> 리액트의 두 파일을 JS 의 모듈 시스템으로 포함

1. package.json 파일 생성
```
npm init -y
```

2. 필요한 외부패키지 설치
```
npm i webpack webpack-cli react react-dom
```

3. Test 환경 구축 
> webpack-test directory 참고

4. 웹팩으로 두 JS 파일 하나로 합치기
```
npx webpack
```

> dist 파일에 main.js 파일이 생성되며, 웹팩으로 생성된 파일이다.

## create-react-app 으로 시작하기
> 리액트로 웹 애플리케이션을 만들기 위한 환경 제공

**장점**
- 바벨 / 웹팩 포함
- 테스트 시스템, HMR(hot-module-replacement), ES6+ 문법, CSS 후처리 등 필수 개발 환경 구축
- 문제 해결을 위한 선택지가 여러 개일 때 가장 합리적인 선택
- 리액트 환경 구축을 위한 시간 절약

### 1.3.1 create-react-app 사용해 보기
1. 리액트-cra
```
npx create-react-app cra-test
```
2. 리액트 앱 실행하기
```html
cd cra-test
npm start
```

3. src 폴더 밑에서 `import` 키워드 사용 장점
- JS & CSS 파일 자동 압축
- 웹팩: 해시값 이용 > url 생성 > 브라우저 캐싱 효과
- 페이지 title 수정 - `react-helmet` 이용
- 검색 엔진 최적화 - `SSR(서버사이드 렌더링)`에 특화된 `넥스트(next.js)` 사용
- PWA(progressive web app) 기능 - `serviceWorker.register()` 코드 사용

### 1.3.2 주요 명령어 알아보기 
> package.json 파일의 네 가지 npm 스크립트 명령어

#### 개발 모드로 실행하기
> npm start
- HMR 동작 > 코드 수정시 화면에 즉시 반영
- 에러 메세지 출력 영역을 클릭하면 에러가 발생한 파일이 에디터에서 오픈
- https 실행 옵션 제공 (`HTTPS=true npm start`)

#### 빌드하기
> npm run build
- 배포 환경 파일 제공(압축) > 정적 파일 생성

> npx serve -s build
- serve 패키지 : 노드(node.js)환경에서 동작하는 웹 서버 애플리케이션
- build/static 폴더 밑에 생성된 파일의 이름에 **해시값** 포함
  + 파일의 내용이 변경되지 않으면 해시값은 항상 동일
  + 새로 빌드를 해도 변경되지 않은 파일은 브라우저에 캐싱되어 있는 파일 사용
  + 빠르게 페이지가 렌더링 되는 효과
- `import`로 가져온 CSS 파일은 모두 `build/static/css/main.{해시값}.chunk.css`에 저장
  + 이미지 파일 크기가 10kb 보다 작은 경우에는 별도 파일로 생성되지 않고 `data url`형식으로 JS 파일에 포함
    + 크기가 작을 땐 한 번의 요청으로 처리하는 것이 효율적
  
#### 테스트 코드 실행하기
> npm test

- 제스트(jest) 란 테스트 프레임워크 기반으로 테스트 시스템 구축
- 테스트 JS 파일 조건
  + `__test__` 폴더 밑에 있는 모든 JS 파일
  + 파일 이름이 `.test.js`로 끝나는 파일
  + 파일 이름이 `.spec.js`로 끝나는 파일
  
#### util.js
```js
export function addNumber(a, b) {
    return a;
}
```
- 코드에 버그가 있기 때문에 테스트 코드 작성시 실패

#### util.test.js
```js
import { addNumber } from "./util";

it('add two numbers', () => {
  const result = addNumber(1, 2);
  expect(result).toBe(3);
});
```
- `it`, `expect` 는 제스트에서 테스트 코드를 작성할 때 사용

```
npm test
```

- CI(continuous integration)와 같이 watch 모드가 필요 없는 환경에서는 명령어로 테스트 코드 실행
```
CI=true npm test
```

#### 설정 파일 추출하기
> npm run eject 

- cra 의 내부 설정 파일이 밖으로 노출
  + 바벨이나 웹팩 설정 변경 가능
- cra 에서 개선하거나 추가된 기능이 단순한 패키지의 버전 업이 적용되지 않음(단점)
- 리액트 툴체인에 익숙하지 않는다면 추천하지 않음 

### 1.3.3 자바스크립트 지원 범위

#### cra(v3.2.0) 지원 기능
- 지수 연산자(exponentiation operator)
- async await 함수
- 나머지 연산자(rest operator), 전개 연산자(spread operator)
- 동적 임포트(dynamic import) 
- 클래스 필드(class field)
- JSX 문법
- 타입 스크립트(typescript), 플로(flow) 타입 시스템

> 폴리필(polyfill) core-js 패키지 활용
```
npm install core-js
```

#### 폴리필 이란?
> 새로운 JS 표준이 나와도 대다수 사용자의 브라우저에 지원하지 않으면 사용 불가  
바벨을 이용하면 어느정도 사용 가능  
바벨 사용 시 빌드 시점에 코드가 변환  
> 새로운 객체나 함수는 성격이 좀 다름  
> 실행 시점에 주입할 수 있는 장점  
> 실행 시점에 주입하고자 하는 객체나 함수가 현재 환경에 존재하는지 검사 후 존재하는 경우에만 주입하는 게 좋음.  
> 그 기능이 없을 때 주입하는 것을 **폴리필**이라고 한다.

### 1.3.4 코드 분할하기
> 코드 분할(code splitting)을 이용하면 사용자에게 필요한 양의 코드만 내려줄 수 있다.

*`cra-test` 파일 `Todo.js`, `TodoList.js` 코드 참조*

- 할 일 목록을 관리할 상태값 정의
- **할 일 추가** 버튼 클릭 시 호출되는 이벤트 처리 함수
- `onClick` 함수가 호출되면 비동기로 Todo 모듈을 가져옴
  + 동적 임포트는 프로미스를 반환하므로, `then` 메서드를 이용해서 동작을 정의
- 비동기로 가져온 `Todo` 컴포넌트를 이용해서 새로운 할 일을 만든다.
- 상탯값에 저장된 할 일 목록을 모두 출력

*파일이 비동기로 처리 되는지 확인*

- 버튼을 누를 때마다 `{숫자}.chunk.js` 파일을 받아옴.
- 이후 버튼을 클릭하면 더 이상 파일을 받아 오지 않고 할 일 목록 계속 추가
```
npm run build
```

- build/static/js 폴더 밑에 `{숫자}.{해시값}.chunk.js` 파일이 추가됨.
  + 배포 환경에서 브라우저 캐싱 효과를 보기 위해 해시값 추가
- Todo.js 파일은 별도 JS 파일로 분리 되었으며, 필요한 경우에만 내려받도록 구현  

### 1.3.5 환경 변수 사용하기
> cra 에서 빌드 시점에 환경 변수를 코드로 전달 가능  
> 환경 변수는 개발, 테스트, 배포 환경별 다른 값 적용 시 유용  
> 전달된 환경 변수에서는 코드에서 `process.env.{환경 변수 이름}`으로 접근 가능

#### NODE_ENV 환경 변수 이용
> NODE_ENV 환경 변수의 값 결정 방법
- npm start 로 실행하면 development
- npm test 로 실행하면 test
- npm run build 로 실행하면 production

#### 기타 환경 변수 이용하기
> NODE_ENV 환경 변수 외에 다른 환경 변수는 `REACT_APP_` 접두사를 붙힘

```js
process.env.REACT_APP
```

환경 변수는 셸에서 입력하거나 `.env` 파일을 이용해 입력 가능

**셸에서 입력**
```
REACT_APP_API_URL=api.myapp.com npm start
```

**`.env`파일로 입력**
> 코드 참조!!

```js
console.log(`REACT_APP_DATA_API = ${process.env.REACT_APP_DATA_API}`);
console.log(`REACT_APP_LOGIN_API = ${process.env.REACT_APP_LOGIN_API}`);
```

> npm start 로 실행하면 `.env.development` 파일 내용 출력

*npm 버전이 로컬 머신의 `npm_version` 환경의 변수에 저장되어있는 경우*
```
REACT_APP_NODE_VERSION=$npm_version
```
----

## 1.4 CSS 작성 방법 결정하기

### 1.4.1 일반적인 CSS 파일로 작성하기
> 코드 참조!!

- `Button1.css` 파일은 일반적인 CSS 파일
- CSS 파일도 ESM 문법을 이용해서 JS 로 가져올 수 있음
- `Button1.css` 파일에 정의된 CSS 클래스명을 입력

> 단점 : CSS 클래스명이 같으면 나중 것으로 대체!(클래스명 충돌)

