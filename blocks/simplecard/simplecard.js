/**
 * loads and decorates the simplecard block
 * @param {Element} block The simplecard block element
 *
 * Authored fields: text (richtext) + a button (link / linkText / linkType).
 */
const STYLES = ['primary', 'secondary'];

export default function decorate(block) {
  const rows = [...block.children];
  const anchor = block.querySelector('a');

  // Text = everything that is not the button row or a standalone style keyword.
  let text = '';
  let style = '';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    if (cell.querySelector('a')) return;
    const keyword = cell.textContent.trim().toLowerCase();
    if (!cell.querySelector('*') && STYLES.includes(keyword)) {
      style = keyword;
      return;
    }
    text += cell.innerHTML;
  });

  if (anchor && !style) {
    style = STYLES.find((s) => anchor.classList.contains(s)) || 'primary';
  }

  const href = anchor ? anchor.getAttribute('href') : '';
  const label = anchor ? anchor.textContent.trim() : '';

  block.innerHTML = `
    <div class="simplecard-body">${text}</div>
    ${anchor ? `<div class="simplecard-actions">
      <a class="button ${style}" href="${href}">${label}</a>
    </div>` : ''}
  `;
}
