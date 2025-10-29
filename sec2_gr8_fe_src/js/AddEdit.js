let editingProductId = null;

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8003/api/admin/products', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productTable').innerHTML = '<tr><td colspan="7">Failed to load products.</td></tr>';
    }
}

function displayProducts(products) {
    const table = document.getElementById('productTable');
    table.innerHTML = '';
    if (!products || products.length === 0) {
        table.innerHTML = '<tr><td colspan="7">No products found.</td></tr>';
        return;
    }
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.Name}</td>
            <td><img src="${product.Product_Image}" alt="${product.Name}" width="60"></td>
            <td>${product.product_ID}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.artist}</td>
            <td>
                <button class="editing-button" onclick="editProduct(${product.product_ID})"><i class="bi bi-pencil-square"></i> EDIT</button>
                <button class="deleting-button" onclick="deleteProduct(${product.product_ID})"><i class="bi bi-trash3"></i> DELETE</button>
            </td>
        `;
        table.appendChild(row);
    });
}

async function searchProduct() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    try {
        const response = await fetch('http://localhost:8003/api/admin/products', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
        const products = await response.json();
        const filteredProducts = products.filter(product =>
            product.Name.toLowerCase().includes(keyword) ||
            product.product_ID.toString().includes(keyword)
        );
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error searching products:', error);
        document.getElementById('productTable').innerHTML = '<tr><td colspan="7">Failed to load products.</td></tr>';
    }
}


function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadProducts();
}

function addProduct() {
    editingProductId = null;
    document.getElementById('formTitle').textContent = 'Add Product';
    document.getElementById('editSection').classList.remove('hidden');
    clearForm();
}

function editProduct(productId) {
    editingProductId = productId;
    document.getElementById('formTitle').textContent = 'Edit Product';
    fetch(`http://localhost:8003/api/products/${productId}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch product: ${response.statusText}`);
        return response.json();
    })
    .then(product => {
        document.getElementById('Name').value = product.Name;
        document.getElementById('product_ID').value = product.product_ID;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('artist').value = product.artist;
        document.getElementById('label').value = product.label;
        document.getElementById('release_date').value = product.release_date || '';
        document.getElementById('product_Category').value = product.product_Category || '';
        document.getElementById('admin_ID').value = 'AD1';
        document.getElementById('editSection').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error loading product for edit:', error);
        alert('Failed to load product data.');
    });
}

async function deleteProduct(productId) {
    if (!confirm(`Are you sure you want to delete product ID: ${productId}?`)) return;
    try {
        const response = await fetch(`http://localhost:8003/api/admin/products/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
        const result = await response.json();
        alert(result.message);
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product.');
    }
}

async function submitForm() {
    const Name = document.getElementById('Name').value.trim();
    const product_Category = document.getElementById('product_Category').value.trim();
    const label = document.getElementById('label').value.trim();
    const price = document.getElementById('price').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const release_date = document.getElementById('release_date').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const admin_ID = document.getElementById('admin_ID').value.trim();
    const product_ID = document.getElementById('product_ID').value.trim();
    const imageFile = document.getElementById('Product_Image').files[0];

    // Validate required fields
    if (!Name || !label || !price || !artist || !quantity) {
        alert('Please fill in all required fields (Name, Label, Price, Artist, Quantity).');
        return;
    }
    if (!editingProductId && !product_ID) {
        alert('Please provide a Product ID for new products.');
        return;
    }

    const formData = new FormData();
    formData.append('product_Category', product_Category);
    formData.append('Name', Name);
    formData.append('label', label);
    formData.append('price', price);
    formData.append('artist', artist);
    if (release_date) formData.append('release_date', release_date); // Only append if non-empty
    formData.append('quantity', quantity);
    formData.append('admin_ID', admin_ID);
    if (!editingProductId) formData.append('product_ID', product_ID);
    if (imageFile) formData.append('Product_Image', imageFile);

    const method = editingProductId ? 'PUT' : 'POST';
    const url = editingProductId
        ? `http://localhost:8003/api/admin/products/${editingProductId}`
        : 'http://localhost:8003/api/admin/products';

    try {
        const response = await fetch(url, {
            method,
            body: formData,
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to save product: ${response.statusText}`);
        const result = await response.json();
        alert(result.message);
        document.getElementById('editSection').classList.add('hidden');
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product: ' + error.message);
    }
}
function clearForm() {
    document.getElementById('Name').value = '';
    document.getElementById('Product_Image').value = '';
    document.getElementById('product_ID').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('label').value = '';
    document.getElementById('release_date').value = '';
    document.getElementById('product_Category').value = '';
    document.getElementById('admin_ID').value = 'AD1';
}


window.onload = loadProducts;