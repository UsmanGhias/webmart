document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const res = await fetch('/api/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Unauthorized or token expired");
        }

        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));

        document.getElementById("username").innerText = user.fullName;
        document.getElementById("profilePic").src = user.profilePic || "https://via.placeholder.com/120";
        const selling = document.getElementById("startSellingBtn");
        const catalog = document.getElementById("openCatalogBtn");

        if (user.posts && Array.isArray(user.posts)) {
            showUserPosts(user.posts);
            if (user.business) {
                showBusiness(user.business);
                selling.classList.add('hidden');
                catalog.classList.remove('hidden');
            }

            if (user.products && Array.isArray(user.products)) {
                showUserProducts(user.products);
            }

        }

    } catch (err) {
        console.error("Unauthorized access:", err);
        alert("Session expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/login.html";
    }

    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener("change", function () {
            const otherInput = document.getElementById("otherCategoryInput");
            if (this.id === "otherCategoryRadio") {
                otherInput.style.display = "block";
            } else {
                otherInput.style.display = "none";
                otherInput.value = "";
            }
        });
    });
});

let postCount = 0;
let editingPostId = null;

function openSettingModal() {
    document.getElementById("settingModal").style.display = "flex";
}

function openPostModal() {
    document.getElementById("postModal").style.display = "flex";
}

function openBusinessModal() {
    document.getElementById("businessModal").style.display = "flex";

}

function openCatalogModal() {
    document.getElementById("catalogModal").style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function submitPost() {
    const desc = document.getElementById("postDesc").value;
    const media = document.getElementById("mediaInput").files[0];
    const loading = document.getElementById("postLoading");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!desc.trim()) {
        alert("Please enter a description.");
        return;
    }

    if (!user || !user._id) {
        alert("User not found");
        return;
    }

    loading.style.display = "block";

    const formData = new FormData();
    formData.append("desc", desc);
    if (media) formData.append("media", media);

    const isEditing = !!editingPostId;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
        ? `http://localhost:3001/api/posts/${editingPostId}`
        : "http://localhost:3001/api/posts/";

    if (!isEditing) formData.append("user", user._id);

    fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            editingPostId = null;
            document.getElementById("postDesc").value = "";
            document.getElementById("mediaInput").value = "";
            closeModal("postModal");

            return fetch('/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        })
        .then(res => res.json())
        .then(updatedUser => {
            showUserPosts(updatedUser.posts);
            loading.style.display = "none";
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Failed to submit post");
            loading.style.display = "none";
        });
}

function changeProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    document.getElementById("profilePic").src = imgURL;

    const formData = new FormData();
    formData.append("profile_pic", file);

    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/profile/uploadProfilePic", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
            console.log("Upload success:", data);
        })
        .catch(err => {
            console.error("Upload failed:", err);
            alert("Failed to upload profile picture");
        });
}

function changeUsername() {
    const newName = document.getElementById("newUsername").value;
    if (newName.trim()) {
        document.getElementById("username").innerText = newName;
        document.getElementById("newUsername").value = "";
    }

    const formData = new FormData();
    formData.append("fullName", newName);

    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/api/profile/update", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
            console.log("User name changed:", data);
        })
        .catch(err => {
            console.error("Error in changing name", err);
            alert("Failed to change user name");
        });
}

// Event delegation for post actions

document.addEventListener('click', async (e) => {
    const unlikeBtn = e.target.closest('.unlike-btn');
    const likeBtn = e.target.closest('.like-btn');
    const commentToggleBtn = e.target.closest('.comment-toggle-btn');
    const submitCommentBtn = e.target.classList.contains('submit-comment') ? e.target : null;
    const shareBtn = e.target.closest('.share-btn');

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Unlike logic
    if (unlikeBtn) {
        const postId = unlikeBtn.dataset.id;
        const likeCountSpan = unlikeBtn.querySelector('.like-count');

        try {
            const response = await fetch(`http://localhost:3001/api/like/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to unlike');
            }

            const updatedLikes = await response.json();
            likeCountSpan.textContent = updatedLikes.length;
            window.location.reload();
        } catch (err) {
            console.error("Unlike error:", err);
            alert(err.message || "Error while unliking.");
        }
    }

    // Like logic
    if (likeBtn) {
        const postId = likeBtn.dataset.id;
        const likeCountSpan = likeBtn.querySelector('.like-count');

        try {
            const response = await fetch(`http://localhost:3001/api/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ postId })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to like');
            }

            const updatedLikes = await response.json();
            likeCountSpan.textContent = updatedLikes.length;
            window.location.reload();
        } catch (err) {
            console.error("Like error:", err);
            alert(err.message || "Error while liking.");
        }
    }

    // Toggle comment section
    if (commentToggleBtn) {
        const section = commentToggleBtn.closest('.post-content').querySelector('.comments-section');
        section.style.display = section.style.display === 'flex' ? 'none' : 'flex';
    }

    // Submit comment (UI-only for now)
    if (submitCommentBtn) {
        const input = submitCommentBtn.previousElementSibling;
        const commentText = input.value.trim();
        if (commentText) {
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `<strong>You:</strong> ${commentText}`;
            submitCommentBtn.parentElement.parentElement.insertBefore(newComment, submitCommentBtn.parentElement);
            input.value = '';
        }
    }

    // Share logic
    if (shareBtn) {
        navigator.clipboard.writeText("Check out this amazing product on WebMart!");
        alert("Link copied! Share it with your friends.");
    }
});

function showUserPosts(userPosts) {
    const postArea = document.getElementById("postsSection");
    postArea.innerHTML = "";
    postCount = 0;

    if (!Array.isArray(userPosts) || userPosts.length === 0) {
        postArea.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No posts found.</p>';
        document.getElementById("postCount").innerText = 0;
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    userPosts.forEach(post => {
        const isLiked = Array.isArray(post.likes) && post.likes.map(id => id.toString()).includes(user._id.toString());
        const newPost = document.createElement("div");
        newPost.className = "user-post";

        const mediaExtension = post.media?.split('.').pop().toLowerCase();
        let mediaElement = "";
        if (["jpg", "jpeg", "png", "webp", "gif"].includes(mediaExtension)) {
            mediaElement = `<img src="http://localhost:3001${post.media}" style="width:100%;border-radius:8px;margin-top:10px;" alt="post image">`;
        } else if (["mp4", "webm", "ogg", "mov"].includes(mediaExtension)) {
            mediaElement = `<video controls style="width:100%;border-radius:8px;margin-top:10px;">
                <source src="http://localhost:3001${post.media}" type="video/${mediaExtension}">
            </video>`;
        }

        newPost.innerHTML = `
            <div class="post-header">
                <img src="${post.user?.profilePic ? `http://localhost:3001${post.user.profilePic}` : '/default-avatar.png'}" style="width:40px;height:40px;border-radius:50%;">
                <div>
                    <strong>${post.user?.fullName || 'Unknown User'}</strong><br>
                    <small>${new Date(post.createdAt).toLocaleString()}</small>
                </div>
                <button onclick="togglePostMenu('${post._id}')">⋮</button>
                <div id="menu-${post._id}" class="post-menu" style="display:none;">
                    <button onclick="startEditPost('${post._id}', \`${post.desc.replace(/`/g, "\\`")}\`)">Edit</button>
                    <button onclick="deletePost('${post._id}')" style="color:red;">Delete</button>
                </div>
            </div>
            <p>${post.desc}</p>
            ${mediaElement}
            <div class="post-actions">
            ${isLiked ?
                `<button class="action-btn unlike-btn liked" data-id="${post._id}">
                            ❤️ <span class="like-count">${post.likes?.length || 0}</span>
                         </button>` :
                `<button class="action-btn like-btn" data-id="${post._id}">
                            🤍 <span class="like-count">${post.likes?.length || 0}</span>
                         </button>`
            }
                <button onclick="commentPost()">💬 Comment (${post.comments?.length || 0})</button>
                <button onclick="sharePost()">📤 Share</button>
            </div>
        `;
        postArea.appendChild(newPost);
        postCount++;
    });

    document.getElementById("postCount").innerText = userPosts.length;
}

function togglePostMenu(postId) {
    const menu = document.getElementById(`menu-${postId}`);
    document.querySelectorAll(".post-menu").forEach(m => {
        if (m !== menu) m.style.display = "none";
    });
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function toggleProductMenu(pId) {
    const menu = document.getElementById(`menu-${pId}`);
    document.querySelectorAll(".product-menu").forEach(m => {
        if (m !== menu) m.style.display = "none";
    });
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function startEditPost(postId, desc) {
    editingPostId = postId;
    document.getElementById("postDesc").value = desc;
    document.getElementById("mediaInput").value = "";
    openPostModal();
}

function deletePost(postId) {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this post?")) return;

    fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(() => {
            alert("Post deleted");
            document.querySelector(`#menu-${postId}`).style.display = "none";
            location.reload();
        })
        .catch(err => {
            console.error("Delete error:", err);
            alert("Failed to delete post");
        });
}


function submitBusiness() {
    console.log("submitBusiness called")
    const name = document.getElementById("bizNameInput").value;
    const desc = document.getElementById("bizDescInput").value;
    const address = document.getElementById("bizLocationInput").value;
    const insta = document.getElementById("instaInput").value;
    const fb = document.getElementById("fbInput").value;
    const tiktok = document.getElementById("tiktokInput").value;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!name || !address || !desc.trim()) {
        alert("Please enter name, address and description.");
        return;
    }

    if (!user || !user._id) {
        alert("User not found");
        return;
    }

    //loading.style.display = "block";

    // Send as JSON instead of FormData
    fetch("http://localhost:3001/api/business", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            desc,
            address,
            insta,
            fb,
            tiktok,
            user: user._id
        })
    })
        .then(res => res.json())
        .then(() => {
            document.getElementById("bizNameInput").value = "";
            document.getElementById("bizDescInput").value = "";
            document.getElementById("bizLocationInput").value = "";
            document.getElementById("instaInput").value = "";
            document.getElementById("fbInput").value = "";
            document.getElementById("tiktokInput").value = "";

            closeModal("postModal");

            return fetch('/api/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        })
        .then(res => res.json())
        .then(updatedUser => {
            showUserPosts(updatedUser.posts);
            // loading.style.display = "none";
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Failed to submit business");
            //loading.style.display = "none";
        });
}

function showBusiness(business) {
    const businessInfo = document.getElementById("businessInfo");
    businessInfo.classList.remove('hidden');
    document.getElementById("bizDesc").innerHTML = business.desc;
    document.getElementById("bizLocation").innerHTML = business.address;
    document.getElementById("linkInsta").href = business.insta;
    document.getElementById("linkFacebook").href = business.fb;
    document.getElementById("linkTiktok").href = business.tiktok;
}

function submitProduct() {
    const name = document.getElementById("productName").value.trim();
    const image = document.getElementById("productImage").files[0];
    const desc = document.getElementById("productDesc").value.trim();
    const material = document.getElementById("productMaterial").value.trim();
    const price = document.getElementById("productPrice").value.trim();
    const quantity = document.getElementById("productQty").value.trim();

    const categoryRadio = document.querySelector('input[name="category"]:checked');
    const otherInput = document.getElementById("otherCategoryInput");
    let category = "";

    if (categoryRadio?.id === "otherCategoryRadio") {
        category = otherInput.value.trim();
    } else if (categoryRadio) {
        category = categoryRadio.value;
    }

    const loading = document.getElementById("postLoading");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!name || !desc || !material || !price || !quantity || !category || !image) {
        alert("Please fill all fields and select an image.");
        return;
    }

    if (!user || !user._id) {
        alert("User not found");
        return;
    }

    loading.style.display = "block";

    const formData = new FormData();
    formData.append("user", user._id);
    formData.append("name", name);
    formData.append("desc", desc);
    formData.append("material", material);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("media", image);

    fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            // Reset form fields
            document.getElementById("productName").value = "";
            document.getElementById("productDesc").value = "";
            document.getElementById("productMaterial").value = "";
            document.getElementById("productPrice").value = "";
            document.getElementById("productQty").value = "";
            document.getElementById("productImage").value = "";
            document.getElementById("otherCategoryInput").value = "";
            document.querySelectorAll('input[name="category"]').forEach(el => el.checked = false);

            closeModal("catalogModal");
            loading.style.display = "none";
            alert("Product added successfully!");
        })
        .catch(err => {
            console.error("Error submitting product:", err);
            alert("Failed to add product.");
            loading.style.display = "none";
        });
}

function showUserProducts(products) {
    const pArea = document.getElementById("productList");
    pArea.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
        pArea.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No products found.</p>';
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const favoriteProductIds = (user?.favorites || []).map(id => id.toString());

    products.forEach(product => {
        const isFav = favoriteProductIds.includes(product._id.toString());
        const newP = document.createElement("div");
        newP.className = "user-product";

        const mediaExtension = product.media?.split('.').pop().toLowerCase();
        let mediaElement = `<img src="http://localhost:3001${product.media}" style="width:100%;border-radius:8px;margin-top:10px;" alt="product image">`;

        newP.innerHTML = `
            <div class="product-header" style="display:flex;align-items:center;gap:10px;">
                <img src="${product.user?.profilePic ? `http://localhost:3001${product.user.profilePic}` : '/default-avatar.png'}" 
                     style="width:40px;height:40px;border-radius:50%;">
                <div>
                    <strong>${product.user?.fullName || 'Unknown User'}</strong><br>
                    <small>${new Date(product.createdAt).toLocaleString()}</small>
                </div>
                <div style="margin-left:auto;">
                    <button onclick="toggleProductMenu('${product._id}')">⋮</button>
                    <div id="menu-${product._id}" class="product-menu" style="display:none;">
                        <button onclick="startEditProduct('${product._id}', \`${product.desc.replace(/`/g, "\\`")}\`)">Edit</button>
                        <button onclick="deleteProduct('${product._id}')" style="color:red;">Delete</button>
                    </div>
                </div>
            </div>
            <div style="margin-top:10px;">
                <p><strong>${product.name}</strong></p>
                <p>${product.desc}</p>
                <p><strong>Price:</strong> PKR ${product.price}</p>
                <p><strong>Quantity in stock:</strong> ${product.quantity}</p>
                <p><strong>Material:</strong> ${product.material}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                ${mediaElement}
            </div>
            <div class="product-actions" style="margin-top:10px;">
            <button onclick="toggleFavorite(this)" class="action-btn ${isFav ? 'active' : ''}" data-id="${product._id}">
    ${isFav ? '❤️ Favorite' : '🤍 Favorite'}
</button>

                   <input type="number" min="1" max="${product.quantity}" value="1" id="qty-${product._id}" style="width:60px;margin:0 10px;">
                <button onclick="addToCart('${product._id}')" class="action-btn">🛒 Add to Cart</button>
            </div>
        `;

        pArea.appendChild(newP);
    });
}
function toggleFavorite(btn) {
    const productId = btn.getAttribute("data-id");
    const token = localStorage.getItem("token");
    console.log("Token being sent:", token);
    const isCurrentlyFav = btn.classList.contains("active");

    const url = isCurrentlyFav
        ? `http://localhost:3001/api/products/favorite?productId=${productId}` // DELETE uses query param
        : `http://localhost:3001/api/products/favorite`;

    const options = {
        method: isCurrentlyFav ? "DELETE" : "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    if (!isCurrentlyFav) {
        // Only POST needs body
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({ productId });
    }

    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            if (!data || data.error) throw new Error(data.message || "Unknown error");

            if (isCurrentlyFav) {
                btn.innerHTML = "🤍 Favorite";
                btn.classList.remove("active");
            } else {
                btn.innerHTML = "❤️ Favorite";
                btn.classList.add("active");
            }
        })
        .catch(err => {
            console.error("Favorite error:", err);
            alert("Failed to update favorite status");
        });
}
