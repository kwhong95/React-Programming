# 9.6 생산성을 높이는 타입스크립트의 기능
## 9.6.1 타입 추론
> 명시적으로 타입 코드를 작성하지 않아도 타입을 추론하는 경우가 많음

### `let`변수의 타입 추론
```ts
let v1 = 123;
let v2 = 'abc';
v1 = 'a'; // Type Error

v2 = 456; // Type Error
```

### `const`변수의 타입 추론
```ts
const v1 = 123;
const v2 = 'abc';
let v3: typeof v1 | typeof v2;
```

- `const` 변수는 리터럴 자체가 타입이 됨

### 배열과 객체의 타입 추론
```ts
const arr1 = [10, 20, 30];
const [n1, n2, n3] = arr1;
arr1.push('a'); // Type Error

const arr2 = { id: 'abcd', age: 123, language: 'korean' };
// const arr2: { id: string; age: number; language: string; }
const { id, age, language } = arr2;
console.log(id === age); // Type Error
```

#### 여러가지 타입으로 구성된 배열의 타입 추론
```ts
interface Person {
    name: string;
    age: number;
}
interface Korean extends Person {
    liveInSeoul: boolean;
}
interface Japanese extends Person {
    liveInTokyo: boolean;
}

const p1: Person = { name: 'mike', age: 23 };
const p2: Korean = { name: 'mike', age: 25, liveInSeoul: true };
const p3: Japanese = { nmae: 'mike', age: 27, liveInTokyo: false };
const arr1 = [p1, p2 ,p3];
const arr2 = [p2, p3];
```

### 함수의 매개변수와 반환값에 대한 타입 추론
```ts
function func1(a = 'abc', b = 10) { // 1
    return `${a}, ${b}`;
}
func1(3, 6); // Type Error 2
const v1: number = func1('a', 1); // Type Error 3

function func2(value: number) { // 4
    if(value < 10) {
        return value;
    } else {
        return `${value} is too big`;
    }
}
```
1) 기본값이 있는 매개변수는 자동으로 타입 정보가 추가
- 함수의 반환값도 타입 추론에 의해 자동으로 타입 정보가 추가
2) 첫 번째 매개변수 숫자 X - 타입 에러
3) 반환값 숫자 X - 타입 에러
4) `return` 키워드가 여러번 사용되도 타입 추론은 잘 동작(`number | string`)

