sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox) {
    "use strict";
    var sessieID = 0;

    return Controller.extend("p2bspg1.controller.SessieDetail", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("SessieDetail")
          .attachPatternMatched(this._onRouteMatched, this);

        var oAv3 = this.byId("av3"),
          oAv4 = this.byId("av4");
        if (
          !localStorage.getItem("user") === null ||
          localStorage.getItem("user").includes('"rol":"admin"')
        ) {
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
      },
      editSessie: function () {
        this.getOwnerComponent().getRouter().navTo("EditSessie", {
          sessieID,
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
      }
    });
  }
);
