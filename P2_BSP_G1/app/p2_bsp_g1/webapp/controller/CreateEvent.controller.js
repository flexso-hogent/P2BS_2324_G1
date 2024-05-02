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

    return Controller.extend("p2bspg1.controller.App", {
      onInit: function () {
        if (
          localStorage.getItem("user") == null ||
          !localStorage.getItem("user").includes('"rol":"admin"')
        ) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }

        var oRegistreer = {
          naam: "",
          locatie: "",
          beginDatum: null,
          eindDatum: null,
          beginUur: "",
          eindUur: "",
          maxAantalInschrijvingen: null,
          prijs: null,
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("EditEvent")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oName = oEvent.getParameter("name");

        if ((oName = "EditEvent")) {
          this.getEventData(oArgs.EvenementID);
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

      getEventData: function (eventId) {
        var button = this.byId("createEditButton");
        button.setText("Bewerk evenement");
        var title = this.byId("titleCreateEdit");
        title.setText("Bewerk evenement");
        this.getView().byId("createEvent").setTitle("Evenement bewerken");
        // Assuming you have a service to fetch event data
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
            MessageBox.success("Event updated successfully!", {
              onClose: function () {
                // Navigate back to the event detail page
                this.getOwnerComponent()
                  .getRouter()
                  .navTo("EventDetail", { eventId: eventId });
              },
            });
          },
          error: function (error) {
            MessageBox.error("Het evenement is niet bijgewerkt. Probeer het opnieuw.");
          },
        });
      },
      handleEvent() {
        var oForm = this.getView().getModel("form").getData();

        if(oForm.evenementID){
          this.onEditEvent();
        }
        else{
          this.createEvent();
        }
      },
      annuleer() {
        history.back();
      }
    });
  }
);
