# 9.5 타입스크립트 고급 기능
## 9.5.1 제네릭
> 타입 정보가 동적으로 결정되는 타입 - 같은 규칙을 여러 타입에 적용 가능 > 타입 코드를 작성할 때 발생할 수 있는 중복 코드 제거

#### 리펙터링이 필요한 코드
```ts
function makeNumberArray(defaultValue: number, size: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < size; i ++) {
        arr.push(defaultValue);
    }
    return arr;
}
function makeStringArray(defaultValue: string, size: number): string[] {
    const arr: string[] = [];
    for (let i = 0; i < size; i++) {
        arr.push(defaultValue);
    }
    return arr;
}
const arr1 = makeNumberArray(1, 10);
const arr2 = makeStringArray('empty', 10);
```

- 딱봐도 중복된 코드가 상당히 많아 보임

### 함수 오버로드로 문제 개선하기
```ts
function makeArray(defaultValue: number, size: number): number[];
function makeArray(defaultValue: string, size: number): string[];
// @ts-ignore
function makeArray(defaultValue, size) {
    const arr = [];
    // ...
}
```
- 숫자와 문자열 배열을 만들 수 있도록 함수 타입 정의
- 타입 추가할 때마다 코드도 추가, 많을 수록 가독성 저하

### 제네릭으로 문제 해결하기
```ts
function makeArray<T>(defaultValue: T, size: number): T[] {
    const arr: T[] = [];
    for (let i = 0; i < size; i ++) {
        arr.push(defaultValue);
    } 
    return arr;
}
const arr1 = makeArray<number>(1, 10);
const arr2 = makeArray<string>('empty', 10);
const arr3 = makeArray(1, 10);
const arr4 = makeArray('empty', 10);
```
- 타입 `T`는 함수를 사용하는 시점에 입력되기 때문에 어떤 타입인지 결정되지 않음
- 함수 내부에서도 타입 `T`의 정보를 이용
- 함수를 호출할 때 타입 `T`가 결정
- `makeArray` 함수의 첫 번째 매개변수를 알면 타입 `T`도 알 수 있기 때문에 호출 시 타입 `T`의 정보를 명시적으로 전달하지 않아도 됨

### 제네릭으로 스택 구현하기
> 제네릭은 데이터의 타입에 다양성을 부여해 주기 때문에 자료구조에서 많이 사용

#### 클래서에서 제네릭 사용하기
```ts
class Stack<D> {
    private items: D[] = [];
    push(item: D) {
        this.items.push(item);
    }
    pop() {
        return this.items.pop();
    }
}

const numberStack = new Stack<number>();
numberStack.push(10);
const v1 = numberStack.pop();
const stringStack = new Stack<string>();
stringStack.push('a');
const v2 = stringStack.pop();

let myStack: Stack<number>;
myStack = numberStack;
myStack - stringStack; // Type Error
```

- 타입 `D`를 아이템으로 하는 배열을 정의
- `push` 메서드는 타입이 `D`인 아이템을 입력으로 받음
- `pop` 메서드의 반환 타입은 `D`임
- 문자열 & 숫자를 저장하는 스택을 생성해서 사용
- 숫자 스택에 문자열 스택을 할당할 수 없음

### `extends` 키워드로 제네릭 타입 제한하기
> 리액트와 같은 라이브러리인 API 는 입력 가능한 값의 범위를 제한  
> 리액트의 속성값 전체는 객체 타입만 허용

```ts
function identity<T extends number | string>(p1: T): T {
    return p1;
}
identity(1);
identity('a');
identity([]); // Type Error
```

#### `extends` 키워드를 이용한 제네릭 타입의 활용 예
```ts
interface Person {
    name: string;
    age: number;
}
interface Korean extends Person {
    liveInSeoul: boolean;
}

function swapProperty<T extends Person, K extends keyof Person>(
    p1: T,
    p2: T,
    name: K,
): void {
    const temp = p1[name];
    p1[name] = p2[name];
    p2[name] = temp;
}

const p1: Korean = {
    name: '홍길동',
    age: 23,
    liveInSeoul: true,
};
const p2: Korean = {
    name: '김삿갓',
    age: 31,
    liveInSeoul: false,
};
swapProperty(p1, p2, 'age');
```

## 9.5.2 맵드 타입
> 맵드(mapped) 타입을 이용하면 몇 가지 규칙으로 새로운 인터페이스를 만들 수 있음  
> 기존 인터페이스의 모든 속성을 선택 속성 또는 읽기 전용으로 만들 때 주로 사용

#### 모든 속성을 선택 속성 또는 읽기 전용으로 변경하기
```ts
interface Person {
    name: string;
    age: number;
}
interface PersonOptional {
    name?: string;
    age?: number;
}
interface PersonReadOnly {
    readonly name: string;
    readonly age: number;
}
```

#### 두 개의 속성을 불 타입으로 만드는 맵드 타입
```ts
type T1 =  { [K in 'prop1' | 'prop2']: boolean };
// { prop1: boolean; prop2: boolean; }
```

- `in` 키워드 오른쪽에는 문자열의 유니온 타입이 올 수 있음

#### 인터페이스의 모든 속성을 불 타입 및 선택 속성으로 만들어주는 맵드 타입
```ts
type MakeBoolean<T> = { [P in keyof T]?: boolean };
const pMap: MakeBoolean<Person> = {};
pMap.name = true;
pMap.age = false;
```

### `Partial`과 `Readonly` 내장 타입
#### 맵드 타입으로 만드는 `Partial`과 `Readonly`
```ts
type T1 = Person['name']; // string 1
type Readonly<T> = { readonly [P in keyof T]: T[P] }; // 2
type Partial<T> = { [P in keyof T]?: T[P] }; // 3
type T2 = Partial<Person>;
type T3 = Readonly<Person>;
```

1) 인터페이스에서 특정 속성의 타입을 추출할 때 사용되는 문법
2) 인터페이스의 모든 속성을 읽기 전용으로 만들어 주는 맵드 타입
   - `keyof T`에 의해 인터페이스 `T`의 모든 속성 이름이 유니온 타입으로 생성
   - `T[P]`는 인터페이스 `T`에 있는 속성 `P`의 타입을 그대로 사용하겠다는 의미
3) 인터페이스의 모든 속성을 선택 속성으로 만들어주는 맵드 타입

### `Pick` 내장 타입
> 원하는 속성만 추출할 때 사용
```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] }; // 1
interface Person {
    name: string;
    age: number;
    language: string;
}
type T1 = Pick<Person, 'name' | 'language'>;
// type T1 = { name: string; language: string; } // 2 
```
1) `Pick`은 인터페이스 `T`와 해당 인터페이스의 속성 이름 `K`를 입력으로 받음
2) `Person`에서 `name`,`language`를 추출한 결과

### 열거형 타입과 맵드 타입
> 맵드 타입을 이용하면 열거형 타입의 활용도를 높일 수 있음

#### 열거형 타입의 모든 원소를 속성 이름으로 가지는 객체
```ts
enum Fruit {
    Apple,
    Banana,
    Orange,
}
const FRUIT_PRICE= {
    [Fruit.Apple]: 1000,
    [Fruit.Banana]: 1500,
    [Fruit.Orange]: 2000,
};
```
- 실수로 가격 정보를 깜빡해도 에러가 발생하지 않음

#### 맵드 타입을 이용한 `FRUIT_PRICE`타입 정의
```ts
enum Fruit {
    Apple,
    Banana,
    Orange,
}
const FRUIT_PRICE: { [key in Fruit]: number } = { // Type Error
    [Fruit.Apple]: 1000,
    [Fruit.Banana]: 1500,
}
```
- `Orange` 속성을 추가해야 에러가 사라짐

## 9.5.3 조건부 타입
> 조건부(conditional) 타입은 입력된 제네릭 타입에 따라 타입을 결정할 수 있는 기능

#### 기본적인 조건부 타입의 예
```ts
// T extends U ? X : Y
type IsStringType = T extends string ? 'yes' : 'no';
type T1 = IsStringType<string>; // 'yes'
type T2 = IsStringType<number>; // 'no'
```

#### `IsStringType` 타입에 유니온 타입을 입력한 결과
```ts
type T1 = IsStringType<string | number>; // 'yes' | 'no' 1
type T2 = IsStringType<string> | IsStringType<number>; // 2
```

1) 조건부 타입에 유니온 타입이 입력되면 각 타입을 하나씩 검사해서 타입을 결정하고 최종 결과는 유니온 타입으로 만들어짐
2) `T1` 과 `T2`는 결과적으로 같은 타입

### `Exclude`, `Extract` 내장 타입
```ts
type T1 = number | string | never; // string | number 1️⃣
type Exclude<T, U> = T extends U ? never : T; // 2️⃣
type T2 = Exclude<1 | 3 | 5 | 7, 1 | 5 | 9>; // 3, 7 3️⃣
type T3 = Exclude<string | number | (() => void ), Function>; // string | number 4️⃣
type Extract<T, U> = T extends U ? T : never; // 5️⃣
type T4 = Extract<1 | 3 | 5 | 7, 1 | 5 | 9>; // 1 | 5 6️⃣

```

1️⃣ 유니온 타입에 있는 `never`타입은 제거, 이는 조건부 타입에서 자주 사용되는 기능  
2️⃣ `Exclude`타입은 `U`의 서브 타입을 제거해주는 유틸리티 타입  
3️⃣ 3와 7은 `1 | 5 | 9`타입의 서브 타입이 아니므로 `T2` 타입은 `3 | 7` 이 됨  
4️⃣ `T3`은 함수가 제거된 `string | number` 타입  
5️⃣ `Extract`는 `Exclude`와 반대로 동작하는 유틸리티 타입  
6️⃣ 1과 5는 `1 | 5 | 9` 타입에 포함되기 때문에 `T4`는 `1 | 5`가 됨

### `ReturnType` 내장 타입
> 조건부 타입으로 만들어진 `ReturnType` 내장 타입은 함수의 반환 타입을 추출함
```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
type T1 = ReturnType<() => string>; // string
function f1(s: string): number {
    return  s.length;
}
type R2 = ReturnType<typeof f1>; // number
```

- 입력된 타입 `T`가 함수이면 함수의 반환 타입이 사용되고, 그렇지 않으면 `any`타입이 사용됨
- 타입 추론을 위해 `infer` 키워드를 사용 - 함수의 반환 타입을 `R`이라는 변수에 담음(`extends`키워드 뒤에 사용)

#### `infer` 키워드를 중첩해서 사용하는 예
```ts
type Unpacked<T> = T extends (infer U)[] // 1
? U
: T extends (...args: any[]) => infer U // 2
    ? U 
    : T extends Promise<infer U> ? U : T; // 3
type T0 = Unpacked<string>; // string 4 
type T1 = Unpacked<string[]>; // string
type T2 = Unpacked<() => string>; // string
type T3 = Unpacked<Promise<string>>; // string
type T4 = Unpacked<Promise<string>[]>; // Promise<string> 5
type T5 = Unpacked<Unpacked<Promise<string>[]>> // string
```
1) 타입 `T`가 `U`의 배열이면 `U`가 사용
2) 함수면 반환 타입이 사용됨
3) 프로미스면 프로미스에 입력된 제네릭 타입이 사용됨
4) 아무것도 만족하지 않으면 자기 자신이 됨
5) `Promise<string>`의 배열이므로 `Promise<string>`이 됨

### 조건부 타입으로 직접 만들어 보는 유틸리티 타입
#### 인터페이스에서 문자열 속성만 추출해서 사용하는 유틸리티 타입
```ts
type StringPropertyNames<T> = {
    [K in keyof T]: T[K] extends String ? K : never
}[keyof T];
type StringProperties<T> = Pick<T, StringPropertyNames<T>>;
interface Person {
    name: string;
    age: number;
    nation: string;
}
type T1 = StringPropertyNames<Person>; // "name" | "nation"
type T2 = StringProperties<Person>; // { name: string; nation: string; }
```
- 타입 T에서 값이 문자열인 모든 속성의 이름을 유니온 타입으로 만들어주는 유틸리티 타입
- `[keyof T]`는 인터페이스에서 모든 속성의 타입을 유니온으로 추출(`never`는 제거)
- `StringProperties`는 인터페이스에서 문자열인 모든 속성을 추출하는 유틸리티 타입

#### 일부 속성만 제거해 주는 유틸리티 타입
```ts
type Omit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;
interface Person {
    name: string;
    age: number;
    nation: string;
}
type T1 = Omit<Person, 'nation' | 'age'>;
const p: T1 = {
    name: 'mike',
};
```

- 인터페이스 `T`에서 입력된 속성 이름 `U`를 제거

#### 인터페이스를 덮어쓰는 유틸리티 타입
```ts
type Overwrite<T, U> = { [P in Exclude<keyof T, keyof U>]: T[P] } & U;
interface Person {
    name: string;
    age: number;
}
type T1 = Overwrite<Person, { age: string, nation: string }>;
const p: T1 = {
    name: 'mike',
    age: 23,
    nation: 'korea'
};
```