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
    
## 4.1.2 속성값 타입 정의하기: `prop-types`
### 리액트 공식 패키지 `prop-types`의 활용법

1) 타입 정보가 필요한 이유
2) 기본적으로 제공하는 타입의 종류
3) 타입 정의 함수로 자신만의 타입 만들기

### 타입 정보가 필요한 이유
- JS는 동적 타입 언어 > 쉽고 간단한 프로젝트 시 생산성이 좋음
- 소스 파일이 50개 이상의 대규모 프로젝트 시 생산성 떡락..
- 타입 에러를 사전에 검사하여 방지할 수 있음
- 타입 정의 자체가 훌륭한 문서가 됨(유지보수 유리)

#### 속성값에 타입 정보가 없는 경우
```js
function User({ type, age, male, onChangeName, onChangeTitle }) {
    function onClick() {
        const msg = `type: ${type}, age: ${age ? age : '알수 없음'}`;
        log(msg, { color: type === 'gold' ? 'red' : 'black' });
        // ...
    }
    function onClick2(name, title) {
        if (onChangeName) {
            onChangeName(name);
        }
        onChangeTitle(title);
        male ? geMalePage() : goFemalePage();
        // ...
    }
    // ...
}
```

#### `prop-types`를 이용한 속성값의 타입 정보 정의
```js
User.propTypes = {
    male: PropTypes.bool.isRequired,
    age: PropTypes.number,
    type: PropTypes.oneOf(['gold', 'silver', 'bronze']),
    onChangeName: PropTypes.func,
    onChangeTitle: PropTypes.func.isRequired
};
```

- `isRequired`: 필수 속성값
- 함수의 매개변수와 반환값에 대한 타입 정보는 정의할 수 없어, 주석으로 자세히 적기를 추천

---

### `prop-types`로 정의할 수 있는 타입
```js
MyComponent.propTypes = {
    // 리액트 요소
    // <div>hello</div> => 참
    // <SomeComponent /> => 참
    // 123 => 거짓
    menu: PropTypes.element,
  
    // 컴포넌트 함수가 반환할 수 있는 모든 것
    // number, string, array, element, ...
    // <SomeComponent /> => 참
    // 123 => 참
    description: PropTypes.node,
  
    // Message 클래스로 생성된 모든 객체
    // new Message() => 참
    // new Car() => 것짓
    message: PropTypes.instanceOf(Message),
  
    // 배열에 포함된 값 중에서 하나를 만족
    // 'jone' => 참
    // 'messy' => 거짓
    name: PropTypes.oneOf(['jone', 'mike']),
  
    // 배열에 포함된 타입 중에서 하나를 만족
    // 123 => 참
    // 'messy' => 참
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  
    // 특정 타입만 포함하는 배열
    // [1, 5, 7] => 참
    // ['a', 'b'] => 거짓
    ages: PropTypes.arrayOf(PropTypes.number),
    
    // 객체의 속성값 타입을 정의
    // {color: 'red', weight: 123} => 참
    // {color: 'red', weigth: '123kg'} => 거짓
    info: PropTypes.shape({
      color: PropTypes.string,
      weight: PropTypes.number
    }),
    
    // 객체에서 모든 속성값의 타입이 같은 경우
    // {prop1: 123, prop2: 456} => 참
    // {prop1: 'red', prop2: 123} => 거짓
    infos: PropTypes.objectOf(PropTypes.number)
};
```

#### 함수를 이용한 커스텀 속성값 타입 정의
```js
MyComponent.propTypes = {
    age: function(props, propName, componentName) {
        const value = props[propName];
        if (value < 10 || value > 20) {
            return new Error(
                `Invalid prop ${propName} supplied to ${componentName}.
                It must be 10 <= value <= 20.`
            );
        }
    }
};
```

