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
            onCollapseExpandPress() {
                const oSideNavigation = this.byId("sideNavigation"),
                    bExpanded = oSideNavigation.getExpanded();
    
                oSideNavigation.setExpanded(!bExpanded);
            },
            onLogoPressed(){
                this.getOwnerComponent().getRouter().navTo("StartScreen");
            },
            onAvatarPressed: function(){
                window.location.href = "#/Profiel";
            }
        });
    });
