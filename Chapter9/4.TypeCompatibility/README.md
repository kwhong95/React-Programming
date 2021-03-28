# 9.4 타입 호환성
> 어떤 타입을 다른 타입으로 취급해도 되는지 판단하는 것

- 타입 A가 타입 B에 할당 가능하다 = 타입 A는 타입 B의 서브 타입이다

## 9.4.1 숫자와 문자열의 타입 호환성

<img width="890" alt="스크린샷 2021-03-28 오후 3 24 19" src="https://user-images.githubusercontent.com/70752848/112744291-c32b4480-8fd9-11eb-80da-4e260f45dc28.png">

#### 숫자와 문자열의 타입 호환성
```ts
function func1(a: nuber, b: number | string) {
    const v1: number | string = a;
    const v2: number = b; // Type Error
}
function func2(a: 1 | 2) {
    const v1: 1 | 3 = a; // Type Error
    const v2: 1 | 2 | 3 = a; 
}
```

## 9.4.2 인터페이스의 타입 호환성
> 타입스크립트는 값 자체의 타입보다는 값이 가진 내부 구조에 기반해서 타입 호환성을 검사함, 이를 덕 타이핑(duck typing) 또는 구조적 타이핑(structural typing) 이라고 부름

- 타입스크립트가 구조적 타이핑을 도입한 이유는 동적 타입 언어인 JS 때문
- 인터페이스 A가 B로 할당 가능한 조건
    + B에 있는 모든 필수 속성의 이름이 A에도 존재해야 함
    + 같은 속성 이름에 대해, A의 속성이 B의 속성에 할당 가능해야 함
    
```ts
interface Person {
    name: string;
    age: number;
}
interface Product {
    name: string;
    age: number;
}
const person: Person = { name: 'mike', age: 23 };
const product: Product = person;
```

- 모든 속성 이름과 타입이 같다 = 서로 할당 가능하다


### 선택 속성이 타입 호환성에 미치는 영향
#### 선택 속성 때문에 할당 가능하지 않은 예
```ts
interface Person {
    name: string;
    age?: number;
}
// ...
const person: Person = {
    name: 'mike',
};
const product: Product = person; // Type Error
```

- 선택 속성 존재 시 `Person` 값의 집합이 `Product` 값의 집합 보다 커짐
- 따라서, 할당 가능하지 않음

#### 선택 속성이 있어도 할당 가능한 예
```ts
interface Person {
    name: string;
    age: number;
}
interface Product {
    name: string;
    age?: number;
}
```

### 추가 속성과 유니온 타입이 타입 호환성에 미치는 영향
> 추가 속성이 있으면 값의 집합은 작아지며, 유니온 타입이 있으면 값의 집합은 커짐

```ts
interface Person {
    name: string;
    age: number;
    gender: string;
}
interface Product {
    name: string;
    age: number | string;
}
```

- 추가 속성이 있으면 값의 집합은 더 작아지므로 `Person`을 `Product`에 할당하는 데 문제가 되지 않음
- 속성의 타입의 범위가 넓어지면 값의 집합은 더 커짐
