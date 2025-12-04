// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active form
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        if (tab === 'login') {
            document.getElementById('loginForm').classList.add('active');
        } else {
            document.getElementById('registerForm').classList.add('active');
        }
    });
});

// Check if already logged in
async function checkAuth() {
    try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        
        if (data.success) {
            if (data.userType === 'owner') {
                window.location.href = '/owner-dashboard.html';
            } else {
                window.location.href = '/user-dashboard.html';
            }
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

checkAuth();

// Login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, userType })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.className = 'message success';
            
            setTimeout(() => {
                if (data.userType === 'owner') {
                    window.location.href = '/owner-dashboard.html';
                } else {
                    window.location.href = '/user-dashboard.html';
                }
            }, 500);
        } else {
            messageDiv.textContent = data.message || 'Login failed';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
        console.error('Login error:', error);
    }
});

// Register form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const messageDiv = document.getElementById('registerMessage');
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, email, password, userType })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = 'Registration successful! Please login.';
            messageDiv.className = 'message success';
            
            // Switch to login tab after 2 seconds
            setTimeout(() => {
                document.querySelector('[data-tab="login"]').click();
                document.getElementById('registerForm').reset();
            }, 2000);
        } else {
            messageDiv.textContent = data.message || 'Registration failed';
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message error';
        console.error('Registration error:', error);
    }
});

