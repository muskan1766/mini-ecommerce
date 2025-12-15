let cart = JSON.parse(localStorage.getItem("cart")) || [];


const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    category: "Electronics",
    image: "images/headphones.jpg"
  },
  {
    id: 2,
    name: "Men T-Shirt",
    price: 799,
    category: "Fashion",
    image: "images/tshirt.jpg"
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 2999,
    category: "Electronics",
    image: "images/watch.jpg"
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 2499,
    category: "Fashion",
    image: "images/shoes.jpg"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1499,
    category: "Electronics",
    image: "images/speaker.jpg"
  },
  {
    id: 6,
    name: "Backpack",
    price: 999,
    category: "Fashion",
    image: "images/backpack.jpg"
  },
  {
    id: 7,
    name: "Laptop Backpack",
    price: 1799,
    category: "Fashion",
    image: "images/laptop-bag.jpg"
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    price: 2499,
    category: "Electronics",
    image: "images/earbuds.jpg"
  }
];





function displayProducts(productList) {
  productContainer.innerHTML = "";

  productList.forEach(product => {
    productContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">

        <h3>
          <a href="product.html?id=${product.id}">
            ${product.name}
          </a>
        </h3>

        <p>₹${product.price}</p>

        <button onclick="addToCart(${product.id}, this)">
          Add to Cart
        </button>
      </div>
    `;
  });
}


function filterCategory(category) {
  if (category === "All") {
    displayProducts(products);
  } else {
    const filteredProducts = products.filter(
      product => product.category === category
    );
    displayProducts(filteredProducts);
  }
}
function filterByPrice(maxPrice) {
  document.getElementById("price-value").innerText = maxPrice;

  const filteredProducts = products.filter(
    product => product.price <= maxPrice
  );

  displayProducts(filteredProducts);
}

function searchProducts(keyword) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(keyword.toLowerCase())
  );

  displayProducts(filteredProducts);
}



function addToCart(productId, btn) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === productId);

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // visual feedback
  if (btn) {
    const originalText = btn.innerText;
    btn.innerText = "✓ Added";
    btn.disabled = true;

    setTimeout(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    }, 800);
  }
}



function productFallbackImage(category) {
  if (category === "Electronics") {
    return "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600";
  } else {
    return "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=600";
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;

  cart.forEach(item => {
    count += Number(item.quantity || 1);
  });

  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = count;
  }
}



const productContainer = document.getElementById("product-container");

if (productContainer) {
  displayProducts(products);
}



// ---------- PRODUCT DETAIL PAGE LOGIC ----------

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (productId) {
  const product = products.find(p => p.id == productId);

  if (product) {
    document.getElementById("product-name").innerText = product.name;
    document.getElementById("product-image").src = product.image;
    document.getElementById("product-price").innerText = "₹" + product.price;
    document.getElementById("product-category").innerText =
      "Category: " + product.category;

    const addBtn = document.getElementById("add-btn");

    if (addBtn) {
      addBtn.onclick = function () {
        addToCart(product.id, addBtn);
      };
    }


  } else {
    document.body.innerHTML = "<h2>Product not found</h2>";
  }
}


// ---------- CART PAGE LOGIC ----------

function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  const totalEl = document.getElementById("total-price");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  let total = 0;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<h3>Your cart is empty</h3>";
    totalEl.innerText = "";
    return;
  }

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <h4>${item.name}</h4>
          <p>₹${item.price}</p>

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  totalEl.innerText = "Total Amount: ₹" + total;
}


function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();        // refresh cart
  updateCartCount();    // update cart icon
}
function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  displayCart();
}


displayCart();
updateCartCount();

function placeOrder() {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;

  if (!name || !address) {
    alert("Please fill all details");
    return;
  }

  // Clear cart
  localStorage.removeItem("cart");
  updateCartCount();

  document.getElementById("order-message").innerText =
    "🎉 Order placed successfully!";

  // Optional redirect after 2 seconds
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}
updateCartCount();
localStorage.removeItem("cart");
