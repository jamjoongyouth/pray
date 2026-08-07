# 청년교구 여름수련회 · 기도 — NFC 키링 페이지

NFC 키링을 찍으면 열리는 수련회 랜딩 페이지입니다.

- **배포 주소**: https://jamjoongyouth.github.io/pray/
- **구조**: `index.html` + `css/style.css` + `js/main.js` (프레임워크 없음)

## ⚠️ 반드시 지켜야 할 것

1. **리포지토리를 삭제하거나 비공개로 바꾸지 마세요.** NFC 키링에 위 주소가
   기록되어 있어, 리포가 사라지면 모든 키링이 죽습니다.
2. **`hidden-q1.html`과 `guide.html`의 파일명을 바꾸지 마세요.** 인쇄한 질문지의
   QR이 이 주소를 가리킵니다. 이름이 바뀌면 나눠준 종이의 QR이 전부 죽습니다.
   (QR 원본은 `poster-print/qr/`)

## 콘텐츠 수정 방법

| 무엇을 | 어떻게 |
|---|---|
| 히든 질문 내용 | `hidden-q1.html`의 `.paper-card` 안 문구 수정 후 push (주소가 그대로라 QR은 계속 유효) |
| 나눔 인도 안내 | `guide.html`의 `.paper-steps` 항목 수정 후 push |
| 히든 질문 추가 | `hidden-q2.html`을 `hidden-q1.html` 복사해 만들고, `index.html`의 `.fellowship-btns`에 버튼 한 줄 추가. 새 QR은 새 주소로 다시 생성해야 함 |
| 말씀·날짜·문구 | `index.html`에서 해당 텍스트 수정 후 push |
| 히어로 배경 | `images/poster-main.webp`를 같은 이름으로 교체 (정사각 이미지 권장 — `css/style.css`의 `.hero`가 `cover`로 깔음). 글씨가 안 읽히면 `.hero::before` 그라데이션 농도를 조절 |
| 포스터 추가 | 이미지를 `images/`에 넣고(장당 300KB 이하 권장) `index.html`의 `.carousel`에 `<img>` 한 줄 추가 후 push — 도트는 자동 생성됨(2장 이상일 때만). 프레임은 1:1 고정이고 `contain`이라, 세로 포스터를 넣어도 잘리지 않고 좌우에 여백이 생김 |
| 사진첩 그리드 | 드라이브 갤러리의 일자별 폴더에 올리면 해당 날짜 탭에 자동 표시 (js/main.js의 Drive API 키 필요) |

수정 후 배포: `git add -A && git commit -m "..." && git push` → 1~2분 내 반영.

> 이미지는 WebP로 넣으면 같은 화질에 용량이 1/3 수준입니다.
> (원본 5MB JPEG → 1400px WebP q80 기준 약 100KB. NFC로 여는 모바일 페이지라 용량이 곧 로딩 시간입니다.)

## NFC 태그 기록 방법

1. 태그는 **NTAG213** 이상 (다이소·쿠팡의 NFC 스티커/키링 대부분 해당)
2. 폰에 **NFC Tools** 앱(무료) 설치 → 쓰기 → URL/URI 레코드 →
   `https://jamjoongyouth.github.io/pray/` 입력 → 태그에 기록
3. 폰으로 태그를 찍어 페이지가 열리는지 확인
4. 확인 후 NFC Tools의 **잠금(Lock)** 실행 — 다른 사람이 덮어쓰는 사고 방지
   (잠금은 되돌릴 수 없으니 반드시 URL 확인 후 실행)
