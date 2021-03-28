# 9.7 타입스크립트 환경 구축하기
## 9.7.1 `create-react-app`과 넥스트에서 타입스크립트 사용하기
### `create-react-app`에서 타입스크립트 사용하기

```shell
npx create-react-app my-cra --template typescript
```

### 넥스트에서 타입스크립트 사용하기
> 넥스트는 프레임워크 코드를 타입스크립트로 작성했을 정도로 타입스크립트에 친화적

```shell
touch tsconfig.json
```

```shell
npx next
```

## 9.7.2 프레임워크를 사용하지 않고 타입스크립트 환경 구축하기

```shell
mkdir ts-config
cd ts-config
npm i typescript react react-dom
npm i @types/react @types/react-dom
npx tsc --init
```

### `tsconfig.json` 파일에 설정하기
```json
{
  // ...
  "jsx": "react",
  "outDir": "./dist",
  // ...
}
```

### 타입스크립트로 간단한 리액트 코드 작성하기
> 소스코드는 `ts-custom` 폴더 참조
<<<<<<< HEAD

## 9.7.3 기타 환경 설정하기
### 자바스크립트와 타입스크립트 같이 사용하기
> 상세 코드는 마찬가지로 `ts-custom` 참조  
> `tsconfig.json` 파일의 `"allowJS": true` 옵션을 제공

### 외부 패키지 사용하기
```shell
npm i lodash @types/lodash
```

```ts
// ...
import _ from 'lodash';

_.
    
// ...
```

### 자바스크립트가 아닌 모듈과 `window` 객체의 타입 정의하기
#### 이미지 모듈과 `window` 객체를 사용하는 코드
```tsx
// ...
import Icon from './icon.png';
window.myValue = 123;

export default function ({ name, age }: { name: string; age: number }) {
    // ...
    return (
        <div>
            <img src={Icon} />
            // ...
        </div>
    );
}
```

- 확장자가 `png` 인 파일을 가져오려고 하면 컴파일 에러 발생 > 타입스크립트는 `png` 모듈의 타입을 모름
- 종종 `window` 객체에 우리가 원하는 속성을 추가하고 싶은 경우가 있음 > 속성이 없다며 에러 발생

#### `window` 객체에 속성을 추가하고 이미지 모듈의 타입 정의하기
```ts
interface Window {
    myValue: number;
}

declare module '*.png' {
    const content: string;
    export default content;
}
```
- `window` 객체에 `myValue` 속성 추가
- 타입스크립트에 `png` 확장자를 가지는 모듈의 타입이 문자열이라고 알려줌

### 자바스크립트 최신 문법 사용하기
```ts
// ...
console.log('123'.padStart(5, '0'));
```
- 메서드가 존재하지 않아 컴파일 에러 발생

#### 최신 문법 사용을 위해 옵션 추가하기
```json
{
  "compilerOptions": {
    "lib": ["dom", "es5", "scripthost", "es2017"],
  }
}
```
