sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/webc/main/Toast",
    "sap/m/MessageBox",
  ],
  function (Controller, JSONModel, Toast, MessageBox) {
    "use strict";

    var user = JSON.parse(localStorage.getItem("user"));

    return Controller.extend("p2bspg1.controller.FeedbackGeven", {
      onInit: function () {
        if (user == null) {
          this.getOwnerComponent().getRouter().navTo("NotFound");
        }
        this.getView().byId("feedback").setValue("");
        this.getView().byId("ratingIndicator").setValue(3);
      },
      onCancel: function () {
        // Redirect to Home page
        window.history.back();
      },

      onSent: function () {
        var feedbackInput = this.getView().byId("feedback"),
          ratingIndicator = this.getView().byId("ratingIndicator"),
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        // Get the values
        var feedback = feedbackInput.getValue();
        var stars = ratingIndicator.getValue();

        // Message box page
        if (!feedback) {
          MessageBox.error(
            oResourceBundle.getText("FeedbackGevenFeedbackEmpy")
          );
          return;
        } else {
          var odatamodel = this.getView().getModel("v2model");
          var inschrijvingID = this.getInschrijvingsID();

          var oForm = {
            gebruikerID_gebruikerID: user.gebruikerID,
            inschrijvingID_inschrijvingID: inschrijvingID,
            feedback: feedback,
            aantalSterren: stars,
          };


          odatamodel.create("/Scores", oForm, {
            success: function (data, response) {
              MessageBox.success(
                oResourceBundle.getText("feedbackGevenSucces"),
                {
                  onClose: function () {
                    history.back();
                  },
                }
              );
            },
            error: function (error) {
              MessageBox.error(oResourceBundle.getText("feedbackGevenError"));
            },
          });
        }
      },

      getInschrijvingsID: function () {
        var oComponent = this.getOwnerComponent();
        var oRouter = oComponent.getRouter();
        var oArgs = oRouter.getHashChanger().getHash().split("/");
        return parseInt(oArgs[oArgs.length - 1], 10);
      },
    });
  }
);
