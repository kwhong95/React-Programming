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
