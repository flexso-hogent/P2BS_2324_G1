sap.ui.define([
  "sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */ 
  function(Controller, MessageBox, JSONModel) {
  "use strict";
  var gebruikerID = 20;

  return Controller.extend("p2bspg1.controller.Profiel", {
    onInit: function() {
      this.oOwnerComponent = this.getOwnerComponent();
      this.oRouter = this.oOwnerComponent.getRouter();
      this.oRouter
        .getRoute("Profiel")
        .attachPatternMatched(this._onRouteMatched, this);
      

      var loggedInUser = JSON.parse(localStorage.getItem("user"))
      var userDataModel = new JSONModel(loggedInUser);
      this.getView().setModel(userDataModel, "userDataModel");
      console.log("logged in user: ", loggedInUser);

      var voornaam = loggedInUser.voornaam;
      var achternaam = loggedInUser.achternaam;
      var geboortedatum = loggedInUser.geboortedatum;
      var email = loggedInUser.email;
      var gebruikerID = loggedInUser.gebruikerID;
      
      console.log("voornaam: ", voornaam);
      console.log("achternaam: ", achternaam);
      console.log("geboortedatum: ", geboortedatum);
      console.log("email: ", email);
      console.log("gebruikerID: ", gebruikerID);
    },
    _onRouteMatched: function(oEvent) {
      var oArgs = oEvent.getParameter("arguments");
      var oView = this.getView();
      var urlPath = "/" + "Gebruikers(gebruikerID=" + oArgs.gebruikerID + ")";
      gebruikerID = oArgs.gebruikerID;

      oView.bindElement({ path: urlPath });
    },
    terug: function() {
      history.back();
    }

  });
}); 