sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("p2bspg1.controller.Registreer", {
      onInit: function () {
        var oRegistreer = {
          achternaam: "",
          email: "",
          geboortedatum: null,
          voornaam: "",
          wachtwoord: ""
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");
      },
    
      onRegister: function() {
        var oForm = this.getView().getModel("form").getData();
        var sHerhaalWachtwoord = this.getView().byId("herhaalWachtwoord").getValue();

        // Check if any field is empty
        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          return;
        }

        // Check if password and repeat password match
        if (oForm.wachtwoord !== sHerhaalWachtwoord) {
          MessageBox.error("Passwords do not match");
          return;
        }

        var odatamodel = this.getView().getModel("v2model");

        odatamodel.create("/Gebruikers", oForm, {
          success: function (data, response) {
            console.log("gelukt");
            MessageBox.success("Uw account is aangemaakt!");
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error("Het is niet gelukt om uw account aan te maken, probeer opnieuw!");
          },
        });
        console.log("done");
      },

      // Function to validate form fields
      validateForm: function(formData) {
        for (var key in formData) {
          if (formData.hasOwnProperty(key)) {
            if (!formData[key] && key !== "herhaalWachtwoord") {
              return false;
            }
          }
        }
        return true;
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
