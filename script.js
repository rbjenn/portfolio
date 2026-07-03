const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('primary-menu');

const setScrolled = () => {
  nav?.classList.toggle('scrolled', window.scrollY > 18);
};

setScrolled();
window.addEventListener('scroll', setScrolled, { passive: true });

const closeMenu = () => {
  nav?.classList.remove('open');
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.setAttribute('aria-label', 'Open menu');
  navLinks?.setAttribute('aria-hidden', window.matchMedia('(max-width: 960px)').matches ? 'true' : 'false');
};

hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  nav?.classList.toggle('open', !expanded);
  hamburger.setAttribute('aria-expanded', String(!expanded));
  hamburger.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
  navLinks?.setAttribute('aria-hidden', String(expanded));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu();
    hamburger?.focus();
  }
});

window.addEventListener('resize', closeMenu);

document.querySelectorAll('.optional-img').forEach((img) => {
  if (img.complete && img.naturalWidth === 0) {
    img.classList.add('is-hidden');
  }

  img.addEventListener('error', () => {
    img.classList.add('is-hidden');
  });
});

const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in-view'));
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form || !statusEl) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot?.value) {
      statusEl.textContent = 'Message sent.';
      statusEl.className = 'form-status success';
      form.reset();
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please complete your name, email, and message.';
      statusEl.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const previousLabel = submitBtn?.textContent || 'Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = 'Message sent. I will get back to you soon.';
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        statusEl.textContent = data?.error || 'Something went wrong. Please try again later.';
        statusEl.className = 'form-status error';
      }
    } catch {
      statusEl.textContent = 'Network error. Please check your connection and try again.';
      statusEl.className = 'form-status error';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = previousLabel;
      }
    }
  });
});
