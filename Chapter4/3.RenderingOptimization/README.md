# 4.3 렌더링 속도를 올리기 위한 성능 최적화 방법
> 리액트 실행 시 가장 많은 CPU 리소스를 사용하는 것은 **렌더링** 이다.

**리액트는 UI 라이브러리**
>  화면을 그리고 또 그린다
- 데이터(속성값 & 상태값)와 컴포넌트 함수로 화면을 그림
- 대부분 연산은 컴포넌트 함수의 실행과 가상 돔에서 발생

**최초 렌더링 이후 또는 데이터 변경시 렌더링 단계**
1) 이전 렌더링 결과를 재사용할지 판단 (`React.memo`)
2) 컴포넌트 함수를 호출
3) 가상 돔끼리 비교해서 변경된 부분만 실제 돔의 반영

> 평상시 개발 시 최적화 고민없이 코딩 후 성능 이슈 발생 시 고민하자!

## 4.3.1 `React.memo` 로 렌더링 결과 재사용하기
> 속성값 비교 함수가 호출

#### `React.memo` 함수 사용의 예
```js
function MyComponent(props) {
    // ...
}
function isEqual(prevProps, nextProps) {
    // true 또는 false를 반환
}
React.memo(MyComponent, isEqual);
```

- 두 번째 매개변수로 **속성값 비교 함수**를 입력
    + 속성값 비교 함수에서 참을 반환하면 이후 단계를 생략하고 이전 렌더링 결과를 재사용
    + 비교 함수 미입력시 얕은(shallow) 비교를 수행
    
#### 특정 속성값의 변경 전과 변경 후
```js
const prevProps = {
    todos: [
        { title: 'fix bug', priority: 'high' },
        { title: 'meeting with jone', priority: 'low' },
        // ...
    ],
    // ...
};
const nextProps = {
    todos: [
        { title: 'fix bug', priority: 'high' },
        { title: 'metting with jone', priority: 'high' },
        // ...
    ],
    // ...
};
```

- 두 번째 객체의 `priority` 속성값이 변경
- `todos`를 수정 가능한 객체로 관리하면 변경 여부 판단 시 단순무식(brute force) 비교하는 수 밖에 없음

#### 속성값을 불변 객체로 관리했을 때 변경 여부 확인하기
```js
prevProps.todos !== nextProps.todos
```
- 속성값을 **불변 객체**로 관리했다면 단순 비교만으로 변경을 판단할 수 있어 렌더링 성능에 큰 도움이 됨


---

### 리액트에서 속성값의 변경 여부를 계산하는 알고리즘
> `React.memo`로 속성값 비교 함수를 입력하지 않은 기본 제공 함수

#### 불변 객체로 관리 시 최상위 객체의 참조값만 비교하면 값의 변경 유무 파악 가능
```js
prevObj === nextObj
```

#### 리액트 속성값의 변경 여부를 판단하기 위해 속성값에 직접 연결된 모든 속성을 비교
```js
prevProps.prop1 === nextProps.prop1 &&
    prevProps.prop2 === nextProps.prop2 // && ... 
```

#### JSX 문법이 `createElement`로 변환된 코드
```js
function Parent() {
    return <Child name="mike" age={23} />;
}
function Child() {
    return React.createElement(Child, { name: 'mike', age: 23 });
}
```
- `creatElement` 변환 코드를 보면 렌더링할 때마다 새로운 속성값 객체가 생성
- 객체 내부 속성값이 변경되지 않아도 최상위 객체의 참조값은 항상 변경됨

## 4.3.2 속성값과 상태값을 불변 변수로 관리하는 방법
### 함수의 값이 변하지 않도록 관리하기
> 컴포넌트 함수 내부에서 함수를 정의해서 자식 컴포넌트의 속성값으로 입력하면, 함수 내용이 변경되지 않아도 자식 컴포넌트 입장에서는 속성값이 변경됐다고 인식한다.

#### 렌더링을 할 때마다 새로운 함수를 만들어서 자식 컴포넌트의 속성값으로 전달
```js
function Parent() {
    const [selectedFruit, setSelectedFruit] = useState('apple');
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>{`count: ${count}`}</p>
            <button onClick={() => setCount(count + 1)}>increase count</button>
            <SelectedFruit 
                selected={selectedFruit}
                onChange={fruit => setSelectedFruit(fruit)}
            />
        </div>
    )
}
```

- 버튼 클릭 시 `count` 상태값을 변경되고 SelectFruit 컴포넌트 함수도 호출됨(`React.memo`를 사용 해도)
- SelectFruit 컴포넌트로 전달되는 `onChange` 속성값이 변하기 때문이고 이 속성값은 부모 컴포넌트가 렌더링될 때마다 새로운 함수로 만들어짐

#### `useState`의 상태값 변경 함수를 입력해서 속성값을 고정
```js
function Parent() {
    const [selectedFruit, setSelectedFruit] = useState('apple');
    // ...
        <SelctedFruit 
            selected={selectedFruit}
            onChange={setSelectedFruit}
        />
    // ...    
}
```
- `useState`의 상태값 변경 함수는 변하지 않으므로 `onChange` 속성값에는 항상 같은 값이 입력됨

#### `useCallback`을 이용해서 속성값을 고정
```js
function Parent() {
    // ...
    const onChangeFruit = useCallback(fruit => {
        setSelectedFruit(fruit);
        sendLog({ type: 'fruit Change', value: fruit });
    }, []);
    // ...
        <SelcetedFruit 
            selected={selectedFruit}
            onChange={onChangeFruit}
        />
}
```

- `useCallback` 훅을 이용해 이벤트 처리 함수 구현
- 의존성 배열로 빈 배열 입력 : 함수는 항상 고정된 값을 가짐
- 훅이 반환한 함수를 속성값으로 입력서

---

### 객체의 값이 변하지 않도록 관리하기
> 컴포넌트 내부에서 객체를 정의해 자식 컴포넌트의 속성값으로 입력하면 내용이 변경되지 않아도 변경되었다고 인식

#### 렌더링을 할 때마다 새로운 객체를 만들어서 자식 컴포넌트의 속성값으로 전달
```js
function SelectedFruit({ selcetedFruit, onChange }) {
    // ...
    return (
        <div>
            <Select 
                options={[
                    { name: 'apple', price: 500 },
                    { name: 'banana', price: 1000 },
                    { name: 'orange', price: 1500 },
                ]}
                selected={selcetedFruit}
                onChange={onChange}
            />
            {/* ...  */} 
        </div>
    );
}
```

- SelectedFruit 컴포넌트가 렌더링 될 때마다 `options` 속성값으로 새로운 객체가 입력됨

#### 변하지 않는 값은 상수 변수로 관리하기
```js
function SelectedFruit({ selectedFruit, onChange }) {
    // ...
    return (
        <div>
            <Select options={} selected={selectedFruit}
                    onChange={onChange} />
            {/* ... */}
        </div>
    );
}

const FRUITS = [
    { name: 'apple', price: 500 },
    { name: 'banana', price: 1000 },
    { name: 'orange', price: 1500 },
]
```

- `options` 속성값은 컴포넌트 렌더링과 무관하게 항상 같은 값을 가짐

#### 상태값을 이용해서 속성값을 계산
```js
function SelectedFruit({ selectedFruit, onChange }) {
    const [maxPrice, setMaxPrice] = useState(1000);
    // ...
    return (
        <div>
            <Select 
                options={FRUITS.filter(item => item.price <= maxPrice)}
                selected={selectedFruit}
                onChange={onChange}
            />
            {/* ... */}
        </div>
    )
}
```

#### `useMemo`훅을 이용해서 속성값을 계산
```js
function SelectedFruit({ selectedFruit, onChange }) {
    // ...
    const fruits = useMemo(() => FRUITS.filter(item => item.price <= maxPrice), [
        maxPrice
    ]);
    return (
        <div>
            <Select options={fruits} selected={selectedFruit} onChange={onChange} />
            {/* ... */}
        </div>
    );
}
```

- `mzxPrice`값이 같으면 `fruits` 값은 변하지 않음
    + `useMemo` 훅은 꼭 필요할 때만 반환되는 값이 변경되도록 함
    + 입력된 함수를 최소한으로 실행
    
---
    
### 상태값을 불변 객체로 관리하기
#### 상태값을 변경하면서 객체를 서로 생성하지 않는 경우
```js
function SelectedFruit({ selctedFruit, onChange }) {
    const [fruits, setFruits] = useState(['apple', 'banana', 'orange']);
    const [newFruit, setNewFruit] = useState('');
    function addNewFruit() {
        fruits.push(newFruit);
        setNewFruit('');
    }
    // ...
    return (
        <div>
            <Select options={fruits} selected={selctedFruit}
                    onChange={onChange} />
            <input
                type='text'
                value={newFruit}
                onChange={e => setNewFruit(e.target.value)}
            />        
            <button onClick=={addNewFruit}>추가하기</button>
            {/* ... */}
        </div>
    )
}
```

- 새로운 과일 목록 추가 시 `fruits` 상태값의 내용은 변경되나 `fruits` 변수가 가리키는 배열의 참조값은 변하지 않음
- `newFruit` 상태값을 초기화하면서 `selectedFruit` 컴포넌트는 다시 렌더링
- Selected 컴포넌트 입장에서는 속성값이 변하지 않음
    + `React.memo` 이용 시 새로 추가된 과일은 반영되지 않음
    
#### 상태값을 불변 객체로 관리하기
```js
function addNewFruit() {
    setFruit([...fruit, newFruit]);
    setNewFruit('');
}
```