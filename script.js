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
      // Keep the mobile menu open when the Products parent is being used to reveal its submenu.
      if (link.classList.contains("dropdown-toggle") && window.matchMedia("(max-width: 700px)").matches) return;
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  // On touch screens, Products opens its submenu on the first tap.
  document.querySelectorAll(".nav-dropdown > .dropdown-toggle").forEach(link => {
    link.addEventListener("click", (event) => {
      if (window.matchMedia("(max-width: 700px)").matches) {
        const parent = link.closest(".nav-dropdown");
        if (parent && !parent.classList.contains("submenu-open")) {
          event.preventDefault();
          parent.classList.add("submenu-open");
          link.setAttribute("aria-expanded", "true");
        }
      }
    });
  });

  // WADONDO.COM enquiry cart: products are saved in this browser between pages.
  const CART_KEY = "wadondoEnquiryCartV1";
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch (_) { return []; }
  };
  let cart = readCart();
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (_) {} };
  const cartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const safeText = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const whatsappBase = "https://wa.me/2348166146010?text=";

  const cartLauncher = document.createElement("button");
  cartLauncher.type = "button";
  cartLauncher.className = "cart-launcher";
  cartLauncher.setAttribute("aria-label", "Open enquiry cart");
  cartLauncher.innerHTML = '<span aria-hidden="true">▣</span> Enquiry Cart <b class="cart-count">0</b>';
  document.body.appendChild(cartLauncher);

  const cartPanel = document.createElement("aside");
  cartPanel.className = "cart-panel";
  cartPanel.setAttribute("aria-label", "Your enquiry cart");
  cartPanel.setAttribute("aria-hidden", "true");
  cartPanel.innerHTML = '<div class="cart-panel-head"><div><p class="eyebrow">YOUR SELECTION</p><h2>Enquiry Cart</h2></div><button type="button" class="cart-close" aria-label="Close cart">×</button></div><div class="cart-items"></div><div class="cart-panel-footer"><p>Prices are confirmed by our team before you order. No online payment is taken.</p><button type="button" class="button button-gold cart-checkout">Send Order Enquiry on WhatsApp</button><a class="cart-email-link" href="contact.html#quote">Prefer email? Request a quote</a><button type="button" class="cart-clear">Clear cart</button></div>';
  document.body.appendChild(cartPanel);
  const cartItems = cartPanel.querySelector(".cart-items");
  const updateCartUI = () => {
    cartLauncher.querySelector(".cart-count").textContent = cartCount();
    if (!cart.length) {
    cartItems.innerHTML = '<div class="cart-empty"><span>▣</span><h3>Your cart is empty</h3><p>Browse the catalogue and add products you would like a quote for.</p><a class="button button-dark" href="products.html">Browse Products</a></div>';
    } else {
      cartItems.innerHTML = cart.map((item, index) => '<div class="cart-line"><div class="cart-line-copy"><strong>' + safeText(item.name) + '</strong><small>' + safeText(item.category) + ' · Price on request</small><a href="' + safeText(item.page || "products.html") + '">View product category</a></div><div class="cart-qty"><button type="button" data-cart-action="minus" data-index="' + index + '" aria-label="Decrease quantity">−</button><span>' + item.qty + '</span><button type="button" data-cart-action="plus" data-index="' + index + '" aria-label="Increase quantity">+</button></div><button type="button" class="cart-remove" data-cart-action="remove" data-index="' + index + '" aria-label="Remove ' + safeText(item.name) + '">×</button></div>').join("");
    }
  };
  const openCart = () => { cartPanel.classList.add("cart-panel-open"); cartPanel.setAttribute("aria-hidden", "false"); document.body.classList.add("cart-is-open"); };
  const closeCart = () => { cartPanel.classList.remove("cart-panel-open"); cartPanel.setAttribute("aria-hidden", "true"); document.body.classList.remove("cart-is-open"); };
  const addToCart = (name, category, page) => {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.qty += 1;
    else cart.push({name, category, page, qty: 1});
    saveCart(); updateCartUI(); openCart();
  };
  cartLauncher.addEventListener("click", openCart);
  cartPanel.querySelector(".cart-close").addEventListener("click", closeCart);
  cartPanel.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
      if (!button) return;
    const index = Number(button.dataset.index);
    const action = button.dataset.cartAction;
    if (!cart[index]) return;
    if (action === "plus") cart[index].qty += 1;
    if (action === "minus") cart[index].qty -= 1;
    if (action === "remove" || cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(); updateCartUI();
  });
  cartPanel.querySelector(".cart-clear").addEventListener("click", () => { cart = []; saveCart(); updateCartUI(); });
  cartPanel.querySelector(".cart-checkout").addEventListener("click", () => {
    if (!cart.length) { openCart(); return; }
    const lines = cart.map(item => '- ' + item.name + ' | Qty: ' + item.qty + ' | Price: please quote').join("\n");
    const message = "Hello WADONDO.COM, I would like to request a quote for the following products:\n\n" + lines + "\n\nPlease confirm current prices, availability and delivery options. Thank you.";
    window.open(whatsappBase + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  });

  // Add e-commerce actions to product cards on all five category pages.
  document.querySelectorAll(".product-grid .product-card").forEach(card => {
    if (card.classList.contains("category-card") || card.querySelector(".shop-product-actions")) return;
    const name = card.querySelector(".product-info h3")?.textContent.trim();
    if (!name) return;
    const category = document.querySelector(".page-hero h1")?.textContent.trim() || "Hotel Access Products";
    const page = location.pathname.split("/").pop() || "products.html";
    const actions = document.createElement("div");
    actions.className = "shop-product-actions";
    const add = document.createElement("button");
    add.type = "button"; add.className = "button button-dark add-to-cart"; add.textContent = "Add to Enquiry Cart";
    add.addEventListener("click", () => addToCart(name, category, page));
    const quote = document.createElement("a");
    quote.className = "button button-gold product-quote-button"; quote.textContent = "Request a Quote";
    quote.href = whatsappBase + encodeURIComponent("Hello WADONDO.COM, please quote for: " + name + ". Please confirm price, availability and compatibility.");
    quote.target = "_blank"; quote.rel = "noopener noreferrer";
    actions.append(add, quote);
    card.querySelector(".product-info")?.appendChild(actions);
  });

  // Featured items on the main Products page use the same cart.
  document.querySelectorAll(".shop-product-card").forEach(card => {
    if (card.querySelector(".shop-product-actions")) return;
    const name = card.dataset.name || card.querySelector("h3")?.textContent.trim();
    const category = card.dataset.category || "Hotel Access Products";
    const page = card.dataset.page || "products.html";
    const actions = document.createElement("div"); actions.className = "shop-product-actions";
    const add = document.createElement("button"); add.type = "button"; add.className = "button button-dark add-to-cart"; add.textContent = "Add to Enquiry Cart";
    add.addEventListener("click", () => addToCart(name, category, page));
    const quote = document.createElement("a"); quote.className = "button button-gold product-quote-button"; quote.textContent = "Request a Quote";
    quote.href = whatsappBase + encodeURIComponent("Hello WADONDO.COM, please quote for: " + name + ". Please confirm price, availability and compatibility."); quote.target = "_blank"; quote.rel = "noopener noreferrer";
    actions.append(add, quote); card.querySelector(".product-info")?.appendChild(actions);
  });

  // Search filters the five category tiles on the main Products page.
  const search = document.getElementById("product-search");
  if (search) {
    const tiles = Array.from(document.querySelectorAll(".category-tile"));
    const empty = document.getElementById("search-empty");
    search.addEventListener("input", () => {
      const term = search.value.trim().toLowerCase();
      let shown = 0;
      tiles.forEach(tile => {
        const matches = (tile.textContent + " " + tile.dataset.search).toLowerCase().includes(term);
        tile.hidden = !matches; if (matches) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }
  updateCartUI();

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
