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

## 2.3.2 함수를 정의하는 새로운 방법: 화살표 함수

#### 화살표 함수의 사용 예
```js
const add = (a, b) => a + b;
console.log(add(1, 2)); // 3
const add5 = a => a + 5;
console.log(add5(1)); // 6
const addAndReturnObject = (a, b) => ({ result: a + b });
console.log(addAndReturnObject(1, 2).result); // 3
```
- 객체를 반환하는 경우 소괄호로 감싸야 한다.

---

### 화살표의 함수의 코드가 여러 줄인 경우
> 전체를 중괄호로 묶고, 반환값에는 `return` 키워드 사용

#### 코드가 두 줄 이상인 화살표 함수
```js
const add = (a, b) => {
    if(a <= 0 || b <= 0) {
        throw new Error('must be positibe number');
    }
    return a + b;
};

```
---

### `this`와 `argument`가 바인딩되지 않는 화살표 함수
#### 화살표 함수에서 나머지 매개변수 사용하기
```js
const printLog = (...rest) => console.log(rest);
printLog(1, 2); // [1, 2]
```

---

### 일반 함수에서 `this`바인딩 때문에 버그가 발생하는 경우
> 일반 함수의 `this` 바인딩 : `this`는 호출 시점에 사용된 객체로 바인딩  
> 일반 함수를 다른 변수에 할당해서 호출하면 버그가 발생할 수 있다.

#### `this`바인딩 떄문에 버그가 발생한 경우
```js
const obj = {
    value: 1,
    increase: function () {
        this.value++
    },
};
obj.increase();
console.log(obj.value); // 2
const increase = obj.increase;
increase();
console.log(obj.value); // 2
```
- 일반 함수(`increase()`) 호출 시 사용된 객체가 `this`로 바인딩
- `obj` 객체가 `this`에 바인딩되므로, `obj.value`가 증가
- 객체 없이 호출된 경우 전역 객체가 바인딩, 브라우저 환경(window 객체 바인딩)
- 따라서, `obj.value`가 증가하지 않음
- `this`와 `arguments`는 자신을 감싸고 있는 가장 가까운 일반 함수의 것을 참조

---

### 생성자 함수 내부에서 정의된 화살표 함수의 `this`
>> 생성자 함수 내부에서 정의된 화살표 함수의 `this`는 생성된 객체를 참조

#### 생성자 함수 내부에서 화살표 함수 사용하기
```js
function Something() {
    this.value = 1;
    this.increase = () => this.value++;
}
const obj = new Something();
obj.increase();
console.log(obj.value); // 2
const increase = obj.increase;
increase();
console.log(obj.value); // 3
```
- 화살표 함수(`increase()`)의 `this`는 가장 가까운 일반 함수인 `Something`의 `this`를 참조
- `Something` 함수는 생성자이고 `obj` 객체가 생성될 때 호출
- `new` 키워드를 이용해 생성자 함수를 호출하면 `this`는 생성되는 객체를 참조

---

### `setInterval` 함수 사용 시 `this`바인딩 문제
#### `setInterval`함수에서 this 객체 사용 시 버그 발생
```js
function Something() {
    this.value = 1;
    setInterval(function increase() {
        this.value++;
    }, 1000);
}
const obj = new Something();
```
- `setInterval`함수의 인수로 들어간 `increase`함수는 **전역 환경(global context)** 에서 실행

#### `setInterval`함수에서 `this`객체를 참조하기 위해 편법 사용
```js
function Something() {
    this.value = 1;
    var that = this;
    setInterval(function increase() {
        that.value++;
    }, 1000);
}
const obj = new Something();
```
- `increase`함수에서는 **클로저(closure)** 를 이용해서 미리 저장해둔 `that` 변수를 통해 `this` 객체에 접근

---

### 클로저 개념 이해하기
> 함수가 생성되는 시점에 접근 가능했던 변수들을 생성 이후에도 계속해서 접근할 수 있게 해주는 기능  
> 상위함수들의 매개 변수와 내부 변수

#### 클로저를 사용한 간단한 코드
```js
function makeAddFunc(x) {
    return function add(y) {
        return x + y;
    };
}
const add5 = makeAddFunc(5);
console.log(add5(1)); // 6
const add7 = makeAddFunc(7);
console.log(add7(1)); // 8
console.log(add5(1)); // 6
```
- `add` 함수는 상위 함수인 `makeAddFunc`의 매개변수 `x`에 접근 가능
- `add5` 함수가 생성된 이후에도 상위 함수를 호출할 때 사용했던 인수에 접근 가능
- `makeAddFunc(7)`이 호출되지만 `add5`에 영향 X > 즉, 생성된 `add` 함수별로 **클로저 환경** 이 생성

#### `setInterval`함수에서 `this`객체를 참조하기 위해 화살표 함수 사용하기
```js
function Something() {
    this.value = 1;
    setInterval(() => {
        this.value++;
    }, 1000);
}
const obj = new Something();
```

- 화살표 함수를 사용했기 때문에 `this`는 `setInterval`의 동작과는 상관없이 `obj`를 참조