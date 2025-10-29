document.addEventListener('DOMContentLoaded', () => {
    // Get product_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    if (!productId) {
        document.getElementById('product-section').innerHTML = '<p>Product ID not provided.</p>';
        return;
    }

    // Fetch product details
    async function fetchProduct() {
        try {
            const response = await fetch(`http://localhost:8003/api/products/${productId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const product = await response.json();
            renderProduct(product);
            fetchRelatedProducts(product.artist, product.product_ID);
        } catch (error) {
            console.error('Error fetching product:', error);
            document.getElementById('product-section').innerHTML = '<p>Failed to load product.</p>';
        }
    }

    // Render product details
    function renderProduct(product) {
        document.getElementById('product-image').src = product.Product_Image;
        document.getElementById('product-image').alt = product.Name;
        document.getElementById('product-name').textContent = product.Name;
        document.getElementById('product-label').textContent = product.label;
        document.getElementById('product-artist').textContent = product.artist;
        document.getElementById('product-release-date').textContent = product.release_date || 'N/A';
        document.getElementById('product-price').textContent = `${product.price} THB`;
    }

    // Fetch related products
    async function fetchRelatedProducts(artist, excludeId) {
        try {
            const response = await fetch(`http://localhost:8003/api/related-products?artist=${encodeURIComponent(artist)}&exclude_id=${excludeId}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const relatedProducts = await response.json();
            renderRelatedProducts(relatedProducts);
        } catch (error) {
            console.error('Error fetching related products:', error);
            document.getElementById('related-list').innerHTML = '<p>Failed to load related products.</p>';
        }
    }

    // Render related products
    function renderRelatedProducts(products) {
        const container = document.getElementById('related-list');
        container.innerHTML = '';
        if (products.length === 0) {
            container.innerHTML = '<p>No related products available.</p>';
            return;
        }
        products.forEach(product => {
            const item = `
                <div class="item" onclick="window.location.href='/ProductDetail.html?product_id=${product.product_ID}'" style="cursor: pointer;">
                    <img src="${product.Product_Image}" alt="${product.Name}">
                    <p>${product.Name}</p>
                </div>
            `;
            container.innerHTML += item;
        });
    }

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    document.getElementById('increase').addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
    });
    document.getElementById('decrease').addEventListener('click', () => {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });

    // Order button (placeholder)
    document.querySelector('.order-btn').addEventListener('click', () => {
        alert('Order functionality not implemented yet.');
    });

    // Fetch product on page load
    fetchProduct();
});