sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("p2bspg1.controller.Login", {
      onInit: function () {
        // Initialization code if needed
      },

      onLogin: function () {
        var email = this.getView().byId("email").getValue();
        var password = this.getView().byId("wachtwoord").getValue();
        var passwordCorrect = false;

        // Validate email and password
        if (!email || !password) {
          MessageBox.error("Please enter both email and password.");
          return;
        }
        // email = '"email":"' + email + '"';
        // password = '"wachtwoord":"' + password + '"';
        //Lukt nog niet helemaal
        var csvFilePath = "http://localhost:4004/odata/v4/overview/Gebruikers";

        $.ajax({
          url: csvFilePath,
          dataType: "json", // We changed the dataType to "json"
          success: function (data) {
            console.log(data);
            console.log("Email: " + email);
            console.log("Password: " + password);

            // Iterate over the array of users
            data.value.forEach(function (user) {
              var storedEmail = user.email; // Get the email field
              var storedPassword = user.wachtwoord; // Get the password field

              console.log("Stored email: " + storedEmail);
              console.log("Stored password: " + storedPassword);

              // Check if the entered email and password match
              if (email === storedEmail && password === storedPassword) {
                console.log("Login successful.");
                passwordCorrect = true;
                MessageBox.success(
                  "Login successful. Redirecting to home screen."
                );
                setTimeout(function () {
                  window.location.href = "#/StartScreen/";
                }, 2000);
                return;
              }
            });

            // If no match found
            if (!passwordCorrect)
              MessageBox.error("Invalid email or password.");
          },
          error: function () {
            MessageBox.error("Failed to read user data.");
          },
        });
      },

      onSeePassword: function () {
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

      onForgotPassword: function () {
        window.location.href = "#/ForgotPassword/";
      },

      onRegister: function () {
        window.location.href = "#/Registreer/";
      },
    });
  }
);
