// variables and data types 
const SEARCH_DELAY = 1000; // const
let searchHistory = []; // let (mutable)
// structural: object containing mock weather data
const MOCK_DB = {
    "london": { temp: 15, condition: "Cloudy", humidity: 82 },
    "paris": { temp: 18, condition: "Sunny", humidity: 60 },
    "new york": { temp: 22, condition: "Partly Cloudy", humidity: 55 },
    "tokyo": { temp: 25, condition: "Rainy", humidity: 90 }
};
// DOM selection 
const elements = {
    input: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    weatherCard: document.getElementById('weatherCard'),
    loader: document.getElementById('loader'),
    cityName: document.getElementById('cityName'),
    tempValue: document.getElementById('tempValue'),
    condition: document.getElementById('condition'),
    humidity: document.getElementById('humidity'),
    errorMsg: document.getElementById('errorMessage'),
    historyList: document.getElementById('historyList'),
    clearBtn: document.getElementById('clearHistoryBtn')
};
// functions 
// arrow function (ES6)
const updateUI = (data, city) => {
    // destructuring 
    const { temp, condition, humidity } = data;
    elements.cityName.innerText = capitalize(city);
    elements.tempValue.innerText = temp;
    elements.condition.innerText = condition;
    elements.humidity.innerText = humidity;
    toggleVisibility(elements.loader, false);
    toggleVisibility(elements.weatherCard, true);
};
// function declaration
function capitalize(str) {
    // string manipulation 
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// helper to toggle classes (DOM manipulation)
const toggleVisibility = (el, show) => {
    if (show) el.classList.remove('hidden');
    else el.classList.add('hidden');
};
// asynchronous programming 
// returning a promise
const fetchWeatherSimulator = (city) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const cityLower = city.toLowerCase();
            // control flow (if/else)
            if (MOCK_DB[cityLower]) {
                resolve(MOCK_DB[cityLower]);
            } else {
                reject(new Error("City not found! Try 'London', 'Paris', 'New York' or 'Tokyo'"));
            }
        }, SEARCH_DELAY);
    });
};
// async/await
async function handleSearch() {
    const city = elements.input.value.trim();
    // control flow (guard clause)
    if (!city) return;
    // reset UI
    toggleVisibility(elements.weatherCard, false);
    toggleVisibility(elements.errorMsg, false);
    toggleVisibility(elements.loader, true);
    // debugging (try/catch)
    try {
        console.log(`Searching for: ${city}`); // Debugging

        const data = await fetchWeatherSimulator(city);

        updateUI(data, city);
        addToHistory(city);
    } catch (error) {
        console.error(error); // Debugging
        elements.errorMsg.innerText = error.message;
        toggleVisibility(elements.loader, false);
        toggleVisibility(elements.errorMsg, true);
    }
}
// array manipulation
function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        renderHistory();
    }
}
function renderHistory() {
    elements.historyList.innerHTML = ''; // clear current list

    // loops (for...of)
    for (const city of searchHistory) {
        const li = document.createElement('li');
        li.innerText = capitalize(city);
        li.onclick = () => {
            elements.input.value = city;
            handleSearch();
        };
        elements.historyList.appendChild(li);
    }
}
// event listeners
elements.searchBtn.addEventListener('click', handleSearch);
elements.input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
elements.clearBtn.addEventListener('click', () => {
    searchHistory = [];
    renderHistory();
});