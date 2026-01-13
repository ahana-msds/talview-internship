function setupForm() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const u = document.getElementById("username").value;
        const p = document.getElementById("password").value;
        if (!u || !p) {
            form.setAttribute("data-status", "invalid");
        } else {
            form.setAttribute("data-status", "ok");
        }
    });
}

module.exports = { setupForm };
