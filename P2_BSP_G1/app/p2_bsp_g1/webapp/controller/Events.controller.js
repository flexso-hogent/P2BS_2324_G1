sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("p2bspg1.controller.Events", {
        onSearchNaam: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("eventsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery) {
                var nQuery = parseInt(sQuery);
        
                if (!isNaN(nQuery)) {
                    var oEvenementIDFilter = new sap.ui.model.Filter({
                        path: 'evenementID',
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: nQuery
                    });
        
                    aFilters.push(oEvenementIDFilter);
                }
        
                var oNaamFilter = new sap.ui.model.Filter({
                    path: 'naam',
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: sQuery
                });
        
                aFilters.push(oNaamFilter);
            }
        
            var oCombinedFilter = new sap.ui.model.Filter({
                filters: aFilters,
                and: false
            });
        
            oBinding.filter(oCombinedFilter);
        },
        

        onSearchLocation: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("eventsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];

            if (sQuery) {
                var oFilter = new Filter("locatie", FilterOperator.Contains, sQuery);
                aFilters.push(oFilter);
            }

            oBinding.filter(aFilters);
        },

        onSearchBeginDate: function(oEvent) {
            var sQuery = oEvent.getParameter("value");
            var oTable = this.byId("eventsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
        
            if (sQuery) {
                var oFilter = new sap.ui.model.Filter("beginDatum", sap.ui.model.FilterOperator.EQ, sQuery);
                aFilters.push(oFilter);
            }
        
            oBinding.filter(aFilters);
        },

        onSearchEndDate: function(oEvent) {
            var sQuery = oEvent.getParameter("value");
            var oTable = this.byId("eventsTable");
            var oBinding = oTable.getBinding("items");
            var aFilters = [];
        
            if (sQuery) {
                var oFilter = new sap.ui.model.Filter("beginDatum", sap.ui.model.FilterOperator.EQ, sQuery);
                aFilters.push(oFilter);
            }
        
            oBinding.filter(aFilters);
        },
        

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var oModel = oTable.getModel();
            var oLabel = this.byId("idFilterLabel");
            var oInfoToolbar = this.byId("idInfoToolbar");
            var aSelectedItems = oTable.getSelectedItems();

            // Update UI
            oInfoToolbar.setVisible(aSelectedItems.length > 0);
            oLabel.setText(aSelectedItems.length + " selected");
        },
    });
});
