
/* -------------------- UTILIDADES -------------------- */
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

/* ---------- MOVER ANO NO RODAPÉ ---------- */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
});

/* -------------------- THEME (Light/Dark) -------------------- */
const themeToggle = $('#theme-toggle');
const root = document.documentElement;
const THEME_KEY = 'portfolio-theme';

function applyTheme(theme){
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem(THEME_KEY, theme);
}

// carregar preferência
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) applyTheme(savedTheme);

// alternar
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

/* -------------------- SMOOTH SCROLL NAVIGATION -------------------- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const href = link.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }
  }
});

/* ---------- TYPING EFFECT (hero) ---------- */
class TypeWriter {
  constructor(element, phrases = [], delay = 100, pause = 1500) {
    this.el = element;
    this.phrases = phrases;
    this.delay = delay;
    this.pause = pause;
    this.phraseIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.tick();
  }
  tick(){
    const current = this.phrases[this.phraseIndex % this.phrases.length];
    let displayed = current.substring(0, this.charIndex);
    this.el.textContent = displayed;

    if (!this.isDeleting) {
      this.charIndex++;
      if (this.charIndex > current.length) {
        this.isDeleting = true;
        setTimeout(()=>this.tick(), this.pause);
        return;
      }
    } else {
      this.charIndex--;
      if (this.charIndex < 0) {
        this.isDeleting = false;
        this.phraseIndex++;
      }
    }
    setTimeout(()=>this.tick(), this.isDeleting ? this.delay/2 : this.delay);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const typingEl = document.querySelector('.typing');
  if (typingEl) {
    const phrases = JSON.parse(typingEl.dataset.phrases || '[]');
    if (phrases.length) new TypeWriter(typingEl, phrases, 80, 1200);
  }
});

/* -------------------- REVEAL ON SCROLL -------------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, {threshold: 0.15});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* -------------------- PROJECT MODAL -------------------- */
const projectButtons = document.querySelectorAll('[data-project]');
const modal = $('#project-modal');
const modalClose = $('#modal-close') || $('.modal-close');

const projectData = {
  1: {
    title: 'Sistema de Cadastro',
    img: 'https://via.placeholder.com/800x400',
    desc: 'Sistema simples de cadastro local com validações e armazenamento local (LocalStorage) para demonstrar fluxo de criação e leitura de dados.'
  },
  2: {
    title: 'API Simulada',
    img: 'https://via.placeholder.com/800x400',
    desc: 'Projeto de estudo sobre rotas e consumo de dados via fetch. Mock de endpoints para testes de integração.'
  },
  3: {
    title: 'Dashboard Responsivo',
    img: 'https://via.placeholder.com/800x400',
    desc: 'Dashboard com layout responsivo e componentes reutilizáveis para visualização de dados.'
  }
};

function openModal(id){
  const data = projectData[id];
  if (!data) return;
  const body = $('#modal-body');
  body.innerHTML = `
    <h2>${data.title}</h2>
    <img src="${data.img}" alt="${data.title}" style="width:100%;height:auto;border-radius:8px;margin:8px 0" />
    <p>${data.desc}</p>
    <p><strong>Tecnologias:</strong> HTML, CSS, JavaScript, Git</p>
    <p><a href="#" target="_blank" rel="noopener">Ver repositório no GitHub</a></p>
  `;
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  $('#modal-body').innerHTML = '';
}

projectButtons.forEach(btn => {
  btn.addEventListener('click', (e)=>{
    const id = btn.dataset.project;
    openModal(id);
  });
});

modalClose?.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
  if (e.target === modal) closeModal();
});

/* fechar com ESC */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* -------------------- CONTACT FORM: MASK e VALIDAÇÃO -------------------- */
const contactForm = $('#contact-form');
const phoneInput = $('#phone');
const emailInput = $('#email');
const feedback = $('#form-feedback');

function maskphone() {
  let phone = document.getElementById("phone").value;

  if (phone[0] != "(") {
      if (phone[0] != undefined) {
          document.getElementById("phone").value = "(" + phone[0];
      }
  }
  
  if (phone[3] != ")") {
      if (phone[3] != undefined) {
          document.getElementById("phone").value = phone.slice(0,3) + ")" + phone[3];
      }
  }

  if (phone[9] != "-") {
      if (phone[9] != undefined) {
          document.getElementById("phone").value = phone.slice(0,9) + "-" + phone[9];
      }
  }
}

phoneInput?.addEventListener('input', (e) => {
  const cursor = phoneInput.selectionStart;
  phoneInput.value = maskPhone(phoneInput.value);
  phoneInput.setSelectionRange(cursor, cursor);
});

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const phone = (phoneInput.value || '').trim();
  const email = (emailInput.value || '').trim();
  const message = $('#message').value.trim();

  if (!name || !phone || !email || !message) {
    feedback.textContent = 'Por favor, preencha todos os campos.';
    feedback.style.color = 'crimson';
    return;
  }

  if (!validateEmail(email)) {
    feedback.textContent = 'Por favor, informe um e-mail válido.';
    feedback.style.color = 'crimson';
    return;
  }

  // Simular envio (sem backend)
  feedback.style.color = '';
  feedback.textContent = 'Enviando...';

  setTimeout(() => {
    feedback.style.color = 'var(--primary)';
    feedback.textContent = 'Mensagem enviada com sucesso! Obrigado, entrarei em contato em breve.';
    contactForm.reset();
  }, 900);
});

/* -------------------- MENU BURGER (mobile) -------------------- */
const burger = $('#burger');
const nav = $('#nav');

burger?.addEventListener('click', () => {
  nav.classList.toggle('open');
  // estilo simples - você pode adaptar
  if (nav.classList.contains('open')) {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.right = '1rem';
    nav.style.top = '60px';
    nav.style.background = 'var(--bg)';
    nav.style.padding = '1rem';
    nav.style.borderRadius = '10px';
    nav.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
  } else {
    nav.style.display = '';
    nav.style.position = '';
    nav.style.padding = '';
  }
});
