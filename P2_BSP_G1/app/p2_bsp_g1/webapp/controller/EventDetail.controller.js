sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("p2bspg1.controller.EventDetail", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.attachRouteMatched(this._onRouteMatched, this);
      },
      signUp: function (evt) {
        MessageToast.show("U bent succesvol ingeschreven voor dit evenement!");
      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        var urlPath = "/" + oArgs.evenementID;

        oView.bindElement({ path: urlPath });
      },
    });
  }
);
