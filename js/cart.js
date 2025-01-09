// Retrieve the cart data from local storage
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Get elements for navbar, total quantity, and total price
const cartCountNav = document.getElementById("cart-quantity"); // Navbar count

const totalPriceSummary = document.getElementById("total-price"); // Total Price
const totalShippingFeeSummary = document.getElementById("total-shipping-fee"); // Total Shipping Fee
const totalDiscountSummary = document.getElementById("total-discount"); // Total Discount
const finalTotalSummary = document.getElementById("final-total"); // Final Total

const cartContainer = document.getElementById("cart-container"); // Cart container

const discountCodeInput = document.getElementById("discount-code"); // Discount input
const shippingSelect = document.getElementById("shipping-options"); // Shipping options
const applyCouponButton = document.getElementById("apply-coupon"); // Apply coupon button

const clearCartIcon = document.getElementById("clear-cart-icon"); // Clear cart icon
const clearCartLabel = document.getElementById("clear-cart-label"); // Clear cart label

// Clear the container before appending new items
cartContainer.innerHTML = "";

// Variable to hold the total price, quantity, and shipping cost
let totalQuantity = 0;
let totalPrice = 0;
let discountAmount = 0;
let currentShippingCost = 5.0; // Default shipping cost

// Function to display cart products and calculate total values
function displayCartProducts() {
  cartContainer.innerHTML = ""; // Clear existing items
  totalQuantity = 0;
  totalPrice = 0;

  // Check if cart is empty
  if (Object.keys(cart).length === 0) {
    cartContainer.style.height = "50px";
    cartContainer.innerHTML = `<p class="text-center">Your cart is empty!</p>`;

    clearCartIcon.style.display = "none"; // Hide the clear cart icon
    clearCartLabel.style.display = "none"; // Hide the clear cart label

    updateCartSummary();
    return;
  }

  // Loop through each item in the cart object
  for (const key in cart) {
    if (cart.hasOwnProperty(key)) {
      const item = cart[key];
      const product = item.product;
      const quantity = item.quantity;
      const total = (product.price * quantity).toFixed(2); // Calculate total price for each product

      // Update total quantity and total price
      totalQuantity += quantity;
      totalPrice += parseFloat(total);

      // Create the HTML structure for each cart item
      const cartItemHTML = `
    <div class="row mb-4">
        <!-- Product Image -->
        <div class="col-4 col-md-2">
            <img src="${product.image}" class="img-fluid rounded-3 cart-item-img" alt="${product.title}">
        </div>

        <!-- Product Details -->
        <div class="col-8 col-md-10">
            <h6 class="cart-item-title">${product.title}</h6>    
            <h6 class="cart-item-category text-muted">${product.category}</h6>

            <!-- Price and Total -->
            <h6 class="mb-0 d-flex align-items-center flex-nowrap">
                <span>$${product.price.toFixed(2)}</span>
                <span class="mx-1"><i class="fas fa-times"></i></span>
                <span>${quantity}</span>
                <span class="mx-1"><i class="fas fa-equals"></i></span>
                <span>$${total}</span>
            </h6>

            <!-- Action Buttons (Plus, Minus, Remove) -->
            <div class="d-flex align-items-center mt-2 flex-nowrap">
                <!-- Minus Button -->
                <button onclick="decreaseQuantity(${product.id})" class="btn p-0 me-1">
                    <lord-icon
                        src="https://cdn.lordicon.com/rypcsrlk.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#000000,secondary:#000000"
                        style="width:30px;height:25px">
                    </lord-icon>
                </button>

                <!-- Plus Button -->
                <button onclick="increaseQuantity(${product.id})" class="btn p-0 me-1">
                    <lord-icon
                        src="https://cdn.lordicon.com/sbnjyzil.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#000000,secondary:#000000"
                        style="width:30px;height:25px">
                    </lord-icon>
                </button>

                <!-- Remove Button -->
                <button onclick="removeItem(${product.id})" class="btn p-0">
                    <lord-icon
                        src="https://cdn.lordicon.com/hwjcdycb.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#000000,secondary:#000000"
                        style="width:30px;height:25px">
                    </lord-icon>
                </button>
            </div>
            <hr class="my-4">
        </div>
    </div>
`;

      // Append the generated HTML to the cart container
      cartContainer.innerHTML += cartItemHTML;
    }
  }

  // Update cart summary
  updateCartSummary();
}

// Function to update the cart summary (total quantity and price)
function updateCartSummary() {
  // Calculate final price with shipping and discount
  const finalPrice = totalPrice + currentShippingCost - discountAmount;

  cartCountNav.textContent = totalQuantity; // Update the navbar count

  if (Object.keys(cart).length === 0) {
    totalPriceSummary.textContent = `$ 0.00`; // Update total price
    totalShippingFeeSummary.textContent = `$ 0.00`; // Update shipping cost
    totalDiscountSummary.textContent = `$ 0.00`; // Update discount amount
    finalTotalSummary.textContent = `$ 0.00`; // Update final total
  } 
  else {
    totalPriceSummary.textContent = `$ ${totalPrice.toFixed(2)}`; // Update total price
    totalShippingFeeSummary.textContent = `$ ${currentShippingCost.toFixed(2)}`; // Update shipping cost
    totalDiscountSummary.textContent = `$ ${discountAmount.toFixed(2)}`; // Update discount amount
    finalTotalSummary.textContent = `$ ${finalPrice.toFixed(2)}`; // Update final total
  }
}

// Function to apply discount based on discount code
function applyDiscount() {
  const code = discountCodeInput.value.trim();
  if (code === "OSTAD") {
    // Apply a 10% discount
    discountAmount = totalPrice * 0.1;
    alert("10% discount applied!");
    discountCodeInput.disabled = true; // Disable the input field after applying the discount
  } else {
    alert("Invalid discount code.");
    discountAmount = 0; // Reset discount if invalid code is entered
  }

  // Update the summary after applying the discount
  updateCartSummary();
}

// Function to update the total price based on shipping option
function updateShippingCost() {
  const shippingOption = shippingSelect.value;

  // Set shipping cost based on selected option
  if (shippingOption === "1") currentShippingCost = 5.0; // Standard-Delivery
  if (shippingOption === "2") currentShippingCost = 15.0; // Faster-Delivery
  if (shippingOption === "3") currentShippingCost = 30.0; // Same-Day-Delivery

  // Update total price element with shipping cost
  updateCartSummary();
}

// Function to increase product quantity
function increaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity++;
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to local storage
  displayCartProducts(); // Refresh the cart
}

// Function to decrease product quantity
function decreaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity--;
    if (cart[productId].quantity <= 0) {
      delete cart[productId]; // Remove the item if quantity is 0
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to local storage
  displayCartProducts(); // Refresh the cart
}

// Function to remove an item completely
function removeItem(productId) {
  if (cart[productId]) {
    delete cart[productId]; // Remove the item
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to local storage
  displayCartProducts(); // Refresh the cart
}

// Function to clear the cart
function clearCart() {
  localStorage.removeItem("cart"); // Remove cart from localStorage
  cart = {}; // Reset the cart variable
  alert("Cart has been cleared!");
  displayCartProducts(); // Refresh the cart display
}

// Event listeners
applyCouponButton.addEventListener("click", applyDiscount); // Apply discount
shippingSelect.addEventListener("change", updateShippingCost); // Update shipping cost

// Call the function to display cart products
displayCartProducts();
