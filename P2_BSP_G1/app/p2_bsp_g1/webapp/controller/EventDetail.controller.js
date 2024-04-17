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
        var urlPath =
          "/" + "Evenementen(evenementID=" + oArgs.evenementID + ")";

        oView.bindElement({ path: urlPath });
      },
      handleListItemPress: function (oEvent) {
        // var oSelectedItem = oEvent.getSource().getBindingContext();
        //Retrieve the path of the selected item and strip the starting '/'
        //to avoid an invalid URL

        // var sEventID = oSelectedItem.getProperty("evenementID");
        // console.log(sEventID);

        // var oRouter = this.getOwnerComponent().getRouter();
        // oRouter.navTo("EventDetail", {
        //   evenementID: sEventID,
        // });
        console.log("Done");
      },
    });
  }
);
