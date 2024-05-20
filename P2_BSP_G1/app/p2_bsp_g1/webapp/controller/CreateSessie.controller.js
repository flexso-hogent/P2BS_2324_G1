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
          maxAantalInschrijvingen: null,
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
        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        var sButtonText = oResourceBundle.getText("titelBewerkSessie");
        
        var button = this.byId("creeerEditButton");
        button.setText(sButtonText);
        
        var title = this.byId("createSessie");
        title.setTitle(sButtonText);
        var sTitleKey = "sessiebewerken"; // Replace with the actual key from your resource bundle

        var title = this.byId("createSessie");
        title.setTitle(oResourceBundle.getText(sTitleKey));
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

      validateSesssionDateWithinEventRange(evenementID, sessionDate, callback) {
        var odatamodel = this.getView().getModel("v2model");

        odatamodel.read("/Evenementen(" + evenementID + ")", {
          success: function(oEventDate) {
            var eventBeginDate = new Date(oEventDate.beginDatum);
            var eventEndDate = new Date(oEventDate.eindDatum);
            var isValid = sessionDate >= eventBeginDate && sessionDate <= eventEndDate;
            callback(isValid);
            console.log(eventBeginDate);
            console.log(eventEndDate);
            console.log(sessionDate);
            console.log(isValid);
          },
          error: function(error) {
            console.log("Failed to fetch event data: ", error);
            callback(false);
          }
        });
      },

      createSessie: function () {
        var oForm = this.getView().getModel("form").getData(),
        oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
    
        // Retrieve evenementID from URL
        var evenementID = this._getEvenementIDFromURL();
    
        // Add evenementID to form data
        oForm.evenement.evenementID = evenementID;
    
        console.log(oForm);
    
        if (!this.validateForm(oForm)) {
          MessageBox.error(oResourceBundle.getText("sessieAlleVeldenError"));
          return;
        }
    
        var date = new Date(oForm.datum);
        var currentDate = new Date();
    
        if (date <= currentDate) {
          MessageBox.error(oResourceBundle.getText("datumError"));
          return;
        }
    
        var beginUur = new Date(oForm.beginUur);
        var eindUur = new Date(oForm.eindUur);
    
        if (beginUur >= eindUur) {
          MessageBox.error(oResourceBundle.getText("uurError"));
          return;
        }
    
        this.validateSesssionDateWithinEventRange(evenementID, date, function(isValid) {
          console.log(evenementID);
          console.log(date);
          console.log(isValid);
          if (!isValid) {
            MessageBox.error(oResourceBundle.getText("datumInEventDatumError"));
            return;
          }
        

          var odatamodel = this.getView().getModel("v2model");
      
          odatamodel.create("/Sessies", oForm, {
            success: function (data, response) {
              console.log("gelukt");
              MessageBox.success(oResourceBundle.getText("sessieAangemaakt"), {
                onClose: function () {
                  window.location.href = "#/Events/" + evenementID;
                },
              });
            },
            error: function (error) {
              console.log("niet gelukt");
              MessageBox.error(
                oResourceBundle.getText("sessieAanmakenError")
              );
            },
          });
        }.bind(this));
      },
      

      editSessie: function () {
        var oForm = this.getView().getModel("form").getData(),
        oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        // Validate form data (similar to createEvent validation)
        if (!this.validateForm(oForm)) {
          MessageBox.error(oResourceBundle.getText("sessieAlleVeldenError"));
          return;
        }

        var date = new Date(oForm.datum);
        var currentDate = new Date();
    
        if (date <= currentDate) {
          MessageBox.error(oResourceBundle.getText("datumError"));
          return;
        }
    
        var beginUur = new Date(oForm.beginUur);
        var eindUur = new Date(oForm.eindUur);
    
        if (beginUur >= eindUur) {
          MessageBox.error(oResourceBundle.getText("uurError"));
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
              window.location.href = "#/Sessies/" + sessieID;
              window.location.reload();
            }, 1000);                  
            return;
          },
          error: function (error) {
            MessageBox.error(oResourceBundle.getText("sessieAanpassenError"));
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
