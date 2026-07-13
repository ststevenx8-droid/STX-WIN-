// STX WIN Catalog System

export const gamesData = [
    {
        id: "super-ace",
        title: "Super Ace",
        category: "slots",
        popular: true,
        img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80"
    },
    {
        id: "golden-baccarat",
        title: "Golden Baccarat",
        category: "live",
        popular: true,
        img: "https://images.unsplash.com/photo-1570649236495-42fa5fe3c48b?w=600&q=80"
    },
    {
        id: "neon-roulette",
        title: "Neon Roulette VIP",
        category: "table",
        popular: false,
        img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=600&q=80"
    },
    {
        id: "blackjack-royale",
        title: "Blackjack Royale",
        category: "table",
        popular: true,
        img: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=600&q=80"
    },
    {
        id: "mega-spin-slots",
        title: "Mega Spin 777",
        category: "slots",
        popular: false,
        img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80"
    }
];

export function renderGames(gridId, categoryFilter = "all", searchQuery = "") {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = "";

    const filteredGames = gamesData.filter(game => {
        const matchesCategory = categoryFilter === "all" || game.category === categoryFilter;
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    filteredGames.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
            <div class="game-card-thumbnail">
                <img src="${game.img}" alt="${game.title}">
                ${game.popular ? `<span class="badge-popular">HOT</span>` : ""}
                <button class="fav-btn" data-id="${game.id}"><i class="fa-regular fa-heart"></i></button>
                <div class="play-hover-overlay">
                    <button class="btn btn-gold btn-sm"><i class="fa-solid fa-play"></i> PLAY</button>
                </div>
            </div>
            <div class="game-card-info">
                <div class="game-category">${game.category}</div>
                <div class="game-title">${game.title}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global initialization bindings
document.addEventListener("DOMContentLoaded", () => {
    renderGames("featured-games-grid", "all");
    renderGames("full-games-grid", "all");

    // Dynamic Filter actions
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            categoryButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            const filter = e.currentTarget.getAttribute("data-category");
            renderGames("featured-games-grid", filter);
            renderGames("full-games-grid", filter);
        });
    });

    // Handle Searches
    const searchInputs = ["global-search-input", "lobby-search"];
    searchInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", (e) => {
                const targetGrid = id === "lobby-search" ? "full-games-grid" : "featured-games-grid";
                renderGames(targetGrid, "all", e.target.value);
            });
        }
    });
});
