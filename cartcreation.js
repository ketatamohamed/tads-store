export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  const cartList = document.querySelector(".cart-list");
  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    cartList.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" style="width:80px; height:auto;">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p class="price">TND ${item.price.toFixed(2)} <span class="old-price">TND ${item.oldPrice.toFixed(2)}</span></p>
          <div class="quantity">
            <button onclick="updateQuantity(-1, ${index})">-</button>
            <span id="qty-${index}">${item.quantity}</span>
            <button onclick="updateQuantity(1, ${index})">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">🗑</button>
      </div>
    `;
  });

  updateSummary();
}

window.updateQuantity = function(change, index) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
window.removeItem = function( index){
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateSummary() {
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shipment = 0.00;
  const discount = 0.00;
  const total = subtotal + shipment - discount;

  if (document.getElementById("subtotal")) {
    document.getElementById("subtotal").textContent = `TND ${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `TND ${total.toFixed(2)}`;
  }
}

if (document.querySelector(".cart-list")) {
  renderCart();
}
window.addToCart = function(button) {
  const productDiv = button.closest(".product");

  const name = productDiv.querySelector(".product-name").textContent;
  const price = parseFloat(productDiv.querySelector(".product-price").textContent);
  const oldPrice = parseFloat(productDiv.querySelector(".product-old-price").textContent);
  const image = productDiv.querySelector(".product-image").getAttribute("src");

  const product = {
    name,
    price,
    oldPrice,
    image,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "cart.html";
}


window.sendEmail = function () {
  emailjs.init("EeQfYEqajo9-uX59A"); // Replace with your real public key

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "🛒 Shopping List:\n";
  cart.forEach(item => {
    message += `• ${item.image} ${item.name} x ${item.quantity} ${item.price}TND
    ${item.price * item.quantity}TND\n`;
  });

  emailjs.send("service_b64w9vy", "template_ugtn2z9", {
    message: message,
    to_name: "Mohamed Ketata",
    reply_to: "tadsvicetresorier@gmail.com"
  }).then(response => {
    alert("✅ Email sent successfully!");
    console.log("SUCCESS", response);
  }).catch(error => {
    alert("❌ Failed to send email: " + error.text);
    console.error("ERROR", error);
  });
};
