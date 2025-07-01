async function addToFavorites(productId) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/api/products/favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Added to favorites");
    } else {
        alert(data.message || "Failed");
    }
}

async function removeFromFavorites(productId) {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3001/api/products/unfavorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Removed from favorites");
    } else {
        alert(data.message || "Failed");
    }
}
