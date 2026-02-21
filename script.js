const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const revealNodes = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const tiltCard = document.getElementById("tiltCard");
const yearNode = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");
const popupForm = document.getElementById("hirePopupForm");
const headerContactBtn = document.getElementById("headerContactBtn");
const hirePopup = document.getElementById("hirePopup");
const hirePopupClose = document.getElementById("hirePopupClose");
const hirePopupBackdrop = document.getElementById("hirePopupBackdrop");
const assistantFab = document.getElementById("assistantFab");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantChat = document.getElementById("assistantChat");
const assistantSuggestions = document.getElementById("assistantSuggestions");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.innerHTML = theme === "light"
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }
  if (themeText) {
    themeText.textContent = theme === "light" ? "Dark" : "Light";
  }
}

const storedTheme = localStorage.getItem("theme");
applyTheme(storedTheme === "dark" ? "dark" : "light");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "light" ? "dark" : "light");
  });
}

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 70, 520)}ms`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("skill-card")) {
        const fill = entry.target.querySelector(".skill-fill");
        if (fill && !fill.dataset.done) {
          fill.style.width = `${fill.dataset.fill}%`;
          fill.dataset.done = "1";
        }
      }
    });
  },
  { threshold: 0.16 }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      if (fill.dataset.done) return;
      fill.style.width = `${fill.dataset.fill}%`;
      fill.dataset.done = "1";
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach((fill) => skillObserver.observe(fill));

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

function updateScrollProgress() {
  if (!scrollProgress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollProgress.style.width = `${Math.min(Math.max(ratio, 0), 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

function attachSubmitState(form) {
  if (!form) return;
  form.addEventListener("submit", () => {
    const submitBtn = form.querySelector("button[type='submit']");
    if (!submitBtn) return;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
  });
}

attachSubmitState(popupForm);

function openHirePopup() {
  if (!hirePopup || !hirePopupBackdrop) return;
  hirePopup.hidden = false;
  hirePopupBackdrop.hidden = false;
  document.body.classList.add("modal-open");
}

function closeHirePopup() {
  if (!hirePopup || !hirePopupBackdrop) return;
  hirePopup.hidden = true;
  hirePopupBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

function openAssistant() {
  if (!assistantPanel) return;
  assistantPanel.hidden = false;
  if (assistantInput) assistantInput.focus();
}

function closeAssistant() {
  if (!assistantPanel) return;
  assistantPanel.hidden = true;
  if (assistantChat) {
    assistantChat.innerHTML = '<div class="assistant-msg assistant-msg-bot">Ask a question about my profile and I will answer instantly.</div>';
  }
  if (assistantInput) {
    assistantInput.value = "";
  }
}

function addAssistantMessage(text, type) {
  if (!assistantChat) return;
  const msg = document.createElement("div");
  msg.className = `assistant-msg ${type === "user" ? "assistant-msg-user" : "assistant-msg-bot"}`;
  msg.textContent = text;
  assistantChat.appendChild(msg);
  assistantChat.scrollTop = assistantChat.scrollHeight;
}

function routeToSection(sectionId, openContactPopup) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (openContactPopup) {
    window.setTimeout(() => {
      openHirePopup();
    }, 500);
  }
}

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function detectSectionTarget(text) {
  if (includesAny(text, ["about", "intro", "introduction", "bio", "background", "profile"])) {
    return "about";
  }
  if (includesAny(text, ["skill", "skills", "skillset", "stack", "tech", "technology", "tools", "expertise", "strengths", "capabilities"])) {
    return "skills";
  }
  if (includesAny(text, ["project", "projects", "portfolio", "work", "case study", "case studies", "work samples"])) {
    return "projects";
  }
  if (includesAny(text, ["certification", "certifications", "certificate", "certificates", "credential", "credentials", "course", "courses"])) {
    return "certifications";
  }
  if (includesAny(text, ["contact", "reach", "email", "phone", "call", "linkedin", "hire", "message", "connect"])) {
    return "contact";
  }
  return "";
}

function getAssistantReply(question) {
  const q = question.toLowerCase();
  const clean = q.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  const navigationPhrases = [
    "go to", "goto", "navigate", "take me", "take us", "bring me", "bring us",
    "show me", "let me see", "i want to see", "view", "open", "see", "jump to",
    "move to", "scroll to", "head to", "direct me", "land on", "lead me", "visit"
  ];
  const asksNavigation =
    includesAny(clean, navigationPhrases) ||
    includesAny(clean, ["section", "page", "tab", "menu"]);

  const target = detectSectionTarget(clean);
  if (asksNavigation && target) {
    routeToSection(target, target === "contact");
    if (target === "about") return "Taking you to the About section now.";
    if (target === "skills") return "Taking you to the Skills section now.";
    if (target === "projects") return "Taking you to the Projects section now.";
    if (target === "certifications") return "Taking you to the Certifications section now.";
    return "Taking you to Contact now.";
  }

  if (includesAny(clean, ["skill", "tech", "tools", "stack", "expertise", "capabilities"])) {
    return "Top skills: SQL, Python, Tableau, R, Excel, and business analytics storytelling.";
  }
  if (includesAny(clean, ["project", "portfolio", "best work", "work samples", "case studies"])) {
    return "Start with Airbnb Market Analysis, Global Work Hours and Productivity, and VDI Log Analytics for strongest business-impact examples.";
  }
  if (includesAny(clean, ["intern", "internship", "full time", "full-time", "available", "open to", "opportunity", "opportunities"])) {
    return "Yes. Sai is open to Data Analyst and BI opportunities, including internships and full-time roles, and is open to Remote, Hybrid, and Relocation options.";
  }
  if (includesAny(clean, ["location", "based", "where", "city", "state"])) {
    return "Sai is based in Michigan, United States.";
  }
  if (includesAny(clean, ["cert", "certificate", "certification", "credential", "course"])) {
    return "Certifications include Google Data Analytics Professional Certificate, Excel Basics for Data Analysis, and Google Cloud Data Analytics.";
  }
  if (includesAny(clean, ["contact", "email", "phone", "linkedin", "call", "message", "connect"])) {
    routeToSection("contact", true);
    return "Taking you to Contact now. You can use email, phone, LinkedIn, or the direct message form.";
  }

  routeToSection("contact", true);
  return "I do not have that exact detail here. Taking you to Contact so you can reach Sai directly for a quick response.";
}

if (headerContactBtn) {
  headerContactBtn.addEventListener("click", openHirePopup);
}

if (hirePopupClose) {
  hirePopupClose.addEventListener("click", closeHirePopup);
}

if (hirePopupBackdrop) {
  hirePopupBackdrop.addEventListener("click", closeHirePopup);
}

if (assistantFab) {
  assistantFab.addEventListener("click", openAssistant);
}

if (assistantClose) {
  assistantClose.addEventListener("click", closeAssistant);
}

if (assistantSuggestions) {
  assistantSuggestions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("assistant-chip")) return;
    const question = target.dataset.question;
    if (!question) return;
    addAssistantMessage(question, "user");
    addAssistantMessage(getAssistantReply(question), "bot");
  });
}

if (assistantForm) {
  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!assistantInput) return;
    const question = assistantInput.value.trim();
    if (!question) return;
    addAssistantMessage(question, "user");
    addAssistantMessage(getAssistantReply(question), "bot");
    assistantInput.value = "";
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (hirePopup && !hirePopup.hidden) closeHirePopup();
  if (assistantPanel && !assistantPanel.hidden) closeAssistant();
});
