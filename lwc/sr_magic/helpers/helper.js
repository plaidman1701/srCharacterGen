import { sortByListOrdering, sendEvt } from "c/sr_jsModules";

const spellOrdering = [
    ["Combat"],
    ["Detection"],
    ["Health"],
    ["Illusion"],
    ["Manipulation", "Control Manipulations", "Telekinetic Manipulations", "Transformation Maniplulations"]      
];

let helper = {
    sendEventToParent: async (cmp) => {
        sendEvt(cmp, "magic_event", {
            characterData: {
                MagicianTypeId__c: cmp.magicianTypeId,
                MagicalTradition__c: cmp.magicalTradition,
                TotemId__c: cmp.totemId
            }
        });        
    },

    buildMinifiedSpellTemplateList: (cmp) => {
        let spellTemplateList = Object.entries(cmp.spellTemplateMap)
        .map(([ key, value ]) => {
            return {
                Id: key,
                Label: value.Label,
                Category__c: value.Category__c,
                Subcategory__c: value.Subcategory__c
            };            
        });

        cmp.minifiedSpellTemplateList = Array.from(spellTemplateList.sort(sortByListOrdering(spellOrdering, ...cmp.spellSectionLabels)));

        console.log('cmp.minifiedSpellTemplateList');
        console.log(JSON.stringify(cmp.minifiedSpellTemplateList));
    },

    // async to speed it up
    buildSpellTemplateListToDisplay: async (cmp) => {
        if (!cmp.magicianTypeObj) {
            return;
        }

        if (!cmp.minifiedSpellTemplateList?.length) {
            helper.buildMinifiedSpellTemplateList(cmp);
        }

        // adjust for types
        let permittedCategories; // null if all allowed
        console.log("cmp.magicianTypeObj.RequiresSpellBonus__c: " + cmp.magicianTypeObj?.RequiresSpellBonus__c);
        console.log("cmp.selectedTotemObj.Spell_Bonus__c: " + cmp.selectedTotemObj?.Spell_Bonus__c);


        if (cmp.magicianTypeObj.RequiresSpellBonus__c) {
            permittedCategories = (cmp.selectedTotemObj?.Spell_Bonus__c ? cmp.selectedTotemObj.Spell_Bonus__c.split(";") : []);
        }
        console.log('permittedCategories');
        console.log(JSON.stringify(permittedCategories));


        cmp.spellTemplateListToDisplay = (permittedCategories ?
            cmp.minifiedSpellTemplateList.filter(template => {
            // filter for shamanic / hermetic adepts
            if (permittedCategories) {
                return permittedCategories.includes(template.Category__c);
            } else {
                return true;
            }
        }) : cmp.minifiedSpellTemplateList);

        console.log('cmp.spellTemplateListToDisplay');
        console.log(JSON.stringify(cmp.spellTemplateListToDisplay));
    }
};

export default helper;