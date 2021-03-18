# 3.6 리액트 내장 훅 살펴보기
## 3.6.1 Consumer 컴포넌트 없이 콘텍스트 사용하기: `useContext`
> Consumer 컴포넌트를 사용하지 않고도 부모 컴포넌트로부터 전달된 콘텍스트 데이터를 사용할 수 있다.

#### 훅을 사용하지 않고 콘텍스트 API 사용하기
```js
const UserContext = React.createContext();
const user = { name: 'mike', age: 23 };

function ParentComponent() {
    return (
        <UserContext.Provider value={user}>
            <ChildComponent />
        </UserContext.Provider>
    );
}

function ChildComponent() {
    // ...
    return (
        <UserContext.Consumer>
            {user => (
                <>
                    <p>{`name is ${user.name}`}</p>
                    <p>{`age is ${user.age}`}</p>
                </>
            )}
        </UserContext.Consumer>
    );
}
```
- 부모 컴포넌트에서는 Provider 컴포넌트로 데이터 전달
- 자식 컴포넌트에서는 Consumer 컴포넌트를 통해 데이터 사용
- 한계점: Consumer 컴포넌트 안쪽에서만 데이터 접근이 가능

#### `useContext` 훅 사용하기
```js
function ChildComponent() {
    const user = React.useContext(UserContext);
    console.log(`user: ${user.name}, ${user.age}`);
    // ...
}
```
- JSX 부분이 다소 복잡해지나, `useContext`훅은 사용하기 간편
