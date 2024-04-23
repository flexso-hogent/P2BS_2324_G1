sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function(Controller, MessageBox) {
    "use strict";

    return Controller.extend("p2bspg1.controller.Login", {
        onInit: function() {
            // Initialization code if needed
        },

        onLogin: function() {
            var email = this.getView().byId("email").getValue();
            var password = this.getView().byId("wachtwoord").getValue();
        
            // Validate email and password
            if (!email || !password) {
                MessageBox.error("Please enter both email and password.");
                return;
            }
            email = '"email":"' + email + '"';
            password = '"wachtwoord":"' + password + '"';
            //Lukt nog niet helemaal
            var csvFilePath = "http://localhost:4004/odata/v4/overview/Gebruikers";
        
            $.ajax({
                url: csvFilePath,
                dataType: "text",
                success: function(data) {
                    var lines = data.split('},');
                    
                    // Zieje in de consolse nog
                    console.log("CSV Data:");
                    console.log(data);
                    console.log("Entered email: " + email);
                    console.log("Entered password: " + password);

                    // Iterate through each line of the CSV file
                    // Hier is de fout, hij itereert niet door de csv file
                    for (var i = 0; i < lines.length; i++) {
                        var columns = lines[i].split(',');
                        var storedEmail = columns[3];
                        var storedPassword = columns[4];
                        // Zieje niet meer in de console
                        console.log(i);
                        console.log("Lines: " + lines.length);
                        console.log("Stored email: " + storedEmail);
                        console.log("Stored password: " + storedPassword);
                         // Check if the entered email and password match
                        if (email === storedEmail && password === storedPassword) {
                            MessageBox.success("Login successful. Redirecting to home screen.");
                            setTimeout(function() {
                                window.location.href = "#/StartScreen/";
                            }, 2000);
                            return;
                        }
                    }
    
                    // If no match found
                    MessageBox.error("Invalid email or password.");
                },
                error: function() {
                    MessageBox.error("Failed to read user data.");
                }  
            });
        },
        
        onSeePassword: function() {
            var oInput = this.getView().byId("wachtwoord");
            var oIcon = this.getView().byId("icon");

            if (oInput.getType() === "Password") {
                oInput.setType("Text");
                oIcon.setIcon("sap-icon://hide");
            } else {
                oInput.setType("Password");
                oIcon.setIcon("sap-icon://show");
            }
        },

        onForgotPassword: function() {
            window.location.href = "#/ForgotPassword/";
        },

        onRegister: function() {
            window.location.href = "#/Registreer/";
        }
    });
});
