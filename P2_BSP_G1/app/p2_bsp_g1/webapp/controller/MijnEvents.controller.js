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
        var sinschrijvingID = oSelectedItem.getProperty("inschrijvingID");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("FeedbackGeven", {
          inschrijvingID: sinschrijvingID,
        });
      },
     

      //   openQR: function (oEvent) {
      //       var oSelectedItem = oEvent.getSource().getBindingContext();
      //       var sInschrijvingsID = oSelectedItem.getProperty("inschrijvingsID");
      //       var sGebruikerID = oSelectedItem.getProperty("gebruikerID");
      //       var sSessieID = oSelectedItem.getProperty("sessieID");

      //       var qrData = sInschrijvingsID + '-' + sGebruikerID + '-' + sSessieID;
      //       var typeNumber = 4; // Change according to your requirement
      //       var errorCorrectionLevel = 'L'; // Change according to your requirement

      //       // Create QR Code
      //       var qr = QRCodeGenerator(typeNumber, errorCorrectionLevel);
      //       qr.addData(qrData);
      //       qr.make();

      //       // Get QR Code SVG
      //       var svg = qr.createSvgTag();

      //       // Render QR Code in UI
      //       var oQRCodeContainer = this.getView().byId("qrCodeContainer");
      //       oQRCodeContainer.setContent(svg);
      //   }
    });
  }
);
