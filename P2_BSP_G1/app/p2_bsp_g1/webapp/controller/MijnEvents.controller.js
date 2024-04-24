sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function(Controller, MessageBox) {
    "use strict";

    return Controller.extend("p2bspg1.controller.MijnEvents", {
        
        onInit: function () {
            if (
                localStorage.getItem("user") == null ||
                !localStorage.getItem("user").includes('"rol":"user"')
              ) {
                this.getOwnerComponent().getRouter().navTo("NotFound");
              }
        },
        
        handleListPress: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var oContext = oSelectedItem.getBindingContext();
            var sEventNaam = oContext.getProperty("naam");
            var sEventLocatie = oContext.getProperty("locatie");
            var sBeschikbareSessies = oContext.getProperty("beschikbareSessies");

            // Toon een dialoogvenster met de details van het geselecteerde evenement
            MessageBox.show("Geselecteerd Evenement:\n" +
                            "Naam: " + sEventNaam + "\n" +
                            "Locatie: " + sEventLocatie + "\n" +
                            "Beschikbare Sessies: " + sBeschikbareSessies, {
                title: "Evenement Details",
                actions: [MessageBox.Action.OK]
            });
        },

        formatBeschikbareSessies: function(sessies) {
            // Implementeer hier de logica om de beschikbare sessies te formatteren
            // bijvoorbeeld: sessies.join(", ")
            return sessies;
        }

    });
});
