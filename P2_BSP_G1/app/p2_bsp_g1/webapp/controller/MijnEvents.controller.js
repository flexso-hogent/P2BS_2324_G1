sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
  ],
  function (Controller, MessageBox, Filter, Sorter) {
    "use strict";
    var user = JSON.parse(localStorage.getItem("user"));
    window.onload = function () {
      window.location.reload();
    };

    return Controller.extend("p2bspg1.controller.MijnEvents", {
      onInit: function () {
        if (user == null) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("MijnEvents")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function (oEvent) {
        var oFilter = new Filter(
          "gebruikerID_gebruikerID",
          sap.ui.model.FilterOperator.EQ,
          user.gebruikerID
        );
        this.getView()
          .byId("InschrijvingTable")
          .getBinding("items")
          .filter([oFilter]);

        // Custom sorter function
        var oTable = this.getView().byId("InschrijvingTable");
        var oBinding = oTable.getBinding("items");
        oBinding.sort(new Sorter("sessieID/evenement/beginDatum", false)); // Sort on 'datum'
        oBinding.sort(new Sorter("sessieID/datum", false));
        oBinding.sort(new Sorter("sessieID/beginUur", false));
        oBinding.sort(new Sorter("sessieID/naam", false));
        oBinding.sort(new Sorter("sessieID/evenement/naam", true, true));
      },

      handleListPress: function (oEvent) {
        var oSelectedItem = oEvent.getSource().getBindingContext();

        var sEventID = oSelectedItem.getProperty("sessieID/sessieID");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("SessieDetail", {
          sessieID: sEventID,
        });
      },
    });
  }
);
