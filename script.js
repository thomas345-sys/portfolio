// script.js - Interactions (no contentReference, no extra notes)

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

/* Mobile nav */
const navToggle = $(".nav-toggle");
const navLinks = $(".nav-links");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  $$(".nav-link").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }));
}

/* Active nav on scroll */
const sections = ["about", "skills", "projects", "experience", "contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map();
$$(".nav-link").forEach(a => {
  const href = a.getAttribute("href");
  if (href && href.startsWith("#")) navMap.set(href.slice(1), a);
});

function setActiveNav() {
  const y = window.scrollY + 120;
  let current = sections[0]?.id || "about";
  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }
  navMap.forEach((a) => a.classList.remove("active"));
  if (navMap.get(current)) navMap.get(current).classList.add("active");
}
window.addEventListener("scroll", setActiveNav);
setActiveNav();

/* Reveal animations */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => io.observe(el));

/* Count-up stats */
function animateCount(el, to) {
  const duration = 850;
  const t0 = performance.now();

  function frame(t) {
    const p = Math.min((t - t0) / duration, 1);
    const val = Math.round(to * (1 - Math.pow(1 - p, 3)));
    el.textContent = val;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = Number(el.dataset.count || "0");
    animateCount(el, to);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });

$$("[data-count]").forEach(el => statObserver.observe(el));

/* Project filtering */
const filterButtons = $$(".chip[data-filter]");
const projectCards = $$(".project-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

/* Project modal */
const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalTags = $("#modalTags");

function openModal(card){
  modalImg.src = card.dataset.img || "";
  modalTitle.textContent = card.dataset.title || "Project";
  modalDesc.textContent = card.dataset.desc || "";
  modalTags.innerHTML = "";

  const tags = (card.dataset.tags || "").split(",").map(t => t.trim()).filter(Boolean);
  tags.forEach(t => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    modalTags.appendChild(span);
  });

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

projectCards.forEach(card => card.addEventListener("click", () => openModal(card)));
$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

/* Tilt effect */
function attachTilt(el) {
  const rect = () => el.getBoundingClientRect();

  function onMove(e){
    const r = rect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    const rotY = (x - 0.5) * 10;
    const rotX = (0.5 - y) * 10;

    el.style.transform = `translateY(-7px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  function onLeave(){
    el.style.transform = "";
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
}

$$("[data-tilt]").forEach(attachTilt);

/* Contact form -> mailto */
const form = $("#contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = encodeURIComponent(fd.get("name"));
    const email = encodeURIComponent(fd.get("email"));
    const message = encodeURIComponent(fd.get("message"));

    const subject = `Portfolio Inquiry - ${decodeURIComponent(name)}`;
    const body = `Name: ${decodeURIComponent(name)}\nEmail: ${decodeURIComponent(email)}\n\n${decodeURIComponent(message)}`;

    window.location.href = `mailto:evanschege35@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.reset();
  });
}

/* Footer year */
$("#year").textContent = new Date().getFullYear();

/* ==========================
   Dynamic typing headline
   ========================== */

const dynamicEl = document.getElementById("dynamicText");

const phrases = [
  "building modern websites",
  "data annotation and labeling",
  "technical support",
  "pairwise comparisons and QA",
  "clean UI and responsive design"
];

let pIndex = 0;
let charIndex = 0;
let typing = true;

function typeLoop() {
  if (!dynamicEl) return;

  const current = phrases[pIndex];

  if (typing) {
    charIndex++;
    dynamicEl.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      typing = false;
      setTimeout(typeLoop, 1100); // pause at full text
      return;
    }
  } else {
    charIndex--;
    dynamicEl.textContent = current.slice(0, charIndex);

    if (charIndex === 0) {
      typing = true;
      pIndex = (pIndex + 1) % phrases.length;
    }
  }

  const speed = typing ? 45 : 25;
  setTimeout(typeLoop, speed);
}

typeLoop();