# 4.1 가독성과 생산성을 고려한 컴포넌트 코드 작성법

Check1. 유지 보수하기 쉬운 코드 작성  
Check2. 컴포넌트의 인터페이스를 쉽게 파악할 수 있는 코드 작성  
Check3. 속성값에 타입 정보를 추가하는 방법  
Check4. 조건부 렌더링 시 가독성을 높이는 방법  
Check5. 컨테이너 컴포넌트와 프레젠테이션 컴포넌트를 구분하여 폴더 구성하는 방법

## 4.1.1 추천하는 컴포넌트 파일 작성법
### 컴포넌트 파일 작성 순서
```js
MyComponent.propTypes = {
    // ...
};

export default function MyComponent({ prop1, prop2 }) {
    // ...
}

const COLUMNES = [
    { id: 1, name: 'phoneNumber', width: 200, color: 'white' },
    { id: 1, name: 'city', width: 100, color: 'grey' },
    // ...
];
const URL_PRODUCT_LIST = './api/products';
function getTotalPrice({ price, total }) {
    // ...
}
```
1) 최상단에는 속성값의 타입을 정의
- 컴포넌트를 사용하는 입장에서 속성값 타입을 제일 먼저 파악하는 것이 중요
2) 컴포넌트 함수의 매개변수는 명명된 매개변수로 정의
- 속성값 사용시 `props` 중복 방지
- 컴포넌트 이름 꼭 작성: 디버깅시 불리
3) 컴포넌트 바깥의 변수와 함수는 가장 아래 정의
- 특별한 이유가 없을 시 `const`(상수)로 정의
- 상수는 대문자 작성이 가독성에 좋음
- 컴포넌트 내부의 커다란 객체 생성 시, 컴포넌트 외부에서 상수를 사용해 정의
- 렌더링 시 불필요한 객체 생성을 피할 수 있어 성능상 이점

---

### 서로 연관된 코드 한 곳으로 모으기
#### 여러 가지 기능이 섞여 있는 컴포넌트 코드
```js
function Profile({ userId }) {
    const [user, setUser] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(width.innerWidth);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);
    // ...
}
```

#### 기능별로 코드 구분하기
```js
function Profile({ userId }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        getUserApi(userId).then(data => setUser(data));
    }, [userId]);
    
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []); 
}
```
- 사용자 정보를 가져오는 기능, 창의 너비를 가져오는 기능을 분리하여 한 곳으로 모음
- 연관된 코드끼리 모으는 것이 가독성에서 나음
- 커스텀 훅으로 분리하는 것도 좋은 방법

#### 각 기능을 커스텀 훅으로 분리하기
```js
function Profile({ userId }) {
    const user = useUser(userId);
    const width = useWindowWidth();
    // ...
}

function useUser(userId) {
    cosnt [user, setUser] = userState(null);
    useEffect(() => {
        getUserApi(userId).then(data => setUser(data));
    }, [userId]);
    return user;
}

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);
    return width;
}
```
- 커스텀 훅 분리시 이점
    + 가독성 향상
    + 재사용성 향상
    
