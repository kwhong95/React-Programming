# 2.7 실행을 멈출 수 있는 제너레이터
> 함수의 실행을 중간에 멈추고 재개할 수 있는 독특한 기능

- 실행을 멈출 때 값을 전달할 수 있기 때문에 반복문에서 제너레이터가 전달하는 값을 하나씩 꺼내 사용이 가능하다.
    + 배열이 반목문에서 사용하는 방식과 비슷
    + 보통의 컬렉션과 달리 값을 미리 생성하지 않음 > 불필요한 메모리 사용 방지
    + 필요한 순간에 값을 계산해서 전달할 수 있기 때문에 메모리 측면에서 효율적
- 다른 함수와 **협업 멀티태스킹**을 할수 있다.

## 2.7.1 제너레이터 이해하기
#### 간단한 제너레이터 함수의 예
```js
function* f1() {
    yield 10;
    yield 20;
    return 'finish';
}
const gen = f1();
```

#### 제너레이터 객체의 `next` 메서드 사용하기
```js
function* f1() {
    console.log('f1-1');
    yield 10;
    console.log('f1-2');
    yield 20;
    console.log('f1-3');
    return 'finished';
}
const gen = f1();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());
// f1-1
// { value: 10, done: false }
// f1-2
// { value: 20, done: false }
// f1-3
// { value: 'finished', done: true }
```

- `next` 메서드를 가지고 있다? 제너레이터 객체가 반복자(iterator)라는 것을 암시

#### 제너레이터 객체의 `return` 메서드 호출하기
```js
const gen = f1();
console.log(gen.next());
console.log(gen.return('abc'));
console.log(gen.next());
// f1-1
// { value: 10, done: false }
// { value: 'abc', done: true }
// { value: undefined, done: true }
```
- `return` 메서드를 호출 > 데이터 객체의 `done` 속성값은 `true`

#### 제너레이터 객체의 `throw` 메서드 호출
```js
function* f1() {
    try {
        console.log('f1-1');
        yield 10;
        console.log('f1-2');
        yield 20;
    } catch (e) {
        console.log('f1-catch', e);
    }
    const gen = f1();
    console.log(gen.next());
    console.log(gen.throw('some error'));
    // f1-1
    // { value: 10, done: false }
    // f1-catch some error
    // { value: undefined, done: true } 
}
```

---

### 반복 가능하면서 반복자인 제너레이터 객체
> 객체는 반복가능하면서 반복자

#### 반복자(iterator) 객체의 조건
- `next` 메서드를 가지고 있다.
- `next` 메서드는 `value`와 `done`속성값을 가진 객체를 반환한다.
- `done` 속성값은 작업이 끝났을 때 참이 된다.

#### 반복 가능(iterable)한 객체의 조건 
- `Symbol.iterator`속성값으로 함수를 가지고 있다.
- 해당 함수를 호출하면 반복자를 반환한다.

#### 배열은 반복 가능한 객체다
```js
const arr = [10, 20, 30];
const iter = arr[Symbol.iterator]();
console.log(iter.next()); // { value: 10, done: false }
```

#### 제너레이터 객체는 반복 가능한 객체다
```js
function* f1() {
    // ...
}
const gen = f1();
console.log(gen[Symbol.iterator]() === gen); // true
```

#### 반복 가능한 객체를 이용하는 코드
```js
function* f1() {
    yield 10;
    yield 20;
    yield 30;
}
for (const v of f1()) {
    console.log(v);
}
const arr = [...f1()];
console.log(arr); // [10, 20, 30]
```

- `for of` 문은 반복가능한 객체로 부터 **반복자**를 얻음 
- `done: true`까지 반복 수행
- 전개 연산자도 `done: true`까지 값을 펼침
