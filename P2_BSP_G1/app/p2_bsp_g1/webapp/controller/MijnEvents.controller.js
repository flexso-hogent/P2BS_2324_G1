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

        var oTable = this.getView().byId("InschrijvingTable");
        var oBinding = oTable.getBinding("items");
        oBinding.sort(new Sorter("sessieID/evenement/beginDatum", true, true)); // Sort on 'datum'

        console.log(oTable);
      },

      handleListPress: function (oEvent) {
        var oSelectedItem = oEvent.getSource().getBindingContext();
        var sEventID = oSelectedItem.getProperty("sessieID/sessieID");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("SessieDetail", {
          sessieID: sEventID,
        });
      },

      geefFeedback: function (oEvent) {
        var oSelectedItem = oEvent.getSource().getBindingContext();
        var eventDate = oSelectedItem.getProperty(
          "sessieID/evenement/beginDatum"
        );
        var currentDate = new Date();
        var eventDateObj = new Date(eventDate);
        var odatamodel = this.getView().getModel("v2model");

        if (currentDate >= eventDateObj) {
          var sinschrijvingID = oSelectedItem.getProperty("inschrijvingID");

          var filter = new Filter(
            "inschrijvingID_inschrijvingID",
            sap.ui.model.FilterOperator.EQ,
            sinschrijvingID
          );
          var filter2 = new Filter(
            "gebruikerID_gebruikerID",
            sap.ui.model.FilterOperator.EQ,
            user.gebruikerID
          );

          odatamodel.read("/Scores", {
            filters: [filter, filter2],
            success: function (oData) {
              if (oData.results.length > 0) {
                MessageBox.information("U heeft al feedback gegeven");
              } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("FeedbackGeven", {
                  inschrijvingID: sinschrijvingID,
                });
              }
            }.bind(this),
            error: function (oError) {
              MessageBox.error("Er is iets fout gegaan");
            },
          });
        } else {
          MessageBox.information("U kunt pas feedback geven na de sessie");
        }
      },
      myCustomFormatterFunction2: function (beginUur, eindUur) {
        try {
          if (beginUur && eindUur) {
            var aTime = beginUur.split(":");
            var formattedTime = aTime[0] + ":" + aTime[1];

            var bTime = eindUur.split(":");
            var formattedTime2 = bTime[0] + ":" + bTime[1];

            var formattedDateTime = formattedTime + " - " + formattedTime2;

            return formattedDateTime;
          } else {
            return "Invalid time";
          }
        } catch (error) {
          console.error("Error formatting date and time:", error);
          return "Error formatting date and time";
        }
      },
      onBack: function () {
        window.location.href =
          "http://localhost:4004/p2_bsp_g1/webapp/index.html";
      },
    });
  }
);
