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

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("EditSessie")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oSessie) {
        var oArgs = oSessie.getParameter("arguments");
        var oName = oSessie.getParameter("name");

        if ((oName = "EditSessie")) {
          this.getSessieData(oArgs.sessieID);
        }
      },

      getSessieData: function (sessieID) {
        var button = this.byId("creeerEditButton");
        button.setText("Bewerk sessie");
        var title = this.byId("titleCreateEdit");
        title.setText("Bewerk evenement");
        this.getView().byId("createSessie").setTitle("Sessie bewerken");
        // Assuming you have a service to fetch event data
        var odatamodel = this.getView().getModel("v2model");
        var oForm = this.getView().getModel("form").getData();

        odatamodel.read("/Sessies(" + sessieID + ")", {
          success: function (oData) {
            // Set the retrieved data to the form model
            var oModel = new JSONModel(oData);
            
            this.getView().setModel(oModel, "form");
          }.bind(this),
          error: function (error) {
            // Handle error
            MessageBox.error("Failed to fetch event data.");
          },
        });
      },

      handleLiveChange: function (oSessie) {
        var oTextArea = oSessie.getSource(),
          iValueLength = oTextArea.getValue().length,
          iMaxLength = oTextArea.getMaxLength(),
          sState =
            iValueLength > iMaxLength ? ValueState.Warning : ValueState.None;

        oTextArea.setValueState(sState);
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

      editSessie: function () {
        var oForm = this.getView().getModel("form").getData();

        // Validate form data (similar to createEvent validation)
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

        // Assuming you have an event ID (e.g., from the route parameter)
        var sessieID = oForm.sessieID; // Replace with actual event ID

        var odatamodel = this.getView().getModel("v2model");

        odatamodel.update("/Sessies(" + sessieID + ")", oForm, {
          success: function (data, response) {
            MessageBox.success(
              "Sessie edited. Redirecting to sessie page."
            );
            setTimeout(function () {
              window.location.href = "#/";
              window.location.reload();
            }, 1000);                  
            return;
          },
          error: function (error) {
            MessageBox.error("De sessie is niet bijgewerkt. Probeer het opnieuw.");
          },
        });
      },
    
      _getEvenementIDFromURL: function() {
          var oComponent = this.getOwnerComponent();
          var oRouter = oComponent.getRouter();
          var oArgs = oRouter.getHashChanger().getHash().split("/");
          console.log(oArgs);
          return oArgs[oArgs.length - 1]; // Assuming evenementID is the last segment of the URL
      },
      handleEditCreate: function () {
        var oForm = this.getView().getModel("form").getData();

        if(oForm.sessieID){
          this.editSessie();
        }
        else{
          this.createSessie();
        }
      }
    });
  }
);
