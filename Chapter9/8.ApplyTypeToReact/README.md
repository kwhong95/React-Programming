# 9.8 리액트에 타입 적용하기
## 9.8.1 리액트 컴포넌트에서 타입 정의하기

#### 이벤트 객체와 이벤트 처리 함수의 타입
```tsx
import React from 'react';
type EventObject<T = HTMLElement> = React.SyntheticEvent<T>; // 1
type EventFunc<T = HTMLElement> = (e: EventObject<T>) => void; // 2
```

1) 리액트에서 발생하는 대부분의 이벤트 객체는 `EventObject` 타입으로 정의 가능하며, 특정 이벤트에 특화된 타입을 원한다면 제네릭 `T`에 원하는 타입을 입력함
2) 대부분의 이벤트 처리 함수를 `EventFunc` 로 정의 가능하며, 마찬가지로 제네릭 `T`에 입력 가능(이벤트 처리 함수를 속성값으로 전달할 때 유용하게 사용)

### 함수형 컴포넌트의 타입 정의하기
```tsx
import React from 'react';

interface Props { // 1
    name: string;
    age?: number;
}

export default function MyComponent({ name, age = 23 }: Props) { // 2 
    return (
        <div>
            <p>{name}</p>
            <p>{age.substr(0)}</p> {/* 타입 에러 3 */ } 
        </div>
    )
}

const _MyComponent: React.FunctionComponent<Props> = function ({ name, age = 23 }) {
    return (
        <div>
            <p>{name}</p>
            <p>{age.substr(0)}</p> {/* 타입 에러 3 */ }
        </div>
    )
}
```

1) 속성값의 타입을 정의 > 속성값의 타입 정보는 문서의 역할을 하므로 파일의 최상단에 정의하는 것이 좋음
2) `Props` 타입을 이용해서 속성값의 타입을 입력, 컴포넌트 속성값의 기본값은 자바스크립트 표준 문법 사용
3) 타입스크립트는 `age`가 숫자라는 것을 알기 떄문에 `substr` 메서드 호출 시 타입 에러가 발생
- `MyComponent` 컴포넌트를 사용하는 곳에서는 `name` 속성을 반드시 입력해야 하며, `age` 는 입력하지 않아도 됨

### 클래스형 컴포넌트의 타입 정의하기
> SKIP!!

## 9.8.2 리덕스에서 타입 정의하기
> SKIP!!