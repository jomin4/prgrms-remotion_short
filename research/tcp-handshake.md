# 리서치: TCP 3-way handshake (시퀀스 다이어그램)

> 시각화 제작 전 웹 레퍼런스 수집. 통용 관례를 근거로 viz 설계. 템플릿 B는 화면 텍스트 최소화 + 시각화 위주 + 하단 자막.

## 수집한 출처
- GeeksforGeeks — TCP 3-Way Handshake Process: https://www.geeksforgeeks.org/computer-networks/tcp-3-way-handshake-process/
- Microsoft Learn — Three-way handshake via TCP/IP: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/three-way-handshake-via-tcpip
- ScienceDirect — Three-Way Handshake overview: https://www.sciencedirect.com/topics/computer-science/three-way-handshake
- Guru99 — TCP 3-Way Handshake: https://www.guru99.com/tcp-3-way-handshake.html

## 통용되는 시각화 관례 (핵심)
1. **두 개의 라이프라인**: 왼쪽 Client, 오른쪽 Server. 세로 점선, **시간은 아래로** 흐름.
2. **메시지 = 화살표**: 라이프라인 사이 수평 화살표. 위에 라벨(SYN/SYN-ACK/ACK), 아래에 seq/ack 숫자.
3. **3단계**:
   - ① Client → Server: **SYN** (seq=x). Client: `SYN_SENT`
   - ② Server → Client: **SYN-ACK** (seq=y, ack=x+1). Server: `SYN_RCVD`
   - ③ Client → Server: **ACK** (ack=y+1). 양쪽: `ESTABLISHED`
4. **상태 라벨**: 각 라이프라인에 현재 상태(CLOSED→LISTEN, SYN_SENT, SYN_RCVD, ESTABLISHED) 표시.
5. **이유**: TCP는 전이중(full-duplex) → 양쪽이 각자 seq를 동기화해야 해서 3번 필요.

## 제안: 숏츠 "TCP는 어떻게 연결될까?" (viz-first)
시퀀스 다이어그램 하나를 스텝마다 한 화살표씩 추가. 화면엔 다이어그램 + 작은 제목 라벨만, 설명은 하단 자막.

| step | 자막(하단) | 시각화 |
|------|-----------|--------|
| intro | "3번의 인사로 연결을 맺습니다" | 제목 훅 |
| 1 | ① SYN — 연결 요청 | SYN 화살표, Client=SYN_SENT |
| 2 | ② SYN-ACK — 수락 + 서버 동기화 | +SYN-ACK, Server=SYN_RCVD |
| 3 | ③ ACK — 확인 → 연결 성립 | +ACK, 양쪽 ESTABLISHED |
| 4 | 이제 데이터 전송 시작 | 3개 완성 + ESTABLISHED 강조 |

## 구현 노트
- 새 컴포지션 **Concept**(id) = intro + steps[]. 각 step = viz + 하단 자막(Caption 재사용) + 작은 상단 라벨.
- 새 viz `sequence`: 액터 2, 메시지 배열(from a/b, label, note, hot), 상태(stateA/stateB). SVG로 라이프라인+화살표.
- 페이스: intro~120, step~170~180프레임.
