sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/Filter"],
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
        
        this.zichtbaarheid = true;        // this.checkUserSignUp();

        var odatamodel = this.getView().getModel("v2model");
        if (!odatamodel) {
            // Toon een foutmelding of voer andere logica uit als het model niet beschikbaar is
            console.error("Model 'v2model' is niet beschikbaar!");
            return;
        }

        this.fetchMaxAantalInschrijvingen();
        this.updateAantalInschrijvingen();
      },

      

      fetchMaxAantalInschrijvingen: function () {
        var that = this;
        var eventId = this.getView().getBindingContext().getProperty("evenementID");
        var odatamodel = this.getView().getModel("v2model");

        odatamodel.read("/Evenementen(" + eventId + ")", {
          success: function (oData) {
            that.maxAantalInschrijvingen = oData.maxAantalInschrijvingen;
            console.log("Maximaal aantal inschrijvingen: ", that.maxAantalInschrijvingen);
          },
          error: function (error) {
            console.error("Fout bij het ophalen van maximale aantal inschrijvingen:", error);
            MessageBox.error("Fout bij het ophalen van maximale aantal inschrijvingen.");
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

      onBeforeRendering: function(){
        this.checkUserSignUp();
      },

      checkUserSignUp: function () {
        var that = this;
        var beschikbareSessies = this.getView().byId("personalSS1");
        console.log("beschikbareSessies", beschikbareSessies);
        var sessionID = 1;
        var button = this.getView().byId("signUpButton"); // ID van de knop die moet worden gecontroleerd
        button.setText("testerrr")
        var odatamodel = this.getView().getModel("v2model");
    
        // Filter om te controleren of de gebruiker al is ingeschreven voor deze sessie
        var filter = new sap.ui.model.Filter(
          "gebruikerID_gebruikerID",
          sap.ui.model.FilterOperator.EQ,
          user.gebruikerID
        );
        
        // var sessieFilter = new sap.ui.model.Filter(
        //     "sessieID_sessieID",
        //     sap.ui.model.FilterOperator.EQ,
        //     sessionID
        // );
        
        // var combinedFilter = new sap.ui.model.Filter({
        //     filters: [gebruikerFilter, sessieFilter],
        //     and: true // Set to true for "AND" condition
        // });
    
        odatamodel.read("/Inschrijvingen", {
          filters: [filter],
          success: function (oData) {
              console.log("checkUserSignUp results", oData.results);
              var bRegistered = false;
              oData.results.forEach(function (registration) {
                  // Check if the user is registered for this session
                  if (registration.sessieID_sessieID === sessionID) {
                      bRegistered = true;
                      return; // Exit the loop early since the user is already registered
                  }
              });
      
              if (bRegistered) {
                  // User is already registered for this session
                  button.setText("Uitschrijven voor deze sessie");
                  button.setType("Reject");
              } else {
                  // User is not registered for this session
                  // Keep the button settings the same
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
            console.log("Inschrijvingen odata results",oData.results);
            oData.results.forEach((e) => {
              if (e.gebruikerID_gebruikerID == user.gebruikerID && e.sessieID_sessieID == sessionID) {
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
        oRouter.navTo("EditEvent", {
            EvenementID: sEventId
        }, /* bReplace */ false);
      },
    
      onTerug: function () {
        history.back();
      },
      onDeactivate: function(button) {
        var button = this.getView().byId("av0");
        var beschikbareSessies = this.getView().byId("personalSS1");
        if (this.zichtbaarheid) {
          button.setText("Activeer evenement"); 
          button.setType("Accept");
          beschikbareSessies.setVisible(false);
          this.zichtbaarheid = false;
        }
        else {
          button.setText("Deactiveer evenement");
          button.setType("Reject");
          beschikbareSessies.setVisible(true);
          this.zichtbaarheid = true;
        }
      },
      myCustomFormatterFunction2: function(beginUur, eindUur) {
        try {
      
          if (beginUur && eindUur) {
            var aTime = beginUur.split(':');
            var formattedTime = aTime[0] + ':' + aTime[1];

            var bTime = eindUur.split(':');
            var formattedTime2 = bTime[0] + ':' + bTime[1];
      
            var formattedDateTime = formattedTime + ' - ' + formattedTime2;
      
            return formattedDateTime;
          } else {
            return "Invalid time";
          }
        } catch (error) {
          console.error("Error formatting date and time:", error);
          return "Error formatting date and time";
        }
      },
      myCustomFormatterFunction: function(beginDatum, beginUur) {
        try {
          var oDate = new Date(beginDatum);
          var formattedDate = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd",
            UTC: true
          }).format(oDate);
      
          if (beginUur) {
            var aTime = beginUur.split(':');
            var formattedTime = aTime[0] + ':' + aTime[1];
      
            var formattedDateTime = formattedDate + ' ' + formattedTime;
      
            return formattedDateTime;
          } else {
            return "Invalid time";
          }
        } catch (error) {
          console.error("Error formatting date and time:", error);
          return "Error formatting date and time";
        }
      }
    });
  }
);
