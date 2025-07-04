# Waterfront Properties Secure Directory

A secure ASP.NET-based employee directory for Waterfront Properties.

## Setup Instructions

### Prerequisites
- Windows Server with IIS installed
- .NET Framework 4.5 or higher

### Setup Steps

1. **Create a New Website/Application in IIS**
   - Open IIS Manager
   - Right-click on "Sites" and select "Add Website" (or add as an application under an existing site)
   - Enter a name (e.g., "WaterfrontDirectory")
   - Set the physical path to the folder containing these files
   - Set the binding information (hostname, port, etc.)
   - Click OK

2. **Verify ASP.NET Configuration**
   - Select the website/application in IIS Manager
   - Double-click on "Authentication"
   - Ensure "Anonymous Authentication" is enabled
   - Double-click on "Application Pools"
   - Ensure the application pool is set to .NET v4.5 or higher
   - Make sure the application pool is running

3. **Set Folder Permissions**
   - Right-click on the directory containing the files
   - Select "Properties" > "Security" tab
   - Add the IIS_IUSRS group with Read & Execute permissions
   - If using a custom app pool identity, add that account as well

4. **Transfer Employee Data**
   - Open Directory.aspx in a text editor
   - Copy all employee rows from WFDirectory2020.html into Directory.aspx
   - Replace the example rows with your actual employee data

5. **Change the Password**
   - Open Web.config
   - Find the `<appSettings>` section
   - Change the "DirectoryPassword" value to a secure password
   - Save the file

6. **Test the Application**
   - Navigate to the site in a web browser
   - Try logging in with the password you set
   - Verify the directory is displayed correctly
   - Test the logout functionality

## Security Features

- Server-side authentication (Forms Authentication)
- Secure configuration in Web.config
- Protection against direct access to protected pages
- Automatic redirection to login page
- Session timeout management
- Robots.txt to prevent search engine indexing

## Troubleshooting

- **Error: HTTP 500.19**
  - Make sure IIS has ASP.NET properly installed
  - Verify the application pool settings

- **Error: Access Denied**
  - Check folder permissions for the IIS_IUSRS account

- **Login Not Working**
  - Verify the password in Web.config matches what you're entering

## Support

For questions or issues, contact your IT department or email support@wfpcc.com. 