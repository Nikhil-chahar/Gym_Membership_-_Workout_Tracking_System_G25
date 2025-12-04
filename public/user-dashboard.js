let activities = [];

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/current-user');
        const data = await response.json();
        
        if (!data.success || data.userType !== 'user') {
            window.location.href = '/';
            return;
        }
        
        document.getElementById('userName').textContent = data.user.name || data.user.username;
        loadActivities();
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
    }
}

// Load activities
async function loadActivities() {
    try {
        const response = await fetch('/api/activities');
        const data = await response.json();
        
        if (data.success) {
            activities = data.activities;
            displayActivities();
            updateStats();
        }
    } catch (error) {
        console.error('Failed to load activities:', error);
    }
}

// Display activities
function displayActivities() {
    const list = document.getElementById('activitiesList');
    
    if (activities.length === 0) {
        list.innerHTML = '<p class="empty-state">No activities yet. Add your first activity!</p>';
        return;
    }
    
    // Sort by date (newest first)
    const sortedActivities = [...activities].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    list.innerHTML = sortedActivities.map(activity => `
        <div class="activity-card">
            <div class="activity-info">
                <h3>${activity.activityType}</h3>
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

// Update statistics
function updateStats() {
    const today = new Date().toDateString();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const todayActivities = activities.filter(a => 
        new Date(a.date).toDateString() === today
    ).length;
    
    const weekActivities = activities.filter(a => 
        new Date(a.date) >= weekAgo
    ).length;
    
    document.getElementById('totalActivities').textContent = activities.length;
    document.getElementById('weekActivities').textContent = weekActivities;
    document.getElementById('todayActivities').textContent = todayActivities;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show add activity modal
function showAddActivityModal() {
    document.getElementById('addActivityModal').style.display = 'block';
    // Set default date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('activityDate').value = now.toISOString().slice(0, 16);
}

// Close add activity modal
function closeAddActivityModal() {
    document.getElementById('addActivityModal').style.display = 'none';
    document.getElementById('addActivityForm').reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addActivityModal');
    if (event.target === modal) {
        closeAddActivityModal();
    }
}

// Add activity form
document.getElementById('addActivityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const activityData = {
        activityType: document.getElementById('activityType').value,
        description: document.getElementById('description').value,
        duration: parseInt(document.getElementById('duration').value),
        equipment: document.getElementById('equipment').value,
        date: new Date(document.getElementById('activityDate').value).toISOString()
    };
    
    try {
        const response = await fetch('/api/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(activityData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeAddActivityModal();
            loadActivities();
        } else {
            alert('Failed to add activity. Please try again.');
        }
    } catch (error) {
        console.error('Failed to add activity:', error);
        alert('An error occurred. Please try again.');
    }
});

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
            loadActivities();
        } else {
            alert('Failed to delete activity.');
        }
    } catch (error) {
        console.error('Failed to delete activity:', error);
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

// Initialize
checkAuth();

