// Show error message if error parameter is present
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('error') === '1') {
    document.getElementById('errorPanel').style.display = 'block';
}

// Focus on password field
document.getElementById('password').focus(); 