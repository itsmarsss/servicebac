const sections = document.getElementsByTagName("section");

for (let i = 0; i < sections.length; i++) {
    sections[i].querySelector(".revealer").addEventListener("click", () => {
        sections[i].classList.toggle("full");
    });
}