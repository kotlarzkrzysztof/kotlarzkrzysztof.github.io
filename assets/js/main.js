// Publication filtering for index.html (modernized)
function filterCategory(category, btn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  if (btn && btn.classList) btn.classList.add('active');

  const rows = document.querySelectorAll('.pub-row');
  rows.forEach(row => {
    const cat = row.dataset.category || '';
    row.style.display = category === 'all' || cat === category ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a[href*="#"]');

  function setActiveNavLink(targetLink) {
    navLinks.forEach(link => {
      const isActive = Boolean(targetLink && link === targetLink);
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(btn => {
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category || btn.textContent.trim().toLowerCase();
      filterCategory(cat, btn);
    });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const cat = btn.dataset.category || btn.textContent.trim().toLowerCase();
        filterCategory(cat, btn);
      }
    });
  });

  // Theme toggle (match reference): use 'pb-theme' key and data-theme-toggle button
  const THEME_KEY = 'pb-theme';
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');

  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (saved) applyTheme(saved);
  // if not saved, head inline script already set theme based on system pref

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  if (navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => setActiveNavLink(link));
    });

    const sections = Array.from(navLinks)
      .map(link => {
        const id = link.getAttribute('href')?.split('#')[1];
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    if (sections.length) {
      const updateActiveSection = () => {
        const probe = 110;
        let activeId = null;

        sections.forEach(section => {
          if (section.getBoundingClientRect().top <= probe) {
            activeId = section.id;
          }
        });

        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
          activeId = sections[sections.length - 1].id;
        }

        if (activeId) {
          const activeLink = document.querySelector(`.nav-menu a[href$="#${activeId}"]`);
          setActiveNavLink(activeLink);
        } else {
          setActiveNavLink(null);
        }
      };

      updateActiveSection();

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
      }, { passive: true });
    }
  }
});
