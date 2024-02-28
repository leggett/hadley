let nav, navLinks, navMobileButton, navMobileClose, navMain, wrapper, intro, header, sendButton;

const navItems =
  location.host === "hadley.ink"
    ? [
        { name: "The Novel", link: "/", target: "" },
        { name: "About Hadley", link: "/about", target: "" },
        { name: "Other writing", link: "/writing", target: "" },
        { name: "Contact", link: "/contact", target: "" },
        { name: "Newsletter", link: "https://hadleyleggett.substack.com/?no_cover=true", target: "_new" },
      ]
    : [
        { name: "The Novel", link: "index.html", target: "" },
        { name: "About Hadley", link: "about.html", target: "" },
        { name: "Other writing", link: "writing.html", target: "" },
        { name: "Contact", link: "contact.html", target: "" },
        { name: "Newsletter", link: "https://hadleyleggett.substack.com/?no_cover=true", target: "_new" },
      ];

// UTILITIES
const make = (selector, ...args) => {
  const attrs = typeof args[0] === "object" && !(args[0] instanceof HTMLElement) ? args.shift() : {};

  let classes = selector.split(".");
  if (classes.length > 0) selector = classes.shift();
  if (classes.length) attrs.className = classes.join(" ");

  let id = selector.split("#");
  if (id.length > 0) selector = id.shift();
  if (id.length) attrs.id = id[0];

  const node = document.createElement(selector.length > 0 ? selector : "div");
  for (let prop in attrs) {
    if (attrs.hasOwnProperty(prop) && attrs[prop] != undefined) {
      if (prop.indexOf("data-") == 0) {
        let dataProp = prop.substring(5).replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
        node.dataset[dataProp] = attrs[prop];
      } else {
        node[prop] = attrs[prop];
      }
    }
  }

  const append = (child) => {
    if (Array.isArray(child)) return child.forEach(append);
    if (typeof child == "string") child = document.createTextNode(child);
    if (child) node.appendChild(child);
  };
  args.forEach(append);
  return node;
};

const cleanUrl = () => {
  const url = new URL(location);
  if (url.hash === "#navPanel") {
    url.hash = "";
    history.pushState({}, "", url);
  }
};

const openMobileNav = (e = false) => {
  if (e) e.preventDefault;
  document.body.classList.add("is-navPanel-visible");
  setTimeout(() => {
    wrapper.addEventListener("click", closeMobileNav);
    cleanUrl();
  }, 50);
};
const closeMobileNav = (e = false) => {
  if (e) e.preventDefault;
  document.body.classList.remove("is-navPanel-visible");
  wrapper.removeEventListener("click", closeMobileNav);
  setTimeout(cleanUrl, 50);
};

// EMAIL - SmtpJS.com - v3.0.0
const Email = {
  send: function (a) {
    return new Promise(function (n, e) {
      (a.nocache = Math.floor(1e6 * Math.random() + 1)), (a.Action = "Send");
      let t = JSON.stringify(a);
      Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {
        n(e);
      });
    });
  },
  ajaxPost: function (e, n, t) {
    let a = Email.createCORSRequest("POST", e);
    a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
      (a.onload = function () {
        let e = a.responseText;
        null != t && t(e);
      }),
      a.send(n);
  },
  ajax: function (e, n) {
    let t = Email.createCORSRequest("GET", e);
    (t.onload = function () {
      let e = t.responseText;
      null != n && n(e);
    }),
      t.send();
  },
  createCORSRequest: function (e, n) {
    let t = new XMLHttpRequest();
    return (
      "withCredentials" in t
        ? t.open(e, n, !0)
        : "undefined" != typeof XDomainRequest
        ? (t = new XDomainRequest()).open(e, n)
        : (t = null),
      t
    );
  },
};

function sendEmail(senderName, senderEmail, messageBody) {
  Email.send({
    SecureToken: "bef19497-1bf0-4ddf-916d-89c7b576e916",
    To: "hi@hadley.ink",
    From: "hi@hadley.ink",
    Subject: `Message from ${senderName}`,
    Body: messageBody,
  }).then((message) => {
    if (message === "OK") {
      document.querySelector("form.contact").classList.remove("failed");
      document.querySelector("form.contact").classList.add("success");
    } else {
      document.querySelector("form.contact").classList.add("failed");
      console.error(message);
    }
  });
}

// INITIALIZE APP -- CALLED ON PAGE LOAD
const initialize = () => {
  // Fade in background on load
  window.setTimeout(() => {
    document.body.classList.remove("is-preload");
  }, 100);

  // Initialize elements
  nav = document.querySelector("#nav");
  navLinks = document.querySelector("#nav .links");
  navMobileClose = document.querySelector("#navPanel .close");
  navMobileButton = document.querySelector("#navPanelToggle");
  wrapper = document.querySelector("#wrapper");
  intro = document.querySelector("#intro");
  header = document.querySelector("#header");
  sendButton = document.querySelector("input[type='submit']");

  // Initialize nav
  navItems.forEach((item) => {
    navLinks.appendChild(
      make(
        `li${location.pathname === item.link ? ".active" : ""}`,
        make("a", { href: item.link, target: item.target }, item.name)
      )
    );
  });

  // Initialize mobile nav
  const navContent = nav.cloneNode(true);
  navContent.id = "mobileNav";
  document.querySelector("#navPanel").appendChild(navContent);

  // Try to close the mobile nav on clicking on the wrapper
  // document.querySelector("#wrapper").addEventListener("click", closeMobileNav);

  // Initialize click handlers
  navMobileButton.addEventListener("click", (e) => {
    openMobileNav(e);
  });
  navMobileClose.addEventListener("click", (e) => {
    closeMobileNav(e);
  });

  // Change style of mobile nav button when page is scrolled
  const mobileNavButtonObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        navMobileButton.classList.toggle("alt", !entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  mobileNavButtonObserver.observe(header);

  // Swap intro for header when scrolled far enough
  if (intro) {
    const introObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intro.classList.toggle("hidden", !entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );
    introObserver.observe(intro);
  }

  // Initialize contact form

  sendButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Don't send the message again if it was just sent
    if (document.querySelector("form.contact").classList.contains("success")) return;

    let senderName = document.querySelector("#name").value;
    let senderEmail = document.querySelector("#email").value;
    let message = document.querySelector("#message").value;
    let encodedMessage = encodeURIComponent(`\n\n--\n${senderName} ${senderEmail} wrote:\n${message}`);
    let messageBody = `${senderName} (${senderEmail}) sent you a message via hadley.ink<br><br>${message}<br><br><a href="mailto:${senderEmail}?body=${encodedMessage}">Reply to ${senderName}</a>`;
    sendEmail(senderName, senderEmail, messageBody);
  });
};
window.addEventListener("load", initialize);
