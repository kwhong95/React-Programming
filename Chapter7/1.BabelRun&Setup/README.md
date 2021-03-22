# 7.1 바벨 실행 및 설정하기
> 폴리필이 무엇이고 바벨에서 어떻게 설정하는가

## 7.1.1 바벨을 실행하는 여러가지 방법
- `@babel/cli`로 실행하기
- 웹팩에서 `babel-loader`로 실행하기
- `@babel/core`를 직접 실행하기
- `@babel/register`로 실행하기
    + 노드(Node.js)에서 `require` 코드가 실행될 때 동적으로 바벨이 실행(리액트를 함께 사용하는 경우가 많지 않음)
    
### 바벨이란?
> 입력과 출력이 모두 JS 코드인 컴파일러

- 보통의 컴파일러가 고수준의 언어를 저수준의 언어로 변환하는 것과 비교
- 역할
  + 리액트의 JSX 문법
  + 타입스크립트와 같은 정적 타입 언어
  + 코드 압축 
  + 제안(proposal) 단계에 있는 문법 등
  
#### 필요한 패키지 설치
```
npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```

#### code.js
```js
const element = <div>babel test</div>;
const text = `element type is ${element.type}`;
const add = (a, b) => a + b;
```

- 리액트 프리셋을 이용해 JSX 문법을 변환할 예정
- 템플릿 리터럴 플러그인을 이용해 코드를 변환할 예정
- 화살표 함수 플러그인을 이용해 함수를 변환할 예정

### `@babel/cli`로 실행하기
```
npx src/code.js --presets=@babel/preset-react --plugins=@babel/plugin-transform-template-literals,@babel/plugin-transform-arrow-functions
```

#### 바벨 실행 후 콘솔에 출력되는 내용
```js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
```

- JSX 문법은 `createElement` 함수 호출로 변환
- 템플릿 리터럴은 문자열의 `concat` 메서드 호출로 변환
- 화살표 함수는 일반 함수로 변환

#### `babel.config.js`
```js
const presets = ['@babel/preset-react'];
const plugins = [
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-arrow-functions'
];

module.exports = { presets, plugins };
```

- 동적으로 설정값을 생성
- 명령어 간소화
```
npx babel src/code.js
```
- 컴파일 결과를 파일로 저장하는 법
```
npx babel src/code.js --out-file dist.js
npx babel src --out-dir dist
```

- 위 명령어는 파일 단위로 처리
- 아래는 폴더 단위로 처리

### 웹팩의 `babel-loader`로 실행하기
#### 패키지 설치하기
```
npm i webpack webpack-cli babel-loader
```
#### `babel-loader` 를 설정하는 `webpack.config.js`
```js
const path = require('path');
module.exports = {
    entry: './src/code.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'code.bundle.js',
    },
    module: {
        rules: [{ test: /\.js$/, use: 'babel-loader' }],
    },
    optimization: { minimizer: [] },
};
```
- 웹팩으로 번들링(bundling)할 파일을 지정
- 번들링된 결과를 `dist/code.bundle.js` 파일로 저장
- JS 파일을 `babel-loader` 가 처리하도록 설정
  + 바벨의 설정 파일을 이용하므로 이전에 만들어 놓은 `babel.config.js` 파일의 내용이 설정값으로 사용
- 웹팩은 기본적으로 JS 파일을 압축하지만 바벨의 실행 여부를 판단하기 위해 잠시 꺼놓음

#### 웹팩 실행하기
```
npx webpack
```

#### 컴파일된 `code.bundle.js` 파일
```js
// ...
var __webpack_exports__ = {};
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};
// ...
```

- 파일 앞부분에는 웹팩의 런타임 코드 추가
- 파일 뒷부분은 바벨이 생성한 코드 확인

### `@babel/core`를 직접 이용하기
#### `@babel/core`로 바벨을 직접 실행하기
```js
const babel = require('@babel/core');
const fs = require('fs');

const filename = './src/code.js';
const source = fs.readFileSync(filename, 'utf8');
const presets = ['@babel/preset-react'];
const plugins = [
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-transform-arrow-functions'
];
const { code } = babel.transformSync(source, {
    filename,
    presets,
    plugins,
    configFile: false,
});
console.log(code);
```
- `transformSync`함수를 호출해서 바벨을 실행
- `babel.config.js` 설정 파일을 사용하지 않도록 함
- 변환된 코드를 콘솔에 출력, 파일 저장 원할 시 `fs module`을 이용

```
node runBabel.js
```

> `@babel/core` 모듈을 직접 사용하는 방식은 자유도가 높다는 장점!

#### 같은 프리셋을 사용하는 두 가지 설정
```js
// 설정 1
const presets = ['@babel/preset-react'];
const plugins = ['@babel/plugin-transform-template-literals'];

// 설정 2
const presets = ['@babel/preset-react'];
const plugins = ['babel/plugin-trasform-arrow-functions']
```

#### 바벨 컴파일 시 3가지 단계
- 파싱(parse) 단계 : 입력된 코드로부터 AST(abstract syntax tree)를 생성
- 변환(transform) 단계 : AST 를 원하는 형태로 변환
- 생성(generate) 단계 : AST 를 코드로 출력

#### AST 란?
> 코드의 구문(syntax)이 분석된 결과를 담고 있는 구조체

코드가 같다면 AST 도 같기 때문에 같은 코드에 대해서 하나의 AST 를 만들어 놓고 재사용 가능

#### AST 를 활용해서 효율적으로 바벨을 실행하는 코드
```js
const babel = require('@babel/core');
const fs = require('fs');

const filename = './src/code.js';
const source = fs.readFileSync(filename, 'utf8');
const presets = ['@babel/preset-react'];

const { ast } = babel.transformSync(source, {
  filename,
  ast: true,
  code: false,
  presets,
  configFile: false,
});

const { code: code1 } = babel.transformFromAstSync(ast, source, {
  filename,
  plugins: ['@babel/plugin-transform-template-literals'],
  configFile: false,
});
const { code: code2 } = babel.transformFromAstSync(ast, source, {
  filename,
  plugins: ['@babel/plugin-transform-arrow-functions'],
  configFile: false,
});
console.log('code1:\n', code1);
console.log('code2:\n', code2);
```

- 코드가 아닌 AST 만 생성
  + 프리셋은 두 가지 설정 모두 같으므로 AST 를 만들 때 해당 프리셋을 미리 적용
- AST 로부터 첫 번째 설정의 플러그인이 반영된 코드를 생성
- 마찬가지로 두 번째 설정이 적용된 코드 생성 
  + 설정의 개수가 많아질수록 이 방식의 효율이 높아짐

## 7.1.2 확장성과 유연성을 고려한 바벨 설정 방법
- `extends` 속성 : 다른 설정 파일을 가져와 확장
- `env`, `overrides` 속성 : 환경별 또는 파일별로 다른 설정을 적용

#### 설치 패키지
```
npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react babel-preset-minify
```

### `extends` 속성으로 다른 설정 파일 가져오기
#### `common/.babelrc`
```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    [
      "@babel/plugin-transform-template-literals",
      {
        "loose": true
      }
    ]
  ]
}
```

- `loose` 옵션 : 문자열 연결 시 `concat` 메서드 사용 대신 `+` 연산자 사용

#### `src/example-extends/.babelrc`
```json
{
  "extends": "../../common/.babelrc",
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugins-transform-template-literals"
  ]
}

```

- `extends` 속성을 이용해서 다른 파일에 있는 설정을 불러옴
- 가져온 설정에 플러그인을 추가
- 템플릿 리터럴 플러그인은 가져온 설정이 이미 존재
  + 플러그인 옵션은 현재 파일의 옵션으로 결정(`loose` 옵션 삭제)
  
#### `code.js`파일을 컴파일한 결과
```js
const element = /*#__PURE__*/React.createElement("div", null, "babel test"); // 1
const text = "element type is ".concat(element.type); // 2

const add = function (a, b) { // 3
  return a + b;
};

```

1) 리액트 프리셋 적용
2) 템플릿 리터럴 플러그인 적용 (`loose` 옵션이 적용되지 않아 `concat` 메서드 사용)
3) 화살표 함수 플러그인 적용

### `env` 속성으로 환경별로 설정하기
#### `env` 속성 사용 예
```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    "@babel/plugin-transform-template-literals",
    "@babel/plugin-transform-arrow-functions"
  ],
  "env": {
    "production": {
      "presets": ["minify"]
    }
  }
}
```

- 전과 같이 프리셋과 플러그인 설정
- `env` 속성 : 환경별로 다른 설정 가능
- 프로덕션 환경에서는 압축 프리셋을 사용하도록 설정

#### 바벨에서 현재 환경 결정
```
process.env.BABEL_ENV || process.env.NODE_ENV || "development"
```

#### 프로덕션 환경으로 바벨 실행
```
NODE_ENV=production npx babel ./src/example-env
```

#### `env`속성이 적용되어 컴파일된 결과
```js
const element=/*#__PURE__*/React.createElement("div",null,"babel test"),text="element type is ".concat(element.type),add=function(c,a){return c+a};
```

#### 개발 환경으로 바벨 실행
> default => `development` 사용
 ```
npx babel ./src/example-env
```

#### 개발 환경으로 컴파일된 결과
```js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};

```

### `overrides` 속성으로 파일별로 설정하기
```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-transform-template-literals"],
  "overrides": [
    {
      "include": "./service1",
      "exclude": "./service1/code2.js",
      "plugins": ["@babel/plugin-transform-arrow-functions"]
    }
  ]
}
```

- 리액트 프리셋과 템플릿 리터럴 플러그인 설정
- `overrides` 속성 : 파일별로 다른 설정 가능
- `service1` 폴더 밑 파일에 화살표 함수 플러그인 설정 적용
- `service1/code2.js` 파일에는 화살표 함수 플러그인 미적용

#### `overrides` 속성으로 컴파일된 결과
```js
// code1.js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};

// code2.js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = (a, b) => a + b;
```

- 예상대로 출력 확인!

## 7.1.3 전체 설정 파일과 지역 설정 파일

#### 바벨 설정 파일 종류
1) 모든 JS 파일에 적용되는 **전체(project-wide) 설정 파일**
2) JS 파일의 경로에 따라 결정되는 **지역(file-relative) 설정 파일**

#### 필요한 패키지 설치
```
npm i @babel/core @babel/cli @babel/plugin-transform-arrow-functions @babel/plugin-transform-template-literals @babel/preset-react
```


#### `babel.config.js`
```json
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-template-literals"
  ]
}
```

#### `src/sevice1/code.js` 파일을 위한 설정 다음과 같이 결정
- `package.json`, `babelrc`, `,babelrc.js` 파일을 만날 때까지 부모 폴더로 이동한다. `src/service1/.babelrc` 파일을 만났고, 그 파일이 **지역 설정 파일** 이다.
- 프로젝트 루트의 `babel.config.js` 파일이 **전체 설정파일**이다.
- 전체 설정 파일과 지역 설정 파일을 병합한다.

#### 바벨 실행하기
```
npx babel src
```

#### 두 설정 파일이 병합되어 컴파일된 결과
```js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is ".concat(element.type);

const add = function (a, b) {
  return a + b;
};

```
- 전체 설정 파일의 리액트 프리셋 적용
- 지역 설정 파일의 템플릿 리터럴(`loose` 옵션 미적용) & 화살표 함수 플러그인 적용

#### 디렉토리 구조
<img width="242" alt="스크린샷 2021-03-22 오후 8 49 57" src="https://user-images.githubusercontent.com/70752848/111985617-2b000c00-8b50-11eb-8643-e1002cd9697a.png">

- `package.json` 파일을 만났고 `package.json` 파일에 `babel` 속성이 없으므로 지역 설정 파일은 없다.
- 프로젝트 루트의 `babel.config.js` 파일이 전체 설정 파일이다.

#### 전체 설정 파일만 적용된 콘솔 출력 결과
```js
const element = /*#__PURE__*/React.createElement("div", null, "babel test");
const text = "element type is " + element.type;

const add = (a, b) => a + b;
```

## 7.1.4 바벨과 폴리필
> JS 의 최신 기능을 모두 사용 + 오래된 브라우저를 지원 

#### 폴리필이란?
> 런타임에 기능을 주입, 런타임에 기능이 존재하는지 검사해 기능이 없는 경우에만 주입

#### 폴리필 코드의 예
```js
if (!String.prototype.padStart) {
    String.prototype.padStart = func; // func는 padStart 폴리필 함수
}
```

### `core-js` 모듈의 모든 폴리필 사용하기
> 바벨에서 폴리필을 위해 공식적으로 지원하는 패키지
#### `code-js` 모듈의 사용 예
```js
import 'core-js'

const p = Promise.resolve(10);
const obj = {
  a: 10,
  b: 20,
  c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

- `core-js` 모듈을 가져오면 해당 모듈의 모든 폴리필이 포함
- 낮은 버전의 브라우저에서도 프로미스, `Object.values`, 배열의 `includes` 메서드를 사용 가능

#### 웹팩에서 `core-js` 모듈을 사용한 예
```js
module.exports = {
    entry: ['core-js', './src/index.js'],
    // ...
}
```
- `core-js` 모듈은 사용법이 간단하나, 필요하지 않은 폴로필까지 포함되므로 번들 파일의 크기가 커짐
- 반대로 번들 파일의 크기에 민감하지 않은 프로젝트에서 사용하기 좋음

### `core-js`모듈에서 필요한 폴리필만 가져오기
#### `core-js`에서 필요한 폴리필을 직접 넣는 코드

```js
import 'core-js/features/promise';
import 'core-js/features/object/values';
import 'core-js/features/array/includes';

const p = Promise.resolve(10);
const obj = {
  a: 10,
  b: 20,
  c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

- 번들 파일 크기 최소화 => 민감한 프로젝트에 적합

### `@babel/preset-env` 프리셋 이용하기
> 실행 환경에 대한 정보를 설정해 주면 자동으로 필요한 기능을 주입

#### `@babel/preset-env` 설정 예
```js
const presets= [
  [
    '@babel/preset-env',
    {
      targets: '> 0.25%, not dead',  
    },
  ],
];

module.exports = { preset };
```
- `targets` 속성으로 지원하는 브라우저 정보를 입력
  + 시장 점유율이 0.25% 이상이고 업데이트가 종료되지 않은 브라우저 입력
- 브라우저 정보는 `browserslist`라는 패키지의 문법을 사용

#### 필요한 패키지 설치
```
npm i @babel/core @babel/cli @babel/preset-env core-js
```

#### `babel.config.js`
```js
const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                chrome: '40',
            },
            useBuiltIns: 'entry',
            corejs: { version: 3, proposals: true },
        },     
    ],
];

module.exports = { presets };
```

- `@babel/preset-env` 프리셋 사용
- 크롬 버전을 최소 40으로 설정
- `useBuiltIns` 속성은 폴리필과 관련된 설정
  + `enrty` 속성을 입력하면 지원하는 브라우저에서만 필요한 폴리필을 포함
- 바벨에게 `core-js` 버전을 알려줌

#### `src/code.js`
```js
import 'core-js';

const p = Promise.resolve(10);
const obj = {
    a: 10,
    b: 20,
    c: 30,
};
const arr = Object.values(obj);
const exist = arr.includes(20);
```

#### 바벨 실행하기
```
npx babel src/code.js
```

#### `useBuiltIns` 속성을 `entry`로 입력 후 컴파일한 결과
```js
'use strict';

require("core-js/modules/es.symbol");
require("core-js/modules/es.symbol.description");
// ...
require("core-js/modules/web.url-search-params.js");

var p = Promise.resolve(10);
var obj = {
  a: 10,
  b: 20,
  c: 30
};
var arr = Object.values(obj);
var exist = arr.includes(20);

```
- 모듈을 가져오는 코드가 출력(크롬 버전 40에 없는 기능을 위한 폴리필)
- 실제 사용하는 폴리필 코드만 출력하는 방법
  + `useBuiltIns` 속성값을 `usage`로 입력
  
#### `usage` 옵션으로 컴파일한 결과
```js
"use strict";

require("core-js/modules/es.promise.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.object.values.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js");

var p = Promise.resolve(10);
var obj = {
  a: 10,
  b: 20,
  c: 30
};
var arr = Object.values(obj);
var exist = arr.includes(20);
```

- 이 파일의 코드와 관련된 세 개의 폴리필이 추가
- 문자열의 `includes` 폴리필이 불필요하게 추가
  + 바벨이 코드에서 사용된 변수의 타입을 추론하지 못하기 때문
  + 바벨 입장에서는 보수적으로 폴리필을 추가할 수밖에 없음
- JS 는 동적 타입 언어이기 떄문에 바벨 입장에서 타입 추론은 까다로운 문제
- TypeScript 와같은 정적 타입 언어를 사용하면 이런 문제를 비교적 쉽게 해결할 수 있음
- `babel.config.js`파일에서 크롬 버전을 조금씩 올려 보면 코드에 포함되는 폴리필의 개수가 점점 줄어드는 것을 확인할 수 있음
- 번들 파일의 크기를 최적화할 목적이라면 필요한 폴리필을 직접 추가하는 방식이 가장 좋다
- `@babel-preset-env` 는 적당한 번들 파일 크기를 유지하면서 폴리필 추가 실수를 막고 싶을 때 가장 좋은 선택임
