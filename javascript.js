const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Switch to light mode";
        themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
        themeToggle.textContent = "Switch to dark mode";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
});

const weatherElements = {
    temperature: document.getElementById("weatherTemperature"),
    feelsLike: document.getElementById("weatherFeelsLike"),
    humidity: document.getElementById("weatherHumidity"),
    wind: document.getElementById("weatherWind"),
    description: document.getElementById("weatherDescription"),
    icon: document.getElementById("weatherIcon"),
    updated: document.getElementById("weatherUpdated")
};

const weatherConditions = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Light freezing drizzle", "🌧️"],
    57: ["Dense freezing drizzle", "🌧️"],
    61: ["Light rain", "🌦️"],
    63: ["Rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    66: ["Light freezing rain", "🌧️"],
    67: ["Heavy freezing rain", "🌧️"],
    71: ["Light snow", "🌨️"],
    73: ["Snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    77: ["Snow grains", "🌨️"],
    80: ["Light rain showers", "🌦️"],
    81: ["Rain showers", "🌧️"],
    82: ["Heavy rain showers", "🌧️"],
    85: ["Light snow showers", "🌨️"],
    86: ["Heavy snow showers", "❄️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with light hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

async function loadWeather() {
    try {
        const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
        weatherUrl.search = new URLSearchParams({
            latitude: "26.9124",
            longitude: "75.7873",
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
            timezone: "Asia/Kolkata"
        }).toString();

        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`Weather request failed (${response.status})`);
        }

        const weather = await response.json();
        const current = weather.current;
        const condition = weatherConditions[current.weather_code];

        if (!current || !condition) {
            throw new Error("Weather service returned an unsupported response.");
        }

        weatherElements.temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        weatherElements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
        weatherElements.humidity.textContent = `${current.relative_humidity_2m}%`;
        weatherElements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        weatherElements.description.textContent = condition[0];
        weatherElements.icon.textContent = condition[1];
        weatherElements.icon.hidden = false;
        weatherElements.updated.textContent = `Updated ${new Date(current.time).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        })}`;
    } catch (error) {
        console.error("Unable to load weather:", error);
        weatherElements.description.textContent = "Weather is currently unavailable.";
    }
}

loadWeather();
window.setInterval(loadWeather, 10 * 60 * 1000);

const chatPanel = document.getElementById("chatPanel");
const chatToggle = document.getElementById("chatToggle");
const chatClose = document.getElementById("chatClose");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

function setChatOpen(isOpen) {
    chatPanel.hidden = !isOpen;
    chatToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
        chatInput.focus();
    } else {
        chatToggle.focus();
    }
}

function addChatMessage(message, sender) {
    const messageElement = document.createElement("p");
    messageElement.className = `chat-message ${sender}-message`;
    messageElement.textContent = message;
    chatMessages.append(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getPortfolioAnswer(question) {
    const normalizedQuestion = question.toLowerCase();

    if (/\b(hi|hello|hey)\b/.test(normalizedQuestion)) {
        return "Hi! You can ask me about Balkishan's background, skills, or projects.";
    }
    if (/\b(skill|language|know|technology|programming)\b/.test(normalizedQuestion)) {
        return "Balkishan's listed skills include HTML, CSS, JavaScript, C, C++, and Python. He is also interested in Java, travelling, and reading.";
    }
    if (/\b(project|work|built|resume)\b/.test(normalizedQuestion)) {
        return "The portfolio features Python programming projects and a web-based Resume Builder. The Resume Builder link is in the Projects section.";
    }
    if (/\b(github|git|code|repository)\b/.test(normalizedQuestion)) {
        return "You can find Balkishan's GitHub profile through the View GitHub link in the Python project card.";
    }
    if (/\b(education|study|university|college|enrollment|student)\b/.test(normalizedQuestion)) {
        return "Balkishan is a second-year student at JECRC University. His enrollment number is 25BCON0344.";
    }
    if (/\b(name|who|about|background)\b/.test(normalizedQuestion)) {
        return "Balkishan Bairagi is a second-year student interested in technology, programming, and building useful projects.";
    }
    if (/\b(hobby|interest|travel|reading)\b/.test(normalizedQuestion)) {
        return "Balkishan enjoys learning new technologies, travelling, and reading.";
    }

    return "I can answer questions about Balkishan's background, education, skills, interests, and projects. Try asking about one of those.";
}

chatToggle.addEventListener("click", function () {
    setChatOpen(chatPanel.hidden);
});

chatClose.addEventListener("click", function () {
    setChatOpen(false);
});

chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const question = chatInput.value.trim();

    if (!question) {
        return;
    }

    addChatMessage(question, "user");
    addChatMessage(getPortfolioAnswer(question), "assistant");
    chatInput.value = "";
    chatInput.focus();
});
