sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"],
  function (Controller, Filter, FilterOperator) {
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
        this.getView().getModel().setProperty("/evenementID", evenementID);
      },

      onTerug: function() {
        history.back();
      },
      _getEvenementIDFromURL: function() {
        var oComponent = this.getOwnerComponent();
        var oRouter = oComponent.getRouter();
        var oArgs = oRouter.getHashChanger().getHash().split("/");
        console.log(oArgs);
        return oArgs[oArgs.length - 1];
      },
    });
  }
);
