sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
  "use strict";

  return Controller.extend("p2bspg1.controller.Profiel", {

    onInit: function() {
      var csvFilePath = "http://localhost:4004/odata/v4/overview/Gebruikers";
      var that = this;
  
      var loggedInUser = JSON.parse(localStorage.getItem("user"));
  
      $.ajax({
          url: csvFilePath,
          dataType: "json",
          success: function (data) {
              var userModel = new sap.ui.model.json.JSONModel(data.value);
              that.getView().setModel(userModel, "userModel");
              
              // Iterate over the array of users
              data.value.forEach(function (user) {
              var storedFirstName = user.voornaam;
              var storedLastName = user.achternaam;
              var storedBirthdate = user.geboortedatum;
              var storedEmail = user.email;
              var storedPassword = user.wachtwoord;
              console.log("Stored first name: " + storedFirstName);
              console.log("Stored last name: " + storedLastName);
              console.log("Stored birthdate: " + storedBirthdate);
              console.log("Stored email: " + storedEmail);
              console.log("Stored password: " + storedPassword);

  
                if (loggedInUser) {
                    var currentUser = data.value.find(function(user) {
                        return user.gebruikerID === loggedInUser.gebruikerID;
                    });
                    if (currentUser) {
                        var userModel = new sap.ui.model.json.JSONModel(currentUser);
                        that.getView().setModel(userModel, "currentUser");
                    }
                }
              });  

          },
          error: function () {
              MessageBox.error("Kon geen gebruikersgegevens ophalen.");
          }
        });
    }
  });
});
