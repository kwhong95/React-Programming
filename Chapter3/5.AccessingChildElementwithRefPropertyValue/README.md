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
    
