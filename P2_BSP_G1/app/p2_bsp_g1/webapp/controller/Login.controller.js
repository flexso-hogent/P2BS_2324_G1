sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("p2bspg1.controller.Login", {
        loadUsers: async function() {
            // Read CSV file and parse users data
            var oModel = new JSONModel();
            try {
                var oData = await this.readCSV("http://localhost:4004/odata/v4/overview/Gebruikers");
                oModel.setData(oData);
                this.getView().setModel(oModel, "users");
            } catch (error) {
                MessageBox.error("Failed to load users data: " + error.message);
            }
        },

        readCSV: function(filePath) {
            return new Promise(function(resolve, reject) {
                Papa.parse(filePath, {
                    download: true,
                    header: true,
                    complete: function(results) {
                        resolve(results.data);
                    },
                    error: function(error) {
                        reject(error);
                    }
                });
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
        },

        onLogin: function() {
            var oView = this.getView();
            var sEmail = oView.byId("email").getValue();
            var sPassword = oView.byId("wachtwoord").getValue();

            var oUsersModel = this.getView().getModel("users");
            if (!oUsersModel) {
                MessageBox.error("Failed to load users data. Please try again later.");
                return;
            }
            var aUsersData = oUsersModel.getData();

            if (!sEmail || !sPassword) {
                MessageBox.error("Please enter both email and password.");
                return;
            }
            
            // Check if provided email and password match any user data
            var bValidCredentials = aUsersData.some(function(user) {
                return user.email === sEmail && user.wachtwoord === sPassword;
            });  
            
            if (bValidCredentials) {
                MessageBox.success("Login successful. Redirecting to home screen.");
                setTimeout(function() {
                    window.location.href = "#/StartScreen/";
                }, 2000);
                return;
            } else {
                MessageBox.error("Invalid email or password");
            }
        }
    });
});
