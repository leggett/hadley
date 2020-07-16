let header = document.getElementById("header");

window.onscroll = (e) => {
	header.style.top = -(window.scrollY / 5) + "px";
};
