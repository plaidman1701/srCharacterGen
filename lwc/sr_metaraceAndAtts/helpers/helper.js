import { sendEvt, BASE_ATTS, sendUpdateEvent, Enums } from "c/sr_jsModules";

let helper = {
    // setInitValues: (cmp) => {
    //     BASE_ATTS.forEach(att => {
    //         cmp.selectedChar[att] = cmp.selectedChar[att];
    //     });

    //     cmp.selectedChar.MetaraceTemplate__c = cmp.selectedChar.MetaraceTemplate__c;

    //     // console.log('done setup');
    //     // console.log(JSON.stringify(cmp.selectedOptions));

    // },

    applyAttChange: (cmp, att, value) => {
        cmp.selectedChar[att] = (isNaN(value) ? value : parseInt(value));
    },

    // buildAdjus: (cmp) => {
    //     let returnList = [];

    //     // metarace
    //     if (!!cmp.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]) {
    //         returnList = returnList.concat(cmp.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]);
    //     }

    //     // helper.buildBonusEffects(this, returnList);

    //     return returnList;
    // },


    // buildAdjuEffects: (cmp) => {
    //     let returnObj = {
    //         adjuListText: [],
    //         atts: {}
    //     };

    //     helper.buildAdjus(cmp).forEach(adju => {
    //         // add to text list
    //         returnObj.adjuListText.push(adju.Description__c);

    //         // attributes
    //         if (adju.Category__c === "Attribute") {
    //             console.log(JSON.stringify(adju));
    //             if (!returnObj.atts[adju.Field__c]) {
    //                 returnObj.atts[adju.Field__c] = { natural: 0, bonus: 0 };
    //             }

    //             if (adju.Bonus__c) {
    //                 returnObj.atts[adju.Field__c].bonus += adju.Value__c;
    //             } else {
    //                 returnObj.atts[adju.Field__c].natural += adju.Value__c;
    //             }
    //         }
    //     });

    //     return returnObj;
    // },

    sendEvt: (cmp) => {
        //let payload = { ...cmp.selectedOptions };
        // console.log('sending payload:');
        // console.log(JSON.stringify(cmp.selectedOptions));

        //sendEvt(cmp, "metarace_and_atts", payload);

        console.log('sendUpdateEvent pre');
        sendUpdateEvent(cmp, Enums.Character, cmp.selectedChar);
        console.log('sendUpdateEvent post');

        // console.log('sent payload');
    }

};


export default helper;