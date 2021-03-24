#7.4 웹팩 고급편
> 웹팩을 이용해서 애플리케이션의 번들 파일을 최적화하는 몇가지 방법

## 7.4.1 나무 흔들기
> 불필요한 코드를 제거해주는 기능

#### `util_esm.js`  파일
```js
export function func1() {
    console.log('func1');
}
export function func2() {
    console.log('func2');
}
```

- ESM(ECMAScript Modules) 문법을 사용하는 코드
    + JS 표준 모듈 시스템
    
#### util_commonjs.js
```js
function func1() {
    console.log('func1');
}
function func2() {
    console.log('func2');
}
module.exports = { func1, func2 };
```

- commonJS 에서는 `module.exports`, `require` 등의 키워드를 사용

#### `util_esm.js` 모듈의 일부 함수만 가져오는 코드
```js
import { func1 } from './util_esm';
func1();
```
- 웹팩 실행 후 번들파일을 열어보면 `func2` 함수가 나무 흔들기 덕분에 제거됨

### 나무 흔들기가 실패하는 경우
> `index.js` 파일에서 `util-commonjs` 모듈을 사용하도록 수정

- 웹팩 실행 후 번들 파일을 열어보면 `func2` 함수가 보인다
- 무엇이 문제인가?
  + 사용되는 모듈이 **ESM(ECMAScript Module)이 아닌 경우
  + 사용하는 쪽에서 ESM 이 아닌 다른 모듈 시스템을 사용하는 경우
  + 동적 임포트(dynamic import)를 사용하는 경우
  
- 위의 경우 나무 흔들기가 동작하지 않으며, 사용하는 쪽 사용되는 쪽 모두 ESM 문법을 사용하면 나무 흔들기가 정상 작동한다

#### 동적 임포트를 사용하는 코드
```js
import('./util_esm').then(util => util.func1());
```

#### 모듈 내부에서 자신의 함수를 호출하는 코드
```js
const arr = [];
export function func1() {
    console.log('func1', arr.length);
}
export function func2() {
    arr.push(10);
    console.log('func2');
}
func2();
```

- `func2` 함수는 전역 변수를 변경
- 모듈이 평가(evaluation)될 때 `func2` 함수가 실행됨
  + 모듈은 최초로 사용될 때 한번 평가, 이 때 전역 변수 `arr`이 변경됨
  + 나무 흔들기 단계에서 `func2 `함수가 제거되면 `func1` 함수는 의도된 대로 동작하지 않음
- 다행히 웹팩은 모듈이 평가되는 시점에 호출되는 함수를 제거하지 않음

### 외부 패키지의 나무 흔들기
> 외부 패키지도 나무 흔들기가 적용되나, 저마다 다양한 방식의 모듈 시스템을 사용하기에 재대로 동작하지 않을 수 있다.

#### 로다시 모듈의 잘못된 사용 예
```js
import { fill } from 'lodash';
const arr = [1, 2, 3];
fill(arr, 'a');
```

- 여기서 로다시의 `fill` 함수만 사용하지만 웹팩으로 만들어진 번들파일에는 로다시의 모든 코드가 포함

#### 로다시 모듈을 잘 사용한 예 (1)
```js
import fill from 'lodash/fill';
// ...
```

#### 로다시 모듈을 잘 사용한 예 (2): `lodash-es` 패키지 사용하기
```js
import { fill } from 'lodash-es';
// ...
```

> 이처럼 본인이 사용하는 패키지에 적용된 모듈 시스템이 무엇인지, ESM 이 아니라면 각 기능을 별도의 파일로 제공하는지 여부를 파악해야 번들 크기를 줄일 수 있음

----

### 바벨 사용 시 주의할 점
> 작성한 코드를 바벨로 컴파일한 이후에도 ESM 문법으로 남아 있어야 한다.

#### ESM 모듈을 유지하도록 설정하기
```js
const presets = [
    [
        '@babel/preset-env',
      {
          // ...
        modules: false, // *
      },
    ],
        // ...
];
// ...
```

- 모듈 시스템을 변경하지 않도록 설정 
- ESM 문법으로 컴파일된 코드는 웹팩에서 자체적으로 사용후 제거됨

## 7.4.2 코드 분할
#### 애플리케이션의 전체 코드를 하나의 번들 파일로 만드는 것은 비효율적일 수 있음
- 불필요한 코드까지 전송되어 사용자의 요청으로부터 페이지가 렌더링 되기 까지 오랜 시간이 걸릴 수 있음
  + 번들 파일을 하나만 만들면 관리 부담이 적어져 내부용 애플리케이션을 만들 땐 좋은 선택
- 많은 사용자의 서비스라면 응답 시간을 최소화하기 위해 코드를 분할하는 것이 좋음

#### 코드 분할 실습 프로젝트 패키지
```shell
npm i webpack webpack-cli react lodash
```

- 코드를 분할하는 가장 직관적인 방법은 웹팩의 `entry` 설정 값에 페이지별로 파일을 입력하는 것

#### 각 페이지 코드

> `webpack-split` 코드 참조


#### 페이지별로 `entry` 설정하기
```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        page1: './src/index1.js',
        page2: './src/index2.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new CleanWebpackPlugin()],
    mode: 'production',
};
```

- 각 페이지의 JS 파일을 `entry`로 입력
- `dist` 폴더를 정리하기 위해 `clean-webpack-plugin`을 사용
```shell
npm i clean-webpack-plugin
```

- 웹팩을 실행해보면 `page1.js`, `page2.js` 두 파일이 생성
- 두 파일 모두 같은 모듈의 내용을 포함하고 있기 떄문에 비효율적

### `SplitChunksPlugin`
> 웹팩에서는 코드 분할을 위해 기본적으로 `SplitChunksPlugin` 을 내장

#### `SplitChunksPlugin`을 사용하도록 설정하기
```js
// ...
module.exports = {
    entry: {
        page1: './src/index1.js', // 1
    },
    // ...
    optimization: {
        splitChunk: { // 2
            chunks: 'all', // 3
            name: 'vendor',
        },
    },
    // ...
};
```

1) 이해를 돕기 위해 하나의 페이지만 생성
2) `optimization` 의 `splitChunks` 속성을 이용하면 코드를 분할 가능
3) `chunks` 속성의 기본값은 동적 임포트만 분할하는 `async`, 동적 임포트가 아니더라도 코드가 분할되도록 `all`로 설정

- 웹팩 빌드 시 로다시와 리액트 모듈은 `vendor.js` 파일로 생성됨
- `util.js` 모듈은 파일의 크기가 작아 `page1.js` 파일에 포함

#### `splitChunks` 속성의 기본값
```js
module.exports = {
    // ...
  optimization: {
      splitChunks: {
          chunks: 'async',  // 1 
          minSize: 30000, // 2
          minChunks: 1, // 3
          // ...
      },
      cacheGroups: {  // 4
          default: {
              minChunks: 2, // 5
              priority: -20,
              reuseExistingChunk: true,
          },
          defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
          }
      }
  }
}
```
1) 동적 임포트만 코드 분할하도록 설정
2) 파일 크기가 30kb 이상인 모듈만 분할 대상
3) 한 개 이상의 청크(chunk)에 포함되어 있어야 함
- 청크는 웹팩에서 내부적으로 사용되는 용어 > 대개 **번들 파일**로 이해
4) 파일 분할은 그룹별로 이뤄짐, 이본적으로 외부 모듈(vendors)와 내부 모듈(default) 두 그룹으로 설정
- 외부 모듈은 내부 모듈에 비해 비교적 낮은 비율로 코드가 변경되기 때문에 브라우저에 오래 캐싱될 수 있다는 장점
5) 내부 모듈은 두 개 이상의 번들 파일에 포함되어야 분할 됨

#### `util.js` 모듈도 분할되도록 설정
```js
// ...
module.exports = {
  // ...  
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 10, // 1
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          priority: 2,
          name: 'vendors',
        },
        defaultVendors: {
          minChunks: 1, // 2
          priority: 1,
          name: 'default',
        }
      }
    }
  },
  // ...
}
```

1) 파일 크기 제한에 걸리지 않도록 낮은 값 설정
2) 청크 개수 제한을 최소 한개로 설정

- 웹팩을 실행하면 `page1.js`, `vendors.js`, `default.js` 세 개의 번들 파일이 생성
- `util.js` 모듈은 `default.js` 번들 파일에 포함

#### 리액트 패키지는 별도로 분할하도록 설정하기
```js
// ...
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          name: 'vendors',
        },
        reactBundle: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react.bundle',
          priority: 2, // *
          minSize: 100,
        },
      }
    }
  },
}
```

- `*` 그룹의 우선순위가 높아야 리액트 모듈이 `vendors` 그룹에 들어가지 않음

---

### 동적 임포트
> 동적 임포트(dynamic import)는 동적으로 모듈을 가져올 수 있는 기능

- 웹팩에서 동적 임포트를 사용 시 해당 모듈의 코드는 자동으로 분할되며, 오래된 브라우저에서도 잘 동작한다.

#### 동적 임포트를 사용하는 코드
```js
function myFunc() {
  import('./util').then(({ add }) =>
          import('lodash').then(({ default: _  }) =>
                  console.log('value', _.fill([1, 2, 3], add(10, 20))),
          ),
  );
}
```
- `import` 함수를 사용하면 동적으로 모듈을 가져올 수 있다.
- `import` 함수는 프로미스 객체를 반환하기 때문에 `then` 메서드로 연결

#### `index3.js` 파일을 번들링하도록 설정하기
```js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        page1: './src/index3.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new CleanWebpackPlugin()],
    mode: 'production',
};
```

- `chunkFilename` 속성을 이용해서 동적 임포트로 만들어지는 번들 파일의 이름을 설정
- 웹팩을 실행하면 `page3.js`, `1.chunk.js`, `2.chunk.js` 세 파일이 생성
  + 두 청크 파일에는 `util.js` 모듈과 로다시 모듈의 코드가 삽입
  + 웹팩 런타임 코드는 `page3.js` 파일에만 들어감
  

#### `dist` 폴더 밑에 `index.html` 파일을 생성 > 브라우저 실행
```html
<html>
<body>
    <script type="text/javascript" src="./page3.js"></script>
</body>
</html>
```

#### 두 모듈을 동시에 가져오는 코드
```js
async function myFunc() {
    const [{ add }, { default: _ }] = await Promise.all([
        import('./util'),
        import('lodash'),
    ]);
    console.log('value', _.fill([1, 2, 3], add(30, 20)));
}
myFunc();
```

---

### 분할된 파일을 `prefetch`, `preload`로 빠르게 가져오기

- 만약 `myFunc` 함수가 이벤트 처리 함수로 사용된다면 버튼을 클릭하기 전 두 모듈은 가져오지 않음 
- 꼭 필요할 때만 모듈을 가져온다 > 게으른 로딩(lazy loading) > 번들 파일의 크기가 큰 경우 응답 속도가 느린 단점

> 웹팩의 동적 임포트 사용시 HTML 의 `prefetch`, `preload` 기능을 활용할 수 있도록 옵션 제공

- `prefetch`: 가까운 미래에 필요한 파일이라고 브라우저에게 알려주는 기능
  + 브라우저가 바쁘지 않을 때 미리 다운로드(게으른 로딩의 단점 보완)
- `preload`: 지금 당장 필요한 파일이라고 브라우저에게 알려주는 기능
  + 첫 페이지 로딩 시 즉시 다운로드
  + 남발 시 첫 페이지 로딩 속도에 부정적인 영향 주의!!
  
#### `preload`, `prefetch` 설정하기
```js
async function myFunc() {
    await new Promise(res => setTimeout(res, 1000)); // 1
    const [{ add }, { default: _ }] = await Promise.all([
        import(/* webpackPreload: true */'./util'), // 2
        import(/* webpackPrefetch: true */'lodash'), // 3
    ]);
}
myFunc();
```

1) 너무 빠르게 처리하면 `prefetch` 효과를 확인할 수 없으므로 1초 대기
2) `util.js` 모듈은 `preload`로 설정
3) 로다시 모듈은 `prefetch` 로 설정

#### `prefetch` 설정이 적용된 HTML
```html
<html>
    <head>
        <link rel="prefetch" as="script" href="1.chunk.js"> // 1
        <script charset="utf-8" src="1.chunk.js"></script>  // 2
        <script charset="utf-8" src="2.chunk.js"></script>    
    </head>
    <body>
        <script type="text/javascript" src="./page3.js"></script>
    </body>
</html>
```

1) `1.chunk.js` 파일은 `prefetch` 가 적용 > `link` 태그는 `page3.js` 파일이 실행되면서 웹팩에 의해 삽입
2) `script` 태그도 `myFunc` 함수가 실행될 때 웹팩에 의해 삽입

#### 이상한 점 발견
> `preload` 기능 설정이 HTML 코드에 반영되지 않음!!
- `preload`는 첫페이지 요청시 전달된 HTML 태그 안에 미리 설정되어 있어야 하므로 웹팩 지원 기능이 아니다.
- 대신 `page3.js` 파일이 평가될 때 `2.chunk.js` 파일을 즉시 다운로드함으로써 어느 정도 `preload` 기능을 모방


## 7.4.3 로더 제작하기
> 모듈을 입력으로 받아 원하는 형태로 변경 후 JS 코드를 반환  
> JS 코드를 반환하기 때문에 웹팩은 CSS, PNG, CSV 확장자를 갖는 모듈 처리 가능

#### CSV 모듈을 사용하는 코드
> `webpack-custom-loader ` 코드 참조

#### 웹팩 실행 후 노드로 번들 파일 실행하기
```shell
npx webpack
node dist/main.js
```

