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

