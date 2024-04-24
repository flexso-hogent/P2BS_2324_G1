sap.ui.define(
  [
    "sap/ui/core/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
  ],
  function (coreLibrary, Controller, JSONModel) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    return Controller.extend("p2bspg1.controller.CreateSessie", {
      onInit: function () {
        if (
          localStorage.getItem("user") == null ||
          !localStorage.getItem("user").includes('"rol":"admin"')
        ) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
      },
      handleLiveChange: function (oEvent) {
        var oTextArea = oEvent.getSource(),
          iValueLength = oTextArea.getValue().length,
          iMaxLength = oTextArea.getMaxLength(),
          sState =
            iValueLength > iMaxLength ? ValueState.Warning : ValueState.None;

        oTextArea.setValueState(sState);
      },

      handleSimpleExceeding: function (oEvent) {
        var oTA = oEvent.getSource();
        oEvent.getParameter("exceeded")
          ? oTA.setValueState(ValueState.Error)
          : oTA.setValueState(ValueState.Success);
      },

      buttonSetShortValuePress: function () {
        this.byId("textAreaWithBinding2").setValue("Small Text");
        this.byId("textAreaWithoutBinding").setValue("Small Text");
      },

      buttonSetLongValuePress: function () {
        var sText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        this.byId("textAreaWithBinding").setValue(sText);
        this.byId("textAreaWithBinding2").setValue(sText);
      },

      buttonToggleShowExceededTextPress: function () {
        var oTA = this.byId("textAreaWithBinding2");
        oTA.setShowExceededText(!oTA.getShowExceededText());
        var oTA = this.byId("textAreaWithoutBinding");
        oTA.setShowExceededText(!oTA.getShowExceededText());
      },
      annuleer() {
        history.back();
      },

      createSessie() {
        history.back();
      },
    });
  }
);
