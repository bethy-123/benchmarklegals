async function loadPartial(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  mount.innerHTML = await res.text();
}

function setActiveNav() {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const pageToKey = {
    "index.html": "home",
    "": "home",
    "about.html": "about",
    "team.html": "team",
    "blogs.html": "blogs",
    "contact.html": "contact",
    "immigration.html": "immigration",
  };

  const key = pageToKey[path];
  if (!key) return;

  document.querySelectorAll("[data-nav]").forEach(a => a.classList.remove("active"));
  document.querySelectorAll(`[data-nav="${key}"]`).forEach(a => a.classList.add("active"));
}

function wireHeaderBehaviour() {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const dd = qs("#ddImm");
  const ddBtn = dd ? qs(".ddToggle", dd) : null;

  function closeDropdown(){
    if(!dd) return;
    dd.classList.remove("open");
    ddBtn?.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown(){
    if(!dd) return;
    const open = dd.classList.toggle("open");
    ddBtn?.setAttribute("aria-expanded", open ? "true" : "false");
  }

  ddBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  dd?.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover:hover)").matches) {
      dd.classList.add("open");
      ddBtn?.setAttribute("aria-expanded","true");
    }
  });

  dd?.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover:hover)").matches) closeDropdown();
  });

  document.addEventListener("click", (e) => {
    if(dd && dd.classList.contains("open") && !dd.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeDropdown();
  });

  const header = qs("#siteHeader");
  const burger = qs("#burger");
  burger?.addEventListener("click", () => header.classList.toggle("menuOpen"));

  qsa(".mobilePanel a").forEach(a => {
    a.addEventListener("click", () => header.classList.remove("menuOpen"));
  });

  const mImmBtn = qs("#mImmBtn");
  const mImmSub = qs("#mImmSub");
  mImmBtn?.addEventListener("click", () => {
    const open = mImmSub.style.display === "block";
    mImmSub.style.display = open ? "none" : "block";
    mImmBtn.setAttribute("aria-expanded", open ? "false" : "true");
  });

  // Language switch
  function switchLanguage(lang){
    let path = window.location.pathname;

    const base = path.startsWith("/benchmarklegals/") ? "/benchmarklegals" : "";
    let cleanPath = base ? path.replace(base, "") : path;

    if(cleanPath === "/" || cleanPath === "") cleanPath = "/index.html";

    if(lang === "tr"){
      if(!cleanPath.startsWith("/tr/")){
        window.location.href = base + "/tr" + cleanPath;
      }
    }

    if(lang === "en"){
      cleanPath = cleanPath.replace(/^\/tr/, "");
      window.location.href = base + cleanPath;
    }
  }

  qs("#langEN")?.addEventListener("click", () => switchLanguage("en"));
  qs("#langTR")?.addEventListener("click", () => switchLanguage("tr"));
  qs("#mobileLangEN")?.addEventListener("click", () => switchLanguage("en"));
  qs("#mobileLangTR")?.addEventListener("click", () => switchLanguage("tr"));
}

(async function initSharedLayout(){
  try {
  const isTurkishPage = location.pathname.includes("/tr/");
const partialPath = isTurkishPage ? "../partials/" : "partials/";
const suffix = isTurkishPage ? "-tr" : "";

await loadPartial("#headerMount", partialPath + "header" + suffix + ".html");
await loadPartial("#footerMount", partialPath + "footer" + suffix + ".html");

    setActiveNav();
    wireHeaderBehaviour();
  } catch (err) {
    console.error(err);
  }
})();
