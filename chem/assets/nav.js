/* ============================================================
   移动端抽屉导航（化学站）
   作用：≤820px 时把 .site-nav 收进右侧抽屉，避免横向滚动藏菜单。
   说明：不改变任何既有 DOM，只在运行时追加按钮与抽屉；
         JS 未加载时 .site-nav 照常横向滚动，功能不丢。
   ============================================================ */
(function () {
  document.documentElement.classList.add('js-nav');

  function init() {
    var head = document.querySelector('.site-head .wrap');
    var nav = document.querySelector('.site-nav');
    if (!head || !nav) return;
    if (document.querySelector('.nav-toggle')) return;

    var act = document.querySelector('.head-act') || head;

    /* 汉堡按钮 */
    var toggle = document.createElement('button');
    toggle.className = 'icon-btn nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', '打开菜单');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML =
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    act.appendChild(toggle);

    /* 抽屉 */
    var brandEl = document.querySelector('.logo-txt');
    var brand = brandEl ? brandEl.textContent.trim() : '菜单';
    var mask = document.createElement('div');
    mask.className = 'nav-mask';
    var drawer = document.createElement('aside');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML =
      '<div class="nd-head"><span class="nd-title">' + brand + '</span>' +
      '<button class="nd-x" type="button" aria-label="关闭菜单">✕</button></div>' +
      '<nav class="nd-list"></nav>';

    var list = drawer.querySelector('.nd-list');
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
      var c = document.createElement('a');
      c.href = a.getAttribute('href');
      c.textContent = a.textContent.trim();
      if (a.classList.contains('on')) c.className = 'on';
      list.appendChild(c);
    });

    /* 底部：搜索 + 深浅色 */
    var foot = document.createElement('div');
    foot.className = 'nd-foot';
    var searchA = document.querySelector('.head-act a.icon-btn');
    if (searchA) {
      var sb = document.createElement('a');
      sb.className = 'btn';
      sb.href = searchA.getAttribute('href');
      sb.textContent = '搜索';
      foot.appendChild(sb);
    }
    var tb = document.createElement('button');
    tb.className = 'btn';
    tb.type = 'button';
    tb.textContent = '浅色 / 深色';
    tb.addEventListener('click', function () {
      var t = document.getElementById('theme-btn');
      if (t) t.click();
    });
    foot.appendChild(tb);
    drawer.appendChild(foot);

    document.body.appendChild(mask);
    document.body.appendChild(drawer);

    function open() {
      document.body.classList.add('nav-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() {
      document.body.classList.remove('nav-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', open);
    mask.addEventListener('click', close);
    drawer.querySelector('.nd-x').addEventListener('click', close);
    list.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* 实验页头部由引擎动态渲染，稍等再试几次（RETRY） */
  var tries = 0;
  function boot() {
    init();
    if (!document.querySelector('.nav-toggle') && tries++ < 12) setTimeout(boot, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
