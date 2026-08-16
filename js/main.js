/* ============================================================
   HIGH TECH INFORMÁTICA — Campo Grande/RJ
   Demo FASE 1 · Interações frontend (sem backend)
   ============================================================ */

/* ------------------------------------------------------------
   CONFIGURAÇÃO DE CONTATO
   Centralize aqui os dados reais da loja. Atualize em um só
   lugar quando o cliente confirmar os dados finais.
   ------------------------------------------------------------ */
const CONFIG = {
  whatsapp: "5521998488340",              // (21) 99848-8340 — confirmado na bio do Instagram
  whatsappMensagem: "Olá! Vim pelo site e quero um orçamento.",
  telefone: "+552131291253",              // (21) 3129-1253 — fixo
  email: "contato@hightechcg.com.br",
  instagram: "https://www.instagram.com/hightech_cg/",
  tiktok: "https://www.tiktok.com/@hightech_cg",
  google: "https://www.google.com/maps/search/High+Tech+Inform%C3%A1tica+Campo+Grande+RJ"
};

const waUrl = (msg) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ------------------------------------------------------------
   Auxiliar: respeitar prefers-reduced-motion
   ------------------------------------------------------------ */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ------------------------------------------------------------
   1. Ano dinâmico no rodapé
   ------------------------------------------------------------ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ------------------------------------------------------------
   2. Menu mobile (hambúrguer)
   ------------------------------------------------------------ */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

function toggleNav(forceClose) {
  const isOpen = nav.classList.toggle("open", forceClose === undefined ? !nav.classList.contains("open") : !forceClose);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => toggleNav());
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => toggleNav(true))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleNav(true);
  });
}

/* ------------------------------------------------------------
   3. Header com sombra ao rolar + botão voltar ao topo
   ------------------------------------------------------------ */
const header = document.getElementById("header");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle("scrolled", y > 10);
  if (toTop) toTop.classList.toggle("visible", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
  );
}

/* ------------------------------------------------------------
   4. Links com data-whats: atualiza href com a mensagem padrão
   ------------------------------------------------------------ */
document.querySelectorAll("[data-whats]").forEach((link) => {
  link.href = waUrl(CONFIG.whatsappMensagem);
});

/* ------------------------------------------------------------
   5. Scroll reveal (IntersectionObserver)
   ------------------------------------------------------------ */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el, i) => {
    const delay = (i % 3) * 90;
    el.style.setProperty("--reveal-delay", `${delay}ms`);
    revealObserver.observe(el);
  });
}

/* ------------------------------------------------------------
   6. Contadores animados (estatísticas do hero)
   ------------------------------------------------------------ */
function animateCounter(el) {
  const target = parseInt(el.dataset.counter, 10) || 0;
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll("[data-counter]");
if (counterEls.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));
}

/* ------------------------------------------------------------
   7. FAQ: fecha os demais ao abrir um item
   ------------------------------------------------------------ */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

/* ------------------------------------------------------------
   8. Formulário de orçamento (frontend only)
   Abre o WhatsApp com a mensagem preenchida. Nenhum dado é
   enviado para servidor nesta FASE 1.
   ------------------------------------------------------------ */
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = (form.nome.value || "").trim();
    const whats = (form.whats.value || "").trim();
    const assunto = form.assunto.value || "";
    const msg = (form.mensagem.value || "").trim();

    // Validação mínima
    if (!nome) {
      form.nome.focus();
      return;
    }
    if (!whats || whats.replace(/\D/g, "").length < 10) {
      form.whats.focus();
      return;
    }

    const texto = [
      `Olá! Me chamo ${nome}.`,
      `Assunto: ${assunto}.`,
      msg ? `Detalhes: ${msg}` : "",
      `Meu WhatsApp: ${whats}.`,
      "Vim pelo site."
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waUrl(texto), "_blank", "noopener");

    if (formNote) {
      formNote.hidden = false;
      form.reset();
      setTimeout(() => {
        formNote.hidden = true;
      }, 8000);
    }
  });
}

/* ------------------------------------------------------------
   9. Fallback de imagens
   Se uma imagem externa falhar, troca por um placeholder
   visual no mesmo estilo do site (evita imagem quebrada).
   ------------------------------------------------------------ */
function makeFallbackIcon() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "48");
  svg.setAttribute("height", "48");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const paths = [
    "M8 16l4-4 4 4M12 8v8",
    "M12 2 2 7l10 5 10-5-10-5z",
    "m2 17 10 5 10-5"
  ];
  paths.forEach((d) => {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
  });
  return svg;
}

function handleImageError(img) {
  const fallback = document.createElement("div");
  fallback.className = "media-fallback";
  fallback.setAttribute("role", "img");
  fallback.setAttribute("aria-label", img.alt || "Imagem ilustrativa");
  fallback.appendChild(makeFallbackIcon());
  img.replaceWith(fallback);
}

document.querySelectorAll("img[data-fallback]").forEach((img) => {
  img.addEventListener("error", () => handleImageError(img), { once: true });
  // Rede lenta/offline: força a checagem também após o load completo
  if (img.complete && img.naturalWidth === 0) handleImageError(img);
});
