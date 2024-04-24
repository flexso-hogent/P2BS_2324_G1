sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function(Controller, MessageBox) {
  "use strict";

  return Controller.extend("p2bspg1.controller.Profiel", {

      onInit: function() {
        if (
          localStorage.getItem("user") == null ||
          !localStorage.getItem("user").includes('"rol":"user"')
        ) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
      }
  });
});
