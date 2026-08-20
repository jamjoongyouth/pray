// 오늘 날짜(방문자 로컬 기준)를 YYYY-MM-DD로. 사진첩 탭과 일정표가 함께 쓴다.
// UTC로 만들면 한국 새벽에 날짜가 하루 밀리므로 로컬 값만 조합한다.
function prayToday() {
  var d = new Date();
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

// 오늘과 날짜 차이가 가장 작은 날. 모임 며칠 전부터 다음 모임이 열려 있고,
// 시작 전이면 첫날, 다 끝난 뒤면 마지막 날이 된다.
// 앞뒤 거리가 같으면 지난 날을 남긴다 (사진첩은 이미 올라온 쪽이 유용하다).
function prayDayGap(date, today) {
  return Math.abs(Date.parse(date) - Date.parse(today)) / 86400000;
}

function prayDefaultIndex(dates) {
  var today = prayToday();
  var idx = 0;
  for (var i = 1; i < dates.length; i++) {
    if (prayDayGap(dates[i], today) < prayDayGap(dates[idx], today)) idx = i;
  }
  return idx;
}

// 드라이브 갤러리: 일자별 폴더의 사진을 날짜 탭으로 전환하며 표시.
// API_KEY가 비어 있으면 아무것도 하지 않음 (버튼만 노출).
(function () {
  var carousel = document.getElementById("photo-grid");
  var tabsBox = document.getElementById("photo-tabs");
  if (!carousel || !tabsBox) return;

  var API_KEY = "AIzaSyDYCXSH17rvI77rvE-yIVNLMyExHecK3uw"; // 리퍼러 제한: jamjoongyouth.github.io
  if (!API_KEY) return;

  var DAYS = [
    { label: "8/7", date: "2026-08-07", folderId: "1EKgNQXJ5wa1OhF-gf5gIXSMBEHWvMxXH" },
    { label: "8/14", date: "2026-08-14", folderId: "1kfK6GrxQvVnBEA8c86AXibpwc7TEoUJR" },
    { label: "8/21", date: "2026-08-21", folderId: "1as7h7UqsA8efuUtqgoYq7vhb7tUUCABN" },
    { label: "8/23", date: "2026-08-23", folderId: "1WWtna5J2MimMUItMwN8kJGDFasCYzjbK" }
  ];

  var gridAll = document.getElementById("photo-grid-all");
  var counter = document.getElementById("photo-counter");
  var toggle = document.getElementById("photo-toggle");
  var upload = document.getElementById("photo-upload");
  var cache = {};

  var makeItem = function (f) {
    var a = document.createElement("a");
    a.href = "https://drive.google.com/file/d/" + f.id + "/view";
    a.target = "_blank";
    a.rel = "noopener";
    var img = document.createElement("img");
    img.src = "https://drive.google.com/thumbnail?id=" + f.id + "&sz=w400";
    img.alt = f.name;
    img.loading = "lazy";
    a.appendChild(img);
    return a;
  };

  var render = function (files) {
    carousel.innerHTML = "";
    carousel.hidden = false;
    if (gridAll) {
      gridAll.innerHTML = "";
      gridAll.hidden = true;
    }
    if (toggle) {
      toggle.hidden = files.length === 0;
      toggle.textContent = "전체보기 ∨";
    }
    if (counter) {
      counter.hidden = false;
      counter.textContent = files.length
        ? "사진 " + files.length + "장 · 옆으로 넘겨보세요"
        : "아직 사진이 없어요 · 첫 사진을 올려주세요";
    }
    files.forEach(function (f) {
      carousel.appendChild(makeItem(f));
      if (gridAll) gridAll.appendChild(makeItem(f));
    });
  };

  var select = function (i) {
    var day = DAYS[i];
    tabsBox.querySelectorAll(".photo-tab").forEach(function (t, j) {
      t.classList.toggle("active", j === i);
    });
    if (upload) {
      upload.href = "https://drive.google.com/drive/folders/" + day.folderId;
    }
    if (cache[day.folderId]) {
      render(cache[day.folderId]);
      return;
    }
    var url = "https://www.googleapis.com/drive/v3/files"
      + "?q=" + encodeURIComponent("'" + day.folderId + "' in parents and mimeType contains 'image/' and trashed = false")
      + "&orderBy=createdTime desc&pageSize=60&fields=files(id,name)&key=" + API_KEY;
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        cache[day.folderId] = data.files || [];
        render(cache[day.folderId]);
      })
      .catch(function () {}); // 실패해도 페이지는 정상 동작
  };

  if (gridAll && toggle) {
    toggle.addEventListener("click", function () {
      var opening = gridAll.hidden;
      gridAll.hidden = !opening;
      carousel.hidden = opening;
      toggle.textContent = opening ? "접기 ∧" : "전체보기 ∨";
    });
  }

  DAYS.forEach(function (day, i) {
    var tab = document.createElement("button");
    tab.type = "button";
    tab.className = "photo-tab";
    tab.textContent = day.label;
    tab.addEventListener("click", function () {
      select(i);
    });
    tabsBox.appendChild(tab);
  });

  select(prayDefaultIndex(DAYS.map(function (d) { return d.date; })));
})();

// 일정표: 오늘에 해당하는 날만 펼친다 (HTML의 open은 JS 없는 경우의 대비).
(function () {
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".day-schedule[data-date]")
  );
  if (!items.length) return;

  var target = items[prayDefaultIndex(items.map(function (el) {
    return el.getAttribute("data-date");
  }))];
  items.forEach(function (el) {
    el.open = el === target;
  });
})();

// 사진첩 라이트박스: 썸네일을 누르면 크게 띄우고, 다시 누르거나 X·Esc로 닫는다.
// 썸네일은 드라이브 응답 후에 생기므로 document에 위임해서 잡는다.
(function () {
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  if (!box || !img) return;

  var lastFocus = null;
  var token = 0; // 큰 이미지 로딩 중에 닫거나 다른 사진을 열면 이전 응답을 버린다

  var open = function (fileId, alt, thumbSrc) {
    var mine = ++token;

    img.alt = alt || "";
    img.src = thumbSrc; // 이미 받아둔 작은 썸네일이라 즉시 뜬다
    img.classList.add("is-loading");

    var full = new Image();
    full.onload = function () {
      if (mine !== token) return;
      img.src = full.src;
      img.classList.remove("is-loading");
    };
    full.onerror = function () {
      if (mine !== token) return;
      img.classList.remove("is-loading"); // 실패하면 작은 썸네일이라도 선명하게
    };
    full.src = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1200";

    box.hidden = false;
    document.body.style.overflow = "hidden";
    lastFocus = document.activeElement;
    var closeBtn = document.getElementById("lightbox-close");
    if (closeBtn) closeBtn.focus();
  };

  var close = function () {
    token++;
    box.hidden = true;
    img.removeAttribute("src");
    img.classList.remove("is-loading");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var link = e.target.closest(".photo-carousel a, .photo-grid a");
    if (!link) return;
    // 새 탭으로 열기(cmd/ctrl/shift 클릭)는 드라이브 원본으로 그대로 보낸다
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    var m = link.href.match(/\/file\/d\/([^/?#]+)/);
    if (!m) return;
    var thumb = link.querySelector("img");
    e.preventDefault();
    open(m[1], thumb ? thumb.alt : "", thumb ? thumb.src : "");
  });

  // 배경·사진·X 어디를 눌러도 닫힘 (X 클릭도 여기로 버블링된다)
  box.addEventListener("click", close);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !box.hidden) close();
  });
})();
