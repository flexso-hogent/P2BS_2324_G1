sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  function (Controller, MessageBox) {
    "use strict";
    var user = localStorage.getItem("user"),
      evenementID = 0;
    return Controller.extend("p2bspg1.controller.Feedback", {
      onInit: function () {
        if (user == null) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("Feedback")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        evenementID = oArgs.evenementID;
        var oView = this.getView();
        var urlPath = "/" + "Score(evenementID=" + oArgs.evenementID + ")";

        oView.bindElement({ path: urlPath });
      },
    });
  }
);
