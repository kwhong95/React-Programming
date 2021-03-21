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
