sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox, Filter) {
    "use strict";
    var sessieID;
    var user = JSON.parse(localStorage.getItem("user"));
    return Controller.extend("p2bspg1.controller.SessieDetail", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("SessieDetail")
          .attachPatternMatched(this._onRouteMatched, this);

        var oAv3 = this.byId("av3"),
          oAv4 = this.byId("av4");
        if (user === null) {
          MessageBox.error("U moet ingelogd zijn om deze pagina te bekijken", {
            onClose: function () {
              window.location.href = "#/Login";
            },
          });
        } else if (user.rol === "admin") {
          oAv3.setVisible(true);
          oAv4.setVisible(true);
        }
      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        var urlPath = "/" + "Sessies(sessieID=" + oArgs.sessieID + ")";
        sessieID = oArgs.sessieID;

        oView.bindElement({ path: urlPath });
        this.setRating();
      },
      editSessie: function () {
        this.getOwnerComponent().getRouter().navTo("EditSessie", {
          sessieID: sessieID,
        });
      },
      deleteSessie: function () {
        var odatamodel = this.getView().getModel("v2model");

        odatamodel.remove("/Sessies(" + sessieID + ")", {
          success: function (data, response) {
            console.log("gelukt");
            MessageBox.success("De sessie is succesvol verwijderd!", {
              onClose: function () {
                history.back();
              },
            });
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error(
              "Het is niet gelukt om de sessie te verwijderen. Probeer het opnieuw!"
            );
          },
        });
      },
      onTerug: function () {
        history.back();
      },
      setRating: function () {
        var that = this;
        var odatamodel = this.getView().getModel("v2model");
        var oFilter = new Filter(
          "inschrijvingID/sessieID_sessieID",
          sap.ui.model.FilterOperator.EQ,
          sessieID
        );

        odatamodel.read("/Scores", {
          filters: [oFilter],
          success: function (oData) {
            console.log(oData);
            var avrRating = 0;
            oData.results.forEach((e) => {
              avrRating += e.aantalSterren;
            });
            var length = oData.results.length;
            if (length != 0) {
              avrRating = avrRating / oData.results.length;
            } else {
              that.byId("rating2").setVisible(false);
              that.byId("geenRecensies").setVisible(true);
            }

            that.byId("rating").setValue(avrRating); // Use that instead of this
            that
              .byId("rating")
              .setTooltip(
                "Een gemiddelde rating van " +
                  avrRating +
                  " op 5 sterren" +
                  " gebaseerd op " +
                  length +
                  " beoordelingen"
              );
          },
          error: function (error) {
            MessageBox.error(
              "Er is een fout opgetreden bij het ophalen van de recensies. Laad de pagina opnieuw!"
            );
          },
        });
      },
    });
  }
);
