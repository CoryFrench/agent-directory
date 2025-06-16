// Fetch directory data when the page loads
async function loadDirectoryData() {
    try {
        const response = await fetch('/api/agent-directory/api/directory', {
            credentials: 'include',
            headers: {
                'X-API-Key': '6ec14ed9-7485-492a-9393-b3df17967945'
            }
        });
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
    const agentsTbody = document.getElementById('agents-tbody');
    agentsTbody.innerHTML = data.agents.map(agent => `
        <tr>
            <td class="name-cell">${agent.full_name || ''}</td>
            <td>${agent.direct_phone || ''}</td>
            <td>${agent.cell_phone || ''}</td>
            <td class="email-cell">${agent.email ? `<a href="mailto:${agent.email}">${agent.email}</a>` : ''}</td>
            <td>${agent.location || ''}</td>
            <td class="contact-links">
                ${agent.approved_facebook ? `<a href="${agent.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${agent.approved_linkedin ? `<a href="${agent.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${agent.approved_goto ? `<a href="${agent.goto_url}" target="_blank">GoTo</a>` : ''}
            </td>
        </tr>
    `).join('');

    // Display Offices
    const officesTbody = document.getElementById('offices-tbody');
    officesTbody.innerHTML = data.offices.map(office => `
        <tr>
            <td class="name-cell">${office.office_name || ''}</td>
            <td>${office.address || ''}</td>
            <td>${office.main_phone || ''}</td>
            <td>${office.fax_number || ''}</td>
        </tr>
    `).join('');

    // Display Teams
    const teamsTbody = document.getElementById('teams-tbody');
    teamsTbody.innerHTML = data.teams.map(team => `
        <tr>
            <td class="name-cell">${team.team_name || ''}</td>
            <td>${team.team_phone || ''}</td>
            <td class="email-cell">${team.team_email ? `<a href="mailto:${team.team_email}">${team.team_email}</a>` : ''}</td>
        </tr>
    `).join('');

    // Display Fax to Email
    const faxTbody = document.getElementById('fax-tbody');
    faxTbody.innerHTML = data.faxToEmails.map(fax => `
        <tr>
            <td class="name-cell">${fax.destination || ''}</td>
            <td>${fax.fax_number || ''}</td>
        </tr>
    `).join('');

    // Display Affiliated Businesses (same structure as agents)
    const affiliatedTbody = document.getElementById('affiliated-tbody');
    affiliatedTbody.innerHTML = data.affiliatedBusinesses.map(business => `
        <tr>
            <td class="name-cell">${business.full_name || ''}</td>
            <td>${business.direct_phone || ''}</td>
            <td>${business.cell_phone || ''}</td>
            <td class="email-cell">${business.email ? `<a href="mailto:${business.email}">${business.email}</a>` : ''}</td>
            <td>${business.location || ''}</td>
            <td class="contact-links">
                ${business.approved_facebook ? `<a href="${business.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${business.approved_linkedin ? `<a href="${business.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${business.approved_goto ? `<a href="${business.goto_url}" target="_blank">GoTo</a>` : ''}
            </td>
        </tr>
    `).join('');

    // Display Yacht Brokerage (same structure as agents)
    const yachtTbody = document.getElementById('yacht-tbody');
    yachtTbody.innerHTML = data.yachtBrokerage.map(broker => `
        <tr>
            <td class="name-cell">${broker.full_name || ''}</td>
            <td>${broker.direct_phone || ''}</td>
            <td>${broker.cell_phone || ''}</td>
            <td class="email-cell">${broker.email ? `<a href="mailto:${broker.email}">${broker.email}</a>` : ''}</td>
            <td>${broker.location || ''}</td>
            <td class="contact-links">
                ${broker.approved_facebook ? `<a href="${broker.facebook_url}" target="_blank">Facebook</a>` : ''}
                ${broker.approved_linkedin ? `<a href="${broker.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
                ${broker.approved_goto ? `<a href="${broker.goto_url}" target="_blank">GoTo</a>` : ''}
            </td>
        </tr>
    `).join('');
}

function logout() {
    fetch('/logout', { 
        method: 'POST',
        credentials: 'include'
    })
        .then(() => window.location.href = '/login')
        .catch(error => console.error('Logout error:', error));
}

// Admin modal functionality
function showAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
    document.getElementById('adminPassword').focus();
}

function hideAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminError').style.display = 'none';
}

async function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    
    // Admin-specific password
    if (password === 'WaterfrontAdmin25!') {
        hideAdminModal();
        window.location.href = '/admin';
    } else {
        document.getElementById('adminError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Add event listeners for admin modal
    document.getElementById('adminBtn').addEventListener('click', showAdminModal);
    document.getElementById('adminCancel').addEventListener('click', hideAdminModal);
    document.getElementById('adminSubmit').addEventListener('click', checkAdminPassword);
    
    // Allow Enter key to submit admin password
    document.getElementById('adminPassword').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAdminPassword();
        }
    });
    
    // Close modal when clicking outside of it
    document.getElementById('adminModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('adminModal')) {
            hideAdminModal();
        }
    });

    // Load initial data
    loadDirectoryData();
}); 