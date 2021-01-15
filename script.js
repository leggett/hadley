let header = document.getElementById("header");

window.onscroll = () => {
  header.style.top = -Math.round(window.scrollY / 5) + "px";
  if (window.scrollY > 100) {
    document.documentElement.classList.add("scrolled");
  } else {
    document.documentElement.classList.remove("scrolled");
  }

  // if (window.scrollY > 1000) {
  //   header.style.display = "none";
  // } else {
  //   header.style.display = "grid";
  // }
};

window.onload = () => {
  if (window.scrollY > 100) {
    document.documentElement.classList.add("scrolled");
  }
};

const touchDevice = "ontouchstart" in document.documentElement;

const appHeight = (event) => {
  if (touchDevice && event?.type === "resize") return;

  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
  document.querySelector("#appHeight").innerText =
    window.innerHeight + " / " + touchDevice + " / " + event?.type;
};

window.addEventListener("resize", appHeight);
appHeight(true);
