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

// 드라이브 갤러리: 공개 폴더의 이미지 목록을 읽어 스와이프 캐러셀로 표시.
// API_KEY가 비어 있으면 아무것도 하지 않음 (캐러셀 숨김, 버튼만 노출).
(function () {
  var carousel = document.getElementById("photo-grid");
  if (!carousel) return;

  var FOLDER_ID = "1JtS_8SzZGzlj1LxoTJoDX-SlgN7s1N3e";
  var API_KEY = "AIzaSyDYCXSH17rvI77rvE-yIVNLMyExHecK3uw"; // 리퍼러 제한: jamjoongyouth.github.io
  if (!API_KEY) return;

  var url = "https://www.googleapis.com/drive/v3/files"
    + "?q=" + encodeURIComponent("'" + FOLDER_ID + "' in parents and mimeType contains 'image/' and trashed = false")
    + "&orderBy=createdTime desc&pageSize=60&fields=files(id,name)&key=" + API_KEY;

  fetch(url)
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.files || !data.files.length) return;
      data.files.forEach(function (f) {
        var a = document.createElement("a");
        a.href = "https://drive.google.com/file/d/" + f.id + "/view";
        a.target = "_blank";
        a.rel = "noopener";
        var img = document.createElement("img");
        img.src = "https://drive.google.com/thumbnail?id=" + f.id + "&sz=w800";
        img.alt = f.name;
        img.loading = "lazy";
        a.appendChild(img);
        carousel.appendChild(a);
      });

      var counter = document.getElementById("photo-counter");
      if (counter) {
        counter.hidden = false;
        var update = function () {
          var idx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
          counter.textContent = (idx + 1) + " / " + data.files.length;
        };
        update();
        carousel.addEventListener("scroll", update, { passive: true });
      }
    })
    .catch(function () {}); // 실패해도 페이지는 정상 동작
})();
