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
