window.addEventListener("DOMContentLoaded", async () => {
    const feed = document.getElementById('feed');
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        feed.innerHTML = `<p style="text-align:center;color:red;">You must be logged in to view the feed.</p>`;
        return;
    }

    try {
        const res = await fetch('http://localhost:3001/api/posts/all', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to fetch posts');
        }

        const posts = await res.json();

        if (!Array.isArray(posts)) {
            throw new Error("Unexpected response format");
        }

        posts.forEach(post => {
            const isLiked = Array.isArray(post.likes) && user?._id
                ? post.likes.map(id => id?.toString()).includes(user._id.toString())
                : false;

            const postCard = document.createElement('div');
            postCard.className = 'post-card';

            postCard.innerHTML = `
                <div class="post-header">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.fullName || 'User')}&background=random&color=fff&size=50"
                         class="business-logo" alt="User Avatar"
                         onerror="this.src='https://via.placeholder.com/50x50/cccccc/666666?text=User'">
                    <div class="business-name">${post.user?.fullName || 'Unknown'}</div>
                </div>

                <img src="https://picsum.photos/600/400?random=${post._id}" class="post-img" alt="Post Media" onerror="this.src='https://via.placeholder.com/600x400/cccccc/666666?text=Post+Image'">

                <div class="post-content">
                    <div class="post-description">${post.desc}</div>
                    <div class="post-actions">
                        ${isLiked ?
                    `<button class="action-btn unlike-btn liked" data-id="${post._id}">
                                ❤️ <span class="like-count">${post.likes?.length || 0}</span>
                             </button>` :
                    `<button class="action-btn like-btn" data-id="${post._id}">
                                🤍 <span class="like-count">${post.likes?.length || 0}</span>
                             </button>`
                }
                        <button class="action-btn comment-toggle-btn">💬</button>
                        <button class="action-btn share-btn">🔄</button>
                    </div>
                    <div class="comments-section" style="display:none;">
                        ${(post.comments || []).map(c => `
                            <div class="comment"><strong>${c.user?.fullName || 'Anonymous'}:</strong> ${c.text}</div>
                        `).join('')}
                        <div class="add-comment">
                            <input type="text" placeholder="Write a comment..." class="comment-input">
                            <button class="submit-comment" data-id="${post._id}">Post</button>
                        </div>
                    </div>
                </div>
            `;
            feed.appendChild(postCard);
        });

    } catch (err) {
        console.error("Error loading feed:", err);
        feed.innerHTML = `<p style="text-align:center;color:red;">Failed to load posts: ${err.message}</p>`;
    }
});


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
