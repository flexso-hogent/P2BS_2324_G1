sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("p2bspg1.controller.App", {
      onInit: function () {
        var oUv1 = this.byId("uv1"),
          oUv2 = this.byId("uv2"),
          oAv1 = this.byId("av1"),
          oAv3 = this.byId("av3"),
          oLoggedOut = this.byId("loginView");

        if (localStorage.getItem("user") == null) {
          oLoggedOut.setVisible(true);
        } else if (localStorage.getItem("user").includes('"rol":"admin"')) {
          oAv1.setVisible(true);
          oAv3.setVisible(true);

          oUv1.setVisible(true);
          oUv2.setVisible(true);
        } else if (localStorage.getItem("user").includes('"rol":"user"')) {
          oUv1.setVisible(true);
          oUv2.setVisible(true);
        }
      },
      onCollapseExpandPress() {
        const oSideNavigation = this.byId("sideNavigation"),
          bExpanded = oSideNavigation.getExpanded();

        oSideNavigation.setExpanded(!bExpanded);
      },
      onLogoPressed() {
        this.getOwnerComponent().getRouter().navTo("StartScreen");
      },
      onAvatarPressed: function () {
        window.location.href = "#/Profiel";
      },
      onLogOut: function () {
        localStorage.removeItem("user");
        window.location.href = "#/Login";
        window.location.reload();
      },
    });
  }
);
