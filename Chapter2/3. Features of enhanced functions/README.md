# 2.3 강화된 함수의 기능
> ES6+ 부터 함수의 기능 보강
- 함수의 매개변수에 기본값 설정이 가능
- 나머지 매개변수를 통해 가변 길이 매개변수를 좀 더 명시적으로 표현 가능
- 화살표 함수(Arrow Function)가 추가되어 간결해지고, `this` 바인딩에 대한 고민이 줄었다.
> 위의 기능이 추가됨에 따라 함수를 호출하는 코드의 가독성 월등히 좋아짐

## 2.3.1 매개변수에 추가된 기능
### 매개변수 기본값
#### 매개변수에 기본값 주기
```js
function printLog(a = 1) {
    console.log({ a });
}
printLog(); // { a : 1 }
```

#### 매개변수 기본값으로 함수 호출 사용하기
```js
function getDefault() {
    return 1;
}
function printLog(a = getDefault()) {
    console.log({ a });
}
printLog(); // { a: 1 }
```

#### 매개변수 기본값을 이용해서 필숫값을 표현하는 방법
```js
function required() {
    throw new Error('no parameter');
}
function printLog(a = required()) {
    console.log({ a });
}
printLog(10); // { a: 10 }
printLog(); // 에러 발생: no parameter
```

----

### 나머지 매개변수
> 입력된 인수 중에서 정의된 매개변수 개수만큼을 제외한 나머지 배열로 생성(매개변수 개수가 가변적일때 유용)

#### 나머지 매개변수를 사용한 코드
```js
function printLog(a, ...rest) {
    console.log({ a, rest });
}
printLog(1, 2, 3); // { a: 1, rest: [2, 3] } 
```

#### `arguments` 키워드로 나머지 매개변수 따라하기
```js
function printLog(a) {
    const rest = Array.from(arguments).splice(1);
    console.log({ a, rest });
}
printLog(1, 2, 3); // { a: 1, rest: [2, 3] }
```

- 매개변수 정의에서 `arguments`의 존재가 명시적으로 들어나지 않아 가독성에 좋지 않음

---
### 명명된 매개변수
> 객체 비구조화를 이용해 구현, 함수 호출 시 매개변수의 이름과 값을 동시에 적을 수 있어 가독성이 높음

#### 명명된 매개변수의 사용 여부에 따른 가독성 비교
```js
const numbers = [10, 20, 30, 40];
const result1 = getValus(numbers, 5, 25);
const result2 = getValus({ numbers, greaterThan: 5, lessThan: 25 });
```

- 선택적 매개변수(optional parameters)의 활용도 상승

#### 명명된 매개변수의 사용 여부에 따른 선택적 매개변수 코드 비교
```js
const result1 = getValues(numbers, undefined, 25);
const result2 = getValues({ numbers, greaterThan: 5 });
const result3 = getValues({ numbers, lessThan: 25 });
```
 - 함수를 호출할 때 마다 객체가 생산됨에 따라 비효율적이라고 생각하지만, JS 엔진이 최적화를 통해 새로운 객체를 생성하지 않으므로 안심해도 됨

