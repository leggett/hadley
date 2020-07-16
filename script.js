let header = document.getElementById("header");
window.onscroll = (e) => {
	header.style.top = -Math.round(window.scrollY / 5) + "px";
};

let content = document.getElementById("content");
setTimeout(() => {
	content.style.marginTop = "90vh";
}, 1000);
