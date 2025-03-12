// Проверка авторизации
function checkAuth() {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProducts();
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    const productForm = document.getElementById('productForm');
    const resetFormBtn = document.getElementById('resetForm');
    const logoutBtn = document.getElementById('logout');

    productForm.addEventListener('submit', handleProductSubmit);
    resetFormBtn.addEventListener('click', resetForm);
    logoutBtn.addEventListener('click', handleLogout);
}

// Обработка отправки формы
function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const product = {
        id: productId || Date.now().toString(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
        stock: parseInt(document.getElementById('productStock').value)
    };

    saveProduct(product);
    showAlert('Товар успешно сохранен', 'success');
    resetForm();
    loadProducts();
}

// Сохранение товара
function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
        products[index] = product;
    } else {
        products.push(product);
    }
    
    localStorage.setItem('products', JSON.stringify(products));
}

// Загрузка списка товаров
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price} ₽</td>
            <td>${product.stock}</td>
            <td class="admin-actions">
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">Редактировать</button>
                <button class="btn btn-delete" onclick="deleteProduct('${product.id}')">Удалить</button>
            </td>
        `;
        productsList.appendChild(row);
    });
}

// Редактирование товара
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productStock').value = product.stock;
    }
}

// Удаление товара
function deleteProduct(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        showAlert('Товар успешно удален', 'success');
    }
}

// Сброс формы
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

// Выход из админ-панели
function handleLogout() {
    localStorage.removeItem('adminAuth');
    window.location.href = 'login.html';
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'rods': 'Удочки',
        'reels': 'Катушки',
        'lures': 'Приманки',
        'lines': 'Лески',
        'accessories': 'Аксессуары'
    };
    return categories[category] || category;
}

// Отображение уведомлений
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
} 