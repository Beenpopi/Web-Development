
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8003/api/products', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const products = await response.json();
        displayProducts(products.slice(0, 3)); // Show up to 3 products
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
    }
}

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    if (!products || products.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <div class="product-frame">
                <div class="product-image">
                    <a href="#" onclick="viewProduct(${product.product_ID})">
                        <img src="${product.Product_Image}" alt="${product.Name}">
                    </a>
                </div>
            </div>
            <div class="info">
                <a href="#" onclick="viewProduct(${product.product_ID})">
                    <p class="product-title">${product.Name}${product.label}<br>${product.price} THB</p>
                </a>
            </div>
        `;
        productList.appendChild(productDiv);
    });

}

function viewProduct(productId) {
    window.location.href = `/ProductDetail.html?id=${productId}`;
}

async function checkLogin() {
    try {
        const response = await fetch('http://localhost:8003/api/check-auth', {
            method: 'GET',
            credentials: 'include'
        });
        const result = await response.json();
        if (result.isLoggedIn) {
            alert('You are already logged in. Please log out first.');
            const redirectUrl = result.isAdmin ? '/AddEdit' : '/AllPro';
            window.location.href = redirectUrl;
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/login';
    }
}

// Carousel functionality (unchanged)
let slideIndex = 1;
showSlides(slideIndex);

function prevSlide() {
    showSlides(slideIndex -= 1);
}

function nextSlide() {
    showSlides(slideIndex += 1);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("carousel-slide");
    const dots = document.getElementsByClassName("dot");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(" active", "");
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].className += " active";
    dots[slideIndex - 1].className += " active";
}
function viewProduct(productId) {
    window.location.href = `/ProductDetail?product_id=${productId}`;
}
window.onload = () => {
    loadProducts();
};