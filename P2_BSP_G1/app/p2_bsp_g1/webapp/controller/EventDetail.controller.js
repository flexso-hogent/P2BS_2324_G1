sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
  ],
  function (Controller, MessageToast, MessageBox, Filter) {
    "use strict";

    var user = JSON.parse(localStorage.getItem("user"));

    return Controller.extend("p2bspg1.controller.EventDetail", {
      iAantalInschrijvingen: 0,

      onInit: function () {
        if (!user) {
          MessageBox.error("U moet ingelogd zijn om deze pagina te bekijken", {
            onClose: function () {
              window.location.href = "#/Login";
            },
          });
        }
        this.oOwnerComponent = this.getOwnerComponent();
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter
          .getRoute("EventDetail")
          .attachPatternMatched(this._onRouteMatched, this);

        var oAv0 = this.byId("av0"),
          oAv1 = this.byId("av1"),
          oAv2 = this.byId("av2"),
          oAv3 = this.byId("av3"),
          oAv4 = this.byId("av4");
        if (!user == null || user.rol == "admin") {
          oAv0.setVisible(true);
          oAv1.setVisible(true);
          oAv2.setVisible(true);
          oAv3.setVisible(true);
          oAv4.setVisible(true);
        }

        var odatamodel = this.getView().getModel("v2model");
        // if (!odatamodel) {
        //     // Toon een foutmelding of voer andere logica uit als het model niet beschikbaar is
        //     console.error("Model 'v2model' is niet beschikbaar!");
        //     return;
        // }

        
      },

      onAfterRendering: function () {
        // this.fetchMaxAantalInschrijvingen();
        this.updateAantalInschrijvingen();
      },

      

      fetchMaxAantalInschrijvingen: async function () {
        var that = this;
        var sHash = window.location.hash;
    
        var aHashParts = sHash.split("/");
        var eventId = aHashParts[aHashParts.length - 1];
        // var eventId = this.getView()
        //   .getBindingContext()
        //   .getProperty("evenementID");
        // var eventId = await this.getView().getBindingContext().getProperty("evenementID");
        var odatamodel = this.getView().getModel("v2model");
        console.log("Event ID fetch inschr:", eventId);

        odatamodel.read("/Evenementen(" + eventId + ")", {
          success: function (oData) {
            console.log("Evenement oData:", oData);
            console.log("Maximaal aantal inschrijvingen oData:", oData.maxAantalInschrijvingen);
            that.maxAantalInschrijvingen = oData.maxAantalInschrijvingen;
            console.log(
              "Maximaal aantal inschrijvingen: ",
              that.maxAantalInschrijvingen
            );
          },
          error: function (error) {
            console.error(
              "Fout bij het ophalen van maximale aantal inschrijvingen:",
              error
            );
            MessageBox.error(
              "Fout bij het ophalen van maximale aantal inschrijvingen."
            );
          },
        });
      },

      updateAantalInschrijvingen: function () {
        var that = this;
        var beschikbareSessies = this.getView().byId("personalSS1");
        var sessionID = 1;
        var odatamodel = this.getView().getModel("v2model");
        var filter = new sap.ui.model.Filter(
          "sessieID_sessieID",
          sap.ui.model.FilterOperator.EQ,
          sessionID
        );

        odatamodel.read("/Inschrijvingen", {
          filters: [filter],
          success: function (oData) {
            that.iAantalInschrijvingen = oData.results.length;
            console.log("Aantal inschrijvingen:", that.iAantalInschrijvingen);
          },
          error: function (error) {
            console.log("Error fetching inschrijvingen:", error);
            MessageBox.error("Foutje bij het ophalen van inschrijvingen.");
          },
        });
      },

      onBeforeRendering: function () {
        this.checkUserSignUp();
      },

      checkUserSignUp: function (sessionID) {
        if (!sessionID) {
          return;
        }
        var that = this;
        var button = this.getView().byId("signUpButton"); 
        console.log(button.getText());
        var odatamodel = this.getView().getModel("v2model");

        // Filter om te controleren of de gebruiker al is ingeschreven voor deze sessie
        var filter = new sap.ui.model.Filter(
          "gebruikerID_gebruikerID",
          sap.ui.model.FilterOperator.EQ,
          user.gebruikerID
        );
    
        odatamodel.read("/Inschrijvingen", {
          filters: [filter],
          success: function (oData) {
              console.log(sessionID);
              console.log("checkUserSignUp results", oData.results);
              var bRegistered = false;
              oData.results.forEach(function (registration) {
                console.log("registration", registration);
                  if (registration.sessieID_sessieID === sessionID) {
                      bRegistered = true;
                      return;
                  }
              });
      
              if (bRegistered) {
                console.log("registered yes");
                  // User is already registered for this session
                  button.setText("Uitschrijven voor deze sessie");
                  console.log("button text registered", button.getText());
                  button.setType("Reject");
              } else {
                console.log("registered no");
                console.log("button text not registered", button.getText());
              }
            
          },
          error: function (error) {
            console.log("Error fetching inschrijvingen:", error);
            MessageBox.error(
              "Er is een fout opgetreden bij het controleren van uw inschrijving. Probeer het opnieuw!"
            );
          },
        });
        
      },

      signUp: function (evt) {
        var button = evt.getSource();
        var buttonText = button.getText();
        var sessionID = button.getBindingContext().getProperty("sessieID");
        console.log("signupSessionID", sessionID);

        if (buttonText === "Uitschrijven voor deze sessie") {
          this.cancelSignUp(sessionID, button);
        } else {
          this.registerForSession(sessionID, button);
        }
        this.updateAantalInschrijvingen();
      },

      registerForSession: function (sessionID, button) {
        var odatamodel = this.getView().getModel("v2model");
        var alreadysignedup = false;

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
            console.log("Inschrijvingen odata results", oData.results);
            oData.results.forEach((e) => {
              if (
                e.gebruikerID_gebruikerID == user.gebruikerID &&
                e.sessieID_sessieID == sessionID
              ) {
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
            oData.results.forEach((e) => {
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
        this.updateAantalInschrijvingen();
      },

      _onRouteMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");
        var oView = this.getView();
        var urlPath =
          "/" + "Evenementen(evenementID=" + oArgs.evenementID + ")";

        oView.bindElement({ path: urlPath });
        this.checkActiveEvent(oArgs.evenementID);
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
        var evenementID = this.getView()
          .getBindingContext()
          .getProperty("evenementID");
        window.location.href = "#/Feedback/" + evenementID;
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
        var oRouter = this.getOwnerComponent().getRouter();
        var sHash = window.location.hash;

        var aHashParts = sHash.split("/");
        var sEventId = aHashParts[aHashParts.length - 1];
        console.log(sEventId);

        // Navigate to "EditEvent" route without full page reload
        oRouter.navTo(
          "EditEvent",
          {
            EvenementID: sEventId,
          },
          /* bReplace */ false
        );
      },

      onTerug: function () {
        history.back();
      },
      checkActiveEvent: function (id) {
        var odatamodel = this.getView().getModel("v2model");

        var that = this;
        odatamodel.read("/Evenementen(" + id + ")", {
          success: function (oData) {
            if (oData.actief) {
              that.getView().byId("av0").setType("Reject");
              that.getView().byId("personalSS1").setVisible(true);
              that.zichtbaarheid = true;
            } else {
              that.getView().byId("av0").setType("Accept");
              that.getView().byId("personalSS1").setVisible(false);
              that.zichtbaarheid = false;
            }
          },
          error: function (error) {
            console.error(
              "Fout bij het ophalen van actieve status van evenement:",
              error
            );
            MessageBox.error(
              "Fout bij het ophalen van actieve status van evenement."
            );
          },
        });
      },
      onDeactivate: function (button) {
        var button = this.getView().byId("av0");
        var beschikbareSessies = this.getView().byId("personalSS1");
        var odatamodel = this.getView().getModel("v2model");
        var that = this;
        if (this.zichtbaarheid) {
          button.setType("Accept");
          beschikbareSessies.setVisible(false);
          this.zichtbaarheid = false;

          odatamodel.update(
            "/Evenementen(" +
              this.getView().getBindingContext().getProperty("evenementID") +
              ")",
            {
              actief: false,
            }
          );
        } else {
          button.setType("Reject");
          beschikbareSessies.setVisible(true);
          this.zichtbaarheid = true;
          odatamodel.update(
            "/Evenementen(" +
              this.getView().getBindingContext().getProperty("evenementID") +
              ")",
            {
              actief: true,
            }
          );
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
      myCustomFormatterFunction: function (beginDatum, beginUur) {
        try {
          var oDate = new Date(beginDatum);
          var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd",
            UTC: true,
          }).format(oDate);

          if (beginUur) {
            var aTime = beginUur.split(":");
            var formattedTime = aTime[0] + ":" + aTime[1];

            var formattedDateTime = formattedDate + " " + formattedTime;

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
