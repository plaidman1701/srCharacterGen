import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { collectionContainers } from "./dataTemplates.js";
import { elementalCategories } from "./constants.js";

export function sendEvt(cmp, evtName, payload) {
    const evt = new CustomEvent(evtName, { detail: payload });
    cmp.dispatchEvent(evt);

};

export function filterAndBuildSpellLists(cmp) {
    let spellTemplateListToDisplay = [];
    let spellAssigListToDisplay = [];
    let filteredSpellTemplateIdSet = new Set();
    let spellAssigListToDisplayIds = new Set();

    let magicianTypeObj = collectionContainers.magic.magicianTypes.dataObj[cmp.selectedChar.MagicianTypeId__c];
    console.log('filterAndBuildSpellLists AllowsSpells__c: ' + magicianTypeObj?.AllowsSpells__c);
    if (!magicianTypeObj?.AllowsSpells__c) {
        // add logic here to reset
        return {
            spellTemplateListToDisplay,
            spellAssigListToDisplay,
            filteredSpellTemplateIdSet,
            spellAssigListToDisplayIds
        }
    }

    let selectedTotemObj = collectionContainers.magic.totems.dataObj[cmp.selectedChar.TotemId__c];

    // adjust for types
    let permittedCategories; // null if all allowed
    let matterBasedRequired;
    let elementalEffect;

    if (magicianTypeObj.RequiresSpellBonus__c) {
        // shamanic adept
        permittedCategories = (selectedTotemObj?.Spell_Bonus__c?.split(";") || []);
    } else if (magicianTypeObj.SpecialOptions__c) {
        // elemental adept
        permittedCategories = (elementalCategories[cmp.selectedChar.ElementalOption__c]?.category.split(";") || []);
        if (permittedCategories.length) {
            matterBasedRequired = elementalCategories[cmp.selectedChar.ElementalOption__c].matterBased;
            elementalEffect = elementalCategories[cmp.selectedChar.ElementalOption__c].elementalEffect;
        }
    }

    let spellTemplateCollectionContainer = collectionContainers.magic.spellTemplates;
    console.log('filter spellTemplateCollectionContainer');
    spellTemplateListToDisplay = spellTemplateCollectionContainer.dataList
    .filter(spellTemplate => {
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

    console.log('filter spellAssigListToDisplay');


    spellAssigListToDisplay = cmp.spellAssigns
    .filter(spellAssign => filteredSpellTemplateIdSet.has(spellAssign.SpellTemplateId__c))
    .map(spellAssign => {
        let template = spellTemplateCollectionContainer.dataObj[spellAssign.SpellTemplateId__c];
        
        let returnObj = Object.assign({}, spellAssign);
        returnObj.Category__c = template.Category__c;
        returnObj.Subcategory__c = template.Subcategory__c;

        spellAssigListToDisplayIds.add(spellAssign.Id);

        return returnObj;
    })
    .sort(sortByListOrdering(spellTemplateCollectionContainer.orderingObj, ...spellTemplateCollectionContainer.sectionLabels)); 

    return {
        spellTemplateListToDisplay,
        spellAssigListToDisplay,
        filteredSpellTemplateIdSet,
        spellAssigListToDisplayIds
    }
};

export function filterAndBuildSpellTemplateList(selectedChar) {
    let spellTemplateListToDisplay = [];
    let filteredSpellTemplateIdSet = new Set();

    let magicianTypeObj = collectionContainers.magic.magicianTypes.dataObj[selectedChar.MagicianTypeId__c];
    console.log('filterAndBuildSpellTemplateList AllowsSpells__c: ' + magicianTypeObj?.AllowsSpells__c);
    if (!magicianTypeObj?.AllowsSpells__c) {
        // add logic here to reset
        return {
            spellTemplateListToDisplay,
            filteredSpellTemplateIdSet
        }
    }

    let selectedTotemObj = collectionContainers.magic.totems.dataObj[selectedChar.TotemId__c];

    // adjust for types
    let permittedCategories; // null if all allowed
    let matterBasedRequired;
    let elementalEffect;

    if (magicianTypeObj.RequiresSpellBonus__c) {
        // shamanic adept
        permittedCategories = (selectedTotemObj?.Spell_Bonus__c?.split(";") || []);
    } else if (magicianTypeObj.SpecialOptions__c) {
        // elemental adept
        permittedCategories = (elementalCategories[selectedChar.ElementalOption__c]?.category.split(";") || []);
        if (permittedCategories.length) {
            matterBasedRequired = elementalCategories[selectedChar.ElementalOption__c].matterBased;
            elementalEffect = elementalCategories[selectedChar.ElementalOption__c].elementalEffect;
        }
    }

    spellTemplateListToDisplay = collectionContainers.magic.spellTemplates.dataList
    .filter(spellTemplate => {
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

    return {
        spellTemplateListToDisplay,
        filteredSpellTemplateIdSet
    };
};

export const popToast = (cmp, {...toastParams}) => {

    //console.log('toastParams');
    //console.log(JSON.stringify(toastParams));

    const event = new ShowToastEvent({
        title: toastParams.title,
        message: toastParams.message,
        variant: toastParams.variant,
        messageData: toastParams.messageData,
        mode: toastParams.mode
    });

    cmp.dispatchEvent(event);
};

export const simpleToast = (cmp, title, message, variant) => {
    //console.log('simpleToast Params');
    //console.log(title, message, variant);
    popToast(cmp, {title, message, variant});
};

export const sortByLabel = (a, b) => {
    if (a.label !== b.label) {
        return (a.label > b.label ? 1 : -1);
    }

    return 0;
};

export const sortByListOrdering = (ordering, h1label, h2label) => {
    return function(a, b) {
        // check for List_Order__c
        if (a.List_Order__c && b.List_Order__c) return a.List_Order__c - b.List_Order__c;

        // top-level
        let aH1Index;
        let bH1Index;

        let aH2List;
        let bH2List;

        if (h1label) {
            // check for h1
            for (let i = 0; i < ordering.length; ++i) {
                if (ordering[i][0].toLowerCase() === a[h1label].toLowerCase()) {
                    aH1Index = i;
                    aH2List = ordering[i];
                }
    
                if (ordering[i][0].toLowerCase() === b[h1label].toLowerCase()) {
                    bH1Index = i;
                    bH2List = ordering[i];
                }
            }
    
            if (aH1Index !== bH1Index) {
                return (aH1Index > bH1Index ? 1 : -1);
            }
        }

        if (h2label) {
            // top-level same, second-level
            // -1 if not found, so they come first
            let aH2Index = aH2List.indexOf(a[h2label]);
            let bH2Index = bH2List.indexOf(b[h2label]);

            if (aH2Index !== bH2Index) {
                return (aH2Index > bH2Index ? 1 : -1);
            }
        }

        // same sub, go by label or name

        return ((a.Label || a.Name) > (b.Label || b.Name) ? 1 : -1);
    };
}

// ordering is a 2d array to sort by, eg [ ["Active", "Combat", "Technical", "Magical", "Physical"], ["Vehicle"], etc ]
//export const buildListForDisplay = (entries, ordering, h1label, h2label) => {
export const buildListForDisplay = (entries, h1label, h2label) => {
    let returnObj = {}, prevH1, prevH2, h1obj, h2obj;

    entries.forEach(entry => {
        // the list is sorted, so the rest is easy
        let h1value = !!h1label ? entry[h1label] : undefined;
        let h2value = !!h2label ? entry[h2label] : undefined;

        if (!h1value) {
            // no top-level
            if (!returnObj.entries) {
                returnObj.entries = [];
            }

            returnObj.entries.push(entry);
            return;
        }

        if (prevH1 != h1value) {
            // new h1
            h1obj = { label: h1value, h2s: [], entries: [] };
            h2obj = undefined;

            prevH1 = h1value;
            if (!returnObj.h1s) {
                returnObj.h1s = [];
            }
            returnObj.h1s.push(h1obj);
        }
        
        if (!h2value) {
            // no h2
            h1obj.entries.push(entry);
            return;
        }

        if (prevH2 != h2value) {
            h2obj = { label: h2value, entries: [] };
            h1obj.h2s.push(h2obj);

            prevH2 = h2value;
        }

        h2obj.entries.push(entry);
    });

    // console.log('done buildListForDisplay');

    return returnObj;
    
};

export const placeholderIdGenerator = infiniteIds();

function* infiniteIds() {
    let index = 0;

    while (true) {
        yield `placeholderId${index++}`;
    }
}

export class CollectionContainer {
    dataObj;
    dataList;
    sectionLabels;
    orderingObj;

    constructor(dataObj, orderingObj, sectionLabels) {
        this.dataObj = dataObj;
        this.orderingObj = orderingObj;
        this.sectionLabels = sectionLabels || []; // empty array

        this.dataList = Object.entries(this.dataObj).map(([key, value]) => value);

        this.dataList =
            Array.from(this.dataList.sort(sortByListOrdering(this.orderingObj, ...this.sectionLabels )));
    }
}

export class UpdateWrapper{
    updateType;
    updateObj;
    crudType;

    constructor(updateType, updateObj, crudType) {
        this.updateType = updateType;
        this.updateObj = updateObj;
        this.crudType = crudType;
    }    
}

export class Enums {
    static Character = Symbol("Character");

    static AssignObjTypes = {
        Skill: Symbol("Skill"),
        Spell: Symbol("Spell")
    };

    static CrudTypes = {
        Save: Symbol("Save"),
        Delete: Symbol("Delete")
    };
}


export function sendUpdateEvent(cmp, updateType, updateObj, crudType) {
    sendEvt(cmp, "updateevent", new UpdateWrapper(updateType, updateObj, crudType));

}