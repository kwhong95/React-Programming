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

## 9.4.3 함수의 타입 호환성
> 함수는 호출하는 시점에 문제가 없어야 할당 가능

- 함수 타입 A가 B로 할당 가능하기 위한 조건
    + A의 매개변수 개수가 B의 매개변수 개수보다 적어야 함
    + 같은 위치의 매개변수에 대해 B의 매개변수가 A의 매개변수로 할당 가능해야 함
    + A의 반환값은 B의 반환값으로 할당 가능해야 함
    
```ts
type F1 = (a: number, b: string) => number;
type F2 = (a: number) => number;
type F3 = (a: number) => number | string;
let f1: F1 = (a, b) => 1;
let f2: F2 = a => 1;
let f3: F3 = a => 1;
f1 = f2;
f2 = f1; // Type Error 1
f2 = f3; // Type Error 2 
```

- TE1 : `F2` 보다 `F1`의 매개변수 개수가 더 많으므로 `F1`은 `F2`로 할당 가능하지 않음
- TE2 : `F3`의 반환 타입은 `F1`의 반환 타입으로 할당 가능하지 않으므로 `F3` 는 `F2`로 할당 가능하지 않음

### 배열의 `map` 메서드를 통해 살펴보는 함수의 타입 호환성
```ts
function addOne(value: number) {
    return value + 1;
}
const result = [1, 2, 3].map<number>(addOne);
// (value: number, index: number, array: number[]) => number
```

- `addOne` 함수는 `map` 메서드의 매개변수로 할당 가능
    + `map` 메서드의 제네릭으로 입력한 `number`는 매개변수 함수의 반환 타입을 의미
- 주석은 `map`메서드가 입력받는 함수의 타입을 의미, `addOne` 함수는 이 타입에 할당 가능
- 함수 타입 할당 조건을 `map` 메서드 입장에서 생각해 보기
    + `map` 메서드는 세 개의 매개변수를 넘겨주는데, 네 개의 매개변수를 사용하는 함수가 할당되면 문제가 됨(네 번째 매개변수가 전달되지 않기 때문)
    + 만약 `addOne` 함수의 매개변수 타입이 `1 | 2 | 3`이면 문제가 됨(`map` 메서드는 다른 숫자도 전달 가능하기 때문)
    + 만약 `addOne` 함수의 반환 타입이 `number | string` 이라면 문제가 됨(위 코드의 `map` 메서드는 숫자 배열을 반환해야 하기 때문)
    
