# 7.2 바벨 플러그인 제작하기
> 바벨은 프리셋과 플러그인을 누구나 제작할 수 있도록 API 를 제공

- 바벨 플러그인 직접 제작
- 바벨 내부적 동작의 이해

## 7.2.1 AST 구조 들여다보기
> 바벨은 문자열로 입력되는 코드를 AST(abstract syntax tree)라는 구조체로 만들어 처리

#### `const v1 = a + b;` 코드로 만들어진 AST
```json
{
  "type": "Program",
  "start": 0,
  "end": 17,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 17,
      "declaration": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 16,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 8,
            "name": "v1"
          },
          "init": {
            "type": "BinaryExpression",
            "start": 11,
            "end": 16,
            "left": {
              "type": "Identifier",
              "start": 11,
              "end": 12,
              "name": "a"
            },
            "operator": "+",
            "right": {
              "type": "Identifier",
              "start": 15,
              "end": 16,
              "name": "b"
            }
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

- AST 각 노드는 `type` 속성이 있음
- 변수 선언은 `VariableDeclaration` 타입
- 하나의 문장에서 여러개의 변수를 선언할 수 있어 배열로 관리
- 선언된 변수를 나타내는 타입은 `VariableDeclarator` 
- 개발자가 만들어낸 각종 이름은 `Identifier` 타입으로 만들어짐
- 실제 코드에 사용된 `v1` 이름이 보임
- 사칙연산은 `BinaryExpression` 타입으로 만들어짐
- `left`, `right` 속성으로 연산에 사용되는 변수나 값이 들어감

> `astexplorer` : 여러 AST 타입의 대한 정보를 얻을 수 있음

## 7.2.2 바벨 플러그인의 기본 구조
> 바벨 플러그인은 하나의 JS 파일로 만들 수 있다.
```js
module.exports = function ({ types: t }) { // 1
    const node = t.BinaryExpression('+', t,Identifier('a'), t.Identifier('b')); // 2
    console.log('isBinaryExpression', t.isBinaryExpression(node)); // 3
    return {}; // 4
}
```
1) `types` 매개변수를 가진 함수를 내보냄
2) `types` 매개변수를 이용해 AST 노드를 생성할 수 있고, 두 변수의 덧셈을 AST 노드로 만듬
3) `types` 매개변수는 AST 노드 타입을 검사하는 용도로 사용
4) 빈 객체를 반환하면 아무 일도 하지 않음

#### 바벨 플러그인 함수가 반환하는 값의 형태
```js
module.exports = function({ types: t }) {
    return {
        visitor: { // 1
            Identifier(path) { // 2
                console.log('Identifier name: ', path.node.name);
            },
            BinaryExpression(path) { // 3
                console.log('BinaryExpression operator: ', path.node.operator);
            }
        }
    }
}
```
1) `visitor` 객체 내부에서 노드의 타입 이름으로 된 함수를 정의할 수 있음
- 해당하는 타입의 노드가 생성되면 같은 이름의 함수가 호출
2) `Identifier` 타입의 노드가 생성되면 호출되는 함수
- `const v1 = a + b;` 코드 입력시 이 함수는 세 번 호출
3) `BinaryExpression` 타입의 노드가 생성되면 호출되는 함수
- `const = a + b;` 코드 입력 시 이 함수는 한 번 호출 

## 7.2.3 바벨 플러그인 제작하기: 모든 콘솔 로그 제거
#### 콘솔 로그를 포함하는 `code.js` 파일
```js
console.log('aaa');
const v1 = 123;
console.log('bbb');
function onClick(e) {
    const v = e.target.value;
}
function add(a, b) {
    return a + b;
}
```
> 플러그인 제작을 위해 콘솔 로그의 AST 구조를 이해해야 함
#### 콘솔 로그의 AST
```json
{
  "types": "Program",
  "start": 0,
  "end": 20,
  "body": [
    {
      "type": "ExpressionStatement",
      "start": 0,
      "end": 20,
      "expression": {
        "type": "CallExpression",
        "start": 0,
        "end": 19,
        "callee": {
          "type": "MemberExpression",
          "start": 0,
          "end": 11,
          "object": {
            "type": "Identifier",
            "start": 0,
            "end": 7,
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "start": 8,
            "end": 11,
            "name": "log"
          }
        }
      }
    }
  ]
}
```

- 콘솔 로그 코드는 `ExpressionStatement` 노드로 시작
- 함수 또는 메서드를 호출하는 코드는 `CallExpression` 노드로 만들어짐
- 메서드 호출은 `CallExpression` 노드 내부에서 `MemberExpression` 노드(내부에 객체와 메서드의 이름 정보)로 만들어짐

#### 콘솔 로그를 제거하는 플러그인 코드
```js
module.exports = function({ types: t }) {
    return {
        visitor: {
            ExpressionStatement(path) { // 1
                if (t.isCallExpression(path.node.expression)) { // 2
                    if (t.isMemberExpression(path.node.expression.callee)) { // 3
                        const memberExp = path.node.expression.callee;
                        if (
                            memberExp.object.name === 'console' && // 4
                            memberExp.property.name === 'log'
                        ) {
                            path.remove(); // 5
                        }
                    }
                }
            }
        }
    }
}
```
1) `ExpressionStatement` 노드가 생성되면 호출되도록 메서드를 등록
2) `ExpressionStatement` 노드의 `expression` 속성이 `CallExpression` 노드인지 검사
3) `callee` 속성이 `MemberExpression` 노드인지 검사
4) `console` 객체의 `log` 메서드가 호출된 것인지 검사
5) 모든 조건을 만족하면 AST 에서 `ExpressionStatement` 노드를 제거

#### 제작할 플러그인을 사용하도록 설정하기
```js
const plugins = ['./plugins/remove-log.js'];
module.exports = { plugins };
```

#### 콘솔 로그가 제거된 결과
```js
const v1 = 123;

function onClick(e) {
  const v = e.target.value;
}

function add(a, b) {
  return a + b;
}
```