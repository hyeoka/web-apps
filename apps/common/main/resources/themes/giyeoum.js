/* Custom themes must have one base type. Upstream initialization can retain
   theme-type-light while adding a custom dark theme, leaving incorrect icons. */
(function () {
  function normalizeType() {
    var body = document.body;
    var type = body.classList.contains('theme-giyeoum-dark') ? 'dark'
      : body.classList.contains('theme-giyeoum-light') ? 'light' : null;
    if (!type) return;
    var wrong = 'theme-type-' + (type === 'dark' ? 'light' : 'dark');
    var correct = 'theme-type-' + type;
    if (body.classList.contains(wrong)) body.classList.remove(wrong);
    if (!body.classList.contains(correct)) body.classList.add(correct);
  }
  normalizeType();
  new MutationObserver(normalizeType).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
