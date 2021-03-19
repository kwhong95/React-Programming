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

## 4.1.3 가독성을 높이는 조건부 렌더링 방법
> 컴포넌트 함수 내부에서 특정 값에 따라 선택적으로 렌더링하는 것: **조건부 렌더링**

#### 간단한 조건부 렌더링 예
```js
function GreetingA({ isLogin, name }) {
    if (isLogin) {
        return <p>{`${name}님 안녕하세요.`}</p>;
    } else {
        return <p>권한이 없습니댜</p>;
    }
}

function GreetingB({ isLogin, name }) {
  return <p>{isLogin ? `${name}님 안녕하세요` : '권한이 없습니다'}</p>;
}
```

#### 조금 복잡한 조건부 렌더링 예
```js
function GreetingA({ isLogin, name }) {
    if (isLogin) {
        return (
                <p className="greeting" onClick={showMenu}>
                  {`${name}님 안녕하세요.`}
                </p>
        );
    } else {
        return (
                <p className="noAuth" onClick={goToLoginPage}>
                  권한이 없습니다.
                </p>
        );
    }
}

function GreetingB({ isLogin, name }) {
    return (
            <p
                className={isLogin ? 'greeting' : 'noAuth'}
                onClick={isLogin ? showMenu : goToLoginPage}
            >
              {isLogin ? `${name}님 안녕하세요`: '권한이 없습니다'}
              
            </p>
    )
}
```

#### 삼항 연산자를 사용한 조건부 렌더링
```js
function Greeting({ isLogin, name, cash }) {
    return (
            <div>
              저희 사이트에 방문해 주셔서 감사합니다.
              {isLogin ? (
                      <div>
                        <p>{name}님 안녕하세요</p>
                        <p>현재 보유하신 금액은 {cash}원 입니다</p>
                      </div>
              ) : null}
            </div>
    );
}
```

### `&&`연산자를 이용한 조건부 렌더링
#### `&&`, `||` 연산자 이해하기
```js
const v1 = 'ab' && 0 && 2; // v1 === 0
const v2 = 'ab' && 2 && 3; // v2 === 3
const v3 = 'ab' || 0; // v3 === 'ab'
const v4 = '' || 0 || 3; // v4 === 3
```

- `&&`, `||` 연산자 모두 마지막으로 검사한 값을 반환
- `&&` : 첫 거짓(false)값 또는 마지막 값을 반환
    + 렌더링할 요소를 끝에 작성하고, 앞쪽에는 해당 조건을 작성
- `||` : 첫 참(true)값 또는 마지막 값을 반환

#### `&&` 연산자를 사용한 조건부 렌더링
```js
function Greeting({ isLogin, name, cash }) {
    return (
            <div>
              저희 사이트에 방문해 주셔서 감사합니다
              {isLogin && (
                      <div>
                        <p>{name}님 안녕하세요</p>
                        <p>현재 보유하신 금액은 {cash}원 입니다</p>
                      </div>
              )}
            </div>
    );
}
```

#### 복잡한 조건을 삼항 연산자로 구현한 예
```js
function Greeting({ isEvent, isLogin, name, cash }) {
    return (
            <div>
              저희 사이트에 방문해주셔서 감사합니다
              {isEvent ? (
                      <div>
                        <p>오늘의 이벤트를 놓치지 마세요</p>
                        <button onClick={onClickEvent}>이벤트 참여하기</button>
                      </div>
              ): isLogin ? (
                  cash <= 100000 ? (
                          <div>
                            <p>{name}님 안녕하세요</p>
                            <p>현재 보유하신 금액은 {cash}원입니다</p>
                          </div>
                  ) : null
              ): null}
            </div>
    );
}
```

#### 복잡한 조건을 `&&` 연산자로 구현한 예
```js
function Greeting({ isEvent, isLogin, name, cash }) {
    return (
            <div>
              저희 사이트에 방문해 주셔서 감사합니다
              {isEvent && (
                      <div>
                        <p>오늘의 이벤트를 놓치지 마세요</p>
                        <button onClick={onClickEvent}>이벤트 참여하기</button>
                      </div>
              )}
              {!isEvent && 
                isLogin &&
                      cash <= 100000 && (
                      <div>
                        <p>{name}님 안녕하세요</p>
                        <p>현재 보유하신 금액은 {cash}원입니다</p>
                      </div>
              )}
            </div>
    );
}
```

### `&&` 연산자 사용시 주의할 점
> 변수가 숫자 타입인 경우 0은 거짓이고, 문자열 타입인 경우 빈문자열이 거짓이다

#### `&&` 연산자를 잘못 사용한 예
```js
<div>
  {cash && <p>{cash}원 보유 중</p>}
  {memo && <p>{200 - memo.length}자 입력 가능</p>}
</div>
```
- 캐시가 0원일 때도 `보유중`을 출력해야 하나 출력되지 않음
- 더 문제는 의도치 않게 숫자 0이 덩그러니 출력됨
- 의도적으로 0도 거짓으로 처리하고 싶다면 `!!cash &&`를 입력

#### `&&` 연산자를 잘 사용한 예
```js
<div>
  {cash != null && <p>{cash}원 보유 중</p>}
  {memo != null && <p>{200 - memo.length}자 입력 가능</p>}
</div>
```

- `cash != null` 은 `cash`가 `undefined`도 아니고 `null`도 아니면 참이 됨

#### 배열의 기본값이 빈 배열이 아닌 경우
```js
<div>{student && student.map(/* */)}</div>
<div>{products.map(/* */)}</div>
```
- 해당 컴포넌트가 **마운트**와 **언마운트**를 반복할 수 있음을 인지
  + 컴포넌트의 상태값도 사라지고 렌더링 성능에도 안좋은 영향을 줄 수 있음
  + 자식 컴포넌트 입장에서는 로직이 간단해지는 장점
- 각자의 취향과 프로젝트의 성격에 따라 **코딩 컨벤션**을 정한다
- 리뷰어(reviewer)를 배려하는 마음으로 작성

## 4.1.4 관심사 분리를 위한 프레젠테이션, 컨테이너 컴포넌트 구분하기
> 비즈니스 로직과 상태값의 유무에 따라 **프레젠테이션(presentation)**과 **컨테이너(container)** 로 구분

- 관심사의 분리: 복잡한 코드를 비슷한 기능을 하는 코드끼리 모아서 별도로 관리
  + UI 처리, API 호출, DB 관리 등
- 기능별로 폴더를 만들어 관리

#### 속성값으로부터 새로운 상태값을 만드는 예
```js
function MyComponent({ todos }) {
    const [doneList, setDoneList] = useState(todos.filter(item => item.done));
    function onChangeName(key, name) {
        setDoneList(
            doneList.map(item => (item.key === key ? { ...item, name } : item))
        );
    }
    // ...
}
```
- 이벤트 처리 함수에서 특정 목록의 이름을 수정
- 이름 수정 시, 부모 데이터와의 **정합(sync)** 이 맞지 않음 > 버그 위험성
- 자식 컴포넌트에서 부모의 데이터를 별도의 상태값으로 관리 > **나쁜 습관(anti-pattern)**
  + 데이터를 복제해서 사용하는 경우
  + 자식 데이터를 변경하는 순간 새로운 객체가 생성되므로 부모의 객체를 참조하지 않음
  + 상태값을 **불변 객체**로 관리하기 때문
  + 코드 리펙터링 방안  
    + `doneList`는 `useMemo`를 이용해서 생성
    + `onChangeName` 함수를 부모로부터 속성값으로 받는다
- 컴포넌트가 비즈니스 로직이나 상태값을 가지면 재사용이 어렵다
- 개발자의 *코드 중복*은 **게으름**이며 **기술 부채**

### 비즈니스 로직과 상태값의 유무로 컴포넌트를 분리
> 재사용성이 좋은 **프레젠테이션 컴포넌트**와 컨테이너 컴포넌트로 구분하는 방법

#### 프레젠테이션 컴포넌트의 정의
- 비즈니스 로직이 없다
- 상태값이 없다.(단, 마우스 오버와 같은 UI 효과를 위한 상태값은 제외)

> 일반적으로 프레젠테이션 컴포넌트가 가독성이 더 좋고 재사용성도 높다.