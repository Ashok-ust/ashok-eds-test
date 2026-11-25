/**
 * loads and decorates the simple-card block
 * @param {Element} block The simple-card block element
 *
 * Authored fields (one row each, in order): text, link, linkText, linkType.
 * The link may arrive as an <a> or as a plain-text URL, so we normalise it into
 * a proper button and never leak the raw URL into the card body.
 */
const STYLES = ['primary', 'secondary'];

function looksLikeUrl(text) {
  return /^(https?:\/\/|\/|www\.|mailto:|tel:)/i.test(text) || /^[\w-]+(\.[\w-]+)+/.test(text);
}

export default function decorate(block) {
  const rows = [...block.children];

  // First row is the card text/body.
  const bodyCell = rows[0]?.querySelector(':scope > div') || rows[0];
  const bodyHtml = bodyCell ? bodyCell.innerHTML : '';

  // Remaining rows describe the button: href, label, style (in any order / any may be missing).
  let href = '';
  let label = '';
  let style = '';

  rows.slice(1).forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const anchor = cell.querySelector('a');
    const txt = cell.textContent.trim();

    if (anchor) {
      href = anchor.getAttribute('href') || href;
      label = label || anchor.textContent.trim();
    } else if (STYLES.includes(txt.toLowerCase())) {
      style = txt.toLowerCase();
    } else if (!href && looksLikeUrl(txt)) {
      href = txt;
    } else if (txt) {
      label = label || txt;
    }
  });

  // Normalise.
  if (href && !/^(https?:\/\/|\/|mailto:|tel:)/i.test(href)) href = `https://${href}`;
  if (!label) label = href;
  if (!style) style = 'primary';

  block.innerHTML = `
    <div class="simple-card-body">${bodyHtml}</div>
    ${href ? `<div class="simple-card-actions">
      <a class="button ${style}" href="${href}">${label}</a>
    </div>` : ''}
  `;
}
