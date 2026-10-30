// KADR Studio site: sticky-nav border, reveal on scroll, play looping demo videos only while visible.
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nav = document.querySelector(".nav");
  var onScroll = function () { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-loop]"));
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
    if (!reduce) videos.forEach(function (v) { v.preload = "auto"; v.play().catch(function () {}); });
    return;
  }

  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealer.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(function (el) { revealer.observe(el); });

  if (reduce) {
    // No autoplay: the poster stays, the visitor can start a clip with the native controls.
    videos.forEach(function (v) { v.controls = true; });
    return;
  }
  var player = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.preload !== "auto") v.preload = "auto"; var p = v.play(); if (p) p.catch(function () {}); }
      else if (!v.paused) v.pause();
    });
  }, { threshold: 0.25 });
  videos.forEach(function (v) { v.muted = true; player.observe(v); });
})();
