let currentUser = null;
let viewingUserId = null;
let isOwnProfile = false;
let currentEditingProductId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get current user from localStorage
    currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Get userId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    viewingUserId = urlParams.get('userId');
    
    // If no userId in URL, redirect to own profile
    if (!viewingUserId) {
        if (currentUser) {
            viewingUserId = currentUser.id;
            isOwnProfile = true;
        } else {
            // Not logged in, redirect to login
            window.location.href = 'login.html';
            return;
        }
    } else {
        // Check if viewing own profile
        isOwnProfile = currentUser && currentUser.id === viewingUserId;
    }
    
    loadProfile();
    setupEventListeners();
});

async function loadProfile() {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`http://localhost:3001/api/profile/user/${viewingUserId}`, {
            headers: headers
        });
        
        if (!response.ok) {
            throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        displayProfile(data);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile: ' + error.message);
    }
}

function displayProfile(profileData) {
    const { profile, posts, products, isFollowing } = profileData;
    
    // Update profile info
    document.getElementById('username').textContent = profile.fullName || 'Unknown User';
    document.getElementById('postCount').textContent = posts.length;
    document.getElementById('followerCount').textContent = profile.followers?.length || 0;
    document.getElementById('followingCount').textContent = profile.following?.length || 0;
    
    // Set profile picture
    const profilePic = document.getElementById('profilePic');
    if (profile.profilePic) {
        profilePic.src = profile.profilePic;
    } else {
        profilePic.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'User')}&background=random&color=fff&size=150`;
    }
    
    // Setup action buttons based on profile type
    setupActionButtons(isFollowing);
    
    // Load posts and products
    displayPosts(posts);
    displayProducts(products);
    
    // Show/hide elements based on ownership
    if (isOwnProfile) {
        document.getElementById('changeIconLabel').style.display = 'block';
        document.getElementById('startSellingBtn').style.display = profile.business ? 'none' : 'block';
        document.getElementById('openCatalogBtn').style.display = profile.business ? 'block' : 'none';
    } else {
        document.getElementById('changeIconLabel').style.display = 'none';
        document.getElementById('startSellingBtn').style.display = 'none';
        document.getElementById('openCatalogBtn').style.display = 'none';
    }
}

function setupActionButtons(isFollowing) {
    const actionButtons = document.getElementById('actionButtons');
    actionButtons.innerHTML = '';
    
    if (isOwnProfile) {
        // Own profile buttons
        actionButtons.innerHTML = `
            <button onclick="openPostModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                <i class="fas fa-pen"></i> Create Post
            </button>
            <button onclick="openSettingModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                <i class="fas fa-cog"></i> Settings
            </button>
        `;
    } else {
        // Other user's profile buttons
        const followButton = isFollowing 
            ? `<button onclick="unfollowUser()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" id="followBtn">
                <i class="fas fa-user-minus"></i> Unfollow
               </button>`
            : `<button onclick="followUser()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" id="followBtn">
                <i class="fas fa-user-plus"></i> Follow
               </button>`;
        
        actionButtons.innerHTML = `
            ${followButton}
            <button onclick="startChat()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                <i class="fas fa-comment"></i> Chat
            </button>
        `;
    }
}

async function followUser() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/profile/follow/${viewingUserId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to follow user');
        }
        
        // Update follow button
        const followBtn = document.getElementById('followBtn');
        followBtn.innerHTML = '<i class="fas fa-user-minus"></i> Unfollow';
        followBtn.className = 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded';
        followBtn.onclick = unfollowUser;
        
        // Update follower count
        const followerCount = document.getElementById('followerCount');
        followerCount.textContent = parseInt(followerCount.textContent) + 1;
        
        alert('User followed successfully!');
        
    } catch (error) {
        console.error('Error following user:', error);
        alert('Error following user: ' + error.message);
    }
}

async function unfollowUser() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/profile/unfollow/${viewingUserId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to unfollow user');
        }
        
        // Update follow button
        const followBtn = document.getElementById('followBtn');
        followBtn.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
        followBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded';
        followBtn.onclick = followUser;
        
        // Update follower count
        const followerCount = document.getElementById('followerCount');
        followerCount.textContent = Math.max(0, parseInt(followerCount.textContent) - 1);
        
        alert('User unfollowed successfully!');
        
    } catch (error) {
        console.error('Error unfollowing user:', error);
        alert('Error unfollowing user: ' + error.message);
    }
}

function startChat() {
    // Redirect to chat page with the user
    window.location.href = `userchat.html?receiverId=${viewingUserId}`;
}

function displayPosts(posts) {
    const postsSection = document.getElementById('postsSection');
    
    if (posts.length === 0) {
        postsSection.innerHTML = '<p class="text-center text-gray-500">No posts yet.</p>';
        return;
    }
    
    postsSection.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card bg-white p-4 rounded-lg shadow-md';
        
        let mediaHtml = '';
        if (post.media) {
            if (post.media.endsWith('.mp4') || post.media.endsWith('.webm')) {
                mediaHtml = `<video src="${post.media}" class="w-full h-40 object-cover rounded mb-2" controls></video>`;
            } else {
                mediaHtml = `<img src="${post.media}" class="w-full h-40 object-cover rounded mb-2" alt="Post media">`;
            }
        }
        
        postCard.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <div class="flex items-center space-x-2">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.fullName || 'User')}&background=random&color=fff&size=32" 
                         class="w-8 h-8 rounded-full" alt="User">
                    <span class="font-semibold text-sm">${post.user?.fullName || 'Unknown'}</span>
                </div>
                ${isOwnProfile ? `
                <div class="post-menu-container">
                    <button class="post-menu-btn" onclick="togglePostMenu('${post._id}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div class="post-dropdown" id="postMenu-${post._id}">
                        <button onclick="editPost('${post._id}')">Edit</button>
                        <button onclick="deletePost('${post._id}')" class="delete">Delete</button>
                    </div>
                </div>
                ` : ''}
            </div>
            ${mediaHtml}
            <p class="text-sm mb-2">${post.desc || ''}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
                <span>${post.likes?.length || 0} likes</span>
                <span>${new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        `;
        
        postsSection.appendChild(postCard);
    });
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    
    if (products.length === 0) {
        productList.innerHTML = '<p class="text-center text-gray-500">No products yet.</p>';
        return;
    }
    
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white p-4 rounded-lg shadow-md';
        
        productCard.innerHTML = `
            <img src="https://picsum.photos/300/200?random=${product._id}" 
                 class="w-full h-40 object-cover rounded mb-2" 
                 alt="${product.name}"
                 onerror="this.src='https://via.placeholder.com/300x200/cccccc/666666?text=Product+Image'">
            <h3 class="font-semibold mb-1">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${product.desc || ''}</p>
            <p class="text-lg font-bold text-green-600 mb-2">PKR ${product.price || 'N/A'}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">${product.category || 'Uncategorized'}</span>
                ${isOwnProfile ? `
                <div class="space-x-2">
                    <button onclick="editProduct('${product._id}')" class="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteProduct('${product._id}')" class="bg-red-500 text-white px-2 py-1 rounded text-xs">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                ` : `
                <button onclick="viewProduct('${product._id}')" class="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    View
                </button>
                `}
            </div>
        `;
        
        productList.appendChild(productCard);
    });
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Content').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Post menu functionality
function togglePostMenu(postId) {
    const menu = document.getElementById(`postMenu-${postId}`);
    const isVisible = menu.style.display === 'flex';
    
    // Hide all other menus
    document.querySelectorAll('.post-dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
    
    // Toggle current menu
    menu.style.display = isVisible ? 'none' : 'flex';
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.post-menu-container')) {
        document.querySelectorAll('.post-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openPostModal() {
    openModal('postModal');
}

function openSettingModal() {
    openModal('settingModal');
}

function openBusinessModal() {
    openModal('businessModal');
}

function openCatalogModal() {
    currentEditingProductId = null;
    document.getElementById('catalogModalTitle').textContent = 'Add Product';
    clearProductForm();
    openModal('catalogModal');
}

// Product functions
async function editProduct(productId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load product');
        }
        
        const product = await response.json();
        
        // Fill form with product data
        document.getElementById('productName').value = product.name || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productDesc').value = product.desc || '';
        document.getElementById('productQty').value = product.qty || '';
        document.getElementById('productMaterial').value = product.material || '';
        
        // Set category
        const categoryRadios = document.querySelectorAll('input[name="category"]');
        categoryRadios.forEach(radio => {
            if (radio.value === product.category) {
                radio.checked = true;
            }
        });
        
        currentEditingProductId = productId;
        document.getElementById('catalogModalTitle').textContent = 'Edit Product';
        openModal('catalogModal');
        
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Error loading product: ' + error.message);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        alert('Product deleted successfully!');
        loadProfile(); // Reload profile to update products
        
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
    }
}

function viewProduct(productId) {
    window.location.href = `buynow.html?productId=${productId}`;
}

function clearProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('productQty').value = '';
    document.getElementById('productMaterial').value = '';
    document.getElementById('productImage').value = '';
    
    // Clear category selection
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.checked = false;
    });
}

// Submit functions (keeping existing functionality)
async function submitPost() {
    const desc = document.getElementById('postDesc').value;
    const mediaInput = document.getElementById('mediaInput');
    
    if (!desc.trim()) {
        alert('Please write something!');
        return;
    }
    
    const formData = new FormData();
    formData.append('desc', desc);
    
    if (mediaInput.files[0]) {
        formData.append('media', mediaInput.files[0]);
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to create post');
        }
        
        alert('Post created successfully!');
        closeModal('postModal');
        document.getElementById('postDesc').value = '';
        mediaInput.value = '';
        loadProfile(); // Reload to show new post
        
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post: ' + error.message);
    }
}

async function submitProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const desc = document.getElementById('productDesc').value;
    const qty = document.getElementById('productQty').value;
    const material = document.getElementById('productMaterial').value;
    const imageInput = document.getElementById('productImage');
    
    // Get selected category
    let category = '';
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    for (const radio of categoryRadios) {
        if (radio.checked) {
            category = radio.value;
            break;
        }
    }
    
    if (category === 'Other') {
        category = document.getElementById('otherCategoryInput').value;
    }
    
    if (!name || !price || !desc || !category) {
        alert('Please fill in all required fields!');
        return;
    }
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('desc', desc);
    formData.append('qty', qty);
    formData.append('material', material);
    formData.append('category', category);
    
    if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }
    
    try {
        const token = localStorage.getItem('token');
        const url = currentEditingProductId 
            ? `http://localhost:3001/api/products/${currentEditingProductId}`
            : 'http://localhost:3001/api/products';
        const method = currentEditingProductId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to save product');
        }
        
        alert(currentEditingProductId ? 'Product updated successfully!' : 'Product added successfully!');
        closeModal('catalogModal');
        clearProductForm();
        loadProfile(); // Reload to show updated products
        
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
    }
}

async function submitBusiness() {
    const name = document.getElementById('bizNameInput').value;
    const desc = document.getElementById('bizDescInput').value;
    const address = document.getElementById('bizLocationInput').value;
    const insta = document.getElementById('instaInput').value;
    const fb = document.getElementById('fbInput').value;
    const tiktok = document.getElementById('tiktokInput').value;
    
    if (!name || !desc || !address) {
        alert('Please fill in all required fields!');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/business', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                desc,
                address,
                insta,
                fb,
                tiktok
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to register business');
        }
        
        alert('Business registered successfully!');
        closeModal('businessModal');
        loadProfile(); // Reload to update business status
        
    } catch (error) {
        console.error('Error registering business:', error);
        alert('Error registering business: ' + error.message);
    }
}

// Event listeners
function setupEventListeners() {
    // Category radio button listener
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = document.getElementById('otherCategoryInput');
            if (this.value === 'Other') {
                otherInput.style.display = 'block';
                otherInput.required = true;
            } else {
                otherInput.style.display = 'none';
                otherInput.required = false;
                otherInput.value = '';
            }
        });
    });
}

// Additional utility functions
function changeTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

async function changeUsername() {
    const newUsername = document.getElementById('newUsername').value;
    if (!newUsername.trim()) {
        alert('Please enter a new username!');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName: newUsername })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update username');
        }
        
        // Update stored user data
        const user = JSON.parse(localStorage.getItem('user'));
        user.fullName = newUsername;
        localStorage.setItem('user', JSON.stringify(user));
        
        alert('Username updated successfully!');
        closeModal('settingModal');
        loadProfile(); // Reload to show updated name
        
    } catch (error) {
        console.error('Error updating username:', error);
        alert('Error updating username: ' + error.message);
    }
}

async function changeProfileImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profilePic', file);
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/profile/upload-pic', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload profile picture');
        }
        
        const data = await response.json();
        document.getElementById('profilePic').src = data.profilePic;
        alert('Profile picture updated successfully!');
        
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture: ' + error.message);
    }
}
