# 7.3 웹팩 초급편
> 웹팩은 모듈(module) 번들러(bundler)다.

#### 모듈은 각 리소스 파일이고 번들은 웹팩 실행 후에 나오는 결과 파일

- 하나의 번들 파일은 여러 모듈로 만들어짐
- 웹팩을 이용하면 제작한 여러가지 리소스를 사용자에게 전달하기 좋은 형태로 생성 가능

### 웹팩이 필요한 이유
> 단일 페이지 애플리케이션은 하나의 HTML 에 수십, 수백 개의 JS 파일을 포함하기 때문에

#### 모든 JS 파일을 `script` 태그로 가져오는 코드
```html
<html>
    <head>
        <script src="javascript_file_1.js" />
        <script src="javascript_file_2.js" />
        // ...
        <script src="javascript_file_999.js" />
    </head>
    // ...
</html>
```

> 계속 늘어나는 JS 파일을 관리하기 힘듬(실행 순서, 전역 변수 버그 등)

#### 웹팩을 사용하지 않고 `script` 태그를 이용해서 외부 모듈을 가져오는 코드
```html
<html>
    <head>
        <script src="https://unpkg.com/lodash@4.17.11"></script> // 2
    </head>
    <body>
        <script src="./index.js"></script>
    </body>
</html>
```
```js
const element = document.createElement('div');
element.innerHTML = _.join(['hello', 'world'], ''); // 1
document.body.appendChild(element);
```

1) `index.js` 파일에서는 로다시를 사용(전역 변수로 등록 가정)
2) `index.html` 파일에서 `script` 태그를 이용해 로다시를 가져옴
3) 여러가지 문제점
- 주소값에 오타 시 가져오기 실패
- 주소값이 재대로 입력했더라도 unpkg 사이트에 장애가 있는 경우 실패
- 로다시의 필요가 없어져 모든 JS 코드에서 제거할 때도 문제가 생길수 있음
- `script` 태그를 지우는 것을 깜빡하면 불필요한 리소스의 다운로드가 발생하고 렌더링 속도를 저하시킴

## 7.3.1 웹팩 실행하기
#### 필요한 패키지 설치
```
 npm i webpack webpack-cli
```

#### `util.js` 파일
```js
export function sayHello(name) {
    console.log('hello', name);
}
```

#### `util.js` 모듈을 사용하는 `index.js` 파일
```js
import { sayHello } from './util';

function myFunc() {
    sayHello('mike');
    console.log('myFunc');
}

myFunc();
```

#### 웹팩 실행하기
```
npx webpack
```

- `dist` 폴더가 생성되고 그 아래 `main.js` 번들 파일 생성(`index.js` + `util.js`)

---

### 설정 파일 이용하기
#### `webpack.config.js` 파일
```js
const path = require('path');

module.exports = {
    entry: './src/index.js', // 1
    output: { // 2
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', // 3
    optimization: { minimizer: [] }, // 4
};
```
1) `index.js` 모듈을 입력 파일로 사용
2) `dist` 폴더 밑에 `main.js` 번들 파일 생성
3) 프로덕션 모드로 설정하면 JS 코드 압축을 포함한 여러가지 최적화 기능이 기본으로 설정
4) 번들 파일의 내용을 쉽게 확인하기 위해 압축하지 않도록 설정

## 7.3.2 로더 사용하기
> 로더(loader)는 모듈을 입력으로 받아서 원하는 형태로 변환한 후 새로운 모듈을 출력해주는 함수

### JS 파일 처리하기

### 필요한 패키지 설치하기
```
npm i babel-loader @babel/core @babel/preset-react react react-dom
```

#### JSX 문법을 사용한 JS 파일
```js
import React from 'react';
import ReactDom from 'react-dom';

function App() {
    return (
        <div className="container">
            <h3 className="title">webpack example</h3>
        </div>
    );
}

ReactDom.render(<App />, document.getElementById('root'));
```

#### `@babel/preset-react`을 사용하도록 설정하기
```js
const presets = ['@babel/preset-react'];
module.exports = { presets };
```

#### `babel-laoder` 설정하기
```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: { 
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader', // !!
            },
        ],
    },
    mode: 'production',
};
```
- js 확장자를 갖는 모듈은 `babel-loader`가 처리하도록 설정

#### 정상 작동 확인(`dist/index.html`)
```js
<html>
    <body>
        <div id="root"></div>
        <script src="main.js"></script>
    </body>
</html>
```

- 만약 `babel-loader`를 설정하지 않고 웹팩을 실행하면 웹팩이 JSX 문법을 이해하지 못하기 때문에 에러 발생

### CSS 파일 처리하기
#### `App.css`
```css
.container {
    border: 1px solid blue;
}

.title {
    color: red;
}
```

#### `App.css` 파일을 사용하는 코드
```js
// ...
import Style from './App.css';

console.log({ Style });
// ...
```

#### `css-loader` 설정하기
```js
// ...
module: {
    rules: [
        // ...
        {
            test: /\.css$/,
            use: 'css-loader',
        },
        // ...
    ]
}
```

#### 실제 스타일을 적용하기 위한 패키지 설치
```shell
npm install style-loader
```

#### `style-loader`를 사용하도록 설정하기
```js
{
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'], // 1
}
```

1) 로더를 배열로 입력하면 오른쪽 로더부터 실행 
- `style-loader` 
    + `css-loader` 가 생성한 CSS 데이터를 `style` 태그로 만들어서 `HTML head`에 삽입
    + 번들 파일이 브라우저에서 실행될 때 `style` 태그를 삽입(실행 시 에러 발생시 태그가 삽입되지 않을 수 있음)
- `css-module`
    + 스타일 코드를 지역화할 수 있음
    + `css-loader`가 제공해 주는 기능
    + `@import, url()` 등 CSS 코드 처리를 도와줌
    
### 기타 파일 처리하기

#### `data.json` 파일
```json
{
  "name": "mike",
  "age": 23
}
```

#### 다양한 종류의 모듈을 사용하는 코드
```js
import ReactDom from 'react-dom';
import './App.css';
import Icon from './icon.png';
import Json from './data.json';
import Text from './data.txt';

function App() {
    return (
        <div className="container">
            <h3 className="title">webpack example</h3>
            <div>{`name: ${Json.name}, age: ${Json.age}`}</div>
            <div>{`text: ${Text}`}</div>
            <img src={Icon} />
        </div>
    );
}

ReactDom.render(<App />, document.getElementById('root'));
```
- JSON 모듈은 웹팩에서 기본적으로 처리(별도 모듈 필요 X)
- TXT, PNG 모듈을 처리하기 위한 패키지
```shell
npm i file-loader raw-loader
```

#### `file-loader` 와 `raw-loader` 설정하기
```js
{
            test: /\.(png|jpg|gif)$/, 
            use: 'file-loader',
},
{
            test: /\.txt$/, 
            use: 'raw-loader',
},
```

### 이미지 파일의 요청 횟수 줄이기

#### 필요한 패키지 설치
```shell
npm i url-loader
```

#### `url-loader` 설정하기
```js
// ...
module: {
    rules: [
        // ...
      {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192, // *
                // ... (모든 괄호 닫기)
```
- `url-loader` 는 파일 크기가 이 값보다 작은 경우에는 번들 파일의 내용을 포함시킴
- 만약 파일 크기가 이 값보다 큰 경우에는 다른 로더가 처리할 수 있도록 `fallback` 옵션 제공(default: `file-loader`)

## 7.3.3 플러그인 사용하기
> 로더보다 강력한 기능을 가짐, 웹팩이 실행되는 전체 과정에 개입할 수 있음

#### 필요한 패키지 설치
```shell
npm i @babel/core @babel/preset-react babel-loader react react-dom
```

#### 간단한 리액트 프로그램의 코드
```js
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
          <div>
            <h3>안녕하세요, 웹팩 플러그인 예제입니다.</h3>
            <p>html-webpack-plugin 플러그인을 사용합니다.</p>
          </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

#### `babel-loader`를 사용하도록 설정하기
```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js', // 1
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [ // 2
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-reat'],
                    },
                },
            },
        ],
    },
    mode: 'production',
}
```
1) `chunkhash`를 사용하면 파일의 내용이 수정될 때마다 파일 이름이 변경 가능
2) JS 모듈을 처리하도록 `babel-loader`를 설정

### html-webpack-plugin
> 웹팩을 실행해서 나오는 결과물을 확인하기 위해서는 이전처럼 HTML 파일을 수동으로 작성

- 번들 파일 이름에 `chunkhash` 옵션을 설정 -> 파일의 내용이 변경될 떄마다 HTML 내용도 수정
- 이 작업을 자동으로하는 플러그인이 `html-webpack-plugin` 

#### 필요한 패키지 설치
```shell
npm install clean-webpack-plugin html-webpack-plugin
```

- `clean-webpack-plugin` 은 웹팩을 실행할 떄마다 `dist` 폴더를 정리

#### `html-webpack-plugin`을 사용하도록 설정하기
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...  
  plugins: [
    new CleanWebpackPlugin(), // 1
    new HtmlWebpackPlugin({  // 2
      template: './template/index.html',
    }),
  ],
  // ...
}
```

1) 웹팩이 실행될 때마다 `dist` 폴더를 정리하도록 `clean-webpack-plugin`을 설정
2) `index.html` 파일이 자동으로 생성되도록 `html-webpack-plugin`을 설정

#### `template/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>웹팩 플러그인 예제</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

#### `html-webpack-plugin`이 생성한 HTML 파일
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>웹팩 플러그인 예제</title>
</head>
<body>
    <div id="root"></div>
    <script defer="defer" src="main.2fc7e35101c3cbaca6c9.js"></script> // * 
</body>
</html>
```
> 번들 파일이 `script` 태그로 등록

---

### DefinePlugin
> 모듈 내부의 문자열을 대체해주는 플러그인 

#### DefinePlugin 을 대체할 문자열
```jsx
// ...
    <div>
      // ...
      <p>{`앱 버전은 ${APP_VERSION} 입니다.`}</p>
      <p>{`10 * 10 = ${TEN * TEN}`}</p>
    </div>
// ...
```

#### DefinePlugin 을 사용하도록 설정하기
```js
// ...
const webpack = require('webpack');

module.exports = {
    // ...
  plugins: [
      // ...
      new webpack.DefinePlugin({ // 1
        APP_VERSION: "1.2.3", // 또는 JSON.stringfy("1.2.3"), // 2
        TEN: '10', // 3
      }),
      // ...    
  ]
}
```
1) DefinePlugin 은 웹팩 모듈에 포함
2) APP_VERSION 문자열을 '1.2.3' 으로 대체
3) TEN 문자열을 10으로 대체


### ProvidePlugin
> 자주 사용되는 모듈은 `import` 키워드를 사용해서 가져오는 것이 귀찮을 수 있음
```js
import React from 'react'; // 1
import $ from 'jquery'; // 2
```

1) 바벨이 JSX 문법 `React.createElement` 코드로 변환해주기 떄문에을 리액트 모듈이 필요
2) 리액트와 같은 프레임워크에서는 거의 필요가 없으나 `jquery`에 익숙한 개발자들은 이 코드를 반복적으로 작성함

> `ProviderPlugin` 을 통해서 미리 설정한 모듈을 자동으로 등록 가능함

#### `import` 키워드 없이 모듈을 사용하는 코드
```js
// import React from 'react';
import ReactDOM from 'react-dom';
// ...
ReactDOM.render(<App />, $('#root')[0]);
```

- 리액트 모듈을 주석 처리하고 `jquery`를 사용해 돔 요소를 가져옴
- `jquery` 모듈을 가져오는 `import` 코드는 작성하지 않아도 됨

#### ProvidePlugin 을 사용하도록 설정하기
```js
// ...
  plugins: [
      // ...
      new webpack.ProviderPlugin({
        React: 'react',
        $: 'jquery',
      }),    
  ],
// ...
```
- 리액트 & `jquery` 모듈을 ProviderPlugin 설정에 추가

```shell
npm install jquery
```

> 에러 없이 번들 파일이 잘 생성된다!