sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, JSONModel) {
    "use strict";

    var loggedInUser = JSON.parse(localStorage.getItem("user"));

    return Controller.extend("p2bspg1.controller.Profiel", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("Profiel")
          .attachPatternMatched(this._onRouteMatched, this);
        console.log("gelukt");

        var oRegistreer = {
          voornaam: "",
          achternaam: "",
          email: "",
          geboortedatum: null,
          wachtwoord: "",
          herhaalWachtwoord: "",
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");
      },

      updateModel: function () {
        var oModel = this.getView().getModel("form");
        var oFormData = oModel.getData();
        oFormData.voornaam = this.getView().byId("voornaam").getValue();
        oFormData.achternaam = this.getView().byId("achternaam").getValue();
        oFormData.email = this.getView().byId("email").getValue();
        oFormData.geboortedatum = this.getView()
          .byId("geboortedatum")
          .getValue();
        oFormData.wachtwoord = this.getView().byId("wachtwoord").getValue();
        oFormData.herhaalWachtwoord = this.getView()
          .byId("herhaalWW")
          .getValue();
        oModel.setData(oFormData);
      },

      _onRouteMatched: function (oEvent) {
        var oView = this.getView();
        console.log("logged in user: ", loggedInUser.gebruikerID);
        var urlPath =
          "/" + "Gebruikers(gebruikerID=" + loggedInUser.gebruikerID + ")";
        oView.bindElement({ path: urlPath });
      },

      onTerug: function () {
        history.back();
      },

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

      onOpslaan: function () {
        this.updateModel();
        var oForm = this.getView().getModel("form").getData(),
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        console.log(oForm);
        var sHerhaalWachtwoord = oForm.herhaalWachtwoord;

        // Check if any field is empty
        if (!this.validateForm(oForm)) {
          MessageBox.error(oResourceBundle.getText("alleVeldenError"));
          return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(oForm.email)) {
          MessageBox.error(oResourceBundle.getText("emailError"));
          return;
        }

        // Check if password and repeat password match
        if (oForm.wachtwoord !== sHerhaalWachtwoord) {
          MessageBox.error(oResourceBundle.getText("wachtwoordError"));
          return;
        }

        var birthdate = new Date(oForm.geboortedatum);
        var currentDate = new Date();
        if (birthdate > currentDate) {
          MessageBox.error(oResourceBundle.getText("geboortedatumError"));
          return;
        }

        MessageBox.confirm(oResourceBundle.getText("bevestigingWijzigen"), {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.YES) {
              var odatamodel = this.getView().getModel("v2model"),
                geboortedatum = new Date(oForm.geboortedatum),
                oFormUpdate = {
                  voornaam: oForm.voornaam,
                  achternaam: oForm.achternaam,
                  email: oForm.email,
                  geboortedatum: geboortedatum,
                  wachtwoord: oForm.wachtwoord,
                },
                that = this;

              odatamodel.update(
                "/Gebruikers(" + loggedInUser.gebruikerID + ")",
                oFormUpdate,
                {
                  success: function () {
                    MessageBox.success(
                      oResourceBundle.getText("wijzigingSucces")
                    );
                    that.getView().byId("wachtwoord").setValue("");
                    that.getView().byId("herhaalWW").setValue("");
                  },
                  error: function () {
                    MessageBox.error(oResourceBundle.getText("profielError"));
                  },
                }
              );
            } else {
              MessageBox.error(oResourceBundle.getText("wijzigingAnnuleren"));
              this.getView().byId("wachtwoord").setValue("");
              this.getView().byId("herhaalWW").setValue("");
            }
          }.bind(this),
        });
      },
      onEditVoornaam: function () {
        var oInputVoornaam = this.getView().byId("voornaam");
        var bEditable = oInputVoornaam.getEditable();
        oInputVoornaam.setEditable(!bEditable);
      },
      onEditAchternaam: function () {
        var oInputAchternaam = this.getView().byId("achternaam");
        var bEditable = oInputAchternaam.getEditable();
        oInputAchternaam.setEditable(!bEditable);
      },
      onEditEmail: function () {
        var oInputEmail = this.getView().byId("email");
        var bEditable = oInputEmail.getEditable();
        oInputEmail.setEditable(!bEditable);
      },
      onEditDate: function () {
        var oInputGeboortedatum = this.getView().byId("geboortedatum");
        var bEditable = oInputGeboortedatum.getEditable();
        oInputGeboortedatum.setEditable(!bEditable);
      },
      onEditWW: function () {
        var oInputWachtwoord = this.getView().byId("wachtwoord");
        var bEditable = oInputWachtwoord.getEditable();
        oInputWachtwoord.setEditable(!bEditable);
      },
      onEditHerhaalWW: function () {
        var oInputHerhaalWachtwoord = this.getView().byId("herhaalWW");
        var bEditable = oInputHerhaalWachtwoord.getEditable();
        oInputHerhaalWachtwoord.setEditable(!bEditable);
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
        console.log(oCurrentIcon);
        var sCurrentIcon = oCurrentIcon.getIcon();
        if (sCurrentIcon === "sap-icon://show") {
          oCurrentIcon.setIcon("sap-icon://hide");
        } else {
          oCurrentIcon.setIcon("sap-icon://show");
        }
      },
      onSeePasswordHerhaal: function () {
        var oPasswordInput = this.getView().byId("herhaalWW");
        var sCurrentType = oPasswordInput.getType();
        if (sCurrentType === "Password") {
          oPasswordInput.setType("Text");
        } else {
          oPasswordInput.setType("Password");
        }
        var oCurrentIcon = this.getView().byId("icon2");
        console.log(oCurrentIcon);
        var sCurrentIcon = oCurrentIcon.getIcon();
        if (sCurrentIcon === "sap-icon://show") {
          oCurrentIcon.setIcon("sap-icon://hide");
        } else {
          oCurrentIcon.setIcon("sap-icon://show");
        }
      },
    });
  }
);
