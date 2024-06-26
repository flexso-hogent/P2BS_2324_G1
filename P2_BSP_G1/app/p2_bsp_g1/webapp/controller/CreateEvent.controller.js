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
    var user = JSON.parse(localStorage.getItem("user"));

    return Controller.extend("p2bspg1.controller.CreateEvent", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("EditEvent")
          .attachPatternMatched(this._onRouteMatched, this);
        oRouter
          .getRoute("CreateEvent")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        if (!user || !user.rol === "admin") {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }

        var oRegistreer = {
          naam: "",
          locatie: "",
          beginDatum: null,
          eindDatum: null,
          beginUur: "",
          eindUur: "",
          prijs: null,
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");

        var oArgs = oEvent.getParameter("arguments");
        var oName = oEvent.getParameter("name");

        if (oName == "EditEvent") {
          this.getEventData(oArgs.EvenementID);
        } else if (oName == "CreateEvent") {
          this._resetCreate();
        }
      },

      validateForm: function (formData) {
        for (var key in formData) {
          if (formData.hasOwnProperty(key)) {
            return true;
          }
        }
        return false;
      },

      _resetCreate: function () {
        var oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        var sButtonText = oResourceBundle.getText("titelCreateEvenement");

        var button = this.byId("createEditButton");
        if (button != null) {
          button.setText(sButtonText);
        }

        var title = this.byId("createEvent");
        if (title != null) {
          title.setTitle(sButtonText);
        }
        
        var sTitleKey = "evenementCreateButton"; // Replace with the actual key from your resource bundle
        if (title != null) {
          title.setTitle(oResourceBundle.getText(sTitleKey));
        }
      },

      getEventData: function (eventId) {
        var oResourceBundle = this.getView()
          .getModel("i18n")
          .getResourceBundle();
        var sButtonText = oResourceBundle.getText("titelBewerkEvenement");

        var button = this.byId("createEditButton");
        button.setText(sButtonText);

        var title = this.byId("createEvent");
        title.setTitle(sButtonText);
        var sTitleKey = "evenementEditButton"; // Replace with the actual key from your resource bundle

        var title = this.byId("createEvent");
        title.setTitle(oResourceBundle.getText(sTitleKey));
        var odatamodel = this.getView().getModel("v2model");
        var oForm = this.getView().getModel("form").getData();

        odatamodel.read("/Evenementen(" + eventId + ")", {
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

      createEvent() {
        var oForm = this.getView().getModel("form").getData();

        // Controlestructuren
        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          return;
        }

        var startDate = new Date(oForm.beginDatum);
        var endDate = new Date(oForm.eindDatum);
        var currentDate = new Date();
        if (startDate > endDate) {
          MessageBox.error("Startdatum moet voor of op de einddatum liggen.");
          return;
        }

        if (startDate <= currentDate || endDate <= currentDate) {
          MessageBox.error("Data moeten in de toekomst liggen.");
          return;
        }

        if (oForm.maxAantalDeelnemers > 1) {
          MessageBox.error("Maximaal aantal deelnemers moet minimaal 1 zijn.");
          return;
        }

        if (oForm.prijs < 0) {
          MessageBox.error("Prijs moet groter of gelijk zijn dan/aan 0.");
          return;
        }

        var odatamodel = this.getView().getModel("v2model");

        odatamodel.create("/Evenementen", oForm, {
          success: function (data, response) {
            MessageBox.success("Evenement succesvol aangemaakt!", {
              onClose: function () {
                window.location.href = "#/Events/"; // Naar event + eventID
              },
            });
          },
          error: function (error) {
            MessageBox.error(
              "Het is niet gelukt om uw evenement aan te maken, probeer opnieuw!"
            );
          },
        });
      },
      onEditEvent: function () {
        var oForm = this.getView().getModel("form").getData();

        // Validate form data (similar to createEvent validation)
        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          return;
        }

        var startDate = new Date(oForm.beginDatum);
        var endDate = new Date(oForm.eindDatum);
        var currentDate = new Date();
        if (startDate > endDate) {
          MessageBox.error("Startdatum moet voor of op de einddatum liggen.");
          return;
        }
        if (startDate <= currentDate || endDate <= currentDate) {
          MessageBox.error("Data moeten in de toekomst liggen.");
          return;
        }

        if (oForm.maxAantalDeelnemers > 1) {
          MessageBox.error("Maximaal aantal deelnemers moet minimaal 1 zijn.");
          return;
        }

        if (oForm.prijs < 0) {
          MessageBox.error("Prijs moet groter of gelijk zijn dan/aan 0.");
          return;
        }

        // Assuming you have an event ID (e.g., from the route parameter)
        var eventId = oForm.evenementID; // Replace with actual event ID

        var odatamodel = this.getView().getModel("v2model");

        odatamodel.update("/Evenementen(" + eventId + ")", oForm, {
          success: function (data, response) {
            MessageBox.success(
              "Event updated successfully! Redirecting to event page."
            );
            setTimeout(function () {
              window.location.href = "#/Events/" + eventId;
              window.location.reload();
            }, 1000);
          },
          error: function (error) {
            MessageBox.error(
              "Het evenement is niet bijgewerkt. Probeer het opnieuw."
            );
          },
        });
      },
      handleEvent() {
        var oForm = this.getView().getModel("form").getData();

        if (oForm.evenementID) {
          this.onEditEvent();
        } else {
          this.createEvent();
        }
      },
      annuleer() {
        history.back();
      },
    });
  }
);
