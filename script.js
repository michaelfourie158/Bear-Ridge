const btn = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");
btn.addEventListener("click", () => btn.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  }
});
document.getElementById("year").textContent = new Date().getFullYear();
