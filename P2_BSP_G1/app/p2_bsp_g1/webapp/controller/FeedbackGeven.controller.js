sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/webc/main/Toast",
  "sap/m/MessageBox"
], function(Controller, JSONModel, Toast, MessageBox) {
	"use strict";

  var user = JSON.parse(localStorage.getItem("user"));

	return Controller.extend("p2bspg1.controller.FeedbackGeven", {

		onInit: function() {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
			this.getView().setModel(oModel);
      if (user == null) {
        this.getOwnerComponent().getRouter().navTo("NotFound");
      }
      
		},
		handleChange: function(oEvent) {
			var demoToast = this.getView().byId("demoToast");
			demoToast.setText("Event change fired.");
			demoToast.show();
		},
    onCancel: function() {
      // Redirect to Home page
      window.location.href = "#/";
    },

    onSent: function() {
        var feedbackInput = this.getView().byId("feedback");
        var ratingIndicator = this.getView().byId("ratingIndicator");

        // Get the values
        var feedback = feedbackInput.getValue();  
        var stars = ratingIndicator.getValue();

        // Message box page
        if (!feedback) {
          MessageBox.error("Feedback is niet verzonden. Vul feedback in.");
          return;
        } else {
          var odatamodel = this.getView().getModel("v2model");
          var inschrijvingID = this.getInschrijvingsID();
          console.log("inschrijvingID", inschrijvingID);
          
          var oForm = {
            "gebruikerID_gebruikerID": user.gebruikerID, 
            "inschrijvingID_inschrijvingID": inschrijvingID,
            "feedback": feedback,
            "aantalSterren": stars,
          }

          console.log("oForm", oForm);

        odatamodel.create("/Scores", oForm, {
          success: function (data, response) {
            MessageBox.success("Feedback met " + stars + " sterren is verzonden.", {
              onClose: function () {
                history.back();
              },
            });
          },
          error: function (error) {
            MessageBox.error(
              "Het is niet gelukt om uw feedback aan te maken, probeer opnieuw!"
            );
          },
        });
          // MessageBox.success("Feedback met " + stars + " sterren is verzonden.",
          //   {
          //     onClose: function () {
          //       window.location.href = "#/";
          //     },
          //   }); 
        }
    },

    getInschrijvingsID: function() {
      var oComponent = this.getOwnerComponent();
          var oRouter = oComponent.getRouter();
          var oArgs = oRouter.getHashChanger().getHash().split("/");
          console.log(oArgs);
          return parseInt(oArgs[oArgs.length - 1], 10);
    }
	});
});