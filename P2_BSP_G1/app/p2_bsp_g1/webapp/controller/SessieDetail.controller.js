sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox, Filter) {
    "use strict";
    var sessieID;
    var user = JSON.parse(localStorage.getItem("user"));
    return Controller.extend("p2bspg1.controller.SessieDetail", {
      onInit: function () {
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("SessieDetail")
          .attachPatternMatched(this._onRouteMatched, this);

        var oAv3 = this.byId("av3"),
          oAv4 = this.byId("av4");
        if (user === null) {
          var oResourceBundle = this.getView()
            .getModel("i18n")
            .getResourceBundle();
          MessageBox.error(oResourceBundle.getText("inloggenVerplicht"), {
            onClose: function () {
              window.location.href = "#/Login";
            },
          });
        } else if (user.rol === "admin") {
          oAv3.setVisible(true);
          oAv4.setVisible(true);
        }
      },
      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        var urlPath = "/" + "Sessies(sessieID=" + oArgs.sessieID + ")";
        sessieID = oArgs.sessieID;

        oView.bindElement({ path: urlPath });
        this.setRating();
      },
      editSessie: function () {
        this.getOwnerComponent().getRouter().navTo("EditSessie", {
          sessieID: sessieID,
        });
      },
      deleteSessie: function () {
        var odatamodel = this.getView().getModel("v2model"),
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        odatamodel.remove("/Sessies(" + sessieID + ")", {
          success: function (data, response) {
            MessageBox.success(oResourceBundle.getText("sessieRemove"), {
              onClose: function () {
                history.back();
              },
            });
          },
          error: function (error) {
            MessageBox.error(oResourceBundle.getText("sessieRemoveError"));
          },
        });
      },
      onTerug: function () {
        window.history.back();
      },
      setRating: function () {
        var that = this,
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
        var odatamodel = this.getView().getModel("v2model");
        var oFilter = new Filter(
          "inschrijvingID/sessieID_sessieID",
          sap.ui.model.FilterOperator.EQ,
          sessieID
        );

        odatamodel.read("/Scores", {
          filters: [oFilter],
          success: function (oData) {
            var avrRating = 0;
            oData.results.forEach((e) => {
              avrRating += parseInt(e.aantalSterren);
            });
            var length = oData.results.length;
            if (length != 0) {
              avrRating = avrRating / length;
            } else {
              that.byId("rating2").setVisible(false);
              that.byId("geenRecensies").setVisible(true);
            }

            that.byId("rating").setValue(avrRating); // Use that instead of this
            that
              .byId("rating")
              .setTooltip(
                oResourceBundle.getText("rating") +
                  avrRating +
                  " " +
                  oResourceBundle.getText("rating2") +
                  " " +
                  length +
                  " " +
                  oResourceBundle.getText("rating3")
              );
          },
          error: function (error) {
            MessageBox.error(oResourceBundle.getText("ratingFetchError"));
          },
        });

        var oFilter2 = new Filter(
          "sessieID_sessieID",
          sap.ui.model.FilterOperator.EQ,
          sessieID
        );
        odatamodel.read("/Inschrijvingen", {
          filters: [oFilter2],
          success: function (oData) {
            var registrationCount = oData.results.length;
            var maxRegistrations = that
              .getView()
              .getBindingContext()
              .getProperty("maxAantalInschrijvingen");

            var oResourceBundle = that
              .getView()
              .getModel("i18n")
              .getResourceBundle();
            var sButtonText = oResourceBundle.getText("inschrijvingen");

            if (maxRegistrations == 0) {
              that
                .byId("maxInschrijvingenText")
                .setText(registrationCount + " " + sButtonText);
            } else {
              that
                .byId("maxInschrijvingenText")
                .setText(
                  registrationCount + "/" + maxRegistrations + " " + sButtonText
                );
            }
          },
          error: function (error) {
            console.log(error);
            MessageBox.error(oResourceBundle.getText("registrationFetchError"));
          },
        });
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
    });
  }
);
