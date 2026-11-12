(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav
  const btn = $(".menu-btn"), links = $(".nav-links");
  const closeMenu = () => { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => btn.setAttribute("aria-expanded", links.classList.toggle("open")));
  links.addEventListener("click", (e) => e.target.closest("a") && closeMenu());
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
  $("#year").textContent = new Date().getFullYear();

  // scroll: progress, header, back-to-top
  const bar = $(".progress i"), header = $(".site-header"), top = $(".to-top");
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header.classList.toggle("scrolled", scrollY > 20);
    top.classList.toggle("show", scrollY > 700);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  // active nav link
  const sections = $$("main section[id]");
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // reveal
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });

  // count-up
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "", plain = "plain" in el.dataset;
    if (reduce) return;
    const start = plain ? end - 60 : 0, t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      el.textContent = v + suf; if (p < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: 0.6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  // spotlight cards
  $$(".card").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  // hub diagram
  const dests = ["Johannesburg", "Pretoria", "Rustenburg", "Steelpoort", "Brits", "Lowveld", "Maputo", "Ressano"];
  const g = $(".spokes"), NS = "http://www.w3.org/2000/svg";
  dests.forEach((d, i) => {
    const a = (i / dests.length) * Math.PI * 2 - Math.PI / 2, far = i >= 6, R = far ? 150 : 128;
    const x = Math.cos(a) * R, y = Math.sin(a) * R;
    const mk = (n, at) => { const el = document.createElementNS(NS, n); for (const k in at) el.setAttribute(k, at[k]); return el; };
    g.append(mk("line", { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: x, y2: y, class: "spoke" + (far ? " far" : "") }));
    g.append(mk("circle", { cx: x, cy: y, r: 5, class: "node" + (far ? " far" : "") }));
    const t = mk("text", { x: Math.cos(a) * (R + 12), y: Math.sin(a) * (R + 12) + 4, "text-anchor": Math.cos(a) > 0.3 ? "start" : Math.cos(a) < -0.3 ? "end" : "middle", class: "lbl" });
    t.textContent = d; g.append(t);
  });

  // lightbox
  const lb = $("#lightbox"), lbImg = $("img", lb);
  $$(".shot").forEach((s) => s.addEventListener("click", () => {
    lbImg.src = s.dataset.src; lbImg.alt = s.dataset.alt;
    lb.showModal ? lb.showModal() : lb.setAttribute("open", "");
  }));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("close")) lb.close(); });

  // quote form -> mailto / whatsapp
  const form = $("#quote"), note = $(".form-note"), wa = $("#wa");
  const compose = () => {
    const f = new FormData(form), v = (k) => (f.get(k) || "").toString().trim();
    return `Quote request\nName: ${v("name")}\nPhone: ${v("phone")}\nCargo: ${v("cargo")}\nFrom: ${v("from")}\nTo: ${v("to")}\nDetails: ${v("msg")}`;
  };
  form.addEventListener("input", () => { wa.href = "https://wa.me/27838222487?text=" + encodeURIComponent(compose()); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.name.value.trim() || !form.phone.value.trim() || !form.cargo.value) { note.textContent = "Please add your name, phone and cargo."; return; }
    note.textContent = "Opening your email app…";
    location.href = "mailto:masdevalia@lantic.net?subject=" + encodeURIComponent("Quote request: " + form.cargo.value) + "&body=" + encodeURIComponent(compose());
  });
})();
