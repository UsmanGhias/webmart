// second section image slider to show top famous products
let gallary = document.querySelector(".gallary");
let back = document.getElementById("previous");
let next = document.getElementById("next");

// Function to move slides
function moveSlide(direction) {
  gallary.style.scrollBehavior = "smooth";
  gallary.scrollLeft += direction * 900;
  resetAutoSlide();
}

// Event listeners for manual navigation
next.addEventListener("click", () => moveSlide(1));
back.addEventListener("click", () => moveSlide(-1));

// Auto slide function
function autoSlide() {
  moveSlide(1);
}

// Auto-slide every 3 seconds
// let autoSlideInterval = setInterval(autoSlide, 3000);

// Reset timer when manually clicking
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(autoSlide, 3000);
}




// Testimonials Slider for Section 6 to show reviews
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
// Background Slider on home Screen automatic Slider

var slideimage = document.getElementById("slideimage");
//  to store imges 
var images = new Array(
  "images/slide 2.jpeg",
  "images/slide 3.jpeg",
  "images/slide 4.jpeg",
  "images/slide 5.jpeg"
);
var len = images.length;
var i = 0;
function slider() {
  if (i > len - 1) {
    i = 0;
  }
  slideimage.src = images[i];
  i++;
  setTimeout('slider()', 3000);
}


// Sub Menu JavaScript to show a DropDown Menu For category option

let subMenu = document.getElementById("sub-Menu");
function toggleMenu() {
  subMenu.classList.toggle("open");
}


// Categories page options to move to the specific categories
function toggleSearch() {
  let searchInput = document.getElementById('search');
  if (searchInput.classList.contains('show')) {
    searchInput.classList.remove('show');
  } else {
    searchInput.classList.add('show');
    searchInput.focus();
  }
}

function filterProducts(category) {
  let products = document.querySelectorAll('.product');
  products.forEach(product => {
    if (product.getAttribute('data-category') === category || category === 'all') {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

function searchProducts() {
  let input = document.getElementById('search').value.toLowerCase();
  let products = document.querySelectorAll('.product');
  products.forEach(product => {
    let title = product.querySelector('h4').innerText.toLowerCase();
    if (title.includes(input)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}
// to show all items or products
function filterProducts(category) {
  const products = document.querySelectorAll('.product');
  products.forEach(product => {
    if (category === 'all' || product.dataset.category === category) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}



// chatbot assistance for cutomer quick responses 
const chatbot = document.getElementById("chatbot");
const chatBody = document.getElementById("chat-body");

const responses = {
  "hey": "Hi! good to see you today. I can help you with 1. Creating account. 2. launch business. 3. how to add items to your Catalog. 3. how to buy items.            And also I can tell you some tips. tell me what you need to know.",
  "good morning": "Good Morning ! Have a nice day.How can i assist you today. Feel free to ask.",
  "i have a question": "I am listening. Go ahead!",
  "how to add products?": "To add a product, go to your profile > add catalog option > Add details of products.",
  "add product": "To add a product, go to Dashboard > Products > Add New.",
  "edit product": "Click the 'Edit' button next to the product in your dashboard.",
  "payment options": "We support PayPal, Stripe, UPI, and credit/debit cards.",
  "favorites": "You can view your favorite items by clicking the heart icon on top.",
  "customer support": "Go to your profile > Help Center or email us at support@webmart.com.",
  "shipping": "We offer standard and express shipping across all regions.",
  "how to sell": "Create an account, add products, and start promoting them.",
  "account": "Go to Settings > Account to manage your profile, password, and preferences.",
  "order status": "Check the 'My Orders' section in your dashboard to track orders."
};

function toggleChat() {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");

  const response = getBotResponse(userText.toLowerCase());
  setTimeout(() => appendMessage(response, "bot"), 500);

  input.value = "";
}

function appendMessage(msg, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", sender === "user" ? "user-msg" : "bot-msg");
  msgDiv.textContent = msg;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(msg) {
  for (let key in responses) {
    if (msg.includes(key)) return responses[key];
  }
  return "Sorry, I didn’t get that. Try asking about products, payments, or your account.";
}

// Start with a welcome message
window.addEventListener("load", () => {
  appendMessage("Hi! I'm Web Mart Assistant. Ask me anything!", "bot");
  slider(); // This ensures your background slider still runs
});


// javascript for loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader-wrapper");
  loader.style.opacity = "0";
  loader.style.visibility = "hidden";
  setTimeout(() => {
    loader.remove(); // Fully remove from DOM for performance
  }, 800);
});





// javascript for responsive slide menu for smaller screens
function showSlideMenu() {
  const sidemenu = document.querySelector('.copyul');
  sidemenu.style.display = "flex";
}

function hideSlideMenu() {
  const sidemenu = document.querySelector('.copyul');
  sidemenu.style.display = "none";
}












