(function () {
  'use strict';

  function initBurgerMenu() {
    var burgerMenu = document.querySelector('.burger-menu');
    var navLinks = document.querySelector('.nav-links');

    if (burgerMenu && navLinks) {
      burgerMenu.addEventListener('click', function () {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      // Close menu when clicking on a link
      var links = navLinks.querySelectorAll('.nav-link');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          burgerMenu.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function (e) {
        if (!burgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
          burgerMenu.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
    }
  }

  // Initialize burger menu on DOM ready
  document.addEventListener('DOMContentLoaded', initBurgerMenu);
})();
