sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("p2bspg1.controller.App", {
      onInit: function () {
        if (
          localStorage.getItem("user") == null ||
          !localStorage.getItem("user").includes('"rol":"admin"')
        ) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
      },
      annuleer() {
        history.back();
      },

      createEvent() {
        this.getOwnerComponent().getRouter().navTo("Events");
      },
    });
  }
);
