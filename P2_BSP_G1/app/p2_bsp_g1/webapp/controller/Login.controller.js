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
          var keepSignedIn = this.getView().byId("keepSignedIn").getSelected();

          // Validate email and password
          if (!email || !password) {
              MessageBox.error("Please enter both email and password.");
              return;
          }

          MessageBox.success("Login successful.");

          this.getOwnerComponent().getRouter().navTo("home");
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
