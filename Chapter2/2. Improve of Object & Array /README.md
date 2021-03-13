# 2.2 객채와 배열의 사용성 개선
> 단축 속성명과 계산된 속성명을 이용하여 객체, 배열을 생성하고 수정하는 코드를 쉽게 작성 가능하다.
> (전개 연산자 & 비구조화 할당)

## 2.2.1 객체와 배열을 간편하게 생성하고 수정하기
### 단축 속성명
> 객체 리터럴 코드를 간편하게 작성 가능하다.

#### 단축 속성명을 사용해서 객체를 생성하기
```js
const name = 'hong';
const obj = {
    age: 27,
    name,
    getName() { return thie.name },
}
```
- 새로 생성할 객체의 속성값 일부가 변수로 존재하면 간단하게 변수 이름만 넣어 준다.
- 속성값이 함수이면 `function` 키워드 없이 함수명만 적어도 된다.

#### 단축 속성명을 사용하지 않은 코드와 사용한 비교해보기
```js
function makePerson1(age, name) {
    return { age: age, name: name };
}
function makePerson2(age, name) {
    return { age, name };
}
```

- 사용한 경우(아래)가 훨씬 코드를 작성하기도 편하고 가독성도 좋다.
- 또한, 단축 속성명은 디버깅을 위해 콘솔 로그 출력때도 용이하다.

#### 콘솔 로그 출력 시 단축 속성명 활용하기
```js
const name = 'mike';
const age = 21;
console.log('name =', name, 'age =', age);
console.l0g({ name, age });
// name = mike, age = 21
```
-----
### 계산된 속성명
> 객체의 속성명을 동적으로 결정

#### 계산된 속성명을 사용하지 않은 코드와 사용한 코드 비교
```js
function makeObject1(key, value) {
    const obj = {};
    obj[key] = value;
    return obj;
}
function makeObject2(key, value) {
    return { [key]: value };
}
```
#### 계산된 속성명을 사용해서 컴포넌트 상태값 변경하기
```js
class MyComponent extends React.Component {
    state = {
        count1: 0,
        count2: 0,
        count3: 0,
    };
    // ...
    onClick = idx => {
        const key = `count${idx}`;
        const value = thie.state[key];
        this.setState({ [key]: value + 1 });
    };
}
```
- `setState` 호출 시 계산된 속성명을 사용할 수 있으며, 계산된 속성명을 사용하지 않았다면 코드가 좀 더 복잡했을 것

## 2.2.2 객체와 배열의 속성값을 간편하게 가져오기
### 전개 연산자
> 배열이나 객체의 모든 속성을 풀어놓을 떄 사용하는 문법

#### 전개 연산자를 이용해서 함수의 매개변수를 입력하기
```js
Math.max(1, 3, 7, 9);
const numbers = [1, 3, 7, 9];
Math.max(...numbers);
```
- 동적으로 매개변수를 전달 가능하다.
- 위같은 경우는 4개로 매개변수가 고정됨.

#### 동적으로 함수의 매개변수를 전달하는 다른 방법(`apply`)
```js
const numbers = [-1, 5, 11, 3];
Math.max.apply(null, numbers);
```
- `this` 바인딩이 필요하지 않아 첫 매개변수로 `null`을 입력
- 전개연산자보다 작성하기 번거롭고 가독성이 떨어짐

#### 전개 연산자를 이용해서 배열과 객체를 복사하기
```js
const arr1 = [1, 2, 3];
const obj1 = { age: 23, name: 'mike' };
const arr2 = [...arr1];
const obj2 = { ...obj1 };
arr2.push(4);
obj2.age = 80;
```
- 기존 객체를 복사해서 새로운 객체를 생성하여 기존 객체에 영향을 주지 않음.

#### 배열에서 전개 연산자를 사용하면 순서가 유지된다
```js
[1, ...[2, 3], 4]; // [1, 2, 3, 4]
new Date(...[2020, 6, 24]); // 2020년 6월 24일
```
- 배열 리터럴에서 중간에 전개 연산자를 사용하면 전개 연산자 전후의 순서가 유지
- 함수의 인수는 정의된 매개변수의 순서대로 입력해야 하므로, 순서가 유지되는 전개 연산자의 성질을 이용하기 좋음

#### 전개 연산자를 이용해서 두 객체를 병합하기
```js
const obj1 = { age: 21, name: 'mike' };
const obj2 = { hobby: 'soccer' };
const obj3 = { ...obj1, ...obj2 };
console.log(obj3); // { age: 21, name: 'mike', hobby: 'soccer' }
```

#### 객체 리터럴에서 중복된 속성명 사용 가능
```js
const obj1 = { x: 1, x: 2, y: 'a' }; // { x: 2, y: 'a' }
const obj2 = { ...obj1, y: 'b' }; // { x: 2, y: 'b' };
```
- 중복된 속성명 사용 시 최종 결과는 마지막 속성명의 값이됨
- 중복된 속성명과 전개 연산자 이용 시 객체의 특정 속성값을 변경할 때 이전 객체에 영향을 주지 않고 새로운 객체 생성이 가능하다.
    + 변수를 수정 불가능하도록 관리할 때 유용하게 사용 가능
    
-----
### 배열 비구조화
> 배열의 여러 속성값을 변수로 쉽게 할당할 수 있는 문법

#### 배열 비구조화를 사용한 간단한 코드
```js
const arr = [1, 2];
const [a, b] = arr;
console.log(a); // 1
console.log(b); // 2
```

#### 배열 비구조화로 이미 존재하는 변수에 값을 할당하기
```js
let a, b;
[a, b] = [1, 2];
```

#### 배열 비구조화에서의 기본값
```js
const arr = [1];
const [a = 10, b = 20] = arr;
console.log(a); // 1
console.log(b) // 20
```
- 첫 번째 변수의 속성값은 존재하기 때문에 기본값 10은 사용되지 않고 속성값이 그대로 할당

#### 배열 비구조화를 이용해서 두 변수의 값을 교환하기
```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1
```

#### 쉼표를 이용해서 일부 속성값을 건너뛰기
```js
const arr = [1, 2, 3];
const [a, , c] = arr;
console.log(a); // 1
console.log(c); // 3
```

#### 나머지 값을 별도의 배열로 만들기 
```js
const arr = [1, 2, 3];
const [first, ...rest1] = arr;
console.log(rest1); // [2, 3]
const [a, b, c, ...rest2] = arr;
console.log(rest2); // []
```
-----
### 객체 비구조화
> 객체의 여러 속성값을 변수로 쉽게 할당할 수 있는 문법

#### 객체 비구조화의 간단한 예
```js
const obj = { age: 21, name: 'mike' };
const { age, name } = obj;
console.log(age); // 21
console.log(name); // mike
```

#### 객체 비구조화에서는 속성명이 중요하다(순서 상관 X)
```js
const obj = { age: 21, name: 'mike' };
const { age, name } = obj;
const { name, age } = obj;
const { a, b } = obj; // a, b : undefined
```

#### 객체 비구조화에서 별칭 사용하기
```js
const obj = { age: 21, name: 'mike' };
const { age: theAge, name } = obj;
console.log(theAge) // 21
console.log(age); // 참조 에러
```

#### 객체 비구조화에서의 기본값
```js
const obj = { age: undefined, name: null, grade: 'A' };
const { age = 0, name = 'noName', grade = 'F' } = obj;
console.log(age); // 0
console.log(name); // null
console.log(grade); // A
```
- `null` 과 기본값이 지정된 `grade` 속성은 그대로 유지된다.

#### 기본값과 별칭 동시에 사용하기
```js
const obj = { age: undefined, name: 'mike' };
const { age: theAge = 0, name } = obj;
console.log(theAge); // 0
```

#### 함수를 이용한 기본값
```js
function getDefaultAge() {
    console.log('hello');
    return 0;
}
const obj = { age: 21, grade: 'A' };
const { age = getDefaultAge(), grade } = obj; // hello 출력되지 않음
console.log(age); // 21
```
- 기본값이 사용될 때만 함수가 호출됨, 따라서 `age`의 속성값은 `undefined` 가 아니므로 기본값이 사용되지 않고, `getDefaultAge` 함수도 호출되지 않는다.

#### 객체 비구조화에서 나머지 속성들을 별도의 객체로 생성하기
```js
const obj = { age: 21, name: 'mike', grade: 'A' };
const { age, ...rest } = obj;
console.log(rest); // { name: 'mike', grade: 'A' }
```

#### `for` 문에서 객체 비구조화를 활용한 예
```js
const people = [{ age: 21, name: 'mike' }, { age: 51, name: 'sara' }];
for (const { age, name } of people) {
    // ...
}
```
----

### 비구조화 심화 학습

#### 중첩된 객체의 비구조화 사용 예
```js
const obj = { name: 'mike', mother: { name: 'sara' } };
const {
    name,
    mother: { name: motherName },
} = obj;
console.log(name); // mike
console.log(motherName); // sara
console.log(mother); // 참조 에러
```
- 세 개의 단어가 등장하나, 비구조화의 결과로 `motherName` 이라는 변수만 생성됨

#### 기본값은 변수 단위가 아니라 패턴 단위로 적용된다
```js
const [{ prop: x } = { prop: 123 }] = [];
console.log(x); // 123

const [{ prop: x } = { prop: 123 }] = [{}];
console.log(x); // undefined
```
- 첫 번째 경우:
  + `{ prop: x }`는 배열의 첫 번째 원소를 가리키고, `{ prop: 123 }` 은 기본값을 정의
  + 첫 번쩨 원소가 존재하지 않아 기본값이 할당 
  + 결과적으로 변수 `x`에는 `123`이 설정
- 두 번째 경우:
  + 배열의 첫 번째 원소가 존재하므로 기본값이 할당되지 않음
  + 첫 번째 원소에는 `prop`이라는 이름의 속성명이 존재하지 않으므로 `x`에는 `undefind`가 할당
  
#### 객체 비구조화에서 계산된 속성명 사용하기
```js
const index = 1;
const { [`key${index}`]: valueOfTheIndex } = { key1: 123 };
console.log(valueOfTheIndex); // 123
```
- 객체 비구조화에서 계산된 속성명을 사용할 때는 반드시 별칭을 입력해야 함
- 단순 변수명만 입력가능한 것은 아님

#### 별칭을 이용해서 다른 객체와 배열의 속성값 할당
```js
const obj = {};
const arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
console.log(obj); // { prop: 123 }
console.log(arr); // [ true ]
```
- 객체 비구조화를 이용해 `obj` 객체의 `prop` 이라는 속성과 배열의 첫 번째 원소에 값을 할당