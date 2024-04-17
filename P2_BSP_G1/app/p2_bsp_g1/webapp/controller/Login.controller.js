sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
  
], function(Controller, MessageBox) {
  "use strict";

  return Controller.extend("your.namespace.Login", {
      
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
        else if (email === "mats" && password === "123") {
            MessageBox.success("Login successful. Redirecting to home screen.");
            // Set a timer for 2 seconds before redirecting to the home screen
            setTimeout(function() {
                window.location.href = "#/StartScreen/";
            }, 2000); // 2000 milliseconds = 2 seconds
            return;
        }
        
        else if (email !== "mats" || password !== "123") {
            MessageBox.error("Invalid email or password.");
            return;
        }
    
        //Lukt nog niet helemaal
        // Read the CSV file
        /*var csvFilePath = "http://localhost:4004/odata/v4/overview/Gebruikers";
    
        $.ajax({
            url: csvFilePath,
            dataType: "text",
            success: function(data) {
                var lines = data.split('\n');
    
                // Iterate through each line of the CSV file
                for (var i = 0; i < lines.length; i++) {
                    var columns = lines[i].split(';');
                    var storedEmail = columns[3];
                    var storedPassword = columns[4];
    
                    // Check if the entered email and password match
                    if (email === storedEmail && password === storedPassword) {
                        MessageBox.success("Login successful.");
                        // Redirect to home screen or perform other actions upon successful login
                        // this.getOwnerComponent().getRouter().navTo("#/Home");
                        return;
                    }
                }
    
                // If no match found
                MessageBox.error("Invalid email or password.");
            },
            error: function() {
                MessageBox.error("Failed to read user data.");
            }
        });*/
    },

      onForgotPassword: function() {
          // Redirect to Forgot Password page
          window.location.href = "#/ForgotPassword/";
      },

      onRegister: function() {
          // Redirect to Registration page
          window.location.href = "#/Registreer/";
      },
      onSeePassword: function() {
        var oPasswordInput = this.getView().byId("wachtwoord");
        var sCurrentType = oPasswordInput.getType();
        if (sCurrentType === "Password") {
            oPasswordInput.setType("Text");
        } else {
            oPasswordInput.setType("Password");
        }
    }    
  });
});
