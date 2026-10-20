
/* ============================================================
   KOKWANI CHAUKE WATER DRILLING — main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.getElementById("preloader").classList.add("hide");
    }, 900);
  });

  /* ---------- Navbar scroll state ---------- */
  var header = document.querySelector("header");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    if (toTop) {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var mMenu = document.querySelector(".mobile-menu");
  if (burger && mMenu) {
    burger.addEventListener("click", function () {
      burger.classList.toggle("open");
      mMenu.classList.toggle("open");
      document.body.style.overflow = mMenu.classList.contains("open") ? "hidden" : "";
    });
    mMenu.querySelectorAll("a").forEach(function (a, i) {
      a.style.transitionDelay = 0.08 * i + 0.1 + "s";
      a.addEventListener("click", function () {
        burger.classList.remove("open");
        mMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var d = e.target.getAttribute("data-delay");
        if (d) e.target.style.transitionDelay = d + "ms";
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      cio.unobserve(el);
      var target = parseInt(el.getAttribute("data-count"), 10);
      var dur = 1800, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("en-ZA").replace(/,/g, " ");
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString("en-ZA").replace(/,/g, " ");
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { cio.observe(c); });

  /* ---------- Hero parallax ---------- */
  var heroBg = document.querySelector(".hero-bg, .page-hero .ph-bg");
  if (heroBg) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) heroBg.style.transform = "translateY(" + y * 0.25 + "px) scale(1.08)";
    }, { passive: true });
  }

  /* ---------- Bubble canvas (hero) ---------- */
  var canvas = document.getElementById("bubbles");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var W, H, bubbles = [], mouse = { x: -999, y: -999 };
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    function Bubble() { this.reset(true); }
    Bubble.prototype.reset = function (init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.r = Math.random() * 5 + 1.5;
      this.speed = Math.random() * 0.6 + 0.25;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.35 + 0.08;
      this.wob = Math.random() * Math.PI * 2;
    };
    Bubble.prototype.step = function () {
      this.wob += 0.02;
      this.y -= this.speed;
      this.x += this.drift + Math.sin(this.wob) * 0.3;
      if (this.y < -20) this.reset(false);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(103,232,249," + this.alpha + ")";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + this.alpha * 0.9 + ")";
      ctx.fill();
    };
    for (var i = 0; i < 55; i++) bubbles.push(new Bubble());
    canvas.parentElement.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      bubbles.forEach(function (b) {
        var dx = b.x - mouse.x, dy = b.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && dist > 0.1) { b.x += (dx / dist) * 1.6; b.y += (dy / dist) * 1.6; }
        b.step();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Typewriter slogan ---------- */
  var tw = document.getElementById("typewriter");
  if (tw) {
    var phrases = JSON.parse(tw.getAttribute("data-phrases"));
    var pi = 0, ci = 0, deleting = false;
    (function type() {
      var full = phrases[pi];
      tw.textContent = full.slice(0, ci);
      var delay = deleting ? 40 : 90;
      if (!deleting && ci === full.length) { delay = 2200; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 500; }
      else ci += deleting ? -1 : 1;
      setTimeout(type, delay);
    })();
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll(".btn, .nav-cta, .faq-q").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var s = document.createElement("span");
      var size = Math.max(rect.width, rect.height);
      s.className = "ripple";
      s.style.width = s.style.height = size + "px";
      s.style.left = e.clientX - rect.left - size / 2 + "px";
      s.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(s);
      setTimeout(function () { s.remove(); }, 700);
    });
  });

  /* ---------- Card tilt + spotlight ---------- */
  document.querySelectorAll(".svc-card, .price-card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      if (window.matchMedia("(pointer:fine)").matches) {
        var rx = (py - 0.5) * -7, ry = (px - 0.5) * 7;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-8px)";
      }
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  /* ---------- Depth bars (pricing) ---------- */
  var fills = document.querySelectorAll(".depth-fill");
  if (fills.length) {
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute("data-w") + "%";
          fio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function (f) { fio.observe(f); });
  }

  /* ---------- Testimonial slider ---------- */
  var track = document.querySelector(".testi-track");
  if (track) {
    var slides = track.children.length;
    var dotsWrap = document.querySelector(".testi-dots");
    var idx = 0, timer;
    for (var d = 0; d < slides; d++) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Testimonial " + (d + 1));
      if (d === 0) b.classList.add("active");
      (function (n) {
        b.addEventListener("click", function () { go(n); restart(); });
      })(d);
      dotsWrap.appendChild(b);
    }
    var dots = dotsWrap.children;
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = "translateX(-" + idx * 100 + "%)";
      for (var k = 0; k < slides; k++) dots[k].classList.toggle("active", k === idx);
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 5500); }
    restart();
    /* swipe */
    var sx = 0;
    track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
    }, { passive: true });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = "0";
      });
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Contact form (mailto fallback) ---------- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var body = "Name: " + fd.get("name") + "%0APhone: " + fd.get("phone") +
        "%0ALocation: " + fd.get("location") + "%0APackage: " + fd.get("package") +
        "%0A%0AMessage: " + fd.get("message");
      window.location.href = "mailto:info@kokwanichauke.co.za?subject=Borehole Quote Request - " +
        encodeURIComponent(fd.get("name")) + "&body=" + body;
      var msg = document.querySelector(".form-msg");
      msg.style.display = "block";
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a, .mobile-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
})();
