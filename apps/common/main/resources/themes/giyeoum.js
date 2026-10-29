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

  // Replace only the native header's brand slot. The original title, menus,
  // keyboard commands and About dialog continue to be owned by ONLYOFFICE.
  let brandSlot;
  function applyBrand() {
    if (brandSlot?.isConnected && brandSlot.dataset.giyeoumBrand) return;
    brandSlot = document.getElementById("header-logo");
    if (!brandSlot) return;
    brandSlot.dataset.giyeoumBrand = "true";
    const link = document.createElement("a");
    link.className = "giyeoum-brand";
    link.href = location.ancestorOrigins?.[0] || "#";
    link.target = "_top";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.parent.postMessage({ type: "gion:home" }, "*");
    });
    link.setAttribute("aria-label", "기여움 DOCS 홈");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "86 302 829 400");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    // The two visible paths in the supplied short logo; no background rectangle.
    for (const shape of [
      "M130.196 302H619L530.609 702H286.206L330.844 502H86L130.196 302Z",
      "M915 302H670.888L582 702H826.554L915 302Z",
    ]) {
      const path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", shape);
      svg.append(path);
    }
    const divider = document.createElement("span");
    divider.className = "giyeoum-brand-divider";
    divider.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = "DOCS";
    link.append(svg, divider, label);
    brandSlot.replaceChildren(link);
    // Let the native header measure the new brand before positioning its tabs.
    window.dispatchEvent(new Event("resize"));
  }
  applyBrand();
  new MutationObserver(applyBrand).observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Chrome follows the workspace theme. Document pages always remain light;
  // theme controls in the native View/File panels are disabled after layout.
  let policyApplied = false;
  function keepDocumentLight() {
    const themes = window.Common?.UI?.Themes;
    if (!themes?.api) return;
    themes.setContentTheme("light", true);
    themes.api.asc_setContentDarkMode?.(false);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "gion:document-ready") return;
    const themes = window.Common?.UI?.Themes;
    if (!themes) return;
    themes.setAvailable(false);
    keepDocumentLight();
    if (!policyApplied) {
      policyApplied = true;
      Common.NotificationCenter.on("contenttheme:dark", (dark) => {
        if (dark) keepDocumentLight();
      });
    }
  });
})();
