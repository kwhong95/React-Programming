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

## 9.6.2 타입 가드
> 조건문을 이용해 타입의 범위를 좁히는 기능 - 불필요한 타입 단언(assertion) 코드 회피

#### 타입 가드를 활용하지 않은 코드
```ts
function print(value: number | string) {
    if (typeof value === 'number') {
        console.log((value as number).toFixed(2));
    } else {
        console.log((value as string).trim());
    }
}
```

- 타입 가드가 없다면 `as` 키워드로 타입을 알려줘야 함

### `typeof` 키워드
```ts
function print(value: number | string) {
    if (typeof value === "number") {
        console.log(value.toFixed(2));
    } else {
        console.log(value.trim());
    }
}
```
- 타입스크립트는 `typeof` 키워드를 이용해 타입을 인식, 해당 메서드 호출 가능

### `instanceof` 키워드

```ts
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Product {
    name: string;
    price: number;
    constructor(name: string, price: number) {
        this.name = name;
        this.age = age;
    }
}
function print(value: Person | Product) {
    console.log(value.name);
    if (value instanceof Person) {
        console.log(value.age); // 1
    } else {
        console.log(value.price); // 2
    }
}
const person = new Person('mike', 23);
print(person);
```
 
1) 타입 가드 덕분에 `if` 문 안에서 `Person`의 `age` 속성에 접근 가능
2) 타입스크립트는 `else` 블록에서 `value`의 타입이 `Product`로 인식

- 인터페이스의 경우 `instanceof` 키워드를 사용할 수 없음(생성자 함수만 올 수 있기 때문)

#### `instanceof`키워드를 잘못 사용한 예
```ts
interface Person {
    name: string;
    age: number;
}
interface Product {
    name: string;
    price: number;
}
function print(value: Person | Product) {
    if (value instanceof  Person) { 
        consol.log(value.age);
    } else {
        console.log(value.price);
    }
}
```
- 인터페이스는 타입 검사에만 사용되는데, 컴파일 후에는 삭제가 되므로 사용할 수 없음

### 식별 가능한 유니온 타입
> 인터페이스를 구별하기 위한 한 가지 방법은 식별 가능한 유니온(discrimination union) 타입을 이용하는 것
```ts
interface Person {
    type: 'person',
    name: string;
    age: number;
}
interface Product {
    type: 'product',
    name: string;
    price: number;
}
function printj(value: Person | Product) {
    if (value.type === 'person') {
        console.log(value.age);
    } else {
        console.log(value.price);
    }
}
```
- 두 인터페이스에 `type` 이라는 같은 이름의 속성을 정의하고, 이를 통해 타입 가드를 이용함

#### `switch`문에서 식별 가능한 유니온 타입 사용하기
```ts
function print(value: Person | Product) {
    switch (value.type) {
        case 'person':
            console.log(value.age);
            break;
        case 'product':
            console.log(value.price);
            break;
    }
}
```

### 타입을 검사하는 함수
#### 함수를 이용한 타입 가드
```ts
function isPerson(x: any): x is Person {
    return (x as Person).age !== undefined;
}
function print(value: Person | Product) {
    if (isPerson(value)) {
        console.log(value.age);
    } else {
        console.log(value.price);
    }
}
```

- 입력된 인수가 `Person` 타입 인지 검사하는 함수

### `in` 키워드
```ts
function print(value: Person | Product) {
    if('age' in value ) {
        console.log(value.age);
    } else {
        console.log(value.price);
    }
}
```
- 속성 이름의 존재를 검사하는 것으로 타입 가드 동작