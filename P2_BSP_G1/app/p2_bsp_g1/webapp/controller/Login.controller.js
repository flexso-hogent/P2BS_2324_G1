sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  function (Controller, MessageBox) {
    "use strict";

    // Refreshen van pagina als er naar gegaan wordt
    window.onload = function () {
      window.location.reload();
    };

    return Controller.extend("p2bspg1.controller.Login", {
      onInit: function () {
        // Initialization code if needed
        if (localStorage.getItem("user")) localStorage.removeItem("user");

        document.addEventListener("keydown", this.onKeyPress.bind(this));
      },

      onKeyPress: function (event) {
        if (event.key === "Enter") {
          this.onLogin();
        }
      },

      onLogin: function () {
        var odatamodel = this.getView().getModel("v2model"),
          oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
          email = this.getView().byId("email").getValue(),
          password = this.getView().byId("wachtwoord").getValue(),
          passwordCorrect = false;

        // Validate email and password
        if (!email || !password) {
          MessageBox.error(oResourceBundle.getText("nietIngevuld"));
          return;
        }
        odatamodel.read("/Gebruikers", {
          success: function (data, response) {
            data.results.forEach(function (e) {
              if (e.email === email && e.wachtwoord === password) {
                passwordCorrect = true;
                var user = data.results.map(function (item) {
                  return {
                    email: item.email,
                    wachtwoord: item.wachtwoord,
                  };
                });
                MessageBox.success(oResourceBundle.getText("loginSucces"));
                localStorage.setItem("user", JSON.stringify(e));
                setTimeout(function () {
                  window.location.href =
                    "http://localhost:4004/p2_bsp_g1/webapp/index.html#";
                  window.location.reload();
                }, 2000);
              }
            });
            if (!passwordCorrect) {
              MessageBox.error("Invalid email or password.");
              this.getView().byId("wachtwoord").setValue("");
            }
          }.bind(this),
          error: function (error) {
            MessageBox.error(oResourceBundle.getText("loginError"));
          },
        });
      },

      onSeePassword: function () {
        var oInput = this.getView().byId("wachtwoord");
        var oIcon = this.getView().byId("icon");

        if (oInput.getType() === "Password") {
          oInput.setType("Text");
          oIcon.setIcon("sap-icon://hide");
        } else {
          oInput.setType("Password");
          oIcon.setIcon("sap-icon://show");
        }
      },

      onRegister: function () {
        window.location.href = "#/Registreer/";
      },
    });
  }
);
