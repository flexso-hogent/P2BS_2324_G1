sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox",],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
      "use strict";
  
      return Controller.extend("p2bspg1.controller.Registreer", {
        onInit: function () {
          var oRegistreer = {
            gebruikerID: 0,
            voornaam: "",
            achternaam: "",
            email: "",
            wachtwoord: "",
            geboortedatum: null,
          };
          var oModel = new JSONModel(oRegistreer);
          this.getView().setModel(oModel, "form");
        },
      
        onRegister: function() {
          var oForm = this.getView().getModel("form").getData();
          oForm.geboortedatum = new Date(oForm.geboortedatum);

          var odatamodel = this.getView().getModel("v2model");


          console.log(oForm);

          odatamodel.create("/Gebruikers", oForm, {
            success: function (data, response) {
              console.log("gelukt");
              MessageBox.success("Data was created successfully");
            },
            error: function (error) {
              console.log("niet gelukt");
              MessageBox.error("Error while creating the data");
            },
          });
          console.log("eeee");
          // Validation
          // if (!data.voornaam || !data.email || !data.password || !data.confirmPassword) {
          //   MessageToast.show("Please fill in all fields.");
          //   return;
          // }
    
          // if (data.password !== data.confirmPassword) {
          //   MessageToast.show("Passwords do not match.");
          //   return;
          // }
    
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
        },
        onSeePassword: function() {
          var oPasswordInput = this.getView().byId("wachtwoord");
          var sCurrentType = oPasswordInput.getType();
          if (sCurrentType === "Password") {
              oPasswordInput.setType("Text");
          } else {
              oPasswordInput.setType("Password");
          }
        },
        onSeePasswordHerhaal: function() {
          var oPasswordInput = this.getView().byId("herhaalWachtwoord");
          var sCurrentType = oPasswordInput.getType();
          if (sCurrentType === "Password") {
              oPasswordInput.setType("Text");
          } else {
              oPasswordInput.setType("Password");
          }
      }  
      });
    });