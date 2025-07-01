document.addEventListener("DOMContentLoaded", () => {
    const favIcons = document.querySelectorAll(".product .fa-heart");
    const favNavIcon = document.querySelector(".profile #favIcon");
    const favCount = document.querySelector("#favCount");
    const favModal = document.createElement("div");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Create Favorites Modal
    favModal.classList.add("favorites-modal");
    favModal.innerHTML = `
        <div class="favorites-content">
            <span class="close-btn">&times;</span>
            <h2>Favorite Items</h2>
            <div id="favItems">No items added to favorites</div>
        </div>
    `;
    document.body.appendChild(favModal);
    const closeBtn = favModal.querySelector(".close-btn");
    
    favIcons.forEach(icon => {
        const product = icon.closest(".product");
        const imgSrc = product.querySelector("img").src;
        
        if (favorites.some(item => item.imgSrc === imgSrc)) {
            icon.classList.add("favorited");
        }

        icon.addEventListener("click", (e) => {
            const title = product.querySelector("h4").textContent;
            const price = product.querySelector("p:nth-of-type(2)").textContent;
            const favItem = { imgSrc, title, price };
            
            if (!favorites.some(item => item.imgSrc === imgSrc)) {
                favorites.push(favItem);
                e.target.classList.add("favorited");
            } else {
                favorites = favorites.filter(item => item.imgSrc !== imgSrc);
                e.target.classList.remove("favorited");
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
            updateFavorites();
        });
    });

    favNavIcon.addEventListener("click", () => {
        favModal.style.display = "block";
        renderFavorites();
    });

    closeBtn.addEventListener("click", () => {
        favModal.style.display = "none";
    });

    function updateFavorites() {
        favCount.textContent = favorites.length;
    }

    function renderFavorites() {
        const favItemsDiv = document.querySelector("#favItems");
        favItemsDiv.innerHTML = favorites.length > 0 ? "" : "No items added to favorites";
        
        favorites.forEach(item => {
            const favItemDiv = document.createElement("div");
            favItemDiv.classList.add("fav-item");
            favItemDiv.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                </div>
            `;
            favItemsDiv.appendChild(favItemDiv);
        });
    }

    updateFavorites();
});