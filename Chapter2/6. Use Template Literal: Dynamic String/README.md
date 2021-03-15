# 2.6 템플릿 리터럴로 동적인 문자열 생성하기
> 변수를 이용해서 동적으로 문자열을 생성할 수 있는 문법

#### ES6 이전에 동적인 문자열을 생성한 코드
```js
var name = 'mike';
var score = 80;
var msg = 'name: ' + ', score/100: ' + score / 100;
```

#### 템플릿 리터럴을 사용한 코드
```js
const msg = `name: ${name}, score/100: ${score / 100}`;
```

#### 여러 줄의 문자열 입력하기
#### ES5에서 여러 줄의 문자열을 생성하는 코드
```js
const msg = 'name: ' + name + '\n' +
'age: ' + age + '\n' +
'score: ' + score + '\n';
```

#### 템플릿 리터럴을 이용해서 여러 줄의 문자열을 생성하는 코드
```js
const msg = `name: ${name}
age: ${age}
score: ${score}`;
```

### 태그된 템플릿 리터럴
> 템플릿 리터럴을 확장한 기능, 함수로 정의

#### 태그된 템플릿 리터럴 함수의 구조
```js
function taggedFunc(strings, ...expressions) {
    return 123;
}
const v1 = 10;
const v2 = 20;
const result = taggedFunc`a ${v1} b ${v2}`;
console.log(result); // 123
```

#### 태그된 템플릿 리터럴의 파싱 결과 분석
```js
const v1 = 10;
const v2 = 20;

taggedFunc`a-${v1}-b-${v2}-c`
// strings = [ 'a-', '-b', '-c' ];
taggedFunc`a-${v1}-b${v2}`;
// strings = [ 'a-', '-b', '' ];
taggedFunc`${v1}-b${v2}`;
// strings = [ '', '-b-', '' ];

// expressions = [10, 20];

function taggedFunc(stings, ...experssions) {
    console.log(string.length === experssions.length + 1); // true
}
```
- 두 개의 표현식을 기준으로 세 개의 문자열로 분할
- 오른쪽이 표현식으로 끝나면 빈 문자열이 들어감
- 왼쪽이 표현식으로 시작하면 빈 문자열이 들어감
- 위 세가지 예제 모두 `expressions` 매개변수의 값은 같음
- `strings` 배열의 개수는 `expressions` 배열의 개수보다 항상 하나 더 많음

#### 일부 문자열을 강조하는 태그된 템플릿 리터럴 함수
```js
function highlight(strings, ...expression) {
    return strings.reduce(
        (prevValue, str, i) =>
            expression.length === i
                ? `${prevValue}${str}`
                : `${prevValue}${str}<strong>${expression[i]}</strong>`,
        '',
    );
}

const v1 = 10;
const v2 = 20;
const result = highlight`a ${v1} b ${v2}`;
console.log(result); // a <strong>10</strong> b <strong>20</strong>
```

