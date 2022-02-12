({

    refreshValues: function(component, helper) {

        // console.log("refreshValues called");
        var cryptoTypeToDisplay = component.get("v.cryptoTypeToDisplay");
        // console.log("refreshValues:");
        // console.log(cryptoTypeToDisplay);
        
        // console.log("getting getApiValues");
        var action = component.get("c.getApiValues");
        // console.log("getApiValues got");
        action.setParams({
            "cryptoToGet": cryptoTypeToDisplay            
        })
        // console.log("setting callback");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var returnMap = response.getReturnValue();
                console.log('inside callback: ' + returnMap['price']);
                component.set("v.priceToDisplay", returnMap['price']);
                component.set("v.open24", returnMap['open24']);
                component.set("v.change24", returnMap['change24']);
                component.set("v.changepct24", returnMap['changepct24']);
                component.set("v.high24", returnMap['high24']);
                component.set("v.low24", returnMap['low24']);
                component.set("v.volume24", returnMap['volume24']);
                component.set("v.volume24to", returnMap['volume24to']);
                component.set("v.lastupdated", returnMap['lastupdated']);
            }
            else {
                console.log("Failed with state: " + state);
            }
            
        });
        // console.log("queuing refreshValues");
        $A.enqueueAction(action);
        // console.log("refreshValues complete");     
    }
})