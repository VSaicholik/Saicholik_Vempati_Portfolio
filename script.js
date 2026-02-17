const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const revealNodes = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const tiltCard = document.getElementById("tiltCard");
const yearNode = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");
const noteForm = document.getElementById("noteForm");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeIcon) {
    themeIcon.textContent = theme === "light" ? "Sun" : "Moon";
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

if (noteForm) {
  noteForm.addEventListener("submit", () => {
    const submitBtn = noteForm.querySelector("button[type='submit']");
    if (!submitBtn) return;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
  });
}
