# 🚄 RAILLINK (레일링크)
> **심플하고 모던한 차세대 스마트 기차 예매 웹 플랫폼**

![RAILLINK UI Preview](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🌟 프로젝트 개요
**RAILLINK**는 복잡하고 정형화된 기존 철도 예매 시스템을 탈피하여, **‘불필요한 정보의 배제’**와 **‘직관적인 3-Step 예매 프로세스’**를 기반으로 설계된 모던 웹 애플리케이션입니다.

- **미니멀리즘 & 글래스모피즘 UI**: 깊이감 있는 블러 효과와 세련된 타이포그래피(Pretendard & Plus Jakarta Sans)를 적용하여 심미적 완성도를 극대화했습니다.
- **인라인 인터랙션**: 불필요한 페이지 이동 없이, 한 화면 내에서 검색부터 좌석 선택, 결제, 모바일 탑승권 발권까지 매끄럽게 연결됩니다.

---

## ✨ 핵심 기능

### 1. 🔍 스마트 통합 검색 및 노선 설정
- **원클릭 노선 스왑(⇄)**: 출발역과 도착역을 360도 회전 애니메이션과 함께 즉각 전환.
- **인기 노선 퀵 칩**: 서울⇄부산, 용산⇄광주송정, 수서⇄동대구 등 주요 구간 즉시 설정.
- **주요 노선별 역 필터**: 경부선, 호남/전라선, 강릉/동해선 등 카테고리별 검색 지원.
- **승차 인원 계산기**: 성인, 어린이(50% 할인), 경로(30% 할인) 인원별 운임 자동 산정.

### 2. 🚆 실시간 열차 조회 & 시간대 필터
- KTX, SRT, ITX-청춘/새마을, 무궁화호 등 전 열차 종별 지원.
- 오전(06~12), 오후(12~18), 저녁(18~24) 빠른 시간대 필터링.
- 일반실 및 특실 잔여석 상태("예약가능", "잔여 3석", "매진") 실시간 표기.

### 3. 💺 호차별 인터랙티브 좌석 배치도
- **실제 열차 구조 반영**:
  - **1호차 (특실)**: 2x1 넓은 좌석 배열
  - **2~5호차 (일반실 / 유아동반 / 정숙 객실)**: 2x2 배열, 창측/통로측 직관적 배치
- **좌석 홀딩 타이머**: 좌석 선점 후 5분 카운트다운 타이머 제공.
- 실시간 가격 및 선택 좌석 플로팅 서머리 바.

### 4. 💳 간편 결제 & 스마트 모바일 탑승권 (E-Ticket)
- 카카오페이, 토스페이, 네이버페이, 신용카드 원클릭 결제 모달.
- **실물 티켓 스타일 Boarding Pass**:
  - 절취선 노치(Notch) 및 백터 QR 코드 / 바코드 렌더링.
  - 호차 및 좌석 번호, 출발/도착 시각 및 소요시간 배지.
  - 승차권 인쇄 / PDF 저장 및 Apple 지갑 연동 UI.

### 5. 🎟️ 내 승차권 보관함 & 운행 현황판
- LocalStorage 기반 발권 승차권 자동 보관 및 QR 재조회.
- 수수료 없는 간편 예매 취소/환불 시뮬레이션.
- 전국 주요 간선 열차의 실시간 정시운행률 및 정차역 현황 모니터링 테이블.
- **다크 모드 / 라이트 모드** 테마 전환 지원.

---

## 🚀 시작하기

별도의 빌드 도구 설치 없이 브라우저에서 바로 실행할 수 있습니다.

```bash
# 1. 저장소 클론
git clone https://github.com/JunHyuk1203/infodesign.git

# 2. 디렉토리 이동
cd infodesign

# 3. 로컬 서버 실행 (Python 예시)
python -m http.server 8080
```
브라우저에서 `http://localhost:8080`에 접속하여 바로 확인하실 수 있습니다.

---

## 🎨 기술 스택 및 디자인 시스템
- **Language**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Design Concept**: Glassmorphism, Modern Flat, Micro-interactions
- **Typography**: Pretendard, Plus Jakarta Sans, Tabular-nums
- **Responsive**: 데스크톱, 태블릿, 모바일 완벽 대응

---

© 2026 RAILLINK Corporation. All rights reserved.
