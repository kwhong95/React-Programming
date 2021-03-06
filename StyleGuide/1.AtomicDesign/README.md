# #1. 아토믹 디자인
> 아토믹 디자인(Atomic Design)은 많은 주목을 받고 있는 UI 디자인 설계 방법

## 목표 설정
1) 논리적인 관점으로 UI 탐색
2) 웹 개발에 어울리는 디자인 설계
- 추상화
- 구상화
3) 아토믹 디자인 이용에 따른 장점과 리액트와 조합한 예

## 3.1 아토믹 디자인이란?
> "틀(페이지)과 부품(컴포넌트) 2가지 수준으로 나누어 UI를 파악하는 것"
>> 즉, 컴포넌트를 조합하여 다양한 인터페이스나 템플릿을 구축하는 방법론

#### 리액트 설계 특징
1) 컴포넌트 이용 - 재사용성이 높음
- 효율, 일관성 등에 깊은 관계가 있어 제품을 편리하게 이용 가능
- 유지 보수 작업이 편리
2) 컴포넌트 활용 방법(페이지와 컴포넌트를 분할한 단위 목록)
- Atoms_원자
- Templates_템플릿
- Molecules_분자
- Pages_페이지
- Organisms_유기체

### Atoms(원자, 아톰)
> "UI를 구성하는 요소 중 가장 작은 요소"

#### 특징
1) 추상적인 요소 - 여러 개를 조합해야 비로소 기능을 가짐
2) 글꼴 크기 등의 구체적인 속성을 포함
- 각자의 특징을 가짐
- 이후 구성될 UI가 어떤 특징의 구성요소로 성립될 것인지에 영향을 줌
3) 웹에서의 Atoms 목록
- 버튼
- 라디오 버튼
- 입력 영역
- 색 팔레트
- 제목
- 타이포그래피
- 아이콘
- 체크박스
4) 가장 중요한 요소(기본)이며, 일관성 있는 Atoms 디자인은 웹 사이트의 톤과 매너 통일과 직결

### Molecules(분자, 몰레큘러)
> "여러 개의 Atoms 조합하여 형성"

#### 특징
1) UI에 의미를 부여 - 어떻게 사용할 것인지 구체적 설정 - 재사용성 유지
2) 일련의 흐름을 상상하여 보다 구체적인 인터페이스 제작 목적
3) Molecules 컴포넌트의 기본은 용도가 명확하면서도 재사용성이 있다는 점
- 단순한 상태가 재사용성이 높음

### Organisms(유기적 조직체, 오가니즘)
> "앞서 나온 두가지 요소를 통해 만드며, 반드시 순서대로 구성될 필요는 없고, Organisms 이 직접 Atoms 을 참조할 수도 있음"

#### 특징
1) 보다 복잡한 UI 이기 때문에 재사용성을 요구하지 않는다는 점
- 대표적인 예: 헤더, 푸터 등
2) 특정 요소를 반복하여 사용하는 경우도 있음
- 대표적인 예: 쇼핑몰 사이트의 상품 정보가 나열된 화면
- 각 아이템들은 Molecules 에 해당
3) HTML 의 아웃라인 단위 느낌
- 몇 개의 Organisms 을 나열하면 하나의 페이지가 완성
- 즉, 사용자가 각 요소에 접근하는 순서를 알면, 사용자가 어떠한 사전 지식을 지닌 채 UI를 사용할 것인지 예상 가능
- 레이아웃을 디자인할 때 중요한 점

### Templates(틀, 템플릿)
> "와이어 프레임과 마찬가지로, 페이지에 표시할 실제 데이터가 반영되기 전의 상태"

#### 특징
1) 페이지 구조나 레이아웃 구성 등을 설명하기 위한 레이어
2) 콘텐츠가 빠져 있으므로 페이지의 '콘텐츠 구조' 에 집중하여 각 컴포넌트가 어떻게 표시되며 어떻게 동작할 것인지 확인
3) 컴포넌트에는 실제 콘텐츠가 들어가므로 페이지가 가진 동적 요소의 특성을 명확히 해두는 것이 중점
