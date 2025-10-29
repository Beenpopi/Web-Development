const form = document.getElementById('searchForm');
const recentSearch = document.getElementById('recentSearch');

form.addEventListener('submit', function (e) {
    e.preventDefault();
});



document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();


    const name = document.getElementById('name').value;
    const artist = document.getElementById('artist').value;
    const label = document.getElementById('label').value;


    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    if (artist) queryParams.append('artist', artist);
    if (label) queryParams.append('label', label);


    fetch(`/search?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('searchResults', JSON.stringify(data.results));


            const recentSearchList = document.getElementById('recentSearch');
            const searchTerm = `${name || artist || label || date}`;
            if (searchTerm) {
                const li = document.createElement('li');
                li.textContent = searchTerm;
                recentSearchList.appendChild(li);
            }


        })
        .catch(error => console.error('Error:', error));
});

function clearForm() {
    document.getElementById('searchForm').reset();
}


const productContainer = document.getElementById('product-container');

async function fetchProducts(query = '') {
    try {
        const url = query
            ? `http://localhost:8003/api/search?${query}`
            : 'http://localhost:8003/api/products';

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        renderProducts(data.results || data);
    } catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = '<p>Failed to load products. Please check your connection or try again later.</p>';
    }
}

function renderProducts(products) {
    productContainer.innerHTML = '';
    if (!products || products.length === 0) {
        productContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = `
            <div class="product-card" onclick="window.location.href='/ProductDetail?product_id=${product.product_ID}'">
                <img src="${product.Product_Image}" alt="${product.Name}">
                <h3>${product.Name}<br><span class="price">${product.price} THB</span></h3>
                <button class="add-to-cart"><i class="bi bi-cart cart-icon"></i> Add to cart</button>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const label = document.getElementById('label').value.trim();

    // Create search term
    const searchTerm = [name, artist, label].filter(Boolean).join(', ');
    if (searchTerm) {
        // Store in localStorage
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recentSearches = [searchTerm, ...recentSearches.filter(term => term !== searchTerm)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

        // Update recent search list
        updateRecentSearches();
    }

    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (artist) params.append('artist', artist);
    if (label) params.append('label', label);

    fetchProducts(params.toString());
});

function clearForm() {
    document.getElementById('searchForm').reset();
    fetchProducts();
}

function updateRecentSearches() {
    const recentSearchList = document.getElementById('recentSearch');
    recentSearchList.innerHTML = '';
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    recentSearches.forEach(term => {
        const li = document.createElement('li');
        li.textContent = term;
        recentSearchList.appendChild(li);
    });
}
// Load all products and recent searches on page load
window.onload = () => {
    fetchProducts();
    updateRecentSearches();
};