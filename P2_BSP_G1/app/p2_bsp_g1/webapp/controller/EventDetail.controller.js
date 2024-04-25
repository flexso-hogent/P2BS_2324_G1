sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast) {
    "use strict";

    var geregistreerdeSessies = [];
    var evenementID = 0;

    return Controller.extend("p2bspg1.controller.EventDetail", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("EventDetail")
          .attachPatternMatched(this._onRouteMatched, this);

        var oAv1 = this.byId("av1"),
          oAv2 = this.byId("av2"),
          oAv3 = this.byId("av3"),
          oAv4 = this.byId("av4");
        if (
          !localStorage.getItem("user") === null ||
          localStorage.getItem("user").includes('"rol":"admin"')
        ) {
          oAv1.setVisible(true);
          oAv2.setVisible(true);
          oAv3.setVisible(true);
          oAv4.setVisible(true);
        }
      },
      signUp: function (evt) {
        var button = evt.getSource();
        var buttonText = button.getText();
        var sessionID = button.getBindingContext().getProperty("sessieID");

        if (buttonText === "Uitschrijven voor deze sessie") {
          var index = geregistreerdeSessies.indexOf(sessionID);
          if (index !== -1) {
            geregistreerdeSessies.splice(index, 1);
          }
          MessageToast.show("U bent succesvol uitgeschreven voor deze sessie!");
          button.setText("Registreer voor deze sessie");
          button.setType("Emphasized");
        } else {
          geregistreerdeSessies.push(sessionID);
          MessageToast.show("U bent succesvol ingeschreven voor deze sessie!");
          button.setText("Uitschrijven voor deze sessie");
          button.setType("Reject");
        }
        console.log("Registered sessions:", geregistreerdeSessies);
      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        evenementID = oArgs.evenementID;
        var urlPath =
          "/" + "Evenementen(evenementID=" + oArgs.evenementID + ")";

        oView.bindElement({ path: urlPath });
      },
      handleListItemPress: function (oEvent) {
        var oSelectedItem = oEvent.getSource().getBindingContext();
        //Retrieve the path of the selected item and strip the starting '/'
        //to avoid an invalid URL

        var sSessieID = oSelectedItem.getProperty("sessieID");
        console.log(sSessieID);

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("SessieDetail", {
          sessieID: sSessieID,
        });
        console.log("Done");
      },
      addSessie: function () {
        window.location.href = "#/Sessies#/new/" + evenementID;
      },
      seeFeedback: function () {
      },
      editEvent: function () {
      },
      deleteEvent: function () {
      },
    });
  }
);
