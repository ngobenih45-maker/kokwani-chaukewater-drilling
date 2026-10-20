/* Kokwani Chauke Water Drilling - shared scripts */
(function(){
  var PHONE_WA = '27837477953';

  // Loader
  window.addEventListener('load', function(){
    var l = document.getElementById('loader');
    if(l) setTimeout(function(){ l.classList.add('hide'); }, 350);
  });

  // Header scroll state
  var header = document.querySelector('header');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Mobile menu
  var burger = document.querySelector('.burger'), menu = document.querySelector('.menu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open'); menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ burger.classList.remove('open'); menu.classList.remove('open'); });
    });
  }

  // Scroll reveal
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        var t = e.target.querySelector('.tank i'); if(t) t.style.height = t.dataset.lvl;
        io.unobserve(e.target);
      }
    });
  }, {threshold:.15}) : null;
  document.querySelectorAll('.reveal').forEach(function(el){
    if(io) io.observe(el); else el.classList.add('in');
  });
  document.querySelectorAll('.tank i').forEach(function(t){
    t.dataset.lvl = getComputedStyle(t).getPropertyValue('--lvl') || '60%';
    t.style.height = '6%';
  });

  // Counters
  var cio = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', n = 0, step = Math.max(1, Math.ceil(end/60));
      var timer = setInterval(function(){
        n += step; if(n >= end){ n = end; clearInterval(timer); }
        el.textContent = n + suf;
      }, 25);
      cio.unobserve(el);
    });
  }, {threshold:.5}) : null;
  document.querySelectorAll('[data-count]').forEach(function(el){
    if(cio) cio.observe(el); else el.textContent = el.dataset.count + (el.dataset.suffix || '');
  });

  // Button ripple
  document.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('click', function(ev){
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement('span');
      sp.className = 'ripple';
      sp.style.cssText = 'width:'+s+'px;height:'+s+'px;left:'+(ev.clientX-r.left-s/2)+'px;top:'+(ev.clientY-r.top-s/2)+'px';
      b.appendChild(sp); setTimeout(function(){ sp.remove(); }, 650);
    });
  });

  // Rising bubbles canvas
  var cv = document.getElementById('bubbles');
  if(cv && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var ctx = cv.getContext('2d'), W, H, bubbles = [];
    function size(){ W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
    size(); window.addEventListener('resize', size);
    var count = window.innerWidth < 760 ? 22 : 46;
    function mk(init){
      return {x:Math.random()*W, y:init ? Math.random()*H : H+20, r:2+Math.random()*9, v:.3+Math.random()*1.1, w:Math.random()*Math.PI*2, a:.15+Math.random()*.35};
    }
    for(var i=0;i<count;i++) bubbles.push(mk(true));
    (function loop(){
      ctx.clearRect(0,0,W,H);
      bubbles.forEach(function(b,i){
        b.y -= b.v; b.w += .03; b.x += Math.sin(b.w)*.5;
        if(b.y < -20) bubbles[i] = mk(false);
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,6.283);
        ctx.fillStyle = 'rgba(185,241,255,'+(b.a*.35)+')'; ctx.fill();
        ctx.strokeStyle = 'rgba(185,241,255,'+b.a+')'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.22,0,6.283);
        ctx.fillStyle = 'rgba(255,255,255,'+b.a+')'; ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  // Contact form -> WhatsApp
  var form = document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = new FormData(form);
      var msg = 'Hello Kokwani Chauke Water Drilling,%0A%0A' +
        'Name: ' + encodeURIComponent(f.get('name')) + '%0A' +
        'Phone: ' + encodeURIComponent(f.get('phone')) + '%0A' +
        'Location: ' + encodeURIComponent(f.get('location')) + '%0A' +
        'Package: ' + encodeURIComponent(f.get('package')) + '%0A' +
        'Message: ' + encodeURIComponent(f.get('message'));
      window.open('https://wa.me/' + PHONE_WA + '?text=' + msg, '_blank');
    });
  }

  // Year
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();
