# 리서치: 변수 = 값 대입 (Stack & Heap 메모리 다이어그램)

> 시각화 제작 전 웹 레퍼런스 수집. 아래 "통용 관례"를 근거로 viz를 설계한다.

## 수집한 출처
- Tufts CS15 — Memory Diagrams (관례 정의): https://www.cs.tufts.edu/comp/15/reference/memory/memory_diagrams.html
- NUS CS2030S — Heap and Stack (Java 기준 stack/heap, aliasing): https://nus-cs2030s.github.io/2324-s2/10-heap-stack.html
- GeeksforGeeks — Stack vs Heap Memory Allocation: https://www.geeksforgeeks.org/dsa/stack-vs-heap-memory-allocation/
- DEV — Rust Visualized: The Stack, the Heap, and Pointers: https://dev.to/ender_minyard/rust-visualized-the-stack-the-heap-and-pointers-a5c
- (참고) Python Tutor 스타일: 프레임(왼쪽) / 객체(오른쪽) + 화살표

## 통용되는 시각화 관례 (핵심)
1. **2열 레이아웃**: 왼쪽 = **Stack**, 오른쪽 = **Heap** (열마다 라벨).
2. **변수 = 박스**: 이름표가 붙은 상자. 상자 안에 "현재 내용"이 들어감.
3. **원시값(primitive)**: 값이 **상자 안에 직접** 들어감 (stack에 저장). 예: `a` 박스 안에 `5`.
4. **참조(reference)**: 상자 안 내용은 주소지만, **상자에서 heap 객체로 향하는 화살표**로 그린다 (주소 숫자는 보통 생략 = 추상화).
5. **객체는 heap에**: `new`/객체 리터럴 실행 시 heap에 생성. 상자 안 화살표가 그 객체를 가리킴.
6. **미초기화**: `∅` 기호로 표시 (null과 구분).
7. **콜 프레임**: 함수 호출마다 stack에 프레임이 쌓임(LIFO). 지역변수/파라미터는 프레임 안에.
8. **화살표는 오직 포인터용**: 데이터 이동을 화살표로 그리지 않는다(혼동 방지). (Tufts 규칙)
9. **대입의 두 얼굴**:
   - **원시값 대입** `b = a` → 값을 **복사**. `a`, `b`는 서로 독립된 별개 상자.
   - **참조 대입** `p = o` → **주소(화살표)를 복사**. `p`, `o`가 **같은 heap 객체**를 가리킴 = **aliasing**.

## 제안: 숏츠 "변수 대입, 값일까 참조일까?" 구성
표준 2열(Stack | Heap) 박스-화살표 다이어그램을 그대로 채택. 한 줄씩 실행하며 상태 변화:

| step | 코드 | 시각화 상태 |
|------|------|-------------|
| 1 | `let a = 5;` | Stack에 `a=[5]` |
| 2 | `let b = a;` | Stack에 `b=[5]` (별개 상자, "값 복사") |
| 3 | `b = 9;` | `b=[9]`, `a`는 여전히 `[5]` → **독립 강조** |
| 4 | `let o = {x:1};` | Stack `o=[●]` → Heap `{x:1}` (화살표) |
| 5 | `let p = o;` | Stack `p=[●]` → **같은** Heap 객체 (화살표 2개, aliasing) |
| 6 | `p.x = 99;` | Heap 객체 `{x:99}` → `o.x`도 99 → **참조 공유 강조** |

→ 원시값=복사 / 참조=공유 대비가 핵심 메시지.

## 구현 노트
- 기존 viz(stack/vars/array/note)에 **`memory` 타입 추가**: 2열(stack/heap) + 박스 + SVG 화살표.
- 화살표는 고정 행 높이로 좌표를 계산해 SVG 오버레이로 연결.
