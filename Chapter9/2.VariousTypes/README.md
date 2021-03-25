# 9.2 타입스크립트의 여러 가지 타입

## 9.2.1 타입스크립트의 다양한 타입
#### 타입스크립트에서 사용되는 다양한 타입의 예
```ts
const size: number = 123;
const isBig: boolean = size >= 100;
const msg: string = isBig ? '크다' : '작다';

const values: number[] = [1, 2 ,3];
const values2: Array<number> = [1, 2, 3];
values.push('a') // Type Error

const data: [string, number] = [msg, size];
data[0].substr(1);
data[1].substr(1); // Type Error
```

### `null`과 `undefined` 타입
#### 타입으로 사용될 수 있는 `null`과 `undefined`
```ts
let v1: undefined = undefined;
let v2: null = null;
v1 = 123; // Type Error

let v3: number | undefined = undefined;
v3 = 123;
```

### 문자열 리터럴과 숫자 리터럴 타입
#### 타입으로 사용되는 숫자 리터럴과 문자열 리터럴
```ts
let v1: 10 | 20 | 30;
v1 = 10;
v1 = 15; // Type Error

let v2: '경찰관' | '소방관';
v2 = '의사'; // Type Error
```

### `any` 타입
> 모든 종류의 값을 허용하는 타입
```ts
let value: any;
value = 123;
value = '456';
value = () => {};
```

- 기존의 JS 코드로 작성된 프로젝트를 TS 로 포팅하는 경우 유용히 사용
- 실제 타입을 알 수 없는 경우나 타입 정의가 안 된 외부 패키지를 사용하는 경우
- `any` 타입을 남발하면 TS 를 사용하는 의미가 퇴색되어 되도록 피한다

### `void`와 `never` 타입
> 아무 값도 반환하지 않고 종료되는 함수의 반환 타입은 `void` 타입으로 정의   
> 항상 예외가 발생해서 비정상적으로 종료되거나 무한 루프 때문에 종료되지 않는 함수의 반환 타입은 `never` 타입으로 정의

```ts
function f1(): void {
    console.log('hello');
}

function f2(): never {
    throw new Error('some error');
}

function f3(): never {
    while (true) {
        // ...
    }
}
```

### `object` 타입
```ts
let v: object;
v = { name: 'abc' };
console.log(v.prop1); // Type Error
```
- 객체의 속성에 대한 정보가 없기 때문에 특정 속성값에 접근하면 타입 에러 발생
- 속성 정보를 포함하여 정의하기 위해서는 인터페이스(interface) 정의를 사용

### 교차 타입과 유니온 타입
```ts
let v1: (1 | 3 | 5) & (3 | 5 | 7);
v1 = 3;
v1 = 1; // Type Error
```

### `type` 키워드로 타입에 별칭 주기
```ts
type Width = number | string;
let width: Width;
width = 100;
width = '100px';
```

