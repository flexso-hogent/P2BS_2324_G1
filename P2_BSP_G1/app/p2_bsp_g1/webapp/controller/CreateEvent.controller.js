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
          startDatum: null,
          eindDatum: null,
          startUur: "",
          eindUur: "",
          maxAantalInschrijvingen: null,
          prijs: null,
        };

        var oModel = new JSONModel(oRegistreer);
        this.getView().setModel(oModel, "form");

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

      createEvent() {
        var oForm = this.getView().getModel("form").getData();

        console.log(oForm);

        if (!this.validateForm(oForm)) {
          MessageBox.error("Please fill in all fields");
          return;
        }

        var startDate = new Date(oForm.startDatum);
        var endDate = new Date(oForm.eindDatum);
        var currentDate = new Date();
        if (startDate > endDate) {
          MessageBox.error("Startdatum moet voor of op de einddatum liggen.");
          return;
        }
        console.log(oForm.startUur);
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

        var odatamodel = this.getView().getModel("v2model");

        console.log('ehre' + odatamodel);
        odatamodel.create("/Evenementen", oForm, {
          success: function (data, response) {
            console.log("gelukt");
            MessageBox.success("Uw account is aangemaakt!", {
              onClose: function() {
                window.location.href = "#/Events/";
              }
            });
            
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error("Het is niet gelukt om uw account aan te maken, probeer opnieuw!");
          },
        });
        console.log("done");
      },
    });
  }
);
