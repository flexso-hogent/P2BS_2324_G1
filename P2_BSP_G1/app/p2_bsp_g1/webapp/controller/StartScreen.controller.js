sap.ui.define([
  "sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"

], function(Controller, MessageBox) {
  "use strict";

  return Controller.extend("your.namespace.StartScreen", {
      
      onInit: function() {
          // Initialization code if needed
      },
			onEvents: function() {
				// Redirect to Event page
				window.location.href = "#/Events/";
			},
			onEventsDetails: function() {
				// Redirect to Event page
				window.location.href = "http://localhost:4004/p2_bsp_g1/webapp/index.html#/Events/1";
			}			,
			onEventsNew: function() {
				// Redirect to Event page
				window.location.href = "http://localhost:4004/p2_bsp_g1/webapp/index.html#/Events#/new";
			},
			onOpenDialog: function() {
				MessageBox.success("Op de knop gedrukt");
			},
			onHomePress: function() {
				window.location.href = "#/StartScreen/"
			},
			onLogoutPress: function() {
				window.location.href = "#/Login/"
			},
			onProfilePress: function() {
				var oAvatar = oEvent.getSource();
				
				var csvData = "http://localhost:4004/odata/v4/overview/Gebruikers";
				var lines = csvData.split('\n');
				
				
				for (var i = 1; i < lines.length; i++) {
						var columns = lines[i].split(';'); 
						
						var firstName = columns[1];
						var lastName = columns[2];
						var email = columns[3];
						var fullName = firstName + ' ' + lastName; 

				var oPopover = new Popover({
						title: "Profiel",
						contentWidth: "200px",
						content: [
								new Text({ text: "Naam: " + fullName }),
								new Text({ text: "Email: " + email }),
								new Button({
										text: "Uitloggen",
										press: function() {
												window.location.href = "#/Login/";
												MessageBox.success("U bent uitgelogd.");
										}
								})
						]
				});

				oPopover.openBy(oAvatar);
			}
		}
  });
});
