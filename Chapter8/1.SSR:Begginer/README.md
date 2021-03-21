# 8.1 서버사이드 렌더링 초급편
### 필요한 기본 기능들
- 리액트에서 제공하는 `renderToString`, `hydrate` 함수를 사용해 본다.
- 서버에서 생생된 데이터를 클라이언트로 전달하는 방법을 알아본다.
- `styled-components`로 작성된 스타일이 서버사이드 렌더링 시 어떻게 처리되는지 알아본다.
- 서버용 번들 파일을 만드는 방법을 알아본다.

### 바벨 실행을 위한 패키지
```
npm install @babel/core @babel/preset-env @babel/presetp-react
```

### 웹팩 실행을 위한 패키지
```
npm install webpack webpack-cli babel-loader clean-webpack-plugin html-webpack-plugin
```

## 8.1.1 클라이언트에서만 렌더링 해보기
> SSR 을 구현하기 위한 사전 작업으로 클라이언트에서만 렌더링하는 웹사이트 제작  
> 자세한 코드는 `test-ssr` 폴더 참조

