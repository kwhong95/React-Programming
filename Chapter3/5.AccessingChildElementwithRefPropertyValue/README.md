# 3.5 `ref` 속성값으로 자식요소에 접근하기
> 돔 요소에 직접 접근하고 싶을 때

- 돔 요소에 포커스를 주고 싶을 때
- 크기나 스크롤 위치를 알고 싶은 경우 

## 3.5.1 `ref` 속성값 이해하기
#### 돔 요소에 접근하기 위해 `ref` 속성값을 사용한 예

```js
import React, { useRef, useEffect } from "react";

function TextInput() {
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div>
            <input type="text" ref={inputRef}/>
            <button>저장</button>
        </div>
    )
}
```

- `ref` 객체를 이용해서 자식 요소에 접근
- 접근하고자 하는 자식 요소의 `ref` 속성값에 `ref` 객체를 입력
- `ref` 객체의 `current` 속성을 이용하면 자식 요소에 접근
- [`useEffect`훅 내부에서 자식요소에 접근]
    + 컴포넌트 런더링 결과가 돔에 반영된 후에 호출 > 돔 요소 이미 생성된 상태
    
## 3.5.2 `ref` 속성값 활용하기

### 함수형 컴포넌트에서 `ref` 속성값 사용하기
> 함수형 컴포넌트의 `ref` 속성값을 입력할 수 없지만, 다른 이름으로 `ref` 객체를 입력받아 내부의 리액트 요소에 연결한다

#### 함수형 컴포넌트에서 `ref` 속성값을 사용한 예
```js
function TextInput({ inputRef }) {
    return (
        <div>
            <input type="text" ref={inputRef} />
            <button>저장</button>
        </div>
    );
}

function Form() {
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    return (
        <div>
            <TextInput inputRef={inputRef} />
            <button onClick={() => inputRef.current.focus()}>텍스트로 이동</button>
        </div>
    );
}
```
- 부모 컴포넌트 입장에서는 자식 요소에 `ref` 속성값을 넣는 형태

### `forwardRef` 함수로 `ref` 속성값을 직접 처리하기
#### `forwardRef` 함수를 사용하는 코드
```js
const TextInput = React.forwardRef((props, ref) => {
  <div>
    <input type="text" ref={ref} />
    <button>저장</button>
  </div>
});

function Form() {
    // ...
  return (
          <div>
            <TextInput ref={inputRef} />
            <button onClick={() => inputRef.current.focus()}>텍스트로 이동</button>
          </div>
  );
}
```

- `forwardRef` 함수를 이용하면 부모 컴포넌트에서 넘어온 `ref` 속성값을 직접 처리가 가능

### `ref` 속성값으로 함수 사용하기
> `ref` 속성값에 함수를 입력하면 자식 요소가 생성되거나 제거되는 시점에 호출
```js
function Form() {
    const [text, setText] = useState(INITIAL_TEXT);
    const [showText, setShowText] = useState(true);
    return (
            <div>
              {showText && (
                  <input 
                    type="text"
                    ref={ref => ref && setText(INITIAL_TEXT)}
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
              )}
              <button onClick={() => setShowText(!showText)}>
                보이기/가리기
              </button>
            </div>
    )
}

const INITIAL_TEXT = '안녕하세요';
```
- `ref` 속성값으로 입력한 함수는 해당 요소가 제거되거나 생성될 때마다 호출
- input 요소에 텍스를 입력해도 화면에는 `INITIAL_TEXT`만 보임
  + 컴포넌트가 렌더링될 때마다 새로운 함수를 `ref` 속성값을 넣기 때문
  
#### `ref` 속성값으로 고정된 함수 입력하기

```js
import React, { useState, useCallback } from "react";

function Form() {
    const [text, setText] = useState(INITIAL_TEXT);
    const [showText, setShowText] = useState(true);
    
    const setInitialText = useCallback(ref => ref && setText(INITIAL_TEXT),
            []);
            
    return (
            <div>
              {showText && (
                  <input 
                    type="text"
                    ref={setInitialText}
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  // ...
              )}
            </div>
    )
}
```

- `useCallback` 훅을 이용해서 `setInitialText` 함수를 변하지 않도록 설계
- `useCallback` 훅의 메모이제이션 기능 덕분에 한 번 생성된 함수를 계속 재사용 가능
- `ref` 속성값으로 함수를 사용하면 돔 요소의 생성과 제거 시점을 알 수 있음
