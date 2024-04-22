sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("p2bspg1.controller.App", {
            onInit: function () {
                // Initialization code if needed
            },
            onCancel: function() {
                window.location.href ="#/StartScreen/"; // Redirect to home page
            },
        });
        
    });
