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
