// Скрипт для основных интерактивных элементов сайта

document.addEventListener('DOMContentLoaded', function () {
  // Переключение темы
  var themeButton = document.querySelector('.theme-toggle');

  function setTheme() {
    if (document.body.classList.contains('dark-theme')) {
      themeButton.textContent = '☀️ Светлая';
    } else {
      themeButton.textContent = '🌙 Тёмная';
    }
  }

  if (themeButton) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
    }

    setTheme();

    themeButton.addEventListener('click', function () {
      document.body.classList.toggle('dark-theme');

      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }

      setTheme();
    });
  }

  // Мобильное меню
  var menuButton = document.querySelector('.menu-toggle');
  var header = document.querySelector('.header-inner');
  var nav = document.querySelector('.nav');

  if (menuButton && header) {
    menuButton.addEventListener('click', function () {
      header.classList.toggle('nav-open');
    });

    if (nav) {
      var navLinks = nav.querySelectorAll('a');

      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function () {
          header.classList.remove('nav-open');
        });
      }
    }
  }

  // Слайдер на странице товара
  var slider = document.querySelector('[data-slider]');

  if (slider) {
    var mainImage = slider.querySelector('.slider-image');
    var thumbs = slider.querySelectorAll('.thumb');
    var prevButton = slider.querySelector('.slider-prev');
    var nextButton = slider.querySelector('.slider-next');
    var currentSlide = 0;

    function showSlide(number) {
      if (number < 0) {
        number = thumbs.length - 1;
      }

      if (number >= thumbs.length) {
        number = 0;
      }

      currentSlide = number;

      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove('active');
      }

      thumbs[currentSlide].classList.add('active');
      mainImage.src = thumbs[currentSlide].getAttribute('data-image');
      mainImage.alt = thumbs[currentSlide].getAttribute('data-alt');
    }

    for (var i = 0; i < thumbs.length; i++) {
      thumbs[i].addEventListener('click', function () {
        for (var j = 0; j < thumbs.length; j++) {
          if (thumbs[j] === this) {
            showSlide(j);
          }
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(currentSlide - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(currentSlide + 1);
      });
    }
  }

  // Поиск, фильтры и сортировка каталога
  var productList = document.querySelector('[data-product-list]');

  if (productList) {
    var cards = productList.querySelectorAll('.product-card');
    var categoryInputs = document.querySelectorAll('[data-filter-category]');
    var weightSelect = document.querySelector('[data-filter-weight]');
    var searchInput = document.querySelector('[data-catalog-search]');
    var sortSelect = document.querySelector('[data-catalog-sort]');
    var resetButton = document.querySelector('[data-reset-filters]');
    var countText = document.querySelector('[data-catalog-count]');
    var emptyText = document.querySelector('[data-catalog-empty]');

    // Запоминаем исходный порядок карточек
    for (var i = 0; i < cards.length; i++) {
      cards[i].setAttribute('data-index', i);
    }

    function sortCards() {
      var cardsArray = [];

      for (var i = 0; i < cards.length; i++) {
        cardsArray.push(cards[i]);
      }

      cardsArray.sort(function (a, b) {
        if (sortSelect.value === 'price-asc') {
          return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
        }

        if (sortSelect.value === 'price-desc') {
          return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
        }

        return Number(a.getAttribute('data-index')) - Number(b.getAttribute('data-index'));
      });

      for (var i = 0; i < cardsArray.length; i++) {
        productList.appendChild(cardsArray[i]);
      }
    }

    function filterProducts() {
      var selectedCategories = [];
      var searchText = searchInput.value.toLowerCase().trim();
      var visibleCount = 0;

      for (var i = 0; i < categoryInputs.length; i++) {
        if (categoryInputs[i].checked) {
          selectedCategories.push(categoryInputs[i].value);
        }
      }

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var category = card.getAttribute('data-category');
        var weight = Number(card.getAttribute('data-weight'));
        var cardText = card.textContent.toLowerCase();
        var showCard = true;

        if (selectedCategories.length > 0 && selectedCategories.indexOf(category) === -1) {
          showCard = false;
        }

        if (weightSelect.value === 'under-1' && weight >= 1) {
          showCard = false;
        }

        if (weightSelect.value === 'one-to-two' && (weight < 1 || weight > 2)) {
          showCard = false;
        }

        if (weightSelect.value === 'over-2' && weight <= 2) {
          showCard = false;
        }

        if (searchText !== '' && cardText.indexOf(searchText) === -1) {
          showCard = false;
        }

        if (showCard) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      }

      sortCards();
      countText.textContent = 'Показано ' + visibleCount + ' из ' + cards.length + ' изделий';
      emptyText.hidden = visibleCount !== 0;
    }

    for (var i = 0; i < categoryInputs.length; i++) {
      categoryInputs[i].addEventListener('change', filterProducts);
    }

    weightSelect.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', filterProducts);
    sortSelect.addEventListener('change', filterProducts);

    resetButton.addEventListener('click', function () {
      for (var i = 0; i < categoryInputs.length; i++) {
        categoryInputs[i].checked = false;
      }

      weightSelect.value = 'any';
      searchInput.value = '';
      sortSelect.value = 'popular';
      filterProducts();
    });

    filterProducts();
  }
});
