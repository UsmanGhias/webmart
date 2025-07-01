let currentUser = null;
let allUsers = [];
let allProducts = [];
let allPosts = [];

// Check admin authentication on page load
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user || user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }
    
    currentUser = user;
    document.getElementById('adminName').textContent = user.fullName || 'Admin';
    
    // Load dashboard by default
    showTab('dashboard');
    loadDashboardData();
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all content divs
    const contents = document.querySelectorAll('[id^="content-"]');
    contents.forEach(content => content.classList.add('hidden'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('[id^="tab-"]');
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    
    // Show selected content and activate tab
    const selectedContent = document.getElementById(`content-${tabName}`);
    const selectedTab = document.getElementById(`tab-${tabName}`);
    
    if (selectedContent) selectedContent.classList.remove('hidden');
    if (selectedTab) selectedTab.classList.add('active-tab');
    
    // Load data based on selected tab
    switch(tabName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            loadUsers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'posts':
            loadPosts();
            break;
    }
}

// Load dashboard statistics
async function loadDashboardData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load dashboard data');
        
        const data = await response.json();
        
        // Update statistics
        document.getElementById('totalUsers').textContent = data.stats.totalUsers;
        document.getElementById('totalProducts').textContent = data.stats.totalProducts;
        document.getElementById('totalPosts').textContent = data.stats.totalPosts;
        document.getElementById('totalComments').textContent = data.stats.totalComments;
        
        // Update recent users
        const recentUsersDiv = document.getElementById('recentUsers');
        recentUsersDiv.innerHTML = data.recentActivity.recentUsers.map(user => `
            <div class="flex items-center space-x-3">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=40" 
                     class="w-10 h-10 rounded-full" alt="User">
                <div>
                    <p class="font-medium">${user.fullName}</p>
                    <p class="text-sm text-gray-500">${user.email}</p>
                </div>
            </div>
        `).join('');
        
        // Update recent products
        const recentProductsDiv = document.getElementById('recentProducts');
        recentProductsDiv.innerHTML = data.recentActivity.recentProducts.map(product => `
            <div class="flex items-center space-x-3">
                <img src="https://picsum.photos/40/40?random=${product._id}" 
                     class="w-10 h-10 rounded object-cover" alt="Product">
                <div>
                    <p class="font-medium">${product.name}</p>
                    <p class="text-sm text-gray-500">PKR ${product.price}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Dashboard error:', error);
        alert('Failed to load dashboard data');
    }
}

// Load users
async function loadUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load users');
        
        allUsers = await response.json();
        renderUsersTable();
        
    } catch (error) {
        console.error('Users error:', error);
        alert('Failed to load users');
    }
}

function renderUsersTable() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = allUsers.map(user => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=40" 
                         class="w-10 h-10 rounded-full mr-3" alt="User">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${user.fullName}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}">
                    ${user.role}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                ${user.role !== 'admin' ? `
                    <button onclick="makeAdmin('${user._id}')" class="text-blue-600 hover:text-blue-900">
                        Make Admin
                    </button>
                ` : ''}
                ${user._id !== currentUser._id ? `
                    <button onclick="deleteUser('${user._id}')" class="text-red-600 hover:text-red-900">
                        Delete
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Load products
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        renderProductsTable();
        
    } catch (error) {
        console.error('Products error:', error);
        alert('Failed to load products');
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = allProducts.map(product => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img src="https://picsum.photos/40/40?random=${product._id}" 
                         class="w-10 h-10 rounded object-cover mr-3" alt="Product">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${product.name}</div>
                        <div class="text-sm text-gray-500">${product.desc.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PKR ${product.price}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.user?.fullName || 'Unknown'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="editProduct('${product._id}')" class="text-blue-600 hover:text-blue-900">
                    Edit
                </button>
                <button onclick="deleteProduct('${product._id}')" class="text-red-600 hover:text-red-900">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Load posts
async function loadPosts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/admin/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load posts');
        
        allPosts = await response.json();
        renderPostsTable();
        
    } catch (error) {
        console.error('Posts error:', error);
        alert('Failed to load posts');
    }
}

function renderPostsTable() {
    const tbody = document.getElementById('postsTable');
    tbody.innerHTML = allPosts.map(post => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <img src="https://picsum.photos/40/40?random=${post._id}" 
                         class="w-10 h-10 rounded object-cover mr-3" alt="Post">
                    <div>
                        <div class="text-sm font-medium text-gray-900">${post.desc.substring(0, 50)}...</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${post.user?.fullName || 'Unknown'}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${post.likes?.length || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${new Date(post.createdAt).toLocaleDateString()}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deletePost('${post._id}')" class="text-red-600 hover:text-red-900">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Admin actions
async function makeAdmin(userId) {
    if (!confirm('Are you sure you want to make this user an admin?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/make-admin`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to make user admin');
        
        alert('User promoted to admin successfully!');
        loadUsers();
        
    } catch (error) {
        console.error('Make admin error:', error);
        alert('Failed to make user admin');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their products and posts.')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        alert('User deleted successfully!');
        loadUsers();
        loadDashboardData();
        
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Failed to delete user');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        alert('Product deleted successfully!');
        loadProducts();
        loadDashboardData();
        
    } catch (error) {
        console.error('Delete product error:', error);
        alert('Failed to delete product');
    }
}

async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete post');
        
        alert('Post deleted successfully!');
        loadPosts();
        loadDashboardData();
        
    } catch (error) {
        console.error('Delete post error:', error);
        alert('Failed to delete post');
    }
}

function editProduct(productId) {
    // Simple edit functionality - you can expand this
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;
    
    const newName = prompt('Enter new product name:', product.name);
    const newPrice = prompt('Enter new price:', product.price);
    const newCategory = prompt('Enter new category:', product.category);
    
    if (newName && newPrice && newCategory) {
        updateProduct(productId, {
            name: newName,
            price: parseFloat(newPrice),
            category: newCategory
        });
    }
}

async function updateProduct(productId, updates) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) throw new Error('Failed to update product');
        
        alert('Product updated successfully!');
        loadProducts();
        
    } catch (error) {
        console.error('Update product error:', error);
        alert('Failed to update product');
    }
}

// Refresh functions
function refreshUsers() {
    loadUsers();
}

function refreshProducts() {
    loadProducts();
}

function refreshPosts() {
    loadPosts();
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
} 