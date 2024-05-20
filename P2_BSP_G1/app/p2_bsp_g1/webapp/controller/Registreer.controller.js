sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
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
          wachtwoord: "",
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");
      },

      // Function to validate form fields
      validateForm: function (formData) {
        for (var key in formData) {
          if (formData.hasOwnProperty(key)) {
            if (!formData[key] && key !== "herhaalWachtwoord") {
              return false;
            }
          }
        }
        return true;
      },

      onRegister: function () {
        var oForm = this.getView().getModel("form").getData();
        var sHerhaalWachtwoord = this.getView()
          .byId("herhaalWachtwoord")
          .getValue();

        // Check if any field is empty
        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          this.getView().byId("wachtwoord").setValue("");
          this.getView().byId("herhaalWachtwoord").setValue("");
          return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(oForm.email)) {
          MessageBox.error(
            "Please enter a valid email address. Example: jan@example.com"
          );
          this.getView().byId("wachtwoord").setValue("");
          this.getView().byId("herhaalWachtwoord").setValue("");
          return;
        }

        // Check if password and repeat password match
        if (oForm.wachtwoord !== sHerhaalWachtwoord) {
          MessageBox.error("Passwords do not match! Please try again.");
          this.getView().byId("wachtwoord").setValue("");
          this.getView().byId("herhaalWachtwoord").setValue("");
          return;
        }

        var birthdate = new Date(oForm.geboortedatum);
        var currentDate = new Date();
        if (birthdate > currentDate) {
          MessageBox.error("Please enter a valid birthdate.");
          this.getView().byId("wachtwoord").setValue("");
          this.getView().byId("herhaalWachtwoord").setValue("");
          return;
        }
        var odatamodel = this.getView().getModel("v2model"),
          geboortedatum = new Date(oForm.geboortedatum);

        var oData = {
            achternaam: oForm.achternaam,
            email: oForm.email,
            geboortedatum: geboortedatum,
            voornaam: oForm.voornaam,
            wachtwoord: oForm.wachtwoord,
            rol: "user",
          },
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        odatamodel.create("/Gebruikers", oData, {
          success: function () {
            MessageBox.success(oResourceBundle.getText("registerenSuccess"));
            window.location.href = "#/Login/";
          },
        });
      },

      onSeePassword: function () {
        var oPasswordInput = this.getView().byId("wachtwoord");
        var sCurrentType = oPasswordInput.getType();
        if (sCurrentType === "Password") {
          oPasswordInput.setType("Text");
        } else {
          oPasswordInput.setType("Password");
        }
        var oCurrentIcon = this.getView().byId("icon");
        var sCurrentIcon = oCurrentIcon.getIcon();
        if (sCurrentIcon === "sap-icon://show") {
          oCurrentIcon.setIcon("sap-icon://hide");
        } else {
          oCurrentIcon.setIcon("sap-icon://show");
        }
      },
      onSeePasswordHerhaal: function () {
        var oPasswordInput = this.getView().byId("herhaalWachtwoord");
        var sCurrentType = oPasswordInput.getType();
        if (sCurrentType === "Password") {
          oPasswordInput.setType("Text");
        } else {
          oPasswordInput.setType("Password");
        }
        var oCurrentIcon = this.getView().byId("icon2");
        var sCurrentIcon = oCurrentIcon.getIcon();
        if (sCurrentIcon === "sap-icon://show") {
          oCurrentIcon.setIcon("sap-icon://hide");
        } else {
          oCurrentIcon.setIcon("sap-icon://show");
        }
      },
      onTerug: function () {
        window.location.href = "#/Login/";
      },
    });
  }
);
