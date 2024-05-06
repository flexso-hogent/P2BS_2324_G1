sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("p2bspg1.controller.NotFound", {
            onInit: function () {
            },
            onHome: function () {
                window.location.href = "";
            }
        });
    });
