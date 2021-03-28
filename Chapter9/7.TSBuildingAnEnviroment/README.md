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
