sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
      "use strict";
  
      return Controller.extend("p2bspg1.controller.Registreer", {
        onInit: function () {
        },
      
        onRegister: function() {
          var model = this.getView().getModel();
          var data = model.getData();
    
          // Validation
          if (!data.voornaam || !data.email || !data.password || !data.confirmPassword) {
            MessageToast.show("Please fill in all fields.");
            return;
          }
    
          if (data.password !== data.confirmPassword) {
            MessageToast.show("Passwords do not match.");
            return;
          }
    
          // Perform registration
          // Here you can call your backend API to register the user
          // Example:
          // jQuery.ajax({
          //   url: "/register",
          //   method: "POST",
          //   data: data,
          //   success: function(response) {
          //     MessageToast.show("Registration successful!");
          //   },
          //   error: function(error) {
          //     MessageToast.show("Registration failed. Please try again later.");
          //   }
          // });
    
          // For demonstration, just show a message
          MessageToast.show("Registration successful!");
        }
      });
    });