# 8.1 서버사이드 렌더링 초급편
### 필요한 기본 기능들
- 리액트에서 제공하는 `renderToString`, `hydrate` 함수를 사용해 본다.
- 서버에서 생생된 데이터를 클라이언트로 전달하는 방법을 알아본다.
- `styled-components`로 작성된 스타일이 서버사이드 렌더링 시 어떻게 처리되는지 알아본다.
- 서버용 번들 파일을 만드는 방법을 알아본다.

### 바벨 실행을 위한 패키지
```shell
npm install @babel/core @babel/preset-env @babel/preset-react
```

### 웹팩 실행을 위한 패키지
```shell
npm install webpack webpack-cli babel-loader clean-webpack-plugin html-webpack-plugin
```

## 8.1.1 클라이언트에서만 렌더링 해보기
> SSR 을 구현하기 위한 사전 작업으로 클라이언트에서만 렌더링하는 웹사이트 제작  
> 자세한 코드는 `test-ssr` 폴더 참조

### 클라이언트 렌더링 확인하기
```shell
npx webpack
```


## 8.1.2 서버사이드 렌더링 함수 사용해 보기: `renderToString`

- `renderToString`
- `renderToNodeStream` 
- `renderToStaticMarkup` : 정적 페이지 
- `renderToStaticNodeStream` : 정적 페이지

### 서버사이드 렌더링을 위한 패키지 설치하기
```shell
npm i express @babel/cli @babel/plugin-transform-modules-commonjs
```

### 웹 서버 코드 작성하기
```js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server'; // 1
import React from 'react';
import App from './App';

const app = express(); // 2
const html = fs.readFileSync( // 3
    path.resolve(__dirname, '../dist/index.html'),
    'utf-8',
);
app.use('/dist', express.static('dist')); // 4
app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // 5
app.get('*', (req, res) => { // 6
    const renderString = renderToString(<App page='home' />); // 7
    const result = html.replace( // 8
        '<div id="root"></div>',
        `<div id="root">${renderString}</div>`,
    );
    res.send(result); // 9
});

app.listen(3000); // 10
```

1) `react-dom` 패키지의 `server` 폴더 밑에 서버에서 사용하는 기능이 모여 있음
2) `express` 객체인 `app` 변수를 이용해서 미들웨어와 url 경로 설정이 가능
3) 웹팩 빌드 후 생성되는 `index.html` 파일의 내용을 가져옴
- SSR 시 이 내용을 기바능로 새로운 HTML 파일을 생성할 예정
4) url 이 `/dist` 로 시작하는 경우에는 `dist` 폴더 밑에 있는 정적 파일을 연결
- 웹팩으로 빌드한 JS 파일이 이 코드에 의해서 서비스됨
5) 브라우저가 자동으로 요청하는 `favicon.ico` 파일이 6번 코드에서 처리되지 않도록 함
6) 나머지 모든 경우를 처리하는 함수를 등록
7) `renderToString` 함수를 이용해 `App` 컴포넌트를 렌더링
- 문자열을 반환
- 현재는 어떤 요청이 들어와도 Home 페이지를 렌더링
8) 렌더링된 결과를 반영해서 HTML 을 완성
9) 완성된 HTML 을 클라이언트에 전송
10) 매개변수는 포트 번호를 의미, 여기는 3000번 포트로 들어오는 클라이언트의 요청을 기다림

### 바벨 설정하기
> 서버를 위한 바벨 설정이 필요 

| 구분 | 바벨 프리셋 | 바벨 플러그인 |
| --- | --- | --- |
| 클라이언트 | `@babel/preset-react` <br> `@babel/preset-env` | 없음 |
| 서버 |  `@babel/preset-react` | `@babel/plugin-transform-modules-commonjs` |

#### 바벨 설정 파일의 내용
> `test-ssr` 폴더의 `.babelrc.~` 파일 참조

---

### 웹팩 설정하기
#### `webpack.config.js` 파일에서 웹팩 설정을 수정하기
```js
// ...
module.exports = {
    // ...
    output: {
        // ...
        publicPath: '/dist/',  // 1
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        configFile: path.resolve(__dirname, '.babelrc.client.js'), // 2
                    },
                },
                // ...
            }
        ]
    }
}
```

1) `publicPath` 설정은 `html-webpack-plugin`이 HTML 생성 시 HTML 내부 리소스 파일의 경로를 만들 때 사용
2) 웹팩은 클라이언트 코드에 대해서만 실행할 예정 

### 기타 설정 및 프로그램 실행하기
> 서버 측 코드는 `@babel/cli` 를 이용해서 바벨만 실행, 클라이언트 코드는 웹팩을 실행

#### `package.json` 에 스크립트 명령어 추가하기
```json
{
  "script": {
    "build-server": "babel src --out-dir dist-server --config-file ./.babelrc.server.js",
    "build": "npm run build server && webpack",
    "start": "node dist-server/server.js"
  }
}
```

1) 서버 측 코드를 빌드 > `src` 폴더 밑에 있는 모든 파일을 `babelrc.server.js` 설정으로 컴파일
2) 서버와 클라이언트 코드를 모두 빌드 > 클라이언트 측 빌드는 웹팩 실행
3) `express` 웹 서버를 띄움 > 빌드 후에 실행해야 적용

- SSR 을 하면 이미 돔 요소가 생성된 상태이기 때문에 클라이언트 측에서 또다시 렌더링할 필요는 없음
    - 단, 각 돔 요소에 필요한 이벤트 처리 함수를 연결해야 함
    - 이벤트 처리 함수를 연결하지 않으면 화면은 잘 보이나 반응하지 않음
    - 리액트에서 제공하는 `hydrate` 함수는 SSR 의 결과로 만들어진 돔 요소에 필요한 이벤트 처리 함수를 붙여줌
    
#### `hydrate` 함수를 사용하도록 `index.js` 파일 수정하기
```js
// ...
ReactDOM.hydrate(<App page='home' />, document.getElementById('root'));
```