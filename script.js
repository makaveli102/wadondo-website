// Mobile navigation and simple quote-form behaviour.
document.addEventListener("DOMContentLoaded", () => {
  // WADONDO.COM welcome screen
  const welcomeScreen = document.getElementById("welcome-screen");

  if (welcomeScreen) {
    const welcomeDelay = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? 1000 : 3500;

    window.setTimeout(() => {
      welcomeScreen.classList.add("welcome-hidden");

      window.setTimeout(() => {
        welcomeScreen.remove();
      }, 900);
    }, welcomeDelay);
  }
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = data.get("name") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const product = data.get("product") || "Not specified";
      const message = data.get("message") || "";
      // IMPORTANT: Replace the placeholder with the business's real enquiry email before publishing.
      const businessEmail = "mbeluobinna60@gmail.com";
      const subject = encodeURIComponent("Product enquiry from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nPhone/WhatsApp: " + phone +
        "\nProduct: " + product + "\n\nMessage:\n" + message
      );
      const status = document.getElementById("form-status");
      if (businessEmail.includes("YOUR-BUSINESS-EMAIL")) {
        status.textContent = "Before publishing, add the business email in script.js. The form is ready to use once that is updated.";
        return;
      }
      window.location.href = "mailto:" + businessEmail + "?subject=" + subject + "&body=" + body;
    });
  }
});
