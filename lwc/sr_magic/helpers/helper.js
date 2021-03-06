import { sortByListOrdering, sendEvt, elementalCategories } from "c/sr_jsModules";


const spellOrdering = [
    ["Combat"],
    ["Detection"],
    ["Health"],
    ["Illusion"],
    ["Manipulation", "Control Manipulations", "Telekinetic Manipulations", "Transformation Maniplulations"]      
];

function filterAndBuildSpellTemplateList(cmp) {
    // adjust for types
    let permittedCategories; // null if all allowed
    let matterBasedRequired;
    let elementalEffect;
    //console.log("cmp.magicianTypeObj.RequiresSpellBonus__c: " + cmp.magicianTypeObj?.RequiresSpellBonus__c);
    //console.log("cmp.selectedTotemObj.Spell_Bonus__c: " + cmp.selectedTotemObj?.Spell_Bonus__c);

    if (cmp.magicianTypeObj.RequiresSpellBonus__c) {
        // shamanic adept
        permittedCategories = (cmp.selectedTotemObj?.Spell_Bonus__c ? cmp.selectedTotemObj.Spell_Bonus__c.split(";") : []);
    } else if (cmp.magicianTypeObj.SpecialOptions__c) {
        // elemental adept
        //console.log('cmp.selectedChar.ElementalOption__c:' + (cmp.selectedChar.ElementalOption__c));
        //console.log(JSON.stringify(elementalCategories));

        permittedCategories = (elementalCategories[cmp.selectedChar.ElementalOption__c] ? [ elementalCategories[cmp.selectedChar.ElementalOption__c].category ] : []);
        if (permittedCategories.length) {
            matterBasedRequired = elementalCategories[cmp.selectedChar.ElementalOption__c].matterBased;
            elementalEffect = elementalCategories[cmp.selectedChar.ElementalOption__c].elementalEffect;
        }
    }
    //console.log('permittedCategories:' + (permittedCategories) + Array.isArray(permittedCategories));
    //console.log('matterBasedRequired:' + (matterBasedRequired));
    //console.log('elementalEffect:' + (elementalEffect));

    let filteredSpellTemplateIdSet = new Set();

    //console.log('permittedCategories:');
    //console.log(permittedCategories);

    //let filteredSpellTemplateList = Object.entries(cmp.spellTemplateMap)
    cmp.spellTemplateListToDisplay = cmp.spellTemplateCollectionContainer.dataList
    .filter(spellTemplate => {
        // if (!permittedCategories) {
        //     filteredSpellTemplateIdSet.add(spellTemplate.Id);
        //     return true;    
        // }

        // if (!permittedCategories.includes(spellTemplate.Category__c)) {
        //     //console.log(value.Category__c + ' is false');
        //     return false;
        // }

        // if (matterBasedRequired) return spellTemplate.MatterBased__c;

        // if (elementalEffect) return elementalEffect === spellTemplate.ElementalEffect__c;
        // //console.log('returning true');

        // filteredSpellTemplateIdSet.add(spellTemplate.Id);
        // return true;

        let filterPassed;
        if (!permittedCategories) {
            filterPassed = true;    
        } else if (!permittedCategories.includes(spellTemplate.Category__c)) {
            filterPassed = false;
        } else if (matterBasedRequired) {
            filterPassed = spellTemplate.MatterBased__c;
        } else if (elementalEffect) {
            filterPassed = elementalEffect === spellTemplate.ElementalEffect__c;
        } else {
            filterPassed = true;
        }

        if (filterPassed) filteredSpellTemplateIdSet.add(spellTemplate.Id);

        return filterPassed;
    });
    // .map(([ key, value ]) => {
    //     filteredSpellTemplateIdSet.add(key);
    //     return {
    //         Id: key,
    //         Label: value.Label,
    //         Category__c: value.Category__c,
    //         Subcategory__c: value.Subcategory__c
    //     };            
    // });

    cmp.filteredSpellTemplateIdSet = filteredSpellTemplateIdSet;
   // cmp.spellTemplateListToDisplay =    Array.from(filteredSpellTemplateList.sort(sortByListOrdering(spellOrdering, ...cmp.spellSectionLabels)));
    
    //console.log('cmp.filteredSpellTemplateIdSet:');
    //console.log(cmp.filteredSpellTemplateIdSet.size);
    //console.log('cmp.spellTemplateListToDisplay:');
    //console.table(cmp.spellTemplateListToDisplay);
}

function filterAndBuildSpellAssignList(cmp) {
    let spellAssignListToDisplay = cmp.selectedSpellAssigns
    .filter(spellAssign => cmp.filteredSpellTemplateIdSet.has(spellAssign.SpellTemplateId__c))
    .map(spellAssign => {
        let spellTemplate = cmp.spellTemplateMap[spellAssign.SpellTemplateId__c];

        return {
            Id: spellAssign.Id,
            Label: spellAssign.Name,
            Category__c: spellTemplate.Category__c,
            Subcategory__c: spellTemplate.Subcategory__c
        };
    });

    cmp.spellAssignListToDisplay =
        Array.from(spellAssignListToDisplay.sort(sortByListOrdering(spellOrdering, ...cmp.spellSectionLabels)));
};

let helper = {
    sendEventToParent: async (cmp) => {
        // sendEvt(cmp, "magic_event", {
        //     characterData: {
        //         MagicianTypeId__c: cmp.magicianTypeId,
        //         MagicalTradition__c: cmp.magicalTradition,
        //         TotemId__c: cmp.totemId,
        //         ElementalOption__c: cmp.elementalOption
        //     }
        // }); 
        sendEvt(cmp, "magic_event", {
            characterData: cmp.selectedChar });        

    },

    buildSpellListsToDisplay: async (cmp) => {
        if (!cmp.magicianTypeObj?.AllowsSpells__c || !cmp.spellTemplateCollectionContainer) {
            cmp.spellTemplateListToDisplay = undefined;
            return;
        }

        cmp.selectedSpellTemplateId = undefined;
        cmp.selectedSpellAssignId = undefined;

        filterAndBuildSpellTemplateList(cmp);
        //filterAndBuildSpellAssignList(cmp);
    },

    handleSpellTemplateClick: (cmp) => {

    }
}

export default helper;