// Declare variables to store data
let products = [];
// Export the cart object
let cart = JSON.parse(localStorage.getItem('cart')) || {}; // Your cart object
// localStorage.setItem('cart', JSON.stringify(cart)); // Store the cart object as a string

// let cart = JSON.parse(localStorage.getItem('cart')) || {};
let cartCount = 0; // Cart count starts at 0

// Show loading overlay and disable interaction
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('show');
    document.body.classList.add('loading'); // Prevent user interaction
}

// Hide loading overlay and enable interaction
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('show');
    document.body.classList.remove('loading'); // Re-enable user interaction
    document.getElementById('footer').style.display = 'block'; // Show the footer
}

// Updated fetchProducts function with loading animation
function fetchProducts() {
    showLoading();
    return fetch('https://fakestoreapi.com/products')
        .then((res) => res.json())
        .then((json) => {
            products = json;
            displayProducts(products); // Display products
        })
        .catch((error) => console.error('Error fetching products:', error))
        .finally(() => hideLoading()); // Always hide the overlay
}

// Display products dynamically
function displayProducts(products) {
    const productsContainer = document.querySelector('#products .row');
    productsContainer.innerHTML = ''; // Clear existing content if any

    products.forEach((product) => {
        const productCard = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body text-center card-clickable" data-description="${product.description}">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                        <p class="card-text"><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
                    </div>
                    <div class="d-flex justify-content-center gap-2 mt-2">
                        <button class="remove-from-cart-btn" data-id="${product.id}">
                                <lord-icon
                                    src="https://cdn.lordicon.com/rypcsrlk.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#000000,secondary:#000000"
                                    style="width:50px;height:50px">
                                </lord-icon>
                        </button>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                                <lord-icon
                                    src="https://cdn.lordicon.com/sbnjyzil.json"
                                    trigger="hover"
                                    stroke="bold"
                                    colors="primary:#000000,secondary:#000000"
                                    style="width:50px;height:50px">
                                </lord-icon>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });

    updateCartCount(); // Update cart count in the navbar
    setupCardClickHandlers();
    setupAddToCartButtons(); // Initialize cart button functionality
}

// Function to set up "Add to Cart" and "Remove from Cart" buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id'); // Get the product ID
            const product = products.find((p) => p.id == productId); // Find the product by ID

            // Check if the product is already in the cart
            if (cart[productId]) {
                // Increase the quantity if already in the cart
                cart[productId].quantity += 1;
                console.log(`Added to Cart - ID: ${product.id}, Title: ${product.title}, Quantity: ${cart[productId].quantity}`);
            } else {
                // Add the product with a quantity of 1 if it's not already in the cart
                cart[productId] = {
                    product: product, // Store product details
                    quantity: 1        // Set quantity to 1 for the first addition
                };
                console.log(`Added to Cart - ID: ${product.id}, Title: ${product.title}`);
            }

            updateCartCount(); // Increase cart count
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    removeFromCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id'); // Get the product ID
            const product = products.find((p) => p.id == productId); // Find the product by ID

            // Remove the product only if it exists in the cart
            if (cart[productId]) {
                if (cart[productId].quantity > 1) {
                    // Decrease the quantity if more than 1
                    cart[productId].quantity -= 1;
                    console.log(`Removed one unit from Cart - ID: ${product.id}, Title: ${product.title}, Quantity: ${cart[productId].quantity}`);
                } else {
                    // If the quantity is 1, remove the product completely from the cart
                    delete cart[productId];
                    console.log(`Removed from Cart - ID: ${product.id}, Title: ${product.title}`);
                }

                updateCartCount(); // Decrease cart count
            } else {
                console.log(`Product not in cart - ID: ${product.id}, Title: ${product.title}`); // Log if not in cart
            }
        });
    });
}

// Add click event listeners to cards
function setupCardClickHandlers() {
    const clickableCards = document.querySelectorAll('.card-clickable');
    clickableCards.forEach((card) => {
        card.addEventListener('click', () => {
            const description = card.getAttribute('data-description');
            if (card.querySelector('.expanded-description')) {
                // Remove expanded description if already shown
                card.querySelector('.expanded-description').remove();
            } else {
                // Add expanded description
                const descElement = document.createElement('p');
                descElement.className = 'expanded-description';
                descElement.innerText = description;
                descElement.style.marginTop = '10px';
                descElement.style.fontSize = '0.9em';
                card.appendChild(descElement);
            }
        });
    });
}

// Function to update the cart count in the navbar
function updateCartCount() {
    let totalQuantity = 0;

    for (const key in cart) {
        if (cart.hasOwnProperty(key)) {
            const item = cart[key]; // Each cart item
            totalQuantity += item.quantity; // Add the quantity of each item to totalQuantity
        }
    }

    console.log("Total Quantity: ", totalQuantity);

    const cartCountNav = document.getElementById('productQuantity');
    cartCountNav.textContent = totalQuantity;

}

// Initialize fetching products on page load
fetchProducts();