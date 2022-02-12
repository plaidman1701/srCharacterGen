({
    
    doInit: function(component, event, helper) {
        // console.log("init called");
        
        var intialRefresh = component.get("c.initValues");
        $A.enqueueAction(intialRefresh);
        // console.log("init complete");
    },
    
    initValues: function(component, event, helper) {
        helper.refreshValues(component, helper);
        
        window.setInterval(
            $A.getCallback(function() { 
                helper.refreshValues(component,helper);
            }), 10000
        ); 
    },
    
    
    
})