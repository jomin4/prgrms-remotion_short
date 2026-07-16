# 개발자 학습 쇼츠 제작 백로그

이 목록을 기준으로 쇼츠를 하나씩 제작한다. 각 행 = 쇼츠 1편(관련 하위 개념 묶음).

- **템플릿**: `A` = 코드 분석(에디터+시각화, 주로 Java/코드), `B` = 개념 설명(viz-first, 시각화 위주)
- **상태**: ⬜ 예정 · 🔨 제작중 · ✅ 완료
- 제작 완료 시 상태 칸에 content 파일 경로 기록
- 제작 흐름: 리서치 → 시각화 확인 → 스크립트/음성 → 렌더 → git 반영 (파이프라인은 README 참고)

**진행률: 1 / 62** (아래 커리큘럼 기준. hashmap 등 커리큘럼 외 제작분은 맨 아래 별도)

---

## 🎨 프론트엔드 (FE)

| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| FE-01 | DOM과 노드 관계 | DOM, 엘리먼트, 자식·형제·자손 관계 | B | ⬜ |
| FE-02 | 브라우저 기본 동작 | form 기본 동작, a 태그, 새로고침, 주소창 URL 변경 | B | ⬜ |
| FE-03 | CSS 선택자 | class·id·자식·후손·hover 선택자 | A | ⬜ |
| FE-04 | Tailwind 기초 | 유틸리티 클래스 사고방식 | A | ⬜ |
| FE-05 | display: flex | 주축·교차축, 정렬 | B | ⬜ |
| FE-06 | CSS position | absolute·relative·sticky·fixed | B | ⬜ |
| FE-07 | JS 기초 문법 | 변수·함수·조건문·반복문 | A | ⬜ |
| FE-08 | DOM 조작 | querySelector·addEventListener·classList·value·innerHTML | A | ⬜ |
| FE-09 | 이벤트 전파 | preventDefault·stopPropagation·캡처링/버블링 | B | ⬜ |
| FE-10 | Promise & async/await | 비동기 처리 흐름 | B | ⬜ |
| FE-11 | 비동기 통신 fetch | fetch·JSON.stringify·response.json·CORS 기초 | A | ⬜ |
| FE-12 | React useState | 상태·리렌더·이벤트 처리 | A | ⬜ |
| FE-13 | React useEffect | 렌더 후 부수효과·의존성 배열 | B | ⬜ |
| FE-14 | React useRef | 렌더와 무관한 값·DOM 참조 | A | ⬜ |
| FE-15 | 컴포넌트 분리 + 할일리스트 | 컴포넌트 분리, 상태 끌어올리기 | A | ⬜ |
| FE-16 | Next.js 라우팅 | 파일 기반 라우팅·페이지 구성 | B | ⬜ |
| FE-17 | 서버 vs 클라이언트 컴포넌트 | 렌더 위치 차이 | B | ⬜ |
| FE-18 | Next.js API 연동 | fetch로 데이터 가져오기 | A | ⬜ |
| FE-19 | 커뮤니티 기능(인증·CRUD) | 회원가입·로그인·글/댓글 CRUD | B | ⬜ |

## ⚙️ 백엔드 (BE)

### 자바
| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| BE-01 | 자바 기초 문법 | 변수·함수·매개변수·리턴·조건문·반복문 | A | ⬜ |
| BE-02 | 컬렉션 | List·Set·Map 특징 | B | ⬜ |
| BE-03 | 스트림 & 람다 | 선언형 데이터 처리 | A | ⬜ |
| BE-04 | 클래스 & 생성자 | 객체 생성·초기화 | A | ⬜ |
| BE-05 | 상속 & 인터페이스 | 확장·다형성 | B | ⬜ |
| BE-06 | 예외 처리 | try-catch·RuntimeException | A | ⬜ |
| BE-07 | 롬복 | 어노테이션이 생성하는 코드 | A | ⬜ |

### Git
| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| BE-08 | Git 기본 명령어 | clone·add·commit·push·pull(+취소) | A | ⬜ |
| BE-09 | Git reset & amend | reset(soft/mixed/hard)·amend·커밋 취소 | A | ✅ `content/explainer/git-reset.json` |
| BE-10 | Git 브랜치 | 생성·삭제·머지 | B | ⬜ |
| BE-11 | 리베이스 | 커밋 히스토리 재정렬 | B | ⬜ |
| BE-12 | Pull Request | 협업 리뷰 흐름 | B | ⬜ |

### HTTP · REST
| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| BE-13 | HTTP 요청/응답 구조 | 요청·응답·Header·Body | B | ⬜ |
| BE-14 | Query Param vs Path Variable | 파라미터 전달 방식 | B | ⬜ |
| BE-15 | HTTP 상태 코드 | 2xx·3xx·4xx·5xx | B | ⬜ |
| BE-16 | Cookie vs Session | 상태 유지 방식 | B | ⬜ |
| BE-17 | REST API 설계 | 리소스 URL·GET/POST/PUT/PATCH/DELETE | B | ⬜ |
| BE-18 | JSON 요청/응답 | 직렬화·역직렬화 | A | ⬜ |

### MySQL
| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| BE-19 | DDL | DB·테이블 생성·수정·삭제 | A | ⬜ |
| BE-20 | DML | SELECT·INSERT·UPDATE·DELETE | A | ⬜ |
| BE-21 | 제약조건 | PK·FK·Unique·NotNull·Default·AutoIncrement | B | ⬜ |
| BE-22 | JOIN | INNER·LEFT·N:1 조회 | B | ⬜ |
| BE-23 | INDEX | 조회 속도와 인덱스 원리 | B | ⬜ |
| BE-24 | 트랜잭션 & ACID | commit·rollback·ACID | B | ⬜ |
| BE-25 | 정규화 기초 | 중복 제거·테이블 분리·관계 | B | ⬜ |

### Spring
| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| BE-26 | 빈 & 의존성 주입 | 빈·스코프·DI·프록시 | B | ⬜ |
| BE-27 | Spring Web 어노테이션 | @RestController·@GetMapping 등 매핑 | A | ⬜ |
| BE-28 | DTO 요청/응답 | 요청 받기·응답 내려주기 | A | ⬜ |
| BE-29 | JPA Entity & Repository | 엔티티·리포지토리·save | A | ⬜ |
| BE-30 | JPA 연관관계 | @ManyToOne(LAZY)·@OneToMany(cascade) | B | ⬜ |
| BE-31 | @Transactional & 더티체킹 | 트랜잭션·더티체킹·롤백·flush | B | ⬜ |
| BE-32 | Spring Security | 인증·인가·로그인·해싱·세션 | B | ⬜ |
| BE-33 | 검증 & 예외 처리 | @Valid·@NotBlank·BindingResult·전역 예외 | A | ⬜ |
| BE-34 | 테스트 | JUnit·AssertJ·given-when-then | A | ⬜ |
| BE-35 | Gradle 빌드 | dependencies·build·bootRun | B | ⬜ |
| BE-36 | Swagger 문서화 | 요청·응답·에러 예시 | B | ⬜ |

## 🖥️ 인프라 (INF)

| ID | 쇼츠 주제 | 핵심 개념 | 템플릿 | 상태 |
|----|-----------|-----------|:--:|:--:|
| INF-01 | 리눅스 기본 명령어 | pwd·ls·cd·mkdir·rm·cp·mv·cat·tail·grep·chmod·chown·ps·kill | A | ⬜ |
| INF-02 | SSH & 키 | 접속·공개키/개인키·pem 권한 | B | ⬜ |
| INF-03 | 네트워크 기초 ① | IP·DNS·라우터·스위치·서브넷·게이트웨이·포트 | B | ⬜ |
| INF-04 | 네트워크 기초 ② | TCP·UDP·ICMP·방화벽 | B | 🔶 TCP 일부 완료 `content/concept/tcp-handshake.json` |
| INF-05 | 프로세스 & 포트 | 프로세스 확인·포트 점유 확인·종료 | A | ⬜ |
| INF-06 | 도커 이미지 & 컨테이너 | 이미지·컨테이너 실행/삭제·볼륨·포트매핑·환경변수·푸시 | B | ⬜ |
| INF-07 | AWS EC2 | 생성·접속·보안그룹·배포·재시작 | B | ⬜ |
| INF-08 | 환경변수 분리 | dev/prod·DB 정보·민감정보 숨기기 | B | ⬜ |
| INF-09 | 로그 | 앱·서버·에러 로그 추적 | B | ⬜ |
| INF-10 | 배포 흐름 | 로컬→빌드→업로드→실행→로그→재배포 | B | ⬜ |

---

## 📦 커리큘럼 외 이미 제작한 쇼츠
파이프라인 검증·CS 기초로 만든 것들 (위 커리큘럼엔 없음):
- ✅ `content/code/hashmap.json` — HashMap 내부(버킷·해싱·충돌)
- ✅ `content/code/variable-assignment.json` — 변수 대입(값 vs 참조, 스택/힙)
- ✅ `content/code/recursion.json` — 재귀·콜스택
- ✅ `content/concept/jwt.json` · `content/explainer/jwt.json` — JWT 인증 흐름
