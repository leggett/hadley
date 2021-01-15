let header = document.getElementById("header");
window.onscroll = () => {
  header.style.top = -Math.round(window.scrollY / 5) + "px";
  if (window.scrollY > 100) {
    document.documentElement.classList.add("scrolled");
  } else {
    document.documentElement.classList.remove("scrolled");
  }
};

window.onload = () => {
  if (window.scrollY > 100) {
    document.documentElement.classList.add("scrolled");
  }
};

const appHeight = () =>
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
window.addEventListener("resize", appHeight);
appHeight();
