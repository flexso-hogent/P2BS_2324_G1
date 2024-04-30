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
      onInit: async function () {
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

        var sEventId = this.getOwnerComponent().getRouter().getHashChanger().getHash().split("/").slice(-2, -1)[0];
        console.log("Event Id: ", sEventId);
        await this.getEventData(sEventId);
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

      getEventData: function (eventId) {
        // Assuming you have a service to fetch event data
        var odatamodel = this.getView().getModel("v2model");
        var oForm = this.getView().getModel("form").getData();
        console.log("OdataModel: ", odatamodel);
        console.log("Form: ", oForm);
        console.log(eventId);
    
        odatamodel.read("/Evenementen(" + eventId + ")", {
            success: function (oData) {
                MessageBox.success("Gelukt!");
                console.log(oData);
                // Set the retrieved data to the form model
                this.getView().getModel("form").setData(oData);
                this.getView().getModel("form").setProperty("naam", "test");
            }.bind(this),
            error: function (error) {
                // Handle error
                MessageBox.error("Failed to fetch event data.");
            }
        });
      },

      createEvent() {
        var oForm = this.getView().getModel("form").getData();
        console.log(oForm);

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

        //console.log('oDataModel: ' + odatamodel);
        writeToCSV(oForm);
        console.log("Data is:", csvLine);
        odatamodel.create("/Evenementen", oForm, {
          success: function (data, response) {
            console.log("gelukt", data, response);
            MessageBox.success("Evenement succesvol aangemaakt!", {
              onClose: function() {
                writeToCSV(oForm);
                window.location.href = "#/Events/" // Naar event + eventID
              }
            });
            
          },
          error: function (error) {
            console.error("Error creting event", error)
            console.log("niet gelukt");
            MessageBox.error("Het is niet gelukt om uw evenement aan te maken, probeer opnieuw!");
          },
        });
        console.log("done");
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
        console.log(oForm.beginUur);
        console.log(oForm.eindUur);
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
        var eventId = "your_event_id_here"; // Replace with actual event ID
    
        var odatamodel = this.getView().getModel("v2model");
    
        odatamodel.update("/Evenementen('" + eventId + "')", oForm, {
            success: function (data, response) {
                MessageBox.success("Event updated successfully!", {
                    onClose: function () {
                        // Navigate back to the event detail page
                        this.getOwnerComponent().getRouter().navTo("EventDetail", { eventId: eventId });
                    }
                });
            },
            error: function (error) {
                MessageBox.error("Failed to update event. Please try again.");
            }
        });
    },
    });
  }
);
