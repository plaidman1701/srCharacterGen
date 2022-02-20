import { sendUpdateEvent, Enums, sortByListOrdering, filterAndBuildSpellLists, filterAndBuildSpellTemplateList } from "c/sr_jsModules";


const spellOrdering = [
    ["Combat"],
    ["Detection"],
    ["Health"],
    ["Illusion"],
    ["Manipulation", "Control Manipulations", "Telekinetic Manipulations", "Transformation Maniplulations"]      
];

/*
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
    console.log('permittedCategories:' + (permittedCategories) + Array.isArray(permittedCategories));
    console.log('matterBasedRequired:' + (matterBasedRequired));
    console.log('elementalEffect:' + (elementalEffect));

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
*/

let helper = {

    // buildSpellListsToDisplay: (cmp) => {
    //     if (!cmp.magicianTypeObj?.AllowsSpells__c || !cmp.spellTemplateCollectionContainer) {
    //         cmp.spellTemplateListToDisplay = [];
    //         return;
    //     }

    //     console.log('buildSpellListsToDisplay magicianTypeObj');
    //     console.log(JSON.stringify(cmp.magicianTypeObj));

    //     // cmp.selectedSpellTemplateId = undefined;
    //     // cmp.selectedSpellAssignId = undefined;

    //     cmp.newSpellAssign = undefined;
        
    //     filterAndBuildSpellTemplateList(cmp);
    //     //filterAndBuildSpellAssignList(cmp);
    // },

    updateSpellAssign: (cmp, crudType) => {


        sendUpdateEvent(cmp, Enums.AssignObjTypes.Spell, cmp.newSpellAssign, crudType);
    },
/*
    getFilteredAndSortedSpellTemplates: (cmp) => {
        if (!cmp.selectedChar) return;
        cmp.newSpellAssign = {};

        //{ cmp.spellTemplateListToDisplay, cmp.filteredSpellTemplateIdSet } = Object.assign({}, filterAndBuildSpellTemplateList(cmp.selectedChar));
        let data = filterAndBuildSpellTemplateList(cmp.selectedChar);
        //console.log('setting cmp.spellTemplateListToDisplay');
        cmp.spellTemplateListToDisplay = data.spellTemplateListToDisplay;
        cmp.filteredSpellTemplateIdSet = data.filteredSpellTemplateIdSet;

        helper.getFilteredAndSortedSpellAssigns(cmp);

        //console.log("cmp.filteredSpellTemplateIdSet: " + cmp.filteredSpellTemplateIdSet.size);

        if (cmp.spellAssigns) {
            console.log("filterAndBuildSpellLists:");
            console.log(JSON.stringify(filterAndBuildSpellLists(cmp, cmp.spellAssigns)));
            console.log("filterAndBuildSpellLists done");
        }


    },

    getFilteredAndSortedSpellAssigns: (cmp) => {
        if (!cmp.spellAssigns?.length || !cmp.spellTemplateListToDisplay || !cmp.filteredSpellTemplateIdSet?.size) {
            cmp.filteredSpellAssignList = [];
            return;
        }

        cmp.filteredSpellAssignList = cmp.spellAssigns
        .filter(spellAssign => cmp.filteredSpellTemplateIdSet.has(spellAssign.SpellTemplateId__c))
        .map(spellAssign => {
            let template = cmp.spellTemplateCollectionContainer.dataObj[spellAssign.SpellTemplateId__c];
            
            let returnObj = Object.assign({}, spellAssign);
            returnObj.Category__c = template.Category__c;
            returnObj.Subcategory__c = template.Subcategory__c;

            return returnObj;
        })
        .sort(sortByListOrdering(cmp.spellTemplateCollectionContainer.orderingObj, ...cmp.spellTemplateCollectionContainer.sectionLabels));   
        //console.log('setting getFilteredAndSortedSpellAssigns:');
        //console.log("cmp.filteredSpellTemplateIdSet: " + cmp.filteredSpellTemplateIdSet.size);
        //console.log('cmp.filteredSpellAssignList:');
        //console.log(JSON.stringify(cmp.filteredSpellAssignList));     
    },
*/
    getFilteredSpellTemplatesAndAssigns: (cmp) => {

        if (cmp.selectedChar && cmp.spellAssigns) {
            let listData = filterAndBuildSpellLists(cmp);
            cmp.spellTemplateListToDisplay = listData.spellTemplateListToDisplay;
            cmp.filteredSpellAssignList = listData.spellAssigListToDisplay;
        }


    }
};

export default helper;

