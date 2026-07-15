# 리서치: Java HashMap 내부 동작

> 시각화 제작 전 웹 레퍼런스 수집. 아래 통용 관례를 근거로 viz 설계.

## 수집한 출처
- GeeksforGeeks — Internal Working of HashMap in Java: https://www.geeksforgeeks.org/java/internal-working-of-hashmap-java/
- howtodoinjava — How HashMap Works in Java: https://howtodoinjava.com/java/collections/hashmap/how-hashmap-works-in-java/
- Medium(Priyaranjan) — How HashMap Works Internally After Java 8 (With Visual Diagrams): https://medium.com/@priyaranjanpatraa/how-hashmap-works-internally-after-java-8-with-visual-diagrams-cba0725de9e8
- DEV — HashMap Internal Working: https://dev.to/iammadhankumar/hashmap-internal-working-250h

## 통용되는 시각화 관례 (핵심)
1. **버킷 배열**: HashMap은 `Node[]` 배열. 각 칸(bucket)이 인덱스를 가짐 (기본 용량 16, 예시는 8).
2. **인덱스 계산**: `index = (n - 1) & hash` (비트 AND). hash는 key의 hashCode를 비트 섞기.
3. **엔트리 = Node**: `{ hash, key, value, next }`. 화면엔 보통 `key=value`로 표기.
4. **충돌 = 체이닝**: 다른 key가 같은 index로 가면 충돌. 같은 버킷에 **연결리스트로 연결**(new node의 next로). 화살표로 체인 표현.
5. **Java 8+ 트리화**: 한 버킷의 노드 > 8 **그리고** 용량 > 64 → **레드블랙 트리**(O(n)→O(log n)).
6. **성능**: 평균 조회/삽입 O(1), 충돌 심하면 체인 O(n) / 트리 O(log n).

## 제안: 숏츠 "HashMap은 어떻게 O(1)일까?" 구성 (Java)
버킷 배열(세로) + 인덱스칸 + 체인(가로 노드+화살표). 한 줄씩:

| step | 코드 | 시각화 |
|------|------|--------|
| 1 | `new HashMap<>()` | 빈 버킷 배열 (0~7) |
| 2 | `put("A", 1)` | `hash("A")&7 → 5`, 버킷5에 `"A"=1` |
| 3 | `put("B", 2)` | 버킷2에 `"B"=2` |
| 4 | `put("C", 3)` | index 5 → **충돌!** 버킷5에 `"A"=1 → "C"=3` 체이닝 |
| 5 | `get("A")` | 버킷5로 이동 → 체인 순회 → `"A"` 발견 |
| 6 | 정리 | 평균 O(1), 충돌 시 체인(8↑&용량64↑ → 트리) |

## 구현 노트
- 새 viz 타입 `hashmap`: `capacity`, 선택적 `compute`(해시 계산 표시), `buckets[{index, entries[{k,v,hot}]}]`.
- 체인은 flex 가로 배치 + `→`(next). 빈 버킷은 `null` 흐리게.
- 페이스: 스텝당 150~190프레임(5~6초)로 여유 있게.
