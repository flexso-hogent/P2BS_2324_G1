sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, ResourceModel) {
    "use strict";

    var user = JSON.parse(localStorage.getItem("user"));

    return Controller.extend("p2bspg1.controller.App", {
      onInit: function () {
        var oUv1 = this.byId("uv1"),
          oUv2 = this.byId("uv2"),
          oUv3 = this.byId("uv3"),
          oAv1 = this.byId("av1"),
          oAv4 = this.byId("av4"),
          oLoggedOut = this.byId("loginView");

        if (user == null) {
          oLoggedOut.setVisible(true);
        } else if (user.rol === "admin") {
          oAv1.setVisible(true);
          oAv4.setVisible(true);
          oUv1.setVisible(true);
          oUv2.setVisible(true);
          oUv3.setVisible(true);
        } else if (user.rol === "user") {
          oUv1.setVisible(true);
          oUv2.setVisible(true);
          oUv3.setVisible(true);
        }
      },
      onCollapseExpandPress() {
        const oSideNavigation = this.byId("sideNavigation"),
          bExpanded = oSideNavigation.getExpanded();

        oSideNavigation.setExpanded(!bExpanded);
      },
      onLogoPressed() {
        window.location.href = "#/";
        window.location.reload();
      },
      onAvatarPressed: function () {
        window.location.href = "#/Profiel";
      },
      onLogOut: function () {
        localStorage.removeItem("user");
        window.location.href = "#/Login";
        window.location.reload();
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
        window.location.href = "#/";
        window.location.reload();
			},
			onLogoutPress: function() {
				window.location.href = "#/Login/"
			},
			onMyEvents: function() {
				window.location.href = "#/MijnEvents/"
			},
			onNewSessie: function() {
				window.location.href = "#/Sessies#/new/1";
			},
      onHandleLanguage: function() {
        var oResoureceModel = this.getView().getModel("i18n");
        if (oResoureceModel.sLocale = null){
          oResoureceModel.sLocale = "nl";
          sap.ui.getCore().getConfiguration().setLanguage("nl");
          this.getView().getModel("i18n").refresh();
        }
        else if (oResoureceModel.sLocale == "nl") {
          this.onLanguageSwitchToEnglish();
        } else {
          this.onLanguageSwitchToDutch();
        }
        console.log(oResoureceModel.sLocale);
      },
      onLanguageSwitchToEnglish: function() {
        var oResoureceModel = this.getView().getModel("i18n");
        oResoureceModel.sLocale = "en";
        sap.ui.getCore().getConfiguration().setLanguage("en");
        this.getView().getModel("i18n").refresh();
      },
      onLanguageSwitchToDutch: function() {
        var oResoureceModel = this.getView().getModel("i18n");
        oResoureceModel.sLocale = "nl";
        sap.ui.getCore().getConfiguration().setLanguage("nl");
        this.getView().getModel("i18n").refresh();
      },
      onHandle:function(){

      }
    });
  }
);
