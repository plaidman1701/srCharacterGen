// eventHelper

import { BASE_ATTS, placeholderIdGenerator, Enums, collectionContainers, filterAndBuildSpellLists, getActiveSkillValues } from "c/sr_jsModules";

import { processIncomingCharacterData } from "./helper.js";

let randomNameIndex = 0;

const COSTS_PER_POINT = {
    "attributes": 2,
    "skills": 1,
    "force": 0.5
};

function getWorkingAttValue(attObject){
    //console.log('getWorkingAttValue')
    //console.log(JSON.stringify(calcdAtts));
    return (attObject.bonus || attObject.natural);
};

function buildAdjus(cmp){
    let returnList = [];

    // metarace
    if (!!cmp.adjustmentTemplates.metarace[cmp.selectedChar.MetaraceTemplate__c]) {
        returnList = returnList.concat(cmp.adjustmentTemplates.metarace[cmp.selectedChar.MetaraceTemplate__c]);
    }

    // totem
    // check if magic type allows shaman, check for shaman, check for totem
    if (cmp.templates.magicianTypeMap[cmp.selectedChar.MagicianTypeId__c]?.TraditionOptions__c?.includes("Shamanic") &&
        cmp.selectedChar.MagicalTradition__c == "Shamanic" &&
        !!cmp.adjustmentTemplates.totems[cmp.selectedChar.TotemId__c]) {
            returnList = returnList.concat(cmp.adjustmentTemplates.totems[cmp.selectedChar.TotemId__c]);
    }
    
    return returnList;
};

function buildAdjuEffects(cmp){
    // object containing usable info about adjustments
    let adjuEffects = {
        adjuListText: [], // text list to display
        atts: {}
    };

    const allAdjus = buildAdjus(cmp);

    allAdjus.forEach(adju => {
        // add to text list
        adjuEffects.adjuListText.push(adju.Description__c);

        // base attributes
        if (adju.Category__c === "Attribute") {
            if (!adjuEffects.atts[adju.Field__c]) {
                adjuEffects.atts[adju.Field__c] = { natural: 0, bonus: 0 };
            }

            if (adju.Bonus__c) {
                adjuEffects.atts[adju.Field__c].bonus += adju.Value__c;
            } else {
                adjuEffects.atts[adju.Field__c].natural += adju.Value__c;
            }
        }

        // do essence
    });

    // compile att into calculated base attributes
    let calcdAtts = {};
    BASE_ATTS.forEach(att => {
        let modifiers = adjuEffects.atts[att];
        //calcdAtts[att] = {};

        calcNaturalBonusText(cmp, calcdAtts, att, modifiers);
    });

    // reations and intiatives
    calcReadOnlyAttsAndInitiavites(cmp, calcdAtts, adjuEffects);

    adjuEffects.atts = calcdAtts;

    cmp.adjuEffects = adjuEffects;

    //return returnObj;
};

function calcReadOnlyAttsAndInitiavites(cmp, calcdAtts, adjuEffects){
    // reaction
    cmp.selectedChar.Reaction__c = Math.floor((getWorkingAttValue(calcdAtts.Quickness__c) + getWorkingAttValue(calcdAtts.Intelligence__c)) / 2);

    let reactionModifiers = adjuEffects.atts.Reaction__c;
    //calcdAtts.Reaction__c = {};
    calcNaturalBonusText(cmp, calcdAtts, "Reaction__c", reactionModifiers);

    // dice
    cmp.selectedChar.InitDice = 1;

    let initiativeDiceModifiers = adjuEffects.atts.InitDice;
    calcNaturalBonusText(cmp, calcdAtts, "InitDice", initiativeDiceModifiers);

    // only need to set text for initiative
    calcdAtts.Initiative = { text: `${calcdAtts.Reaction__c.text} + ${calcdAtts.InitDice.text}D6` };

    // essence and magic
    cmp.selectedChar.Essence__c = 6;
    calcNaturalBonusText(cmp, calcdAtts, "Essence__c", adjuEffects.atts.Essence__c);

    cmp.selectedChar.Magic__c = (cmp.selectedChar.MagicianTypeId__c ? Math.floor(getWorkingAttValue(calcdAtts.Essence__c)) : 0);
    calcNaturalBonusText(cmp, calcdAtts, "Magic__c", adjuEffects.atts.Magic__c);

    //pools
    cmp.selectedChar.dicePools_combat =
        Math.floor((getWorkingAttValue(calcdAtts.Quickness__c) + getWorkingAttValue(calcdAtts.Intelligence__c) + getWorkingAttValue(calcdAtts.Willpower__c)) / 2);
    calcNaturalBonusText(cmp, calcdAtts, "dicePools_combat", adjuEffects.dicePools?.combat);

};

function calcNaturalBonusText(cmp, attObjs, att, modifiers){
    attObjs[att] = {};

    attObjs[att].natural = cmp.selectedChar[att] + (modifiers?.natural ||  0);

    if (modifiers?.bonus) {
        attObjs[att].bonus = attObjs[att].natural + modifiers.bonus;
    }
    attObjs[att].text = String(attObjs[att].natural) + (attObjs[att].bonus ? ` (${attObjs[att].bonus})` : "");
}

function calculateForcePoints(cmp) {
    if (!cmp.selectedChar?.MagicianTypeId__c) return 0;

    let spellList = filterAndBuildSpellLists(cmp).spellAssigListToDisplay;
    let spellPoints = spellList.reduce((previous, current) => previous + current.Rating__c, 0);



    return spellPoints;
}

function buildBasicInfo(cmp){
    let basicInfo = {};
    // add metarace
    basicInfo.metarace = {
        label: cmp.templates.metaraceTemplateMap[cmp.selectedChar.MetaraceTemplate__c].Label,
        cost: cmp.templates.metaraceTemplateMap[cmp.selectedChar.MetaraceTemplate__c].Build_Point_Cost__c
    };

    // add attributes
    let attPoints = BASE_ATTS.reduce(((previous, current) => previous + cmp.selectedChar[current]), 0);
    basicInfo.attributes = {
        label: `${cmp.labels.attributes} (${attPoints})`,
        cost: COSTS_PER_POINT.attributes * attPoints
    };

    // add skills
    if (!cmp.SkillAssigns__r) {
        cmp.SkillAssigns__r = [];
    }
    let skillPoints = cmp.SkillAssigns__r.reduce(((previous, current) => previous + current.Rating__c), 0);
    basicInfo.skills = {
        label: `${cmp.labels.skills} (${skillPoints})`,
        cost: COSTS_PER_POINT.skills * skillPoints
    };

    // magic
    let magTypeObj = collectionContainers.magic.magicianTypes.dataObj[cmp.selectedChar.MagicianTypeId__c];
    let magicBuildPoints = magTypeObj?.BuildPoints__c || 0;
    let magicTypeName = magTypeObj?.Label || "";
    basicInfo.magic = {
        label: `${cmp.labels.magic} ${magicTypeName} (${magicBuildPoints})`,
        cost: magicBuildPoints
    };

    // force
    let forcePoints = calculateForcePoints(cmp);
    let freePoints = magTypeObj?.ForcePoints__c || 0;
    basicInfo.forcePoints = {
        label: `${cmp.labels.forcePoints} (${forcePoints}, ${freePoints} free)`,
        cost: COSTS_PER_POINT.force * (forcePoints - freePoints > 0 ? forcePoints - freePoints : 0)
    };



    cmp.basicInfo = basicInfo;


}

let eventHelper = {
    setNewChar: (cmp) => {
        // we can't use a class because proper classes aren't reactive in LWC, even with @track
        cmp.selectedChar = {};
        BASE_ATTS.forEach(att => {
            cmp.selectedChar[att] = 1;
        });
        cmp.selectedChar.InitDice = 1;

        cmp.selectedChar.MetaraceTemplate__c =
            Object.entries(cmp.templates.metaraceTemplateMap).filter(entry => entry[1].Label === "Human")[0][1].Id;
            // [0][1] because Object.entries is a 2D array. We want the first (only) object of the array, and the 2nd element [key, value] of the entry

        //console.log('new char built:');
        //console.log(JSON.stringify(cmp.selectedChar));

        processIncomingCharacterData(cmp);

        eventHelper.rebuildAdjusAndBasicInfo(cmp);
        eventHelper.resetObjectsBeingDeleted(cmp);
    },

    randomizeName: (cmp) => {
        eventHelper.changeValue(cmp, "Name", cmp.handles[randomNameIndex++]);
        if (randomNameIndex >= cmp.handles.length) randomNameIndex = 0;
    },

    rebuildAdjusAndBasicInfo: (cmp) => {
        buildAdjuEffects(cmp);
        buildBasicInfo(cmp);

        // console.log('getActiveSkillValues:')
        // console.log(JSON.stringify(getActiveSkillValues(cmp.SkillAssigns__r)));
    },


    clearChar: (cmp) => {
        cmp.selectedChar = undefined;
        cmp.saveDisabled = true;

        eventHelper.resetObjectsBeingDeleted(cmp);
    },

    handleSpellChange: (cmp, payload) => {
        //console.log('handleSpellChange');
        //console.log(JSON.stringify(payload));
        //console.log(String(payload.crudType));

        let spellAssignObj = payload.updateObj;
        let spellAssignIndex = cmp.spellAssigns?.findIndex(assign => assign.Id == spellAssignObj.Id);
        //console.log('spellAssignIndex: ' + spellAssignIndex);

        switch (payload.crudType) {
            case Enums.CrudTypes.Save:
                let spellTemplate = collectionContainers.magic.spellTemplates.dataObj[spellAssignObj.SpellTemplateId__c];

                // check for parenthesis in template name and rebuild name before adding
                let templateInnerLabelText = spellTemplate.Label.match(/\(([^)]+)\)/)?.at(0);

                // add option
                spellAssignObj.Name =
                    (spellTemplate.Label.replace(templateInnerLabelText, spellAssignObj.SpellTemplateOption__c)).trim();
                // add variant
                let variant = spellTemplate.Variants__c?.split(";").at(spellAssignObj.SpellTemplateVariantIndex__c);
                if (variant) {
                    spellAssignObj.Name += " " + variant;
                }

                if (spellAssignIndex === undefined || spellAssignIndex === -1) {
                    spellAssignObj.Id = placeholderIdGenerator.next().value;
                    cmp.spellAssigns.push(spellAssignObj);
                } else {
                    //Object.assign(cmp.spellAssigns[spellAssignIndex], spellAssignObj);
                    cmp.spellAssigns[spellAssignIndex] = spellAssignObj;
                }
            break;
            case Enums.CrudTypes.Delete:
                cmp.objectsBeingDeleted.push(...cmp.spellAssigns.splice(spellAssignIndex, 1));
                //cmp.objectsBeingDeleted.spellAssigns.push(...cmp.spellAssigns.splice(spellAssignIndex, 1));
            break;
        }

        cmp.spellAssigns = JSON.parse(JSON.stringify(cmp.spellAssigns));
    },

    handleSkillChange: (cmp, payload) => {
        let skillObj = payload.updateObj;
        let skillIndex = cmp.SkillAssigns__r?.findIndex(assign => assign.Id == skillObj.Id);

        switch (payload.crudType) {
            case Enums.CrudTypes.Save:
                let skillTemplate = collectionContainers.skills.skillTemplates.dataObj[skillObj.SkillTemplateId__c];

                skillObj.Name = skillTemplate.Label + (skillTemplate.Requires_Name__c ? " - " + skillObj.Name : "");

                if (skillIndex === undefined || skillIndex === -1) {
                    skillObj.Id = placeholderIdGenerator.next().value;
                    cmp.SkillAssigns__r.push(skillObj);
                } else {
                    Object.assign(cmp.SkillAssigns__r[skillIndex], skillObj);
                }
            break;
            case Enums.CrudTypes.Delete:
                cmp.objectsBeingDeleted.push(...cmp.SkillAssigns__r.splice(skillIndex, 1));
            break;
        }

        cmp.SkillAssigns__r = JSON.parse(JSON.stringify(cmp.SkillAssigns__r));
    },

    resetObjectsBeingDeleted: (cmp) => {
        cmp.objectsBeingDeleted = [];
    },

    updateCharacter: (cmp, newChar) => {
        Object.assign(cmp.selectedChar, newChar);
    }
};

export { eventHelper };