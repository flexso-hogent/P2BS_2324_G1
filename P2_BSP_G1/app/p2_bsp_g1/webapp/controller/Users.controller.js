sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/model/Filter"],
  function (Controller, MessageBox, Filter) {
    "use strict";
    var user = localStorage.getItem("user");

    return Controller.extend("p2bspg1.controller.Users", {
      onInit: function () {
        if (user == null) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }

        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("Users")
          .attachPatternMatched(this._onRouteMatched, this);

      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var evenementID = oArgs.evenementID;
        var oFilter = new Filter("inschrijvingID/sessieID/evenement_evenementID", sap.ui.model.FilterOperator.EQ, evenementID);
        this.getView().byId("userTable").getBinding("items").filter([oFilter]);
      },
      onTerug: function() {
        history.back();
      }
    });
  }
);
