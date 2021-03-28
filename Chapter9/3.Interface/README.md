# 9.3 인터페이스
> 정의할 수 있는 타입의 종류와 인터페이스로 타입을 정의하는 방법

## 9.3.1 인터페이스로 객체 타입 정의하기
#### 인터페이스의 간단한 예
```ts
interface Person {
    name: string;
    age: number;
}
const p1: Person = { name: 'mike', age: 23 };
const p2: Person = { name: 'mike', age: 'ten' }; // Type Error
```

### 선택 속성
#### 인터페이스에서 선택 속성 정의하기
```ts
interface Person {
    name: string;
    age?: number;
}
const p1: Person = { name: 'mike' };
```

#### `undefined`가 유니온 타입에 포함된 경우
```ts
interface Person {
    name: string;
    age: number | undefinedl
}
const p1: Person = { name: 'mike' }; // Type Error
const p2: Person = { name: 'mike', age: undefined };
```

### 읽기 전용 속성(readonly)
```ts
interface Person {
    readonly name: string;
    age?: number;
}
const p1: Person = {
    name: 'mike',
};
p1.name = 'jone'; // Comfile Error
```

### 정의되지 않은 속성값에 대한 처리
> 보통은 객체가 인터페이스에 정의되지 않은 속성값을 가지고 있어도 할당 가능
```ts
interface Person {
    readonly name: string;
    age?: number;
}
const p1: Person = {
    name: 'mike',
    birthday: '1997-01-01', // Type Error
};
const p2: Person = {
    name: 'mike',
    birthday: '1997-01-01',
};
const p3: Person = p2;
```

## 9.3.2 인터페이스로 정의하는 인덱스 타입
#### 인덱스 타입의 예
```ts
interface Person {
    readonly name: string;
    age: number;
    [key: string]: string | number;
}
const p1: Person = {
    name: 'mike',
    birthday: '1997-01-01',
    age: '25', // Type Error
};
```

### 여러 개의 인덱스를 정의하는 경우
> 속성 이름에 숫자를 사용하면 문자열로 변환된 후 사용됨  
> 타입스크립트에서는 숫자인 속성 이름 값이 문자열인 속성 이름의 값으로 할당 가능한지 검사

#### 속성 이름의 타입으로 숫자와 문자열을 동시에 사용한 경우
```ts
interface YearPriceMap {
    [year: number]: A;
    [year: string]: B;
}
```

- 속성 이름이 숫자인 A 타입은 문자열인 B 타입에 할당 가능해야 함

#### 여러 개의 인덱스를 정의해서 사용하기
```ts
interface YearPriceMap {
    [year: number]: number;
    [year: string]: string | number
}
const yearMap: YearPriceMap = {};
yearMap[1998] = 1000;
yearMap[1998] = 'abc'; // Type Error
yearMap['2000'] = 1234;
yearMap['2000'] = 'million';
```

## 9.3.3 그 밖에 인터페이스로 할 수 있는 것
### 인터페이스로 함수 타입 정의하기
```ts
interface GetInfoText {
    (name: string, age: number): string;
}
const getInfoText: GetInfoText = function(name, age) {
    const nameText = name.substr(0, 10);
    const ageText = name >= 35 ? 'senior' : 'junior';
    return `name: ${nameText}, age: ${ageText}`;
};
```

- 인터페이스로 함수를 정의할 때는 속성 이름 없이 정의

#### 함수 타입에 속성값 추가하기
```ts
interface GetInfoText {
    (name: string, age: number);
    totalCall: number;
}
const getInfoText: GetInfoText = function(name, age) {
    getInfoText.totalCall += 1;
    console.log(`totalCall: ${getInfoText.totalCall}`);
    // ...
};
getInfoText.totalCall = 0;
```

### 인터페이스로 클래스 구현하기

```ts
interface Person {
    name: string;
    age: number;

    isYoungThan(age: number): boolean;
}

class SomePerson implements Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    isYoungThan(age: number) {
        return this.age < age;
    }
}
```
- `implements` 키워드를 사용해 인터페이스를 클래스로 구현할 수 있음
- 하나의 속성이라도 구현하지 않으면 컴파일 에러가 발생

### 인터페이스 확장하기
```ts
interface Person {
    name: string;
    age: number;
}
interface Korean extends Person {
    isLiveInSeoul: boolean;
}
/*
interface Korean {
    name: string;
    age: number;
    isLiveInSeoul: boolean;
}
 */
```

#### 여러 개의 인터페이스 확장히기
```ts
// ...
interface Programmer {
    favoratieProgrammingLanguage: string;
}
interface Korean extends Person, Programmer {
    isLiveInSeoul: boolean;
}
```

### 인터페이스 합치기
#### 교차 타입을 이용해서 인터페이스 합치기
```ts
interface Person {
    name: string;
    age: number;
}
interface Product {
    name: string;
    price: number;
}
type PP = Person & Product;
const pp: PP = {
    name: 'a',
    age: 23,
    price: 1000,
};
```