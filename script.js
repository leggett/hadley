let header = document.getElementById("header");

window.onscroll = (e) => {
	header.style.top = -Math.round(window.scrollY / 5) + "px";
};
