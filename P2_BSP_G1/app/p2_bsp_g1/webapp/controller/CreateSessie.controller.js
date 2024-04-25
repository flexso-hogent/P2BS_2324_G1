sap.ui.define(
  [
    "sap/ui/core/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
  ],
  function (coreLibrary, Controller, JSONModel, MessageBox) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    return Controller.extend("p2bspg1.controller.CreateSessie", {
      onInit: function () {
        if (
          localStorage.getItem("user") == null ||
          !localStorage.getItem("user").includes('"rol":"admin"')
        ) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
        var oRegistreer = {
          evenement: {
            evenementID: null,
          },
          naam: "",
          datum: null,
          beginUur: "",
          eindUur: "",
          spreker: "",
          korteInhoud: "",
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");
      },
      handleLiveChange: function (oEvent) {
        var oTextArea = oEvent.getSource(),
          iValueLength = oTextArea.getValue().length,
          iMaxLength = oTextArea.getMaxLength(),
          sState =
            iValueLength > iMaxLength ? ValueState.Warning : ValueState.None;

        oTextArea.setValueState(sState);
      },

      handleSimpleExceeding: function (oEvent) {
        var oTA = oEvent.getSource();
        oEvent.getParameter("exceeded")
          ? oTA.setValueState(ValueState.Error)
          : oTA.setValueState(ValueState.Success);
      },

      buttonSetShortValuePress: function () {
        this.byId("textAreaWithBinding2").setValue("Small Text");
        this.byId("textAreaWithoutBinding").setValue("Small Text");
      },

      buttonSetLongValuePress: function () {
        var sText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        this.byId("textAreaWithBinding").setValue(sText);
        this.byId("textAreaWithBinding2").setValue(sText);
      },

      buttonToggleShowExceededTextPress: function () {
        var oTA = this.byId("textAreaWithBinding2");
        oTA.setShowExceededText(!oTA.getShowExceededText());
        var oTA = this.byId("textAreaWithoutBinding");
        oTA.setShowExceededText(!oTA.getShowExceededText());
      },
      annuleer() {
        history.back();
      },

      validateForm: function (formData) {
        for (var key in formData) {
          if (formData.hasOwnProperty(key)) {
            return true;
          }
        }
        return false;
      },

      createSessie: function () {
        var oForm = this.getView().getModel("form").getData();
    
        // Retrieve evenementID from URL
        var evenementID = this._getEvenementIDFromURL();
    
        // Add evenementID to form data
        oForm.evenement.evenementID = evenementID;
    
        console.log(oForm);
    
        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          return;
        }
    
        var date = new Date(oForm.datum);
        var currentDate = new Date();
    
        if (date <= currentDate) {
          MessageBox.error("Datum moeten in de toekomst liggen.");
          return;
        }
    
        var beginUur = new Date(oForm.beginUur);
        var eindUur = new Date(oForm.eindUur);
    
        if (beginUur >= eindUur) {
          MessageBox.error("Beginuur moet voor einduur liggen.");
          return;
        }
    
        var odatamodel = this.getView().getModel("v2model");
    
        odatamodel.create("/Sessies", oForm, {
          success: function (data, response) {
            console.log("gelukt");
            MessageBox.success("Uw sessie is aangemaakt!", {
              onClose: function () {
                window.location.href = "#/Events/" + evenementID;
              },
            });
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error(
              "Het is niet gelukt om uw sessie aan te maken, probeer opnieuw!"
            );
          },
        });
        console.log("done");
    },
    
    _getEvenementIDFromURL: function() {
        var oComponent = this.getOwnerComponent();
        var oRouter = oComponent.getRouter();
        var oArgs = oRouter.getHashChanger().getHash().split("/");
        console.log(oArgs);
        return oArgs[oArgs.length - 1]; // Assuming evenementID is the last segment of the URL
    },
    
    });
  }
);
