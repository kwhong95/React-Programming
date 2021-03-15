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

## 2.7.2 제너레이터 활용하기
> 제너레이터, 반복자, 반복가능한 객체를 이용하면 함수형 프로그래밍의 대표적인 함수를 쉽게 구현 가능하다.

#### 제너레이터로 구현한 `map`, `filter`, `take` 함수
```js
function* map(iter, mapper) {
    for (const v of iter) {
        yield mapper(v);
    }
}

function* filter(iter, test) {
    for(const v of iter) {
        if (test(v)) {
            yield v;
        }
    }
}

function* take(n, iter) {
    for(const v of iter) {
        if (n <= 0) return;
        yield v;
        n--;
    }
}

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = take(3, map(filter(values, n => n % 2 === 0), n => n * 10));
console.log([...result]); // [ 20, 40 , 60 ]
```
- 제너레이터 함수 내부에서 반복 가능한 객체를 이용
- 제너레이터 덕분에 새로운 배열 객체를 생성하지 않음
- 세 함수가 필요한 순간에만 실행됨
- 함수 호출시 제너레이터 객체만 생성되고 실제 연신은 수행되지 않음
- 값이 필요한 순간에 제너레이터 객체를 통해 다음 값을 요청
- 필요한 순간에만 연산 > **지연 평가(lazy evaluation)**

#### 제너레이터 함수로 자연수의 집합 표현
```js
function* naturalNumbers() {
    let v = 1;
    while (true) {
        yield v ++;
    }
}

const values = naturalNumbers();
const result = take(3, map(filter(values, n => n % 2 === 0), n => n * 10));
console.log([...result]); // [ 20, 40, 60 ]
```

- 제너레이터 함수를 사용하지 않았다면 이 함수는 먹통이 되었을 것

---

### 제너레이터 함수끼리 호출하기(`yield*`)
#### 제너레이터 함수가 다른 제너레이터 함수 호출하기
```js
function* g1() {
    yield 2;
    yield 3;
}
function* g2() {
    yield 1;
    yield* g1();
    yield 4;
}
console.log(...g2()); // 1 2 3 4
```

#### 반복 가능한 객체를 처리하는 `yield*` 키워드
```js
function* g2_second() {
    yield 1;
    for (const value of g1()) {
        yield value;
    }
    yield 4;
}

function* g2_third() {
    yield 1;
    yield* [2, 3];
    yield 4;
}
```

---

### 제너레이터 함수로 데이터 전달하기
> 제너레이터 함수는 외부로 부터 데이터를 받아 소비할 수 있다.(`next`)

#### `next`메서드를 이용해서 제너레이터 함수로 데이터 전달하기
```js
function* f1() {
    const data1 = yield;
    console.log(data1); // 10
    const data2 = yield;
    console.log(data2);
}
const gen = f1();
gen.next();
gen.next(10);
gen.next(20);
```
- 첫 `next` 메서드 호출은 제너레이터 함수의 실행이 시작되도록 하는 역할만 수행
- `next` 메서드의 인수로 데이터 전달 가능
- `next` 메서드를 통해서 전달된 인수는 `yield` 키워드의 결괏값으로 받을 수 있음

---

### 협업 멀티태스킹 
> 여러개의 태스크를 실행할 때 하나의 태스크가 종료되기 전에 멈추고 다른 테스크가 실행되는 것

- 실행을 멈추고 재개할 수 있음 > 멀티 태스킹 가능
- 협업 > 제너레이터가 실행을 멈추는 시점을 자발적(non-preemptive)으로 선택

#### 제너레이터 함수를 이용한 협업 멀티태스킹
```js
function* minsu() {
    const myMsgList = [
        '안녕 나는 민수야',
        '만나서 반가워',
        '내일 영화 볼래?',
        '시간 안 되니?',
        '내일모레는 어때?',
    ];
    for (const msg of myMsgList) {
        console.log('수지: ', yield msg);
    }
}

function suji() {
    const myMsgList = ['', '안녕 나는 수지야', '그래 반가워', '...'];
    const gen = minsu();
    for (const msg of myMsgList) {
        console.log('민수: ', gen.next(msg).value);
    }
}
suji();
```

- `yield` 키워드를 통해서 자발적으로 자신의 실행을 멈춤
- 일반 함수에서는 제너레이터 객체의 `next` 메서드를 호출해서 제너레이터 함수가 다시 실행되도록 함

---

### 제너레이터 함수의 예외 처리
> 제너레이터 함수에서 발생한 예외는 `next` 메서드를 호출하는 외부 함수에 영향을 줌

#### 제너레이터 함수에서 예외가 발생한 경우
```js
function* getFunc() {
    throw new Error('some error');
}
function func() {
    const gen = getFunc();
    try {
        gen.next();
    } catch (e) {
        console.log('in catch: ', e);
    }
}
func();
```

- 제너레이터 함수에서 예외가 발생
- 객체가 만들어지는 시점에는 예외 발생 X
- `next` 메서드가 호출되면 제너레이터 함수의 예외가 일반 함수에 영향을 줌
- 따라서, 일반 함수의 실행은 `catch` 문으로 이동