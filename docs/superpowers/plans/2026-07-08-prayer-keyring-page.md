# 수련회 NFC 키링 랜딩 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 청년교구 여름수련회(기도 주제) NFC 키링을 찍으면 열리는 모바일 랜딩 페이지를 만들어 GitHub Pages에 무료 배포한다.

**Architecture:** 순수 HTML/CSS/JS 정적 페이지 1장. 히어로 → 말씀 카드 → 포스터 갤러리(스크롤 스냅 캐러셀) → 교제내용(노션 공개 페이지 링크) 순서의 단일 스크롤 페이지. GitHub Pages로 배포하며 NFC에는 이 불변 URL을 기록한다.

**Tech Stack:** HTML5, CSS3(scroll-snap, 그라데이션 배경), 바닐라 JS(캐러셀 도트만), GitHub Pages, gh CLI(계정: `dugeun`).

## Global Constraints

- 비용 0원: 외부 유료 서비스·CDN·웹폰트 요청 금지 (시스템 폰트 스택만 사용)
- 프레임워크·빌드 도구 금지: index.html + css/style.css + js/main.js 3파일 구조
- 모바일 우선: 기준 뷰포트 390px, 데스크톱은 max-width 콘텐츠 중앙 정렬로만 대응
- 배포 URL: `https://dugeun.github.io/pray/` — 리포명 `pray`, 브랜치 `main`, 루트 서빙
- 프로젝트 루트: `/Users/geunx2/Documents/AIKAMP/pray` (git 초기화 완료, main 브랜치)
- 임시 콘텐츠(말씀·날짜·노션 링크·포스터)는 `<!-- TEMP-CONTENT -->` 주석으로 표시 — Task 7에서 실제 콘텐츠로 교체
- 커밋 메시지 끝에 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` 추가

**정적 페이지 검증 방식:** 단위 테스트 대신 로컬 서버(`python3 -m http.server`) + `curl | grep` 스모크 체크 + 최종 브라우저 확인을 사용한다. 각 태스크의 "검증" 스텝이 테스트 사이클을 대신한다.

---

### Task 1: 페이지 뼈대 + 히어로 + 밤하늘 배경

**Files:**
- Create: `index.html`
- Create: `css/style.css`

**Interfaces:**
- Produces: `index.html`의 시맨틱 구조(`header.hero`, `main`, `footer.footer`)와 `css/style.css`의 CSS 변수(`--bg-top`, `--bg-bottom`, `--ink`, `--gold`, `--card`). 이후 태스크는 `main` 안에 `<section>`을 추가하고 이 변수들을 사용한다.

- [ ] **Step 1: index.html 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2026 청년교구 여름수련회 · 기도</title>
  <meta name="description" content="2026 청년교구 여름수련회 — 주제 말씀, 포스터, 교제 내용">
  <meta name="theme-color" content="#0b1026">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="stars" aria-hidden="true"></div>

  <header class="hero">
    <p class="hero-label">2026 청년교구 여름수련회</p>
    <h1 class="hero-title">기도</h1>
    <!-- TEMP-CONTENT: 실제 수련회 날짜로 교체 -->
    <p class="hero-dates">2026. 8월</p>
  </header>

  <main>
  </main>

  <footer class="footer">
    <p>청년교구 여름수련회 · 기도</p>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: css/style.css 작성**

```css
:root {
  --bg-top: #0b1026;
  --bg-bottom: #1b2350;
  --ink: #eef1ff;
  --ink-dim: #aab2d8;
  --gold: #e8c874;
  --card: rgba(255, 255, 255, 0.06);
  --radius: 20px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont,
    "Apple SD Gothic Neo", "Malgun Gothic", "Segoe UI", sans-serif;
  color: var(--ink);
  background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
  background-attachment: fixed;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  word-break: keep-all;
}

/* 밤하늘 별: radial-gradient 점 3겹 + 은은한 반짝임 */
.stars {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent 51%),
    radial-gradient(1px 1px at 70% 15%, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 45% 60%, #fff 50%, transparent 51%),
    radial-gradient(1px 1px at 85% 45%, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 10% 75%, #fff 50%, transparent 51%),
    radial-gradient(1px 1px at 60% 85%, #fff 50%, transparent 51%),
    radial-gradient(1px 1px at 35% 10%, #fff 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 90% 80%, #fff 50%, transparent 51%);
  opacity: 0.7;
  animation: twinkle 4s ease-in-out infinite alternate;
}

@keyframes twinkle {
  from { opacity: 0.4; }
  to { opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
  .stars { animation: none; }
}

.hero {
  text-align: center;
  padding: 96px 24px 64px;
}

.hero-label {
  font-size: 0.95rem;
  letter-spacing: 0.14em;
  color: var(--ink-dim);
  margin-bottom: 16px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--gold);
  text-shadow: 0 0 40px rgba(232, 200, 116, 0.35);
  margin-bottom: 16px;
}

.hero-dates {
  font-size: 1rem;
  color: var(--ink-dim);
}

main {
  max-width: 560px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  gap: 48px;
}

.section-title {
  font-size: 0.9rem;
  letter-spacing: 0.16em;
  color: var(--gold);
  text-align: center;
  margin-bottom: 20px;
}

.footer {
  text-align: center;
  padding: 40px 20px 56px;
  color: var(--ink-dim);
  font-size: 0.85rem;
}
```

- [ ] **Step 3: 로컬 서버로 스모크 체크**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
python3 -m http.server 8123 &
sleep 1
curl -s http://localhost:8123/ | grep -c '기도'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8123/css/style.css
kill %1
```

Expected: 첫 grep은 `2` 이상, style.css는 `200`.

- [ ] **Step 4: Commit**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add index.html css/style.css
git commit -m "feat: 페이지 뼈대와 히어로, 밤하늘 배경

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 주제 말씀 카드 섹션

**Files:**
- Modify: `index.html` (`<main>` 내부)
- Modify: `css/style.css` (파일 끝에 추가)

**Interfaces:**
- Consumes: Task 1의 `main` 요소, CSS 변수 `--card`, `--radius`, `--ink-dim`, `--gold`
- Produces: `section.verse-card#verse` — Task 7이 이 안의 텍스트만 교체한다

- [ ] **Step 1: index.html의 `<main>` 안에 말씀 카드 추가**

`<main>` 여는 태그 바로 다음에 삽입:

```html
    <section class="verse-card" id="verse">
      <h2 class="section-title">주제 말씀</h2>
      <!-- TEMP-CONTENT: 실제 주제 말씀으로 교체 -->
      <blockquote class="verse-text">
        “쉬지 말고 기도하라”
      </blockquote>
      <p class="verse-ref">데살로니가전서 5장 17절</p>
    </section>
```

- [ ] **Step 2: css/style.css 끝에 말씀 카드 스타일 추가**

```css
/* ── 말씀 카드 ── */
.verse-card {
  background: var(--card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  padding: 36px 28px;
  text-align: center;
  backdrop-filter: blur(6px);
}

.verse-text {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.6;
  margin-bottom: 16px;
}

.verse-ref {
  font-size: 0.95rem;
  color: var(--ink-dim);
}
```

- [ ] **Step 3: 스모크 체크**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
python3 -m http.server 8123 &
sleep 1
curl -s http://localhost:8123/ | grep -c 'verse-card\|verse-text\|verse-ref'
kill %1
```

Expected: `3`

- [ ] **Step 4: Commit**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add index.html css/style.css
git commit -m "feat: 주제 말씀 카드 섹션

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: 포스터 갤러리 캐러셀

**Files:**
- Create: `images/poster-1.svg`, `images/poster-2.svg`, `images/poster-3.svg` (임시 포스터)
- Create: `js/main.js`
- Modify: `index.html` (`#verse` 섹션 뒤)
- Modify: `css/style.css` (파일 끝에 추가)

**Interfaces:**
- Consumes: Task 2의 `#verse` 섹션(그 뒤에 삽입), CSS 변수
- Produces: `section.gallery#gallery` 안의 `.carousel`(img 나열)과 `.dots`. `js/main.js`는 `.carousel`의 img 개수만큼 도트를 자동 생성하므로, Task 7에서 img를 교체/추가해도 JS 수정 불필요

- [ ] **Step 1: 임시 포스터 SVG 3장 생성**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
mkdir -p images
for i in 1 2 3; do
cat > "images/poster-$i.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="600" height="800" fill="#1b2350"/>
  <text x="300" y="380" text-anchor="middle" fill="#e8c874" font-size="48" font-family="sans-serif">POSTER $i</text>
  <text x="300" y="440" text-anchor="middle" fill="#aab2d8" font-size="24" font-family="sans-serif">임시 이미지</text>
</svg>
EOF
done
ls images/
```

Expected: `poster-1.svg poster-2.svg poster-3.svg`

- [ ] **Step 2: index.html의 `#verse` 섹션 닫는 태그 뒤에 갤러리 추가**

```html
    <section class="gallery" id="gallery">
      <h2 class="section-title">포스터 갤러리</h2>
      <div class="carousel" id="carousel">
        <!-- TEMP-CONTENT: 실제 포스터 이미지로 교체 -->
        <img src="images/poster-1.svg" alt="수련회 포스터 1" loading="lazy">
        <img src="images/poster-2.svg" alt="수련회 포스터 2" loading="lazy">
        <img src="images/poster-3.svg" alt="수련회 포스터 3" loading="lazy">
      </div>
      <div class="dots" id="dots" role="tablist" aria-label="포스터 넘기기"></div>
    </section>
```

- [ ] **Step 3: js/main.js 작성**

```js
// 캐러셀 도트: img 개수만큼 생성, 스크롤 위치에 따라 활성 표시
(function () {
  var carousel = document.getElementById("carousel");
  var dotsBox = document.getElementById("dots");
  if (!carousel || !dotsBox) return;

  var slides = carousel.querySelectorAll("img");
  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "포스터 " + (i + 1));
    dot.addEventListener("click", function () {
      carousel.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" });
    });
    dotsBox.appendChild(dot);
  });

  var dots = dotsBox.querySelectorAll(".dot");
  carousel.addEventListener("scroll", function () {
    var idx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === idx);
    });
  }, { passive: true });
})();
```

- [ ] **Step 4: css/style.css 끝에 캐러셀 스타일 추가**

```css
/* ── 포스터 갤러리 ── */
.carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  border-radius: var(--radius);
}

.carousel::-webkit-scrollbar { display: none; }

.carousel img {
  width: 100%;
  flex-shrink: 0;
  scroll-snap-align: center;
  border-radius: var(--radius);
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background: var(--card);
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.dot.active {
  background: var(--gold);
  transform: scale(1.25);
}
```

- [ ] **Step 5: 스모크 체크**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
python3 -m http.server 8123 &
sleep 1
curl -s http://localhost:8123/ | grep -c 'poster-'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8123/js/main.js
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8123/images/poster-1.svg
kill %1
```

Expected: `3`, `200`, `200`

- [ ] **Step 6: Commit**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add index.html css/style.css js/main.js images/
git commit -m "feat: 포스터 갤러리 스크롤 스냅 캐러셀

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: 교제내용 버튼 섹션

**Files:**
- Modify: `index.html` (`#gallery` 섹션 뒤)
- Modify: `css/style.css` (파일 끝에 추가)

**Interfaces:**
- Consumes: Task 3의 `#gallery` 섹션(그 뒤에 삽입), CSS 변수
- Produces: `a.notion-btn` — Task 7이 `href`만 실제 노션 공개 URL로 교체한다

- [ ] **Step 1: index.html의 `#gallery` 섹션 닫는 태그 뒤에 추가**

```html
    <section class="fellowship" id="fellowship">
      <h2 class="section-title">교제 내용</h2>
      <p class="fellowship-desc">수련회 교제 내용과 나눔 자료는<br>아래에서 확인할 수 있어요.</p>
      <!-- TEMP-CONTENT: href를 실제 노션 공개 페이지 URL로 교체 -->
      <a class="notion-btn" href="https://www.notion.so" target="_blank" rel="noopener">교제내용 보러가기 →</a>
    </section>
```

- [ ] **Step 2: css/style.css 끝에 스타일 추가**

```css
/* ── 교제 내용 ── */
.fellowship {
  text-align: center;
}

.fellowship-desc {
  color: var(--ink-dim);
  line-height: 1.7;
  margin-bottom: 24px;
}

.notion-btn {
  display: inline-block;
  padding: 16px 36px;
  border-radius: 999px;
  background: var(--gold);
  color: #1b1503;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  box-shadow: 0 6px 24px rgba(232, 200, 116, 0.3);
  transition: transform 0.15s;
}

.notion-btn:active {
  transform: scale(0.97);
}
```

- [ ] **Step 3: 스모크 체크**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
python3 -m http.server 8123 &
sleep 1
curl -s http://localhost:8123/ | grep -c 'notion-btn'
kill %1
```

Expected: `1`

- [ ] **Step 4: Commit**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add index.html css/style.css
git commit -m "feat: 교제내용 노션 링크 섹션

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: 운영 가이드 README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 없음 (문서만)
- Produces: 운영자용 가이드 — 이후 유지보수의 기준 문서

- [ ] **Step 1: README.md 작성**

```markdown
# 청년교구 여름수련회 · 기도 — NFC 키링 페이지

NFC 키링을 찍으면 열리는 수련회 랜딩 페이지입니다.

- **배포 주소**: https://dugeun.github.io/pray/
- **구조**: `index.html` + `css/style.css` + `js/main.js` (프레임워크 없음)

## ⚠️ 반드시 지켜야 할 것

1. **리포지토리를 삭제하거나 비공개로 바꾸지 마세요.** NFC 키링에 위 주소가
   기록되어 있어, 리포가 사라지면 모든 키링이 죽습니다.
2. **노션 교제내용 페이지의 "웹에 공개" 설정을 끄지 마세요.** 끄면 페이지의
   "교제내용 보러가기" 버튼이 죽습니다.

## 콘텐츠 수정 방법

| 무엇을 | 어떻게 |
|---|---|
| 교제내용 | 노션 페이지에서 직접 수정 (즉시 반영, 재배포 불필요) |
| 말씀·날짜·문구 | `index.html`에서 해당 텍스트 수정 후 push |
| 포스터 추가 | 이미지를 `images/`에 넣고(장당 300KB 이하 권장) `index.html`의 `.carousel`에 `<img>` 한 줄 추가 후 push — 도트는 자동 생성됨 |

수정 후 배포: `git add -A && git commit -m "..." && git push` → 1~2분 내 반영.

## NFC 태그 기록 방법

1. 태그는 **NTAG213** 이상 (다이소·쿠팡의 NFC 스티커/키링 대부분 해당)
2. 폰에 **NFC Tools** 앱(무료) 설치 → 쓰기 → URL/URI 레코드 →
   `https://dugeun.github.io/pray/` 입력 → 태그에 기록
3. 폰으로 태그를 찍어 페이지가 열리는지 확인
4. 확인 후 NFC Tools의 **잠금(Lock)** 실행 — 다른 사람이 덮어쓰는 사고 방지
   (잠금은 되돌릴 수 없으니 반드시 URL 확인 후 실행)
```

- [ ] **Step 2: Commit**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add README.md
git commit -m "docs: 운영 가이드 README

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: GitHub Pages 배포

**Files:**
- 없음 (배포 작업만)

**Interfaces:**
- Consumes: Task 1~5의 커밋 완료된 main 브랜치
- Produces: 라이브 URL `https://dugeun.github.io/pray/` — NFC에 기록할 최종 주소

- [ ] **Step 1: GitHub 리포 생성 + push**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
gh repo create pray --public --source=. --remote=origin --push
```

Expected: `https://github.com/dugeun/pray` 생성 및 push 완료 메시지.

- [ ] **Step 2: GitHub Pages 활성화 (main 브랜치 루트)**

```bash
gh api -X POST repos/dugeun/pray/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Expected: JSON 응답에 `"html_url": "https://dugeun.github.io/pray/"` 포함.
(이미 활성화된 경우 409 — 그러면 `gh api repos/dugeun/pray/pages`로 상태 확인.)

- [ ] **Step 3: 배포 완료 대기 및 확인**

```bash
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w "%{http_code}" https://dugeun.github.io/pray/)
  echo "try $i: $code"
  [ "$code" = "200" ] && break
  sleep 15
done
curl -s https://dugeun.github.io/pray/ | grep -c '기도'
```

Expected: 몇 분 안에 `200`, grep은 `2` 이상.

- [ ] **Step 4: 사용자 확인 요청**

사용자에게 폰에서 `https://dugeun.github.io/pray/`를 열어 디자인·동작(갤러리 스와이프, 버튼)을 확인해 달라고 요청한다. **NFC 기록은 Task 7(실제 콘텐츠 교체) 완료 후 진행해도 되고, URL은 불변이므로 지금 기록해도 된다**는 점을 안내한다.

---

### Task 7: 실제 콘텐츠 교체 (사용자 입력 필요)

**Files:**
- Modify: `index.html` (TEMP-CONTENT 주석 위치 3곳)
- Modify: `images/` (실제 포스터로 교체)

**Interfaces:**
- Consumes: 사용자 제공 — ① 주제 말씀(구절·본문), ② 수련회 정확한 이름·날짜, ③ 실제 포스터 이미지 파일, ④ 노션 공개 페이지 URL
- Produces: 최종 라이브 페이지

**차단 조건:** 사용자 입력 4가지가 모두 도착할 때까지 이 태스크는 시작할 수 없다. 일부만 도착하면 도착한 것만 부분 교체·배포해도 된다 (URL 불변이므로 안전).

- [ ] **Step 1: `index.html`에서 `TEMP-CONTENT` 주석 3곳의 내용을 실제 값으로 교체**

교체 위치: `.hero-dates`(날짜), `.verse-text`/`.verse-ref`(말씀), `.notion-btn`의 `href`(노션 URL). 교체 후 해당 `<!-- TEMP-CONTENT ... -->` 주석 삭제.

- [ ] **Step 2: 실제 포스터로 교체**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
# 사용자 제공 이미지를 images/에 복사한 뒤, 장당 300KB 초과 시 압축:
sips -Z 1200 --setProperty formatOptions 75 -s format jpeg images/원본.png --out images/poster-1.jpg
```

`index.html`의 `.carousel` 내 `<img src>`를 실제 파일명으로 교체하고, 임시 SVG는 삭제(`git rm images/poster-*.svg`).

- [ ] **Step 3: 남은 TEMP-CONTENT가 없는지 확인**

```bash
grep -rn "TEMP-CONTENT" index.html || echo "clean"
```

Expected: `clean` (부분 교체 배포인 경우 남은 항목이 의도한 것인지 확인)

- [ ] **Step 4: 배포 및 라이브 확인**

```bash
cd /Users/geunx2/Documents/AIKAMP/pray
git add -A
git commit -m "feat: 실제 수련회 콘텐츠 반영

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
git push
sleep 90
curl -s https://dugeun.github.io/pray/ | grep -c "TEMP-CONTENT" || echo "live clean"
```

Expected: `live clean`

- [ ] **Step 5: 사용자에게 최종 확인 + NFC 기록 안내**

폰에서 최종 페이지 확인 후, README의 "NFC 태그 기록 방법" 절차대로 키링에 기록하도록 안내한다.
