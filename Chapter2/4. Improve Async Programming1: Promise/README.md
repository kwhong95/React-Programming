# 2.4 향상된 비동기 프로그래밍 1: 프로미스
> 비동기 상태를 값으로 다룰 수 있는 객체

## 2.4.1 프로미스 이해하기
### 콜백 패턴의 문제
> 조금만 중첩되도 코드의 복잡성이 증대

#### 콜백 함수의 중첩 사용
```js
function requestData1(callback) { 
    // ...
    callback(data); // 2 
}
function requestData2(callback) {
    // ...
    callback(data); // 4
}
function onSuccess1(data) { 
    console.log(data);
    requestData2(onSuccess2); // 3
}
function onSuccess2(data) { // 5
    console.log(data);
    // ...
}
requestData1(onSuccess1); // 1
```

- 비순차적 흐름이기에 코드를 읽기 힘듬
- 1~5 순서대로 실행되고, 짧은 코드에도 쉽게 읽히지 않음

#### 간단한 프로미스 코드 예
```js
requestData1()
    .then(data => {
        console.log(data);
        return requestData2();
    })
    .then(data => {
        console.log(data);
        // ...
    });
```
- 프로미스로 코드를 순차적으로 작성 가능

---

### 프로미스의 세 가지 상태
- 대기중(pending): 결과를 기다리는 중
- 이행됨(fulfilled): 수행이 정상적으로 끝남 > 결과값 O
- 거부됨(rejected): 수행이 비정상적으로 끝남
> 이행됨, 거부됨 상태 > 처리됨(settled) 상태  
> 프로미스는 처리됨 상태가 되면 더 이상 다른 상태로 변경 X

### 프로미스를 생성하는 방법
```js
const p1 = new Promise((resolve, reject) => {
    // ...
    // resolve(data)
    // or reject('error message')
});
const p2 = Promise.reject('error message');
const p3 = Promise.resolve(param);
```

#### `Promise.resolve`의 반환값
```js
const p1 = Promise.resolve(123);
console.log(p1 !== 123); // true
const p2 = new Promise(resolve => setTimeout(() => resolve(10), 1));
console.log(Promise.resolve(p2) === p2); // true
```

---

### 프로미스 이용하기 1: `then`
> 처리됨 상태가 된 프로미스를 처리할 떄 사용되는 메서드

#### `then`메서드를 사용한 간단한 코드
```js
requestData().then(onResolve, onReject);
Promise.resolve(123).then(data => console.log(data)); // 123
Promise.reject('err').then(null, error => console.log(error)); // 에러 발생
```

#### 연속해서 `then`메서드 호출하기
```js
requestData1()
    .then(data => {
        console.log(data);
        return requestData2();
    })
    .then(data => {
        return data + 1;
    })
    .then(data => {
        throw new Error('some error');
    })
    .then(null, error => {
        console.log(error);
    });
```

#### 거부됨 상태가 되면 `onReject`함수를 호출한다
```js
Promise.reject('err')
    .then(() => console.log('then 1'))
    .then(() => console.log('then 2'))
    .then(() => console.log('then 3'), () => console.log('then 4'))
    .then(() => console.log('then 5'), () => console.log('then 6'));
```

---

### 프로미스 이용하기 2: `catch`
> 프로미스 수행 중 발생한 예외 처리 메서드 (= `then`메서드의 `onReject`함수 역할)
> 
#### 같은 기능을 하는 `then`메서드와 `catch`메서드
```js
Promise.reject(1).then(null, error => {
    console.log(error);
});
Promise.reject(1).catch(error => {
    console.log(error)
})
```

#### `then`메서드의 `onReject`를 사용했을 때의 문제점
```js
Promise.resolve().then(
    () => {
        throw new Error('some error');
    },
    error => {
        console.log(error);
    },
)
```
- `Unhandled promise rejection` 에러 발생
    + 거부됨 상태인 프로미스를 처리하지 않음
    
#### `onReject` 함수를 사용하지 않고 `catch`를 사용한 예
```js
Promise.resolve()
    .then(() => {
        throw new Error('some error');
    })
    .catch(error => {
        console.log(error);
    })
```

#### `catch` 메서드 이후에도 `then`메서드 사용하기
```js
Promise.reject(10)
    .then(data => {
        console.log('then1: ', data);
        return 20;
    })
    .catch(error => {
        console.log('catch: ', error);
        return 30;
    })
        .then(data => {
            console.log('then2: ', data);
        });
    // catch: 10
    // then2: /30
```

---

### 프로미스 이용하기 3: `finally`
> 프로미스의 이행됨 또는 거부됨 상태일 때 호출되는 메서드 > 프로미스 체인의 가장 마지막에 사용

#### `finally`를 사용한 간단한 코드
```js
requestData()
    .then(data => {
        // ...
    })
    .catch(error => {
        // ...
    })
    .finally(() => {
        // ...
    })
```

#### `finally`메서드는 새로운 프로미스를 생성하지 않는다
```js
function requestData() {
    return fetch()
            .catch(error => {
                // ...
            })
            .finally(() => {
                sendLogToServer('requestData finished');
            });
}
requestData().then(data => console.log(data));
```

## 2.4.2 프로미스 활용하기
### 병렬로 처리하기: `Promise.all`
> 여러 개의 프로미스를 병렬로 처리할 때 사용하는 함수

- `then` 메서드를 체인 연결하면 각각의 비동기 처리가 병렬로 체인으로 연결하면 비동기 처리가 병렬로 처리 되지 않는 단점이 있다.

#### 순차적으로 실행되는 비동기 코드
```js
requestData() 
    .then(data => {
        console.log(data);
        return requestData2();
    })
    .then(data => {
        console.log(data);
    })
```
- 비동기 함수 간에 **의존성**이 없다면 병렬로 처리하는게 더 빠르다.

#### 병렬로 실행되는 코드
```js
requestData1().then(data =>  console.log(data));
requestData2().then(data => console.log(data));
```

#### `Promise.all`을 사용하는 코드
```js
Promise.all([requestData1(), requestData2()]).then(([data1, data2]) => {
    console.log(data1, data2);
})
```

---

- 프로미스를 반환하고, 만약 하나라도 거부됨 상태가 된다면 반환하는 프로미스도 거부됨 상태가 된다.

---

### 가장 빨리 처리된 프로미스 가져오기: `Promise.race`
> 가장 빨리 처리된 프로미스를 반환하는 함수

#### `Promise.race`를 사용한 간단한 코드
```js
Promise.race([
    requestData(),
        new Promise((_, reject) => setTimeout(reject, 3000)),
])
    .then(data => console.log(data))
    .catch(error => console.log(error))
```

- 3초안에 데이터를 받으면 `then`메서드가 호출되고, 그렇지 않으면 `catch`메서드가 호출

---

### 프로미스를 이용한 데이터 캐싱
> 처리됨 상태가 되면 상태를 유지하는 프로미스 성질을 이용해 데이터 캐싱이 가능하다.

#### 프로미스로 캐싱 기능 구현하기
```js
let catchedPromise;
function getData() {
    catchedPromise = catchedPromise || requestData();
    return catchedPromise;
}
getData().then(v => console.log(v));
getData().then(v => console.log(v));
```
