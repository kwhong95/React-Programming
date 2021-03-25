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

## 9.2.2 열거형 타입
> `enum` 키워드를 사용해 정의 각 원소는 값으로 사용될 수 있고, 타입으로 사용 가능

```ts
enum Fruit {
    Apple,
    Banana,
    Orange,
}
const v1: Fruit = Fruit.Apple;
const v2: Fruit.Apple | Fruit.Banana = Fruit.Banana;
```

#### 명시적으로 원소의 값 입력하기
```ts
enum Fruit {
    Apple,
    Banana = 5,
    Orange,
}
console.log(Fruit.Apple, Fruit.Banana, Fruit.Orange) // 0, 5, 6
```

- 열거형 타입의 첫 번째 원소의 값을 할당하지 않으면 자동으로 0이 할당
- 열거형 타입의 각 원소에 숫자 또는 문자열을 할당 가능
    + 명시적으로 값을 입력하지 않으면 이전 원소에서 1만큼 증가한 값 할당
- 다른 타입과 달리 열거형 타입은 컴파일 후에도 관련된 코드가 남음
  
#### 열거형 타입이 컴파일된 결과
```ts
var Fruit;
(function(Fruit) {
    Fruit[(Fruit['Apple'] = 0)] = 'Apple';
    Fruit[(Fruit['Banana'] = 5)] = 'Banana';
    Fruit[(Fruit['Orange'] = 6)] = 'Orange';
})(Fruit || (Fruit = {}));
console.log(Fruit.Apple, Fruit.Banana, Fruit.Orange); // 0, 5, 6
```

- 열거형 타입은 객체로 존재
- 열거형 타입의 각 원소는 이름과 같이 양방향으로 매핑(mapping)됨
- 열거형 타입은 객체로 존재하기 때문에 해당 객체를 런타임에 사용할 수 있음

#### 열거형 타입의 객체 사용하기
```ts
enum Fruit {
    Apple,
    Banana = 5,
    Orange,
}
console.log(Fruit.Banana); // 5
console.log(Fruit['Banana']); // 5
console.log(Fruit[5]); // Banana
```

- 각 원소의 이름과 값이 양방향으로 매핑되어, 값을 이용해 이름을 가져오기가 가능

### 열거형 타입의 값으로 문자열 할당하기
```ts
enum Language {
    Korean = 'ko',
    English = 'en',
    Japanese = 'jp',
}
```

#### 열거형 타입에 문자열을 할당했을 때 컴파일된 결과
```ts
var Language;
(function(Language) {
    Language['Korean'] = 'ko';
    Language['English'] = 'en';
    Language['Japanese'] = 'jp';
})(Language || (Language = {}));
```

- 열거형 타입의 원소에 문자열을 할당하는 경우에는 단방향 매핑됨
- 서로 다른 원소의 이름 또는 값이 같을 경우 충돌이 발생하기 때문

### 열거형 타입을 위한 유틸리티 함수
> 열거형 타입을 자주 사용한다면 몇 가지 유틸리티 함수를 만들어 사용하는 게 좋음
```ts
function getEnumLength(enumObject: any) {
    const keys = Object.keys(enumObject);
    // enum의 값이 숫자이면 두 개씩 들어가므로 문자열만 계산
    return keys.reduce(
        (acc, key) => (typeof enumObject[key] === 'string' ? acc + 1 : acc),
        0,
    );
}
```

- 원소가 숫자인 경우에는 양방향으로 매핑되어 주의해야 함
    - 객체의 속성값이 문자열인 경우만 계산하면 열거형 타입에서 원소의 개수 구하기 가능
    
#### 열거형 타입에 존재하는 값인지 검사하는 함수
```ts
function isValidEnumValue(enumObject: any, value: number | string) {
    if (typeof value === 'number') {
        return !!enumObject[value];
    } else {
        return (
            Object.keys(enumObject)
                .filter(key => isNaN(Number(key)))
                .some(key => enumObject[key] === value)
        );
    }
}
```

- 값이 숫자이면 양방향 매핑됐는지 검사
- 값이 문자열이면 양방향 매핑에 의해 생성된 키를 제거, 해당 값이 존재하는지 검사

#### `getEnumLength` 함수와 `isValidEnumValue` 함수의 사용 예
```ts
enum Fruit {
    Apple,
    Banana,
    Orange,
}
enum Language {
    Korean = 'ko',
    English = 'en',
    Japanese = 'jp',
}

console.log(getEnumLength(Fruit), getEnumLength(Language)); // 3 3
console.log('1 in Fruit: ', isValidEnumValue(Fruit, 1)); // true
console.log('5 in Fruit: ', isValidEnumValue(Fruit, 5)); // false
console.log('ko in Language: ', isValidEnumValue(Language, 'ko')); // false
console.log('Korean in Language: ', isValidEnumValue(Language, 'Korean')); // false
```

- `isValidEnumValue` 함수는 서버로부터 받은 데이터를 검증할 때 유용하게 사용 가능

### 샹수 열거형 타입
- 열거형 타입은 컴파일 후에도 남아 있기 때문에 번들 파일의 크기가 불필요하게 커질 수 있음
- 열거형 타입의 객체에 접근하지 않는다면 굳이 컴파일 후에 객체로 남겨 놓을 필요는 없음
- 상수(const) 열거형 타입을 사용 시 컴파일 결과에 객체를 남겨 놓지 않을 수 있음

```ts
const enum Fruit {
    Apple,
    Banana,
    Orange,
}
const fruit: Fruit = Fruit.Apple;

const enum Language {
    Korean = 'ko',
    English = 'en',
    Japanense = 'jp',
}
const lang: Language = Language.Korean;
```

#### 상수 열거형 타입이 컴파일된 결과
```ts
const fruit = 0;
const lang = 'ko';
```

- 열거형 타입의 객체를 생성하는 코드가 보이지 않음
- 열거형 타입이 사용된 코드는 원소의 값으로 대체되므로 코드가 상당히 간소화됨
- 모든 경우에 쓸수 있는건 아님, 열거형 타입을 상수로 정의하면 열거형 타입의 객체를 사용할 수 없음

#### 상수 열거형 타입의 객체는 사용할 수 없다
```ts
const enum Fruit {
    Apple,
    Banana,
    Orange,
}
console.log(getEnumLength(Fruit)); // Type Error
```

