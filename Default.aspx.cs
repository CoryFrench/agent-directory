using System;
using System.Configuration;
using System.Web.Security;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // If user is already authenticated, redirect to directory page
        if (User.Identity.IsAuthenticated)
        {
            Response.Redirect("Directory.aspx");
        }
    }

    protected void LoginButton_Click(object sender, EventArgs e)
    {
        // Get the configured password from Web.config
        string configPassword = ConfigurationManager.AppSettings["DirectoryPassword"];
        
        // Check if the entered password matches
        if (PasswordTextBox.Text == configPassword)
        {
            // Set authentication cookie
            FormsAuthentication.SetAuthCookie("DirectoryUser", false);
            
            // Redirect to directory page
            Response.Redirect("Directory.aspx");
        }
        else
        {
            // Show error message
            ErrorPanel.Visible = true;
        }
    }
} 