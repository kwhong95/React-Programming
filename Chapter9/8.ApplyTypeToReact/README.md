# 9.8 리액트에 타입 적용하기
## 9.8.1 리액트 컴포넌트에서 타입 정의하기

#### 이벤트 객체와 이벤트 처리 함수의 타입
```tsx
import React from 'react';
type EventObject<T = HTMLElement> = React.SyntheticEvent<T>; // 1
type EventFunc<T = HTMLElement> = (e: EventObject<T>) => void; // 2
```

