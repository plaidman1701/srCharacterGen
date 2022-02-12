({
    doInit: function(component, event, helper) {
        
        //console.log("Cryptolistwrapper init");
        
        // Create the action
        var action = component.get("c.getCryptoList");
        
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // console.log("Cryptolistwrapper has list");
                // console.log(response.getReturnValue());
                
                component.set("v.cryptosToList", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        // Send action off to be executed
        $A.enqueueAction(action);
    },


    
})