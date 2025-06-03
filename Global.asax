<%@ Application Language="C#" %>

<script runat="server">
    void Application_Start(object sender, EventArgs e)
    {
        // Code that runs on application startup
    }
    
    void Application_Error(object sender, EventArgs e)
    {
        // Code that runs when an unhandled error occurs
        Exception ex = Server.GetLastError();
        
        // Log the error (optional)
        // System.Diagnostics.EventLog.WriteEntry("WaterfrontDirectory", ex.Message, System.Diagnostics.EventLogEntryType.Error);
        
        // Clear the error
        Server.ClearError();
        
        // Redirect to default page
        Response.Redirect("Default.aspx");
    }
</script> 