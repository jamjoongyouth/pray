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

// 드라이브 갤러리: 일자별 폴더의 사진을 날짜 탭으로 전환하며 표시.
// API_KEY가 비어 있으면 아무것도 하지 않음 (버튼만 노출).
(function () {
  var carousel = document.getElementById("photo-grid");
  var tabsBox = document.getElementById("photo-tabs");
  if (!carousel || !tabsBox) return;

  var API_KEY = "AIzaSyDYCXSH17rvI77rvE-yIVNLMyExHecK3uw"; // 리퍼러 제한: jamjoongyouth.github.io
  if (!API_KEY) return;

  var DAYS = [
    { label: "8/7 (금)", folderId: "1EKgNQXJ5wa1OhF-gf5gIXSMBEHWvMxXH" },
    { label: "8/14 (금)", folderId: "1kfK6GrxQvVnBEA8c86AXibpwc7TEoUJR" },
    { label: "8/21 (금)", folderId: "1as7h7UqsA8efuUtqgoYq7vhb7tUUCABN" },
    { label: "8/23 (주일)", folderId: "1WWtna5J2MimMUItMwN8kJGDFasCYzjbK" }
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

  select(0);
})();
