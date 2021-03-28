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


