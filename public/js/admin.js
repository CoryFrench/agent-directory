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
    
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = '';
    
    formTemplates[type].forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label for="${field.name}">${field.label}${field.required ? ' *' : ''}:</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
        `;
        formFields.appendChild(div);
    });
    
    document.getElementById('editModal').style.display = 'block';
}

async function showEditModal(type, id) {
    console.log('=== showEditModal DEBUG START ===');
    console.log('Type:', type, 'ID:', id);
    
    try {
        console.log('Fetching item from API...');
        const response = await fetch(`/api/directory/${type}/${id}`, {
            method: 'GET',
            credentials: 'same-origin'
        });
        
        console.log('API Response status:', response.status);
        if (!response.ok) throw new Error('Failed to fetch item');
        
        const item = await response.json();
        console.log('Fetched item:', item);
        
        // Check if DOM elements exist
        const modalTitle = document.getElementById('modalTitle');
        const itemIdField = document.getElementById('itemId');
        const itemTypeField = document.getElementById('itemType');
        const formFields = document.getElementById('formFields');
        const editModal = document.getElementById('editModal');
        
        console.log('DOM Elements Check:');
        console.log('- modalTitle:', modalTitle ? 'EXISTS' : 'NULL');
        console.log('- itemId:', itemIdField ? 'EXISTS' : 'NULL');
        console.log('- itemType:', itemTypeField ? 'EXISTS' : 'NULL');
        console.log('- formFields:', formFields ? 'EXISTS' : 'NULL');
        console.log('- editModal:', editModal ? 'EXISTS' : 'NULL');
        
        if (!formFields) {
            console.error('CRITICAL: formFields element not found!');
            alert('Critical error: Form container not found. Please refresh the page.');
            return;
        }
        
        if (modalTitle) modalTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        if (itemIdField) itemIdField.value = id;
        if (itemTypeField) itemTypeField.value = type;
        
        console.log('Clearing form fields...');
        formFields.innerHTML = '';
        
        console.log('Form template for', type, ':', formTemplates[type]);
        
        formTemplates[type].forEach((field, index) => {
            console.log(`Creating field ${index + 1}:`, field.name, '=', item[field.name]);
            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label for="${field.name}">${field.label}${field.required ? ' *' : ''}:</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" value="${item[field.name] || ''}" ${field.required ? 'required' : ''}>
            `;
            formFields.appendChild(div);
        });
        
        console.log('Form fields populated. Showing modal...');
        if (editModal) {
            editModal.style.display = 'block';
            console.log('Modal displayed successfully');
        } else {
            console.error('CRITICAL: editModal element not found!');
            alert('Critical error: Modal not found. Please refresh the page.');
        }
        
    } catch (error) {
        console.error('=== ERROR in showEditModal ===');
        console.error('Error details:', error);
        console.error('Stack trace:', error.stack);
        alert('Error loading item for editing: ' + error.message);
    }
    
    console.log('=== showEditModal DEBUG END ===');
}

function hideModal() {
    document.getElementById('editModal').style.display = 'none';
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
    console.log('=== DOMContentLoaded DEBUG START ===');
    
    console.log('Loading directory data...');
    loadDirectoryData();
    
    // Add event listeners for add buttons
    console.log('Setting up add button listeners...');
    const addButtons = document.querySelectorAll('.add-btn');
    console.log('Found', addButtons.length, 'add buttons');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            showAddModal(button.dataset.type);
        });
    });
    
    // Modal event listeners
    console.log('Setting up modal event listeners...');
    
    const editForm = document.getElementById('editForm');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const editModal = document.getElementById('editModal');
    
    console.log('Modal DOM Elements Check:');
    console.log('- editForm:', editForm ? 'EXISTS' : 'NULL');
    console.log('- closeBtn:', closeBtn ? 'EXISTS' : 'NULL');
    console.log('- cancelBtn:', cancelBtn ? 'EXISTS' : 'NULL');
    console.log('- logoutBtn:', logoutBtn ? 'EXISTS' : 'NULL');
    console.log('- editModal:', editModal ? 'EXISTS' : 'NULL');
    
    if (editForm) {
        editForm.addEventListener('submit', saveItem);
        console.log('✓ Edit form submit listener added');
    } else {
        console.error('✗ editForm not found - cannot add submit listener');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
        console.log('✓ Close button listener added');
    } else {
        console.error('✗ Close button not found - cannot add click listener');
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideModal);
        console.log('✓ Cancel button listener added');
    } else {
        console.error('✗ Cancel button not found - cannot add click listener');
    }
    
    // Logout button event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
        console.log('✓ Logout button listener added');
    } else {
        console.log('ℹ Logout button not found (this may be normal)');
    }
    
    // Close modal when clicking outside
    console.log('Setting up modal outside click listener...');
    window.addEventListener('click', (event) => {
        if (editModal && event.target === editModal) {
            hideModal();
        }
    });
    console.log('✓ Modal outside click listener added');
    
    console.log('=== DOMContentLoaded DEBUG END ===');
}); 