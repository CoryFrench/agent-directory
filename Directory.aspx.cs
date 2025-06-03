using System;
using System.Web.Security;

public partial class Directory : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Check if user is authenticated
        if (!User.Identity.IsAuthenticated)
        {
            // Redirect to login page if not authenticated
            Response.Redirect("Default.aspx");
        }
    }

    protected void LogoutButton_Click(object sender, EventArgs e)
    {
        // Sign out the user
        FormsAuthentication.SignOut();
        
        // Redirect to login page
        Response.Redirect("Default.aspx");
    }
} 