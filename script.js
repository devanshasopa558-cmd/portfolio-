console.log("JavaScript connected");
const themeButton = document.getElementById("themeToggle");
themeButton.addEventListener("click", function () {
document.body.classList.toggle("dark-mode");
if (document.body.classList.contains("dark-mode")) {
themeButton.textContent = "Switch to Light Mode";
} else {
themeButton.textContent = "Switch to Dark Mode";
}
});
const themeToggle = document.getElementById("themeToggle");
const greeting = document.getElementById("greeting");
const lastUpdated = document.getElementById("lastUpdated");
const storageKey = "profile-theme";

function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.textContent = isDark
        ? "Switch to light theme"
        : "Switch to dark theme";
}

function getPreferredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "dark" || saved === "light") {
        return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark")
        ? "light"
        : "dark";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
});

applyTheme(getPreferredTheme());

const hour = new Date().getHours();
let timeOfDay = "Hello";
if (hour < 12) {
    timeOfDay = "Good morning";
} else if (hour < 18) {
    timeOfDay = "Good afternoon";
} else {
    timeOfDay = "Good evening";
}

greeting.textContent = `${timeOfDay}. Search this page for PLACEHOLDER to replace sample details.`;

if (lastUpdated) {
    const now = new Date();
    lastUpdated.dateTime = now.toISOString().slice(0, 10);
    lastUpdated.textContent = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

const projectSearch = document.getElementById("projectSearch");
const techFilterButtons = document.getElementById("techFilterButtons");
const projectItems = Array.from(document.querySelectorAll(".projects-list > li"));
const projectFilterStatus = document.getElementById("projectFilterStatus");
let activeTech = "all";

function getProjectTechs(item) {
    return (item.dataset.tech || "")
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);
}

function buildTechFilters() {
    const techs = new Set();
    projectItems.forEach((item) => {
        getProjectTechs(item).forEach((tech) => techs.add(tech));
    });

    const buttons = ["All", ...Array.from(techs).sort((a, b) => a.localeCompare(b))];
    techFilterButtons.innerHTML = "";

    buttons.forEach((tech) => {
        const button = document.createElement("button");
        const value = tech.toLowerCase() === "all" ? "all" : tech;
        button.type = "button";
        button.className = "tech-filter";
        button.dataset.tech = value;
        button.textContent = tech;
        button.setAttribute("aria-pressed", value === "all" ? "true" : "false");
        if (value === "all") {
            button.classList.add("is-active");
        }
        button.addEventListener("click", () => {
            activeTech = value;
            techFilterButtons.querySelectorAll(".tech-filter").forEach((filterButton) => {
                const isActive = filterButton.dataset.tech === activeTech;
                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });
            filterProjects();
        });
        techFilterButtons.appendChild(button);
    });
}

function filterProjects() {
    const query = (projectSearch.value || "").trim().toLowerCase();
    let visibleCount = 0;

    projectItems.forEach((item) => {
        const name = (item.dataset.name || "").toLowerCase();
        const techs = getProjectTechs(item);
        const matchesQuery =
            query === "" ||
            name.includes(query) ||
            techs.some((tech) => tech.toLowerCase().includes(query));
        const matchesTech =
            activeTech === "all" ||
            techs.some((tech) => tech.toLowerCase() === activeTech.toLowerCase());
        const isVisible = matchesQuery && matchesTech;
        item.hidden = !isVisible;
        if (isVisible) {
            visibleCount += 1;
        }
    });

    const techLabel = activeTech === "all" ? "all technologies" : activeTech;
    if (visibleCount === 0) {
        projectFilterStatus.textContent = query
            ? `No projects match "${query}" for ${techLabel}.`
            : `No projects found for ${techLabel}.`;
    } else {
        projectFilterStatus.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? "" : "s"} for ${techLabel}.`;
    }
}

if (projectSearch && techFilterButtons) {
    buildTechFilters();
    projectSearch.addEventListener("input", filterProjects);
    filterProjects();
}
