sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/webc/main/Toast",
  "sap/m/MessageBox"
], function(Controller, JSONModel, Toast, MessageBox) {
	"use strict";

	return Controller.extend("your.namespace.FeedbackGeven", {

		onInit: function() {
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
			this.getView().setModel(oModel);
		},
		handleChange: function(oEvent) {
			var demoToast = this.getView().byId("demoToast");
			demoToast.setText("Event change fired.");
			demoToast.show();
		},
    onCancel: function() {
      // Redirect to Home page
      window.location.href = "#/StartScreen/";
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
          MessageBox.success("Feedback met " + stars + " sterren is verzonden.");
          setTimeout(function() {
            window.location.href = "#/StartScreen/";
          }, 2000);
        }
        
    }

	});
});