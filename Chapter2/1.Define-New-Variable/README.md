# 2.1 변수를 정의하는 새로운 방법: const, let

## 2.1.1 `var`가 가진 문제

### var 의 첫 번째 문제: 함수 스코프
> var 로 정의된 변수는 함수 스코프를 가진다!

#### 스코프(scope)란? 
> 변수가 사용될 수 있는 영역  
> 스코프는 변수가 정의된 위치에 의해 결정
```js
function expample() {
    var i = 1;
}
console.log(i); // 참조 에러
```

- `var` 변수를 함수가 아닌 프로그램의 가장 밖에서 정의하면 **전역 변수**가 된다.
- `var` 키워드를 사용하지 않고 변수에 값을 할당하면 그 변수는 **전역 변수**가 된다.

```js
function example1() {
    i = 1;
}
function example2() {
    console.log(i);
}
example1();
example2(); // 1이 출력됨
```
- 명시적 에러가 발생 하도록 하려면 `use strict`를 선언하면 됨
- 위처럼 `var`는 함수 스코프이기에 `for` 반복문에서 정의된 변수가 반복문이 끝난 시점에서도 남는다.

```js
for (var i = 0; i < 10; i++) {
    console.log(i);
}
console.log(i); // 10
```

- `var` 변수의 스코프를 제한하기 위해 즉시 실행 함수를 사용함.
  + 작성하기 번거럽고 가독성이 떨어짐
    
### `var`의 두 번째 문제점: 호이스팅
> 호이스팅 : 정의된 변수(`var`)가 변수가 속한 스코프의 최상단으로 끌어올려진다.

#### 변수가 정의된 시점보다 먼저 변수 사용하기
```js
console.log(myVar); // undefined
var myVar = 1;
```
- 변수를 정의하기 전에 사용했음에도 이 코드는 에러가 발생하지 않음.
    + 1이 아닌 `undefined`가 출력됨
    + 호이스팅으로 인해 다음 코드처럼 변경
    
#### 호이스팅의 결과
```js
var myVar = undefined;
console.log(myVar); // undefined
myVar = 1;
```

#### 변수가 정의된 시점보다 먼저 변수에 값을 할당하기
```js
console.log(myVar); // undefined
myVar = 2;
console.log(myVar); // 2
var myVar = 1; 
```
> 버그처럼 보이는 위 코드는 에러 없이 사용 되는 것이 단점이라고 할 수 있다.  
> 호이스팅은 직관적이지 않으며, 보통 프로그래밍 언어에서 찾기 힘든 성질이다.

### `var` 의 기타 문제들
#### `var` 변수는 재정의가 가능하다
```js
var myVar = 1;
var myVar = 2;
```
1. 변수를 생성한다? 새로운 변수를 정의한다.
 - 위 코드를 에러 없이 사용될 수 있다는 것은 직관적이지 않으며 버그의 확률을 높인다.
2. `var`는 재할당 가능한 변수로 밖에 만들 수 없다. 
   - 상수처럼 쓸 값도 무조건 재할당 가능한 변수로 생성
   - 재할당 불가능 변수 사용: 코드의 복잡도가 낮아짐, 가독성은 높아짐
    
## 2.1.2 `var` 의 문제를 해결하는 `const`, `let`
> `const`, `let` 은 **블록 스코프**다

#### 블록 스코프에서는 블록을 벗어나면 사용할 수 없다
```js
if (true) {
    const i = 0;
}
console.log(i); // 참조 에러
```

#### 블록 스코프에서 같은 이름을 갖는 변수의 사용 예
```js
let foo = 'bar1';
console.log(foo); // bar1
if (true) {
    let foo = 'bar2'
    console.log(foo); // bar2
}
console.log(foo); // bar1
```
> 마지막 foo 변수는 같은 블록에서 정의한 `bar1`을 출력한다

### `const, let` 에서의 호이스팅
> 호이스팅은 일어나지만, 정의하기 이전에 변수 사용시 *참조 에러* 발생
```js
console.log(foo); // 참조 에러
const foo = 1;
```
- 이러한 에러 발생은 **임시적 사각지대(temporal dead zone)**에 의해 발생한다.

#### `const` 에서 호이스팅의 역할을 설명하기 위한 예
```js
const foo = 1;
{
    console.log(foo); // 참조 에러
    const foo = 2;
}
```
- 블록 안의 변수가 호이스팅 되지 않았다면 *참조 에러*는 발생하지 않았을 것
- 여기서 호이스팅의 역할을 짐작할 수 있음

#### `var` 에서 호이스팅의 효과를 확인하는 코드
```js
var foo = 1;
(function () {
    console.log(foo); // undefined
    var foo = 2;
})
```

### `const` 변수를 재할당 불가능하게 만든다
> `let, var`로 정의된 변수는 재할당 가능하다.  
> 재할당 불가 변수는 프로그램의 복잡도를 상당히 낮춰주므로 되도록 사용을 권장한다.

#### `const`로 정의된 변수만 재할당 불가능하다
```js
const bar = 'a';
bar = 'b'; // 에러 발생
var foo = 'a';
foo = 'b';
let value = 'a';
value = 'b';
```

#### `const` 로 정의해도 객체의 내부 속성값은 수정 가능하다
```js
const bar = { prop1: 'a' };
bar.prop1 = 'b';
bar.prop2 = 123;
console.log(bar); // { prop1: 'b', prop2: 123 }
const arr = [10, 20];
arr[0] = 100;
arr.push(300);
console.log(arr); // [100, 20, 300]
```

#### 불가능하게 하고싶다면?
> `immer`, `immutable.js`등의 외부 패키지 활용 권장

- 단지 수정만할 수 없도록 차단하는 방법
    - `Object.preventExtensions`
    - `Object.seal`
    - `Object.freeze`
#### `const`로 정의된 변수에 재할당은 불가능하
```js
const bar = { prop1: 'a' };
bar = { prop2: 123 }; // 에러 발생
```
