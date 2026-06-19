document.addEventListener('DOMContentLoaded', function () {
  const themeButtons = document.querySelectorAll('.theme-toggle');

  function setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('sweet-theme', theme);
    themeButtons.forEach(function (button) {
      button.textContent = isDark ? '☀️ Светлая' : '🌙 Тёмная';
      button.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    });
  }

  setTheme(localStorage.getItem('sweet-theme') || 'light');
  themeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setTheme(document.body.classList.contains('dark-theme') ? 'light' : 'dark');
    });
  });

  const headerInner = document.querySelector('.header-inner');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNavigation = document.querySelector('.nav');

  function closeMenu() {
    if (!headerInner || !menuToggle) return;
    headerInner.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
  }

  if (headerInner && menuToggle && siteNavigation) {
    menuToggle.addEventListener('click', function () {
      const isOpen = headerInner.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    siteNavigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.matchMedia('(min-width: 1181px)').addEventListener('change', function (event) {
      if (event.matches) closeMenu();
    });
  }

  const slider = document.querySelector('[data-slider]');
  if (!slider) return;

  const image = slider.querySelector('.slider-image');
  const thumbs = Array.from(slider.querySelectorAll('.thumb'));
  let current = 0;

  function showSlide(index) {
    current = (index + thumbs.length) % thumbs.length;
    thumbs.forEach(function (thumb) { thumb.classList.remove('active'); });
    const activeThumb = thumbs[current];
    activeThumb.classList.add('active');
    image.src = activeThumb.dataset.image;
    image.alt = activeThumb.dataset.alt || '';
  }

  thumbs.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () { showSlide(index); });
  });
  slider.querySelector('.slider-prev').addEventListener('click', function () { showSlide(current - 1); });
  slider.querySelector('.slider-next').addEventListener('click', function () { showSlide(current + 1); });
});
