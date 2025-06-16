// Form field templates for each type
const formTemplates = {
    agents: [
        { name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' }
    ],
    affiliated: [
        { name: 'full_name', label: 'Business Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' }
    ],
    yacht: [
        { name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' }
    ],
    teams: [
        { name: 'team_name', label: 'Team Name', type: 'text', required: true },
        { name: 'team_phone', label: 'Team Phone', type: 'tel' },
        { name: 'team_email', label: 'Team Email', type: 'email' }
    ],
    offices: [
        { name: 'office_name', label: 'Office Name', type: 'text', required: true },
        { name: 'main_phone', label: 'Main Phone', type: 'tel' },
        { name: 'fax_number', label: 'Fax Number', type: 'tel' },
        { name: 'address', label: 'Address', type: 'text' }
    ],
    fax: [
        { name: 'destination', label: 'Destination', type: 'text', required: true },
        { name: 'fax_number', label: 'Fax Number', type: 'tel', required: true }
    ]
};

// Load all directory data
async function loadDirectoryData() {
    try {
        const response = await fetch('/api/directory', {
            method: 'GET',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Populate each section
        populateSection('agents', data.agents || []);
        populateSection('affiliated', data.affiliatedBusinesses || []);
        populateSection('yacht', data.yachtBrokerage || []);
        populateSection('teams', data.teams || []);
        populateSection('offices', data.offices || []);
        populateSection('fax', data.faxToEmails || []);
        
    } catch (error) {
        console.error('Error loading directory data:', error);
        alert('Error loading directory data. Please try again.');
    }
}

function populateSection(type, items) {
    const gridElement = document.getElementById(`${type}-grid`);
    if (!gridElement) return;
    
    gridElement.innerHTML = items.map(item => {
        let html = '<div class="card">';
        
        // Name field (varies by type)
        if (type === 'teams') {
            html += `<div class="name">${item.team_name}</div>`;
        } else if (type === 'offices') {
            html += `<div class="name">${item.office_name}</div>`;
        } else if (type === 'fax') {
            html += `<div class="name">${item.destination}</div>`;
        } else {
            html += `<div class="name">${item.full_name}</div>`;
        }
        
        // Contact info
        if (item.direct_phone) html += `<div class="info">Direct: ${item.direct_phone}</div>`;
        if (item.cell_phone) html += `<div class="info">Cell: ${item.cell_phone}</div>`;
        if (item.main_phone) html += `<div class="info">Phone: ${item.main_phone}</div>`;
        if (item.team_phone) html += `<div class="info">Phone: ${item.team_phone}</div>`;
        if (item.fax_number) html += `<div class="info">Fax: ${item.fax_number}</div>`;
        if (item.email) html += `<div class="info">Email: <a href="mailto:${item.email}">${item.email}</a></div>`;
        if (item.team_email) html += `<div class="info">Email: <a href="mailto:${item.team_email}">${item.team_email}</a></div>`;
        if (item.location) html += `<div class="info">Location: ${item.location}</div>`;
        if (item.address) html += `<div class="info">Address: ${item.address}</div>`;
        
        // Social media (for agents, affiliated, yacht)
        if (['agents', 'affiliated', 'yacht'].includes(type)) {
            html += '<div class="social">';
            if (item.approved_facebook) html += `<a href="${item.facebook_url}" target="_blank" class="facebook" title="Facebook"><i class="fab fa-facebook"></i></a>`;
            if (item.approved_linkedin) html += `<a href="${item.linkedin_url}" target="_blank" class="linkedin" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
            if (item.approved_goto) html += `<a href="${item.goto_url}" target="_blank" class="goto" title="GoTo"><i class="fas fa-external-link-alt"></i></a>`;
            html += '</div>';
        }
        
        // Admin controls
        html += `
            <div class="admin-controls">
                <button class="edit-btn" data-type="${type}" data-id="${item.id}">Edit</button>
                <button class="delete-btn" data-type="${type}" data-id="${item.id}">Delete</button>
            </div>
        </div>`;
        
        return html;
    }).join('');
    
    // Add event listeners
    gridElement.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            showEditModal(button.dataset.type, button.dataset.id);
        });
    });
    
    gridElement.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            deleteItem(button.dataset.type, button.dataset.id);
        });
    });
}

function showAddModal(type) {
    document.getElementById('modalTitle').textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('itemId').value = '';
    document.getElementById('itemType').value = type;
    
    const form = document.getElementById('itemForm');
    form.innerHTML = '';
    
    formTemplates[type].forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}:</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
        `;
        form.appendChild(div);
    });
    
    document.getElementById('modal').style.display = 'block';
}

async function showEditModal(type, id) {
    try {
        const response = await fetch(`/api/directory/${type}/${id}`, {
            method: 'GET',
            credentials: 'same-origin'
        });
        
        if (!response.ok) throw new Error('Failed to fetch item');
        
        const item = await response.json();
        
        document.getElementById('modalTitle').textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        document.getElementById('itemId').value = id;
        document.getElementById('itemType').value = type;
        
        const form = document.getElementById('itemForm');
        form.innerHTML = '';
        
        formTemplates[type].forEach(field => {
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}:</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" value="${item[field.name] || ''}" ${field.required ? 'required' : ''}>
            `;
            form.appendChild(div);
        });
        
        document.getElementById('modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching item:', error);
        alert('Error loading item for editing');
    }
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

async function saveItem(event) {
    event.preventDefault();
    
    const type = document.getElementById('itemType').value;
    const id = document.getElementById('itemId').value;
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const url = id ? `/api/directory/${type}/${id}` : `/api/directory/${type}`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        hideModal();
        loadDirectoryData();
        
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Error saving item. Please try again.');
    }
}

async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/directory/${type}/${id}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        loadDirectoryData();
        
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
    }
}

function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin'
    }).then(() => {
        window.location.href = '/login';
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDirectoryData();
    
    // Add event listeners for add buttons
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', () => {
            showAddModal(button.dataset.type);
        });
    });
    
    // Modal event listeners
    document.getElementById('itemForm').addEventListener('submit', saveItem);
    document.querySelector('.close').addEventListener('click', hideModal);
    document.getElementById('cancelBtn').addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            hideModal();
        }
    });
}); 