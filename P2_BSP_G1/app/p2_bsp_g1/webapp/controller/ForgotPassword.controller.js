sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox",],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("p2bspg1.controller.ForgotPassword", {
      onInit: function () {
        var oForgotPassword = {
          gebruikerID: 0,
          email: "",
          wachtwoord: "",
        };
        var oModel = new JSONModel(oForgotPassword);
        this.getView().setModel(oModel, "form");
      },
    
      onForgotPassword: function() {
        var oForm = this.getView().getModel("form").getData();
        oForm.geboortedatum = new Date(oForm.geboortedatum);

        var odatamodel = this.getView().getModel("v2model");


      }
    });
  });