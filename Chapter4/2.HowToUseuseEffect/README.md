# 4.2 `useEffect` 훅 실전 활용법

## 4.2.1 의존성 배열을 관리하는 방법
> `useEffect`훅에 입력하는 두 번째 매개변수, 해당 내용이 변경되었을 때 부수 효과 함수가 실행

### 부수 효과 함수에서 API 를 호출하는 경우
> 불필요한 API 호출이 발생하지 않도록 주의

```js
function Profile({ userId }) {
    const [user, setUser] = useState();
    useEffect(() => {
        fetchUser(userId).then(data => setUser(data));
    });
    // ...
}
```
- `fetchUser` 함수는 렌더링을 할 때마다 호출되므로 *비효율적*
- 의존성 배열에 빈배열 삽입 > `userId`가 변경되도 새로운 사용자의 정보를 가져오지 못함 > 올바른 해결책 X

#### 의존성 배열로 API 호출 횟수를 최적화하기
```js
useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
}, [userId]);
```

- `userId`가 변경될 시만 `fetchUser` 함수를 호출
- 추후 새로 추가된 변수를 빠짐없이 의존성 배열에 추가

#### 의존성 배열을 잘못 관리한 경우
```js
const [needDetail, setNeedDetail] = useState(false);
useEffect(() => {
    fetchUser(userId, needDetail).then(data => setUser(data));
}, [userId]);
```

- 부수 효과 함수를 수정할 때 새로운 상태값을 사용했다면 의존성 배열에 추가해야함
- 실수 방지를 위해 `eslint` 에서 사용할 수 있는 `exhaustive-deps` 규칙을 만들어 제공
    + 잘못된 의존성 배열 사용을 찾아줌
    
### 의존성 배열을 잘못 관리하면 생기는 일
> 의존성 배열에 입력해야 할 값을 입력하지 않으면 오래된 값을 참조하는 문제가 발생

#### 의존성 배열을 잘못 관리한 경우
```js
function MyComponent() {
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    useEffect(() => {
        const id = setInterval(() => console.log(value1, value2), 1000);
        return () => clearInterval(id);
    }, [value1]);
    return (
        <div>
            <button onClick={() => setValue1(value1 + 1)}>
                value1 증가
            </button>
            <button onClick={() => setValue1(value2 + 1)}>
                value2 증가
            </button>
        </div>
    )
}
```

- `value2`를 의존성 배열에 넣지 않음
    + 변경 시에도 부수 효과 함수는 갱신되지 않음
    + 변경 전 부수 효과 함수 실행
- 컴포넌트 함수가 실행될 때마다 부수 효과 함수가 생성
    + 함수는 생성될 당시의 변수를 참조
    + 같은 `value2` 변수라고 하더라도 컴포넌트 함수가 실행될 때마다 새로운 메모리 공간을 가짐
    + 즉, 부수 효과 함수가 생성된 시점의 `value2`를 참조
   
---

### `useEffect` 훅에서 `async await`함수 사용하기
> `async await` 함수를 사용하기 위해 부수 효과 함수를 `async await`로 생성하면 에러가 발생(부수 효과 함수의 반환값은 항상 함수 타입!)

#### 부수 효과 함수를 `async await`로 만든 예
```js
useEffect( async () => {
    const data = await fetchUser(userId);
    setUser(data);
}, [userId]);
```

- `async await` 함수는 프로미스 객체를 반환
- 부수 효과 함수는 **함수만 반환** 가능
- 반환된 함수는 부수 효과 함수가 호출되기 직전과 컴포넌트가 사라지기 직전에 호출
- 사용할 수 있는 방법 : 부수 효과 함수 내에서 `async await` 함수를 만들어 호출

#### `useEffect` 훅에서 `async await` 함수 사용하기
```js
useEffect(() => {
    async function fetchAndSetUser() {
        const data = await fetchUser(userId);
        setUser(data);
    }
    fetchAndSetUser();
}, [userId]);
```

### `fetchAndSetUser` 함수 재사용하기
#### `useEffect` 훅 밖에서 `fetchAndSetUser` 함수가 필요한 경우
```js
function Profile({ userId }) {
    const [user, setUser] = useState();
    useEffect(() => {
        async function fetchAndSetUser(needDetail) {
            const data = await fetchUser(userId, needDetail);
            setUser(data);
        }
        fetchAndSetUser(false);
    }, userId);
    
    if(!user) {
        return <h1>로딩중 ...</h1>;
    }
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{`캐시: ${user.cash}`}</p>
            <p>{`계정 생성일: ${user.creatAt}`}</p>
            <button onClick={() => fetchAndSetUSer(true)}>더보기</button>
            <UserDetail user={user} />
        </div>
    );
}
```

#### `fetchAndSetUser` 함수를 `useEffect`흑 밖으로 이동
```js
function Profile(userId) {
    const [user, setUser] = useState();
    async function fetchAndSetUser(needDetail) {
        const data = await fetchUser(userId, needDetail);
        setUser(data);
    }
    useEffect(() => {
        fetchAndSetUser(false);
    }, [fetchAndSetUser]);
}
```

- `fetchAndSetUser` 함수는 렌더링 할 때마다 갱신..

#### `userId`가 변경될 때만 `fetchAndSetUser` 함수 갱신
```js
function Profile(userId) {
    const [user, setUser] = useState();
    const fetchAndSetUser = useCallback(
        async needDetail => {
            const data = await fetchUser(userId, needDetail);
            setUser(data);
        },
        [userId]
    );
    useEffect(() => {
        fetchAndSetUser(false);
    }, [fetchAndSetUser]);
    // ...
}
```

- `useCallback` 훅을 이용해서 `fetchAndSetUser` 함수가 필요할 때만 갱신
- `userId`가 변경될 때만 호출
