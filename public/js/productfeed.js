let products = [];
let currentFilter = 'All';
const favorites = new Set();
const cart = new Set();

// Product image mapping for better visuals
const productImages = {
    'Fashion': [
        '/images/Black bag (1).jpg',
        '/images/White bag.jpg',
        '/images/Cozy crochet scarf-Cute crochet baby patterns.jpg',
        '/images/crochet crochet patterns-Stitching Serenity_ Crochet Earrings for Every Mood (1).jpg',
        '/images/How to Embroider onto a Sweatshirt – Needle Work.jpg'
    ],
    'Religious': [
        '/images/handmade.jpg',
        '/images/slide 1.jpeg',
        '/images/slide 2.jpeg'
    ],
    'Food': [
        '/images/slide 3.jpeg',
        '/images/slide 4.jpeg',
        '/images/slide 5.jpeg'
    ],
    'Beauty': [
        '/images/slide 6.jpeg',
        '/images/slide 7.jpeg',
        '/images/slide 8.jpeg'
    ],
    'Home': [
        '/images/slide 9.jpeg',
        '/images/slide 10.jpeg',
        '/images/slide 11.jpeg'
    ],
    'Other': [
        '/images/20 Latest Crochet Keychain Ideas To Try In 2025! - Ask Bart.jpg',
        '/images/slide 12.jpeg',
        '/images/slide 13.jpeg'
    ]
};

function getProductImage(product) {
    // If product has uploaded image, use it
    if (product.media && product.media !== '') {
        return `http://localhost:3001${product.media}`;
    }
    
    // Otherwise use category-appropriate image
    const category = product.category || 'Other';
    const categoryImages = productImages[category] || productImages['Other'];
    const imageIndex = Math.abs(product._id.charCodeAt(0)) % categoryImages.length;
    return categoryImages[imageIndex];
}

window.addEventListener("DOMContentLoaded", async () => {
    const feed = document.getElementById('product-grid');
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        feed.innerHTML = `<p style="text-align:center;color:red;">You must be logged in to view the products.</p>`;
        return;
    }

    // Load favorites from user data
    if (user && user.favorites && Array.isArray(user.favorites)) {
        user.favorites.forEach(id => favorites.add(id));
    } else if (user) {
        // Initialize favorites array if it doesn't exist
        user.favorites = [];
        localStorage.setItem("user", JSON.stringify(user));
    }

    // Load cart from backend
    try {
        const cartRes = await fetch('http://localhost:3001/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (cartRes.ok) {
            const cartData = await cartRes.json();
            if (cartData && cartData.cart && Array.isArray(cartData.cart)) {
                cartData.cart.forEach(product => cart.add(product._id));
                console.log('Cart loaded successfully:', cartData.cart.length, 'items');
            }
        } else {
            console.warn('Failed to load cart:', cartRes.status);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }

    try {
        const res = await fetch('http://localhost:3001/api/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch products');
        }

        products = await res.json();
        console.log("Fetched products:", products);

        if (!Array.isArray(products)) {
            throw new Error("Unexpected response format");
        }

        renderProducts();

    } catch (err) {
        console.error("Error loading products:", err);
        feed.innerHTML = `<p style="text-align:center;color:red;">Failed to load products: ${err.message}</p>`;
    }
});

function renderProducts() {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";
    const query = document.getElementById('searchInput').value.toLowerCase();
    products.filter(product => {
        const matchesFilter = currentFilter === 'All' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
    }).forEach((product) => {
        const productImage = getProductImage(product);
        grid.innerHTML += `
    <div class="bg-white rounded-xl shadow-md p-4">
        <img src="${productImage}" class="rounded-lg w-full h-48 object-cover mb-4" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/cccccc/666666?text=Product+Image'">
            <h3 class="text-lg font-semibold">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${product.desc}</p>
            <p class="text-lg font-bold text-green-600 mb-2">PKR ${product.price || 'N/A'}</p>
            <div class="flex items-center space-x-2 mb-4">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(product.user?.fullName || 'User')}&background=random&color=fff&size=32" 
                     class="w-8 h-8 rounded-full clickable-profile" alt="Seller" data-user-id="${product.user?._id}" style="cursor: pointer;" />
                <span class="text-sm text-blue-500 clickable-profile" data-user-id="${product.user?._id}" style="cursor: pointer;">
                    ${product.user?.fullName || 'Unknown Seller'}
                </span>
            </div>
            <div class="flex justify-between items-center">
                <button onclick="toggleFavorite('${product._id}')" class="text-red-500 text-xl" title="${favorites.has(product._id) ? 'Remove from favorites' : 'Add to favorites'}">
                  <i class="${favorites.has(product._id) ? 'fas' : 'far'} fa-heart"></i>
                </button >
            <button onclick="addToCart('${product._id}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" title="${cart.has(product._id) ? 'Already in cart' : 'Add to cart'}">
                ${cart.has(product._id) ? 'In Cart' : 'Add to Cart'}
            </button>
            </div >
    </div >
            `;
    });
    updateCounts();
}

async function toggleFavorite(id) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isFav = favorites.has(id);
    const method = isFav ? "DELETE" : "POST";

    const url = isFav
        ? `http://localhost:3001/api/products/favorite?productId=${id}`
        : `http://localhost:3001/api/products/favorite`;

    const options = {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    if (!isFav) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({ productId: id });
    }

    try {
        const res = await fetch(url, options);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        if (isFav) {
            favorites.delete(id);
            user.favorites = user.favorites.filter(fid => fid !== id);
        } else {
            favorites.add(id);
            user.favorites.push(id);
        }

        localStorage.setItem("user", JSON.stringify(user));

        renderProducts();
        updateFavoritesModal();

    } catch (err) {
        console.error("Favorite error:", err.message);
        alert("Error toggling favorite");
    }
}

async function addToCart(id) {
    if (cart.has(id)) {
        alert("Item already in cart");
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const res = await fetch('http://localhost:3001/api/cart', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId: id })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        cart.add(id);
        renderProducts();
        updateCartModal();
        updateCounts();
        alert("Added to cart successfully!");
    } catch (err) {
        console.error("Cart error:", err.message);
        alert("Error adding to cart: " + err.message);
    }
}

async function removeFromCart(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch('http://localhost:3001/api/cart', {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId: id })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        cart.delete(id);
        renderProducts();
        updateCartModal();
        updateCounts();
    } catch (err) {
        console.error("Remove from cart error:", err.message);
        alert("Error removing from cart: " + err.message);
    }
}

function updateFavoritesModal() {
    const favoritesModal = document.getElementById('favoritesModal');
    const favoritesList = favoritesModal.querySelector('#favoritesList');
    
    if (!favoritesList) {
        console.error('Favorites list element not found');
        return;
    }
    
    favoritesList.innerHTML = '';
    
    const favoriteProducts = products.filter(product => favorites.has(product._id));
    
    if (favoriteProducts.length === 0) {
        favoritesList.innerHTML = '<p class="text-center text-gray-500">No favorites yet</p>';
        return;
    }
    
    favoriteProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'favorite-item bg-gray-100 p-3 rounded-lg flex justify-between items-center';
        item.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${getProductImage(product)}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/100x100/cccccc/666666?text=Product'">
                <div>
                    <h4 class="font-semibold">${product.name}</h4>
                    <p class="text-sm text-gray-600">PKR ${product.price}</p>
                </div>
            </div>
            <button onclick="toggleFavorite('${product._id}')" class="text-red-500 hover:text-red-700">
                <i class="fas fa-heart"></i>
            </button>
        `;
        favoritesList.appendChild(item);
    });
}

function updateCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartList = cartModal.querySelector('#cartList');
    
    if (!cartList) {
        console.error('Cart list element not found');
        return;
    }
    
    cartList.innerHTML = '';
    
    const cartProducts = products.filter(product => cart.has(product._id));
    
    if (cartProducts.length === 0) {
        cartList.innerHTML = '<p class="text-center text-gray-500">Your cart is empty</p>';
        return;
    }
    
    cartProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'cart-item bg-gray-100 p-3 rounded-lg flex justify-between items-center';
        item.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${getProductImage(product)}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/100x100/cccccc/666666?text=Product'">
                <div>
                    <h4 class="font-semibold">${product.name}</h4>
                    <p class="text-sm text-gray-600">PKR ${product.price}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="buyNow('${product._id}')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                    Buy Now
                </button>
                <button onclick="removeFromCart('${product._id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartList.appendChild(item);
    });
}

function buyNow(productId) {
    // Redirect to buy now page with product ID
    window.location.href = `buynow.html?productId=${productId}`;
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            // Update modal content when opening
            if (id === 'cartModal') {
                updateCartModal();
            } else if (id === 'favoritesModal') {
                updateFavoritesModal();
            }
        } else {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
}

function toggleSearchBar() {
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchfilter');
    
    if (searchInput.classList.contains('hidden')) {
        searchInput.classList.remove('hidden');
        searchInput.focus();
        searchIcon.classList.remove('fa-search');
        searchIcon.classList.add('fa-times');
    } else {
        searchInput.classList.add('hidden');
        searchInput.value = '';
        searchIcon.classList.remove('fa-times');
        searchIcon.classList.add('fa-search');
        renderProducts(); // Re-render to show all products
    }
}

function searchProducts() {
    renderProducts();
}

function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button styling
    const filterButtons = document.querySelectorAll('#filters button');
    filterButtons.forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.style.backgroundColor = 'var(--secondary)';
        btn.style.color = '#fdfdff';
    });
    
    // Highlight active filter
    const activeButton = Array.from(filterButtons).find(btn => 
        btn.textContent.trim() === category
    );
    if (activeButton) {
        activeButton.classList.add('bg-blue-600', 'text-white');
        activeButton.style.backgroundColor = '#2563eb';
    }
    
    renderProducts();
}

function updateCounts() {
    const favCountElement = document.getElementById('favCount');
    const cartCountElement = document.getElementById('cartCount');
    
    if (favCountElement) {
        favCountElement.textContent = favorites.size;
        if (favorites.size > 0) {
            favCountElement.classList.remove('hidden');
        } else {
            favCountElement.classList.add('hidden');
        }
    }
    
    if (cartCountElement) {
        cartCountElement.textContent = cart.size;
        if (cart.size > 0) {
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }
}

// Profile click handler
document.addEventListener('click', (e) => {
    const profileClick = e.target.closest('.clickable-profile');
    if (profileClick) {
        const userId = profileClick.dataset.userId;
        if (userId && userId !== 'undefined') {
            window.location.href = `profile.html?userId=${userId}`;
        }
    }
});