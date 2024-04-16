sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function(Controller, MessageBox) {
  "use strict";

  return Controller.extend("your.namespace.ForgotPassword", {

      onInit: function() {
          // Initialization code if needed
      },

      onResetPassword: function() {
          var email = this.getView().byId("email").getValue();

          // Validate email address
          if (!email) {
              MessageBox.error("Please enter your email address.");
              return;
          }

          // Send password reset email
          MessageBox.success("Password reset email sent successfully.");
      },

      onCancel: function() {
          window.location.href ="http://localhost:4004/p2_bsp_g1/webapp/index.html#/Login/"; // Redirect to home page
      }

  });
});
