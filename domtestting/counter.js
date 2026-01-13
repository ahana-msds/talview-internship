function setupCounter() {
    const btn = document.getElementById("incBtn");
    const count = document.getElementById("count");

    btn.addEventListener("click", () => {
        count.textContent = Number(count.textContent) + 1;
    });
}

module.exports = { setupCounter };
