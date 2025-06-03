<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Waterfront Properties Company Directory - Login</title>
    <meta name="robots" content="noindex, nofollow" />
    <style>
        body {
            background-color: #FFFFFF;
            padding: 30px;
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .logo {
            width: 50px;
            height: 46px;
        }
        .error {
            color: #e74c3c;
            margin-top: 10px;
        }
        .form-group {
            margin: 20px 0;
        }
        input[type="password"] {
            padding: 8px;
            width: 200px;
        }
        .button {
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            cursor: pointer;
        }
        .button:hover {
            background-color: #2980b9;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="container">
            <table width="626" border="0">
                <tbody>
                    <tr>
                        <td width="55" height="48"><img src="wflogo.jpg" class="logo" alt="" /></td>
                        <td width="494"><h2 style="text-align: center">Waterfront Properties Company Directory</h2></td>
                        <td width="55"><img src="wflogo2.jpg" class="logo" alt="" /></td>
                    </tr>
                </tbody>
            </table>

            <p>Please enter the password to view the company directory.</p>

            <asp:Panel ID="ErrorPanel" runat="server" Visible="false">
                <p class="error">Access denied! Incorrect password.</p>
            </asp:Panel>

            <div class="form-group">
                <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="PasswordTextBox">Password:</asp:Label>
                <asp:TextBox ID="PasswordTextBox" runat="server" TextMode="Password"></asp:TextBox>
            </div>
            
            <asp:Button ID="LoginButton" runat="server" Text="View Directory" CssClass="button" OnClick="LoginButton_Click" />
        </div>
    </form>
</body>
</html> 