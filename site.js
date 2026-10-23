const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navlinks');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

const table = document.querySelector('.compare');
if (table) {
  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll';
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Surgical visualization comparison. Scroll horizontally on small screens.');
  table.before(wrapper);
  wrapper.append(table);
  const hint = document.createElement('p');
  hint.className = 'table-hint';
  hint.textContent = 'Swipe across to compare approaches';
  wrapper.before(hint);
}

const quotes = [
  { text: '“The visualization is a game changer.”', credit: 'Breast surgeon, cadaveric evaluation' },
  { text: '“I’m standing up straight, it’s amazing.”', credit: 'Operating surgeon, initial cadaveric evaluation' },
  { text: '“Intuitive and easy to incorporate.”', credit: 'Fellowship-trained breast surgeon' }
];
let quoteIndex = 1;
const quoteCenter = document.querySelector('.centerquote');
const quoteSides = document.querySelectorAll('.sidequote');
function setQuote(element, quote) {
  element.replaceChildren(document.createTextNode(quote.text));
  const credit = document.createElement('span');
  credit.className = 'quotecredit';
  credit.textContent = quote.credit;
  element.append(credit);
}
function renderQuotes() {
  if (!quoteCenter) return;
  setQuote(quoteCenter, quotes[quoteIndex]);
  if (quoteSides.length === 2) {
    setQuote(quoteSides[0], quotes[(quoteIndex + quotes.length - 1) % quotes.length]);
    setQuote(quoteSides[1], quotes[(quoteIndex + 1) % quotes.length]);
  }
  document.querySelectorAll('.carousel-dots span').forEach((dot, i) => dot.classList.toggle('active', i === quoteIndex));
}
document.querySelector('[aria-label="Previous surgeon quote"]')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + quotes.length - 1) % quotes.length;
  renderQuotes();
});
document.querySelector('[aria-label="Next surgeon quote"]')?.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  renderQuotes();
});
renderQuotes();

// Preserve the existing Netlify form identities and show success only after a successful response.
document.querySelectorAll('form[data-netlify]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending…';
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!response.ok) throw new Error('Submission was not accepted');
      form.reset();
      status.textContent = form.getAttribute('name') === 'revelascope-newsletter'
        ? 'Thank you. You’re subscribed.'
        : 'Thank you. Your inquiry has been received.';
    } catch {
      status.textContent = 'Your submission could not be sent. Please try again or email contact@revelascope.com.';
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });
});
