const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealElements = document.querySelectorAll(
  ".feature, .room-card, .summary-panel, .step-form, .payment-form, .story-panel, .contact-form, .map-panel, .section-heading, .page-hero"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

const bookingForm = document.querySelector("#bookingForm");

if (bookingForm) {
  const steps = [...bookingForm.querySelectorAll(".form-step")];
  const dots = [...bookingForm.querySelectorAll(".step-dot")];
  const prevButton = document.querySelector("#prevStep");
  const nextButton = document.querySelector("#nextStep");
  const checkoutLink = document.querySelector("#checkoutLink");
  const roomSelect = document.querySelector("#roomSelect");
  const summaryRoom = document.querySelector("#summaryRoom");
  const summaryGuests = document.querySelector("#summaryGuests");
  const summaryTotal = document.querySelector("#summaryTotal");
  const prices = {
    "Deluxe King": 420,
    "Aurelia Suite": 790,
    "Sky Penthouse": 1850
  };
  let currentStep = 0;

  const selectedRoom = new URLSearchParams(window.location.search).get("room");
  if (selectedRoom && roomSelect) {
    roomSelect.value = selectedRoom;
  }

  function updateSummary() {
    const formData = new FormData(bookingForm);
    const room = formData.get("room") || "Deluxe King";
    const guests = formData.get("guests") || "2";
    const total = prices[room] || prices["Deluxe King"];
    summaryRoom.textContent = room;
    summaryGuests.textContent = guests;
    summaryTotal.textContent = `$${total.toLocaleString()}`;
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => step.classList.toggle("active", stepIndex === currentStep));
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentStep));
    prevButton.style.visibility = currentStep === 0 ? "hidden" : "visible";
    nextButton.classList.toggle("hidden", currentStep === steps.length - 1);
    checkoutLink.classList.toggle("hidden", currentStep !== steps.length - 1);
    updateSummary();
  }

  nextButton.addEventListener("click", () => showStep(currentStep + 1));
  prevButton.addEventListener("click", () => showStep(currentStep - 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showStep(Number(dot.dataset.stepTarget)));
  });
  bookingForm.addEventListener("input", updateSummary);
  showStep(0);
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Request Received";
      button.disabled = true;
    }
  });
});
