(function () {
  'use strict';

  var root = document.documentElement;
  var themeButton = document.getElementById('theme-toggle');
  var themeMeta = document.getElementById('theme-color-meta');
  var systemTheme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function setTheme(theme, persist) {
    var isDark = theme === 'dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(isDark));
      themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeButton.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#080b12' : '#f5f7fb');
    }

    if (persist) {
      try {
        localStorage.setItem('caixin-theme', isDark ? 'dark' : 'light');
      } catch (error) {
        // Theme persistence is optional when storage is unavailable.
      }
    }
  }

  setTheme(root.getAttribute('data-theme') || 'light', false);

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
  }

  if (systemTheme && systemTheme.addEventListener) {
    systemTheme.addEventListener('change', function (event) {
      var hasSavedTheme = false;
      try {
        hasSavedTheme = Boolean(localStorage.getItem('caixin-theme'));
      } catch (error) {
        hasSavedTheme = false;
      }
      if (!hasSavedTheme) setTheme(event.matches ? 'dark' : 'light', false);
    });
  }

  var motionButtons = document.querySelectorAll('[data-motion-toggle]');

  function updateMotionControls() {
    var reduced = root.classList.contains('motion-reduced');
    motionButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(!reduced));
      button.classList.toggle('is-off', reduced);
      button.setAttribute('title', reduced ? 'Enable interface motion' : 'Reduce interface motion');
    });
  }

  motionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var reduceMotion = !root.classList.contains('motion-reduced');
      root.classList.toggle('motion-reduced', reduceMotion);
      try {
        localStorage.setItem('caixin-motion', reduceMotion ? 'reduced' : 'auto');
      } catch (error) {
        // Motion persistence is optional when storage is unavailable.
      }
      updateMotionControls();
    });
  });
  updateMotionControls();

  document.querySelectorAll('[data-si-scene]').forEach(function (scene) {
    var world = scene.querySelector('[data-si-world]');
    var card = scene.closest('.si-scene-card');
    var insight = card ? card.querySelector('[data-si-insight]') : null;
    var nodes = scene.querySelectorAll('.si-node');
    var frame = null;

    function activateNode(node) {
      nodes.forEach(function (item) {
        item.classList.toggle('is-active', item === node);
        item.setAttribute('aria-pressed', String(item === node));
      });

      if (!insight) return;
      var index = node.querySelector('span');
      insight.querySelector('[data-si-insight-index]').textContent = index ? index.textContent : '';
      insight.querySelector('[data-si-insight-title]').textContent = node.getAttribute('data-insight-title');
      insight.querySelector('[data-si-insight-text]').textContent = node.getAttribute('data-insight-text');
    }

    nodes.forEach(function (node) {
      node.setAttribute('aria-pressed', 'false');
      node.addEventListener('pointerenter', function () { activateNode(node); });
      node.addEventListener('focus', function () { activateNode(node); });
      node.addEventListener('click', function () { activateNode(node); });
    });

    if (nodes.length) activateNode(nodes[0]);

    if (!world || !window.matchMedia('(pointer: fine)').matches) return;

    scene.addEventListener('pointermove', function (event) {
      if (root.classList.contains('motion-reduced')) return;
      var rect = scene.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        world.style.setProperty('--scene-rotate-x', (-y * 9).toFixed(2) + 'deg');
        world.style.setProperty('--scene-rotate-y', (x * 12).toFixed(2) + 'deg');
      });
    });

    scene.addEventListener('pointerleave', function () {
      if (frame) cancelAnimationFrame(frame);
      world.style.setProperty('--scene-rotate-x', '0deg');
      world.style.setProperty('--scene-rotate-y', '0deg');
    });
  });

  document.querySelectorAll('[data-publications]').forEach(function (section) {
    var buttons = section.querySelectorAll('[data-publication-filter]');
    var cards = Array.prototype.slice.call(section.querySelectorAll('.paper-box'));
    var status = section.querySelector('[data-publication-status]');

    function applyFilter(filter) {
      var visible = 0;

      cards.forEach(function (card) {
        var badge = card.querySelector('.badge');
        var badgeText = badge ? badge.textContent.trim().toLowerCase() : '';
        var show = filter === 'all' ||
          (filter === '2026' && badgeText.indexOf('2026') !== -1) ||
          (filter === 'accepted' && badgeText.indexOf('under review') === -1 && badgeText.indexOf('technical report') === -1) ||
          (filter === 'preprint' && (badgeText.indexOf('under review') !== -1 || badgeText.indexOf('technical report') !== -1));

        card.hidden = !show;
        if (show) visible += 1;
      });

      buttons.forEach(function (button) {
        var active = button.getAttribute('data-publication-filter') === filter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      if (status) status.textContent = visible + (visible === 1 ? ' item' : ' items');
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.getAttribute('data-publication-filter'));
      });
    });

    applyFilter('all');
  });

  var revealItems = document.querySelectorAll(
    '.research-home .paper-box, .research-home .si-pillars article, .research-home .si-news li, .research-home .si-awards li, .research-home .si-education li'
  );

  if ('IntersectionObserver' in window && !root.classList.contains('motion-reduced')) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(function (item, index) {
      item.classList.add('si-reveal');
      item.style.setProperty('--reveal-delay', (index % 4) * 55 + 'ms');
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-revealed'); });
  }
}());
