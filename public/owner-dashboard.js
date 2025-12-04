let activities = [];
let users = [];
let stats = {};

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        
        if (!data.success || data.userType !== 'owner') {
            window.location.href = '/';
            return;
        }
        
        document.getElementById('ownerName').textContent = data.user.name || data.user.username;
        loadData();
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
    }
}

// Load all data
async function loadData() {
    await Promise.all([
        loadActivities(),
        loadUsers(),
        loadStats()
    ]);
}

// Load activities
async function loadActivities() {
    try {
        const response = await fetch('/api/activities');
        const data = await response.json();
        
        if (data.success) {
            activities = data.activities;
            displayActivities();
        }
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (data.success) {
            users = data.users;
            displayUsers();
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// Load stats
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
            stats = data.stats;
            displayStats();
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Display stats
function displayStats() {
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalActivities').textContent = stats.totalActivities || 0;
    document.getElementById('todayActivities').textContent = stats.activitiesToday || 0;
    document.getElementById('weekActivities').textContent = stats.activitiesThisWeek || 0;
}

// Display activities
function displayActivities() {
    const list = document.getElementById('allActivitiesList');
    
    if (activities.length === 0) {
        list.innerHTML = '<p class="empty-state">No activities recorded yet.</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedActivities = [...activities].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    list.innerHTML = sortedActivities.map(activity => `
        <div class="activity-card">
            <div class="activity-info">
                <h3>${activity.activityType} <span style="color: #999; font-size: 14px; font-weight: normal;">by ${activity.username}</span></h3>
                ${activity.description ? `<p>${activity.description}</p>` : ''}
                <div class="activity-meta">
                    <span class="badge">${activity.duration} min</span>
                    ${activity.equipment ? `<span class="badge" style="background: #764ba2;">${activity.equipment}</span>` : ''}
                    <span style="color: #999; font-size: 12px;">${formatDate(activity.date)}</span>
                </div>
            </div>
            <div class="activity-actions">
                <button class="btn btn-danger" onclick="deleteActivity('${activity.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Display users
function displayUsers() {
    const list = document.getElementById('usersList');
    
    if (users.length === 0) {
        list.innerHTML = '<p class="empty-state">No members registered yet.</p>';
        return;
    }
    
    list.innerHTML = users.map(user => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Member since:</strong> ${formatDate(user.createdAt)}</p>
            <div class="user-actions">
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Remove Member</button>
            </div>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Delete activity
async function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/activities/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadData();
        } else {
            alert('Failed to delete activity.');
        }
    } catch (error) {
        console.error('Failed to delete activity:', error);
        alert('An error occurred. Please try again.');
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to remove this member? All their activities will also be deleted.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadData();
        } else {
            alert('Failed to remove member.');
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
        alert('An error occurred. Please try again.');
    }
}

// Logout
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/';
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        if (tab === 'activities') {
            document.getElementById('activitiesTab').classList.add('active');
        } else {
            document.getElementById('usersTab').classList.add('active');
        }
    });
});

// Search functionality
document.getElementById('activitySearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = activities.filter(a => 
        a.activityType.toLowerCase().includes(searchTerm) ||
        a.description.toLowerCase().includes(searchTerm) ||
        a.username.toLowerCase().includes(searchTerm) ||
        (a.equipment && a.equipment.toLowerCase().includes(searchTerm))
    );
    
    const list = document.getElementById('allActivitiesList');
    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-state">No activities found.</p>';
        return;
    }
    
    list.innerHTML = filtered.map(activity => `
        <div class="activity-card">
            <div class="activity-info">
                <h3>${activity.activityType} <span style="color: #999; font-size: 14px; font-weight: normal;">by ${activity.username}</span></h3>
                ${activity.description ? `<p>${activity.description}</p>` : ''}
                <div class="activity-meta">
                    <span class="badge">${activity.duration} min</span>
                    ${activity.equipment ? `<span class="badge" style="background: #764ba2;">${activity.equipment}</span>` : ''}
                    <span style="color: #999; font-size: 12px;">${formatDate(activity.date)}</span>
                </div>
            </div>
            <div class="activity-actions">
                <button class="btn btn-danger" onclick="deleteActivity('${activity.id}')">Delete</button>
            </div>
        </div>
    `).join('');
});

document.getElementById('userSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    );
    
    const list = document.getElementById('usersList');
    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty-state">No members found.</p>';
        return;
    }
    
    list.innerHTML = filtered.map(user => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Member since:</strong> ${formatDate(user.createdAt)}</p>
            <div class="user-actions">
                <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Remove Member</button>
            </div>
        </div>
    `).join('');
});

// Initialize
checkAuth();

