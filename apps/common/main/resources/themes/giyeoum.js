/* Activate ONLYOFFICE's own Modern foundation before native layout measurements. */
(function () {
  let iconTheme;
  let reportedTheme;
  function applyNativeFoundation() {
    const body = document.body;
    const type = body.classList.contains("theme-giyeoum-dark")
      ? "dark"
      : body.classList.contains("theme-giyeoum-light")
        ? "light"
        : null;
    if (!type) return;
    const base = type === "dark" ? "theme-night" : "theme-white";
    const wrong =
      type === "dark"
        ? ["theme-type-light", "theme-white"]
        : ["theme-type-dark", "theme-night"];
    for (const name of wrong)
      if (body.classList.contains(name)) body.classList.remove(name);
    for (const name of [base, "theme-type-" + type, "theme-icons-cls-mod2"])
      if (!body.classList.contains(name)) body.classList.add(name);
    if (reportedTheme !== type) {
      reportedTheme = type;
      window.parent.postMessage({ type: "gion:theme", theme: type }, "*");
    }
    if (window.uitheme?.apply_icons_from_url && iconTheme !== type) {
      iconTheme = type;
      window.uitheme.apply_icons_from_url(
        "theme-giyeoum-" + type,
        new URL("resources/img/v2/", location.href).href,
      );
    }
  }
  applyNativeFoundation();
  new MutationObserver(applyNativeFoundation).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
