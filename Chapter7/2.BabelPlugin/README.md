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