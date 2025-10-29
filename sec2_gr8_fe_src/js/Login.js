function toggleForm(id) {
    const customerForm = document.getElementById('customerLoginForm');
    const adminForm = document.getElementById('adminLoginForm');

    if (id === 'customerLoginForm') {
        customerForm.classList.add('show');
        adminForm.classList.remove('show');
    } else if (id === 'adminLoginForm') {
        adminForm.classList.add('show');
        customerForm.classList.remove('show');
    }
}

function showModal(title, message, isError = false) {
    const modal = document.getElementById('loginModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    if (isError) {
        modal.classList.add('error');
    } else {
        modal.classList.remove('error');
    }
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    grecaptcha.reset(); // Reset reCAPTCHA after modal closes
}

async function checkAuth() {
    try {
        const response = await fetch('http://localhost:8003/api/check-auth', {
            method: 'GET',
            credentials: 'include'
        });

        const result = await response.json();
        if (result.isLoggedIn) {
            showModal('Already Logged In', 'You are already logged in. Please log out first.');
            setTimeout(() => {
                closeModal();
                if (result.userType === 'admin') {
                    window.location.href = '/AddEdit';
                } else if (result.userType === 'customer') {
                    window.location.href = '/HomePage';
                } else {
                    window.location.href = '/';
                }
            }, 2000);
            return; 
        }

      
    } catch (error) {
        console.error('Error checking authentication:', error);
    }
}



async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data['g-recaptcha-response'] = grecaptcha.getResponse(); // Add reCAPTCHA response

    if (!data.username || !data.password || !data.userType || !data['g-recaptcha-response']) {
        showModal('Error', 'Please fill in all fields and complete the CAPTCHA.', true);
        return;
    }

    try {
        const response = await fetch('http://localhost:8003/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            showModal('Success', result.message || 'Login successful!');
            setTimeout(() => {
                closeModal();
                window.location.href = result.redirect || (data.userType === 'admin' ? '/AddEdit' : '/HomePage');
            }, 2000);
        } else {
            grecaptcha.reset(); // Reset reCAPTCHA on error
            showModal('Error', result.error || 'Invalid username or password.', true);
        }
    } catch (err) {
        console.error('Error logging in:', err);
        grecaptcha.reset();
        showModal('Error', 'An error occurred. Please try again.', true);
    }
}



window.onload = () => {
    checkAuth();
    document.getElementById('customerLoginForm').addEventListener('submit', handleLogin);
    document.getElementById('adminLoginForm').addEventListener('submit', handleLogin);
};
