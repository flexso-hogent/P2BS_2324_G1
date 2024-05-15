sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/resource/ResourceModel", "sap/ui/core/Fragment", "sap/m/MenuItem", "sap/m/MessageToast"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  async function (Controller, ResourceModel, Fragment, MenuItem, MessageToast) {
    "use strict";

    console.log("voor");
    var user = await JSON.parse(localStorage.getItem("user"));
    console.log("user", user);

    return Controller.extend("p2bspg1.controller.App", {
      onInit: function () {
        console.log("allooo");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .attachRouteMatched(this._onRouteMatched, this);
      },

      onBeforeRendering: function () {
        console.log("before rendering");
        this.showCorrectElementsAndLanguage();
      },

      _onRouteMatched: function () {
        console.log("voor");
        var user = JSON.parse(localStorage.getItem("user"));
        console.log("user", user);
        this.showCorrectElementsAndLanguage();
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
        if (oResoureceModel.sLocale == "nl") {
          this.onLanguageSwitchToEnglish();
        } else {
          this.onLanguageSwitchToDutch();
        }
      },
      onLanguageSwitchToEnglish: function() {
        var oResoureceModel = this.getView().getModel("i18n");
        oResoureceModel.sLocale = "en";
        sap.ui.getCore().getConfiguration().setLanguage("en");
        localStorage.setItem("language", "en");
        this.getView().getModel("i18n").refresh();
      },
      onLanguageSwitchToDutch: function() {
        var oResoureceModel = this.getView().getModel("i18n");
        oResoureceModel.sLocale = "nl";
        sap.ui.getCore().getConfiguration().setLanguage("nl");
        localStorage.setItem("language", "nl");
        this.getView().getModel("i18n").refresh();
      },
      onPress: function () {
				var oView = this.getView(),
					oButton = oView.byId("button");

          console.log(oView.getId());

				if (!this._oMenuFragment) {
					this._oMenuFragment = Fragment.load({
						id: oView.getId(),
						name: "p2bspg1.view.Menu",
						controller: this
					}).then(function(oMenu) {
						oMenu.openBy(oButton);
						this._oMenuFragment = oMenu;
						return this._oMenuFragment;
					}.bind(this));
				} else {
					this._oMenuFragment.openBy(oButton);
				}
			},
			onMenuAction: function(oEvent) {
				var oItem = oEvent.getParameter("item"),
					sItemPath = "";

				while (oItem instanceof MenuItem) {
					sItemPath = oItem.getText();
					oItem = oItem.getParent();
				}
        console.log(sItemPath);


        switch (sItemPath) {
          case "English":
            this.onLanguageSwitchToEnglish();
            break;
          case "Dutch":
            this.onLanguageSwitchToDutch();
            break;
        }

			},
      showCorrectElementsAndLanguage: function(){
        var oUv1 = this.byId("uv1"),
          oUv2 = this.byId("uv2"),
          oUv3 = this.byId("uv3"),
          oAv1 = this.byId("av1"),
          oAv4 = this.byId("av4"),
          oLoggedOut = this.byId("loginView");
        console.log(user);
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
        var language = localStorage.getItem("language");
        if (language == null) {
          this.onLanguageSwitchToDutch();
        } else if(language == "en") {
          this.onLanguageSwitchToEnglish();
        } else {
          this.onLanguageSwitchToDutch();
        }
      }
    });
  }
);
