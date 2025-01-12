Module 20 Assignment

Live Link: https://ancientfahad.github.io/Shopping_Cart/index.html
Shopping Cart Project

Key Features:

Data Fetching from API:
    Product data is dynamically retrieved from the Fake Store API(https://fakestoreapi.com/). Here's an example of the fetch implementation:
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => console.log(data)); // Logs the products to the console

This allows for a scalable and dynamic product listing.

Local Storage for State Management:
        Local storage is utilized to transfer data between different pages (e.g., cart details or product selections). This ensures persistence across page reloads and provides a seamless user experience.

Product Details View:
        Clicking on a product shows its detailed description page, offering more information about the selected item.
