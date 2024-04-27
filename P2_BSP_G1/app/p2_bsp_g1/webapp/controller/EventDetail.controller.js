sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"],
  function (Controller, MessageToast, MessageBox) {
    "use strict";

    var user = JSON.parse(localStorage.getItem("user"));

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
        if(!user == null || user.rol == "admin"){
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
          this.cancelSignUp(sessionID, button);
        } else {
          this.registerForSession(sessionID, button);
        }
      },

      registerForSession: function (sessionID, button) {
        var odatamodel = this.getView().getModel("v2model");
        var alreadysignedup = false;

        var filter = new sap.ui.model.Filter([
          new sap.ui.model.Filter(
            "gebruikerID/gebruikerID",
            sap.ui.model.FilterOperator.EQ,
            user.gebruikerID
          ),
          new sap.ui.model.Filter(
            "sessieID/sessieID",
            sap.ui.model.FilterOperator.EQ,
            sessionID
          ),
        ]);
        odatamodel.read("/Inschrijvingen", {
          filters: [filter],
          success: function (oData) {
            oData.results.forEach(e => {
              if (e.gebruikerID_gebruikerID == user.gebruikerID) {
                alreadysignedup = true;
              }
            });
            if (alreadysignedup === false) {
              var oData = {
                gebruikerID: {
                  gebruikerID: user.gebruikerID,
                },
                sessieID: {
                  sessieID: sessionID,
                },
              };
              odatamodel.create("/Inschrijvingen", oData, {
                success: function (data, response) {
                  console.log("ingeschreven");
                  MessageBox.success(
                    "U bent succesvol ingeschreven voor deze sessie!"
                  );
                  button.setText("Uitschrijven voor deze sessie");
                  button.setType("Reject");
                },
                error: function (error) {
                  console.log("niet gelukt");
                  MessageBox.error(
                    "Het is niet gelukt om u in te schrijven voor deze sessie. Probeer het opnieuw!"
                  );
                },
              });
            } else {
              MessageBox.error(
                "U bent al ingeschreven voor deze sessie. U kunt zich niet nogmaals inschrijven."
              );
              button.setText("Uitschrijven voor deze sessie");
              button.setType("Reject");
            }
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error("Niet gelukt om inschrijvingen op te halen.");
          },
        });

        
      },

      cancelSignUp: function (sessionID, button) {
        var odatamodel = this.getView().getModel("v2model");

        // Zoek de inschrijving die overeenkomt met de huidige gebruiker en sessie
        var filter = new sap.ui.model.Filter([
          new sap.ui.model.Filter(
            "gebruikerID_gebruikerID",
            sap.ui.model.FilterOperator.EQ,
            user.gebruikerID
          ),
          new sap.ui.model.Filter(
            "sessieID_sessieID",
            sap.ui.model.FilterOperator.EQ,
            sessionID
          ),
        ]);

        odatamodel.read("/Inschrijvingen", {
          filters: [filter],
          success: function (oData) {
            var inschrijvingID = 0;
            oData.results.forEach(e => {
              if (e.gebruikerID_gebruikerID == user.gebruikerID) {
                inschrijvingID = e.inschrijvingID;
              }
            });
            odatamodel.remove("/Inschrijvingen(" + inschrijvingID + ")", {
              success: function (data, response) {
                console.log("uitgeschreven");
                MessageBox.success(
                  "U bent succesvol uitgeschreven voor deze sessie!"
                );
                button.setText("Registreer voor deze sessie");
                button.setType("Emphasized");
              },
              error: function (error) {
                console.log("niet gelukt");
                MessageBox.error(
                  "Het is niet gelukt om u uit te schrijven voor deze sessie. Probeer het opnieuw!"
                );
              },
            });
          },
          error: function (error) {
            console.log("Error fetching inschrijving:", error);
            MessageBox.error(
              "Er is een fout opgetreden bij het ophalen van uw inschrijving. Probeer het opnieuw!"
            );
          },
        });
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        var urlPath =
          "/" + "Evenementen(evenementID=" + oArgs.evenementID + ")";

        oView.bindElement({ path: urlPath });
      },

      handleListItemPress: function (oEvent) {
        var oSelectedItem = oEvent.getSource().getBindingContext();
        var sSessieID = oSelectedItem.getProperty("sessieID");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("SessieDetail", {
          sessieID: sSessieID,
        });
      },

      addSessie: function () {
        var evenementID = this.getView()
          .getBindingContext()
          .getProperty("evenementID");
        window.location.href = "#/Sessies#/new/" + evenementID;
      },

      seeFeedback: function () {
        // window.location.href = "#/Feedback#/" + evenementID;
      },

      editEvent: function () {
        // window.location.href = "#/Evenementen#/edit/" + evenementID;
      },

      deleteEvent: function () {
        var odatamodel = this.getView().getModel("v2model");
        var evenementID = this.getView()
          .getBindingContext()
          .getProperty("evenementID");

        odatamodel.remove("/Evenementen(" + evenementID + ")", {
          success: function (data, response) {
            console.log("gelukt");
            MessageBox.success("Het evenement is succesvol verwijderd!", {
              onClose: function () {
                window.location.href = "#/Events";
              },
            });
          },
          error: function (error) {
            console.log("niet gelukt");
            MessageBox.error(
              "Het is niet gelukt om het evenement te verwijderen. Probeer het opnieuw!"
            );
          },
        });
      },
      onEventPressEdit: function (EvenementID) {
        var sHash = window.location.hash;

        var aHashParts = sHash.split("/");
        var sEventId = aHashParts[aHashParts.length - 1];
        this.getOwnerComponent().getRouter().navTo("EditEvent", {
            EvenementID: sEventId
        });
      },
    });
  }
);
