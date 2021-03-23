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
