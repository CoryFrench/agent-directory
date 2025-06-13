// Form field templates for each type
const formTemplates = {
    agents: [
        { name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'goto_url', label: 'GoTo URL', type: 'url' }
    ],
    affiliated: [
        { name: 'full_name', label: 'Business Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'goto_url', label: 'GoTo URL', type: 'url' }
    ],
    yacht: [
        { name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { name: 'direct_phone', label: 'Direct Phone', type: 'tel' },
        { name: 'cell_phone', label: 'Cell Phone', type: 'tel' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'goto_url', label: 'GoTo URL', type: 'url' }
    ],
    teams: [
        { name: 'team_name', label: 'Team Name', type: 'text', required: true },
        { name: 'team_email', label: 'Team Email', type: 'email' },
        { name: 'team_phone', label: 'Team Phone', type: 'tel' }
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

// Fetch directory data when the page loads
async function loadDirectoryData() {
    try {
        const response = await fetch('/api/directory');
        if (!response.ok) {
            throw new Error('Failed to fetch directory data');
        }
        const data = await response.json();
        displayDirectoryData(data);
    } catch (error) {
        console.error('Error loading directory data:', error);
        document.querySelector('.container').innerHTML = 
            '<p style="color: red;">Error loading directory data. Please try again later.</p>';
    }
}

function displayDirectoryData(data) {
    // Display Agents
    document.getElementById('agents-grid').innerHTML = data.agents.map(agent => `
        <div class="card">
            <div class="name">${agent.full_name}</div>
            ${agent.direct_phone ? `<div class="info">Direct: ${agent.direct_phone}</div>` : ''}
            ${agent.cell_phone ? `<div class="info">Cell: ${agent.cell_phone}</div>` : ''}
            ${agent.email ? `<div class="info">Email: <a href="mailto:${agent.email}">${agent.email}</a></div>` : ''}
            ${agent.location ? `<div class="info">Location: ${agent.location}</div>` : ''}
            <div class="social">
                ${agent.facebook_url ? `<a href="${agent.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${agent.linkedin_url ? `<a href="${agent.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${agent.goto_url ? `<a href="${agent.goto_url}" target="_blank">GoTo</a>` : ''}
            </div>
            <div class="admin-controls">
                <button class="edit-btn" data-type="agents" data-id="${agent.id}">Edit</button>
                <button class="delete-btn" data-type="agents" data-id="${agent.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Display Affiliated Businesses
    document.getElementById('affiliated-grid').innerHTML = data.affiliated.map(business => `
        <div class="card">
            <div class="name">${business.full_name}</div>
            ${business.direct_phone ? `<div class="info">Direct: ${business.direct_phone}</div>` : ''}
            ${business.cell_phone ? `<div class="info">Cell: ${business.cell_phone}</div>` : ''}
            ${business.email ? `<div class="info">Email: <a href="mailto:${business.email}">${business.email}</a></div>` : ''}
            ${business.location ? `<div class="info">Location: ${business.location}</div>` : ''}
            <div class="social">
                ${business.facebook_url ? `<a href="${business.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${business.linkedin_url ? `<a href="${business.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${business.goto_url ? `<a href="${business.goto_url}" target="_blank">GoTo</a>` : ''}
            </div>
            <div class="admin-controls">
                <button class="edit-btn" data-type="affiliated" data-id="${business.id}">Edit</button>
                <button class="delete-btn" data-type="affiliated" data-id="${business.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Display Yacht Brokerage
    document.getElementById('yacht-grid').innerHTML = data.yacht.map(broker => `
        <div class="card">
            <div class="name">${broker.full_name}</div>
            ${broker.direct_phone ? `<div class="info">Direct: ${broker.direct_phone}</div>` : ''}
            ${broker.cell_phone ? `<div class="info">Cell: ${broker.cell_phone}</div>` : ''}
            ${broker.email ? `<div class="info">Email: <a href="mailto:${broker.email}">${broker.email}</a></div>` : ''}
            ${broker.location ? `<div class="info">Location: ${broker.location}</div>` : ''}
            <div class="social">
                ${broker.facebook_url ? `<a href="${broker.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${broker.linkedin_url ? `<a href="${broker.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${broker.goto_url ? `<a href="${broker.goto_url}" target="_blank">GoTo</a>` : ''}
            </div>
            <div class="admin-controls">
                <button class="edit-btn" data-type="yacht" data-id="${broker.id}">Edit</button>
                <button class="delete-btn" data-type="yacht" data-id="${broker.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Display Teams
    document.getElementById('teams-grid').innerHTML = data.teams.map(team => `
        <div class="card">
            <div class="name">${team.team_name}</div>
            ${team.team_email ? `<div class="info">Email: <a href="mailto:${team.team_email}">${team.team_email}</a></div>` : ''}
            ${team.team_phone ? `<div class="info">Phone: ${team.team_phone}</div>` : ''}
            <div class="admin-controls">
                <button class="edit-btn" data-type="teams" data-id="${team.id}">Edit</button>
                <button class="delete-btn" data-type="teams" data-id="${team.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Display Offices
    document.getElementById('offices-grid').innerHTML = data.offices.map(office => `
        <div class="card">
            <div class="name">${office.office_name}</div>
            ${office.main_phone ? `<div class="info">Phone: ${office.main_phone}</div>` : ''}
            ${office.fax_number ? `<div class="info">Fax: ${office.fax_number}</div>` : ''}
            ${office.address ? `<div class="info">Address: ${office.address}</div>` : ''}
            <div class="admin-controls">
                <button class="edit-btn" data-type="offices" data-id="${office.id}">Edit</button>
                <button class="delete-btn" data-type="offices" data-id="${office.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Display Fax to Email
    document.getElementById('fax-grid').innerHTML = data.fax.map(fax => `
        <div class="card">
            <div class="name">${fax.destination}</div>
            ${fax.fax_number ? `<div class="info">Fax: ${fax.fax_number}</div>` : ''}
            <div class="admin-controls">
                <button class="edit-btn" data-type="fax" data-id="${fax.id}">Edit</button>
                <button class="delete-btn" data-type="fax" data-id="${fax.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const id = button.dataset.id;
            showEditModal(type, id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            const id = button.dataset.id;
            deleteItem(type, id);
        });
    });
}

function showAddModal(type) {
    document.getElementById('modalTitle').textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    document.getElementById('itemId').value = '';
    document.getElementById('itemType').value = type;
    
    const formFields = document.getElementById('formFields');
    formFields.innerHTML = formTemplates[type].map(field => `
        <div class="form-group">
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
        </div>
    `).join('');

    document.getElementById('editModal').style.display = 'block';
}

async function showEditModal(type, id) {
    try {
        const response = await fetch(`/api/directory/${type}/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const item = await response.json();

        document.getElementById('modalTitle').textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        document.getElementById('itemId').value = id;
        document.getElementById('itemType').value = type;
        
        const formFields = document.getElementById('formFields');
        formFields.innerHTML = formTemplates[type].map(field => `
            <div class="form-group">
                <label for="${field.name}">${field.label}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" 
                       value="${item[field.name] || ''}" ${field.required ? 'required' : ''}>
            </div>
        `).join('');

        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading item:', error);
        alert('Failed to load item for editing');
    }
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
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to save item');
        
        hideModal();
        loadDirectoryData(); // Refresh the data
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item');
    }
}

async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`/api/directory/${type}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete item');
        
        loadDirectoryData(); // Refresh the data
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
    }
}

function logout() {
    fetch('/logout', { method: 'POST' })
        .then(() => window.location.href = '/login')
        .catch(error => console.error('Logout error:', error));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for add buttons
    document.querySelectorAll('.add-btn').forEach(button => {
        button.addEventListener('click', () => {
            const type = button.dataset.type;
            showAddModal(type);
        });
    });

    // Add event listener for logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Add event listener for cancel button
    document.getElementById('cancelBtn').addEventListener('click', hideModal);

    // Add event listener for form submission
    document.getElementById('editForm').addEventListener('submit', saveItem);

    // Load initial data
    loadDirectoryData();
}); 