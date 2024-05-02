sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function(Controller, MessageBox) {
    "use strict";

    var loggedInUser = JSON.parse(localStorage.getItem("user"))
    console.log("Logged in userID: ", loggedInUser.gebruikerID);
   
    return Controller.extend("p2bspg1.controller.MijnEvents", {
        
        onInit: function () {
            if (
                localStorage.getItem("user") == null ||
                !localStorage.getItem("user").includes('"rol":"user"')
              ) {
                this.getOwnerComponent().getRouter().navTo("NotFound");
              }
            this.oOwnerComponent = this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter
                .getRoute("MijnEvents")
                .attachPatternMatched(this._onRouteMatched, this);
            console.log("gelukt");
        },
        
        _onRouteMatched: function(oSessie) {
            var sRouteName = oSessie.getParameter("name");
            if (sRouteName === "MijnEvents") {
                this.refreshPage();
            }
        },

        refreshPage: function() {
            var oTable = this.byId("mijnEventsTable");
            if (oTable) {
                oTable.getBinding("items").refresh();
            }
        },

        handleListPress: function(oEvent) {
            //Naar tablat gaan met sessieDetails
            var oSelectedItem = oEvent.getSource().getBindingContext();
            var sSessieID = oSelectedItem.getProperty("sessieID");
    
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("SessieDetail", {
              sessieID: sSessieID,
            });
        }            
    });
});
