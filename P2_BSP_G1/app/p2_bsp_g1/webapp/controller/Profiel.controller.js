sap.ui.define([
  "sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */ 
  function(Controller, MessageBox, JSONModel) {
  "use strict";

  var loggedInUser = JSON.parse(localStorage.getItem("user"))

  return Controller.extend("p2bspg1.controller.Profiel", {
    onInit: function() {
      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oRouter
        .getRoute("Profiel")
        .attachPatternMatched(this._onRouteMatched, this);
      console.log("gelukt");
      

      // var userDataModel = new JSONModel(loggedInUser);
      // this.getView().setModel(userDataModel, "userDataModel");
      // console.log("logged in user: ", loggedInUser);

    },
    _onRouteMatched: function(oEvent) {
      var oView = this.getView();
      console.log("logged in user: ", loggedInUser.gebruikerID);
      var urlPath = "/" + "Gebruikers(gebruikerID=" + loggedInUser.gebruikerID + ")";
      oView.bindElement({ path: urlPath });
    },
    onTerug: function() {
      history.back();
    },
    onWijzig: function() {
      MessageBox.confirm("Wilt u uw gegevens wijzigen?", {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function(sAction) {
          if (sAction === MessageBox.Action.YES) {
            this.oRouter.navTo("WijzigProfiel");
          }
        }.bind(this),
      });
    },

  });
}); 