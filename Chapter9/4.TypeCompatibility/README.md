# 9.4 타입 호환성
> 어떤 타입을 다른 타입으로 취급해도 되는지 판단하는 것

- 타입 A가 타입 B에 할당 가능하다 = 타입 A는 타입 B의 서브 타입이다

## 9.4.1 숫자와 문자열의 타입 호환성

<img width="890" alt="스크린샷 2021-03-28 오후 3 24 19" src="https://user-images.githubusercontent.com/70752848/112744291-c32b4480-8fd9-11eb-80da-4e260f45dc28.png">

#### 숫자와 문자열의 타입 호환성
```ts
function func1(a: nuber, b: number | string) {
    const v1: number | string = a;
    const v2: number = b; // Type Error
}
function func2(a: 1 | 2) {
    const v1: 1 | 3 = a; // Type Error
    const v2: 1 | 2 | 3 = a; 
}
```