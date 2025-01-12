// Retrieve the cart data from local storage
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Get elements for navbar, total quantity, and total price
const cartCountNav = document.getElementById("cart-quantity"); // Navbar count

const totalPriceSummary = document.getElementById("total-price"); // Total Price
const totalDiscountSummary = document.getElementById("total-discount"); // Total Discount
const afterDiscount = document.getElementById("after-discount");
const totalShippingFeeSummary = document.getElementById("total-shipping-fee"); // Total Shipping Fee
const finalTotalSummary = document.getElementById("final-total"); // Final Total

const discountCodeInput = document.getElementById("discount-code"); // Discount input
const applyCouponButton = document.getElementById("apply-coupon"); // Apply coupon button

const cartContainer = document.getElementById("cart-container"); // Cart container
const mainContainer = document.getElementById("main-container"); // Main container
const emptyCartMessage = document.getElementById("empty-cart-message"); // Empty cart message
const clearCartIcon = document.getElementById("clear-cart-icon"); // Clear cart icon
const clearCartLabel = document.getElementById("clear-cart-label"); // Clear cart label

const shippingSelect = document.getElementById("shipping-options"); // Shipping options
const checkoutButton = document.getElementById("checkout"); // Checkout button

// Variables for cart calculations
let totalQuantity = 0;
let totalPrice = 0;
let discountAmount = 0;
let currentShippingCost = 5.0; // Default shipping cost
let couponApplied = false; // Track if the coupon is applied

// Function to display cart products
function displayCartProducts() {
  cartContainer.innerHTML = ""; // Clear existing items
  totalQuantity = 0;
  totalPrice = 0;

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = `<p class="text-center">Your cart is empty!</p>`;
    clearCartIcon.style.display = "none";
    clearCartLabel.style.display = "none";
    mainContainer.style.display = "none";
    emptyCartMessage.style.display = "block";
    updateCartSummary();
    return;
  } else {
    emptyCartMessage.style.display = "none";
  }

  // Loop through the cart and generate HTML for each product
  for (const key in cart) {
    if (cart.hasOwnProperty(key)) {
      const item = cart[key];
      const product = item.product;
      const quantity = item.quantity;
      const total = (product.price * quantity).toFixed(2);

      totalQuantity += quantity;
      totalPrice += parseFloat(total);

      const cartItemHTML = `
        <div class="row mb-4">
            <div class="col-4 col-md-2">
                <img src="${product.image}" class="img-fluid rounded-3" alt="${product.title}">
            </div>
            <div class="col-8 col-md-10">
                <h6>${product.title}</h6>
                <h6 class="text-muted">${product.category}</h6>
                <h6>$${product.price.toFixed(2)} x ${quantity} = $${total}</h6>
                <div>
                    <button onclick="decreaseQuantity(${product.id})">-</button>
                    <button onclick="increaseQuantity(${product.id})">+</button>
                    <button onclick="removeItem(${product.id})">Remove</button>
                </div>
                <hr>
            </div>
        </div>
      `;

      cartContainer.innerHTML += cartItemHTML;
    }
  }

  updateCartSummary();
}

// Function to update the cart summary
function updateCartSummary() {
  const finalPrice = totalPrice + currentShippingCost - discountAmount;
  const afterDiscountPrice = totalPrice - discountAmount;

  cartCountNav.textContent = totalQuantity;
  totalPriceSummary.textContent = `$ ${totalPrice.toFixed(2)}`;
  totalDiscountSummary.textContent = `- $ ${discountAmount.toFixed(2)}`;
  afterDiscount.textContent = `$ ${afterDiscountPrice.toFixed(2)}`;
  totalShippingFeeSummary.textContent = `$ ${currentShippingCost.toFixed(2)}`;
  finalTotalSummary.textContent = `$ ${finalPrice.toFixed(2)}`;
}

// Function to apply discount
function applyDiscount() {
  const code = discountCodeInput.value.trim().toLowerCase();

  // Validate promo code
  if (code === "ostad10") {
    discountAmount = totalPrice * 0.1; // 10% discount
    alert("10% discount applied!");
  } else if (code === "ostad5") {
    discountAmount = totalPrice * 0.05; // 5% discount
    alert("5% discount applied!");
  } else {
    alert("Invalid promo code.");
    return; // Exit the function for invalid codes
  }

  // Apply the coupon and enable changing it
  couponApplied = true;
  updateCartSummary();
}


// Function to update shipping cost
function updateShippingCost() {
  const shippingOption = shippingSelect.value;
  currentShippingCost = shippingOption === "1" ? 5.0 : shippingOption === "2" ? 15.0 : 30.0;
  updateCartSummary();
}

// Increase, decrease, and remove product functions
function increaseQuantity(productId) {
  if (cart[productId]) cart[productId].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartProducts();
}

function decreaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity--;
    if (cart[productId].quantity <= 0) delete cart[productId];
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartProducts();
}

function removeItem(productId) {
  delete cart[productId];
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartProducts();
}

// Clear cart and checkout functions
function clearCart() {
  localStorage.removeItem("cart");
  cart = {};
  alert("Cart cleared!");
  displayCartProducts();
}

function checkout() {
  localStorage.removeItem("cart");
  cart = {};
  alert("Checkout successful!");
  displayCartProducts();
}

// Event listeners
applyCouponButton.addEventListener("click", applyDiscount);
shippingSelect.addEventListener("change", updateShippingCost);
checkoutButton.addEventListener("click", checkout);

// Initial display
displayCartProducts();