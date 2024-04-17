sap.ui.define([
  "sap/ui/core/mvc/Controller"

], function(Controller, ) {
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
			}

    });
});
