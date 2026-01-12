const btn = document.getElementById("loadBtn");
const dashboard = document.getElementById("dashboard");

/* service class */
class EvaluationService {

    async fetchCandidates() {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("API Error");
        return await res.json();
    }

    evaluateCandidate() {
        return Math.floor(Math.random() * 40) + 60; // 60–100
    }
}


/* ui class */

class DashboardUI {

    static getLabel(score) {
        if (score >= 85) return "good";
        if (score >= 70) return "avg";
        return "low";
    }

    static createCard(candidate, score) {
        const div = document.createElement("div");
        div.className = "card";

        const labelClass = this.getLabel(score);

        div.innerHTML = `
      <h3>${candidate.name}</h3>
      <p>${candidate.email}</p>
      <p>Score: <b class="${labelClass}">${score}</b></p>
    `;

        return div;
    }
}

/* controller logic */

const service = new EvaluationService();

btn.addEventListener("click", async () => {
    dashboard.innerHTML = "Loading...";

    try {
        const candidates = await service.fetchCandidates();
        dashboard.innerHTML = "";

        candidates.slice(0, 8).forEach(c => {
            const score = service.evaluateCandidate();
            const card = DashboardUI.createCard(c, score);
            dashboard.appendChild(card);
        });

    } catch (err) {
        dashboard.innerHTML = "Failed to load candidates.";
        console.error(err);
    }
});
