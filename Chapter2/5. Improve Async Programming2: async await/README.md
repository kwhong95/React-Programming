# 2.5 향상된 비동기 프로그래밍 2: async await
> 비동기 프로그래밍 동기 프로그래밍처럼 작성할 수 있도록 추가된 기능  
> `then` 메서드를 체인 형식으로 호출하는 것보다 가독성이 좋음

## 2.5.1 async await 이해하기
### async await 함수는 프로미스를 반환한다
> 프로미스는 객체로 존재하나 async await 는 함수에 적용되는 개념

#### 프로미스 반환하는 async await 함수 - 1
```js
async function getData() {
    return 123;
}
getData().then(data => console.log(data)); // 123
```

#### 프로미스를 반환하는 async await 함수 - 2
```js
async function getData() {
    return Promise.resolve(123);
}
getData().then(data => console.log(data)); // 123
```

#### async await 함수에서 예외가 발생하는 경우
```js
async function getData() {
    throw new Error('123');
}
getData().catch(error => console.log(error)); // 에러 발생: 123
```

### `await` 키워드를 사용하는 방법
> async await 함수 내부에서 사용

- `await` 오른쪽에 프로미스를 입력하면 그 프로미스가 처리됨 상태가 될 때까지 기다린다.

#### `await` 키워드의 사용 예
```js
function requestData(value) {
    return new Promise(resolve => 
    setTimeout(() => {
        console.log('requestData: ', value);
        resolve(value);
    }, 100),
    );
}
async function getData() {
    const data1 = await requestData(10);
    const data2 = await requestData(20);
    console.log(data1, data2);
    return [data1, data2];
}
getData();
// requestData: 10
// requestData: 20
// 10 20
```
#### `await` 키워드는 `async` 키워드 없이 사용할 수 없다
```js
function getData() {
    const data = await requestData(10); // 에러 발생
    console.log(data);
}
```

### async await 는 프로미스보다 가독성이 좋다

#### async await 와 프로미스 비교하기
```js
function getDataPromise() {
    asyncFunc1()
        .then(data => {
            console.log(data);
            return asyncFunc2();
        })
        .then(data => {
            console.log(data);
        })
}
async function getDataAsync() {
    const data1 = await asyncFunc1();
    console.log(data1);
    const data2 = await asyncFunc2();
    console.log(data2);
}
```

#### 의존성이 높은 코드에서 가독성 비교하기
```js
function getDataPromise() {
    return asyncFunc1()
        .then(data1 => Promise.all([data1, asynFunc2(data1)]))
        .then(([data1, data2]) => {
            return asyncFunc3(data1, data2);
    });
}
async function getDataAsync() {
    const data1 = await asyncFunc1();
    const data2 = await asyncFunc2(data1);
    return asyncFunc3(data1, data2);
}
```