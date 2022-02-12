// eventHelper

//import { PlayerChar } from "c/sR_JsModules";
import { BASE_ATTS, placeholderIdGenerator } from "c/sr_jsModules";

let randomNameIndex = 0;

const COSTS_PER_POINT = {
    "attributes": 2,
    "skills": 1
};

function getWorkingAttValue(calcdAtts, att){

    //let atts = cmp.adjuEffects.atts;
    //console.log('getWorkingAttValue')
    //console.log(JSON.stringify(calcdAtts));
    return (calcdAtts[att].bonus ? calcdAtts[att].bonus : calcdAtts[att].natural);
};

function buildAdjus(cmp){
    let returnList = [];

    // metarace
    if (!!cmp.templates.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]) {
        returnList = returnList.concat(cmp.templates.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]);
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
    });


    // compile att into calculated base attributes
    let calcdAtts = {};
    BASE_ATTS.forEach(att => {
        let modifiers = adjuEffects.atts[att];
        calcdAtts[att] = {};

        calcNaturalBonusText(cmp, calcdAtts, att, modifiers);

    });

    // reations and intiatives
    calcReactionsAndInitiavites(cmp, calcdAtts, adjuEffects);

    adjuEffects.atts = calcdAtts;

    cmp.adjuEffects = adjuEffects;



    //return returnObj;
};

function calcReactionsAndInitiavites(cmp, calcdAtts, adjuEffects){
    cmp.selectedChar.Reaction__c = Math.floor((getWorkingAttValue(calcdAtts, "Quickness__c") + getWorkingAttValue(calcdAtts, "Intelligence__c")) / 2);

    let reactionModifiers = adjuEffects.atts.Reaction__c;
    calcdAtts.Reaction__c = {};
    calcNaturalBonusText(cmp, calcdAtts, "Reaction__c", reactionModifiers);

    // dice
    cmp.selectedChar.InitDice = 1;

    let initiativeDiceModifiers = adjuEffects.atts.InitDice;
    calcdAtts.InitDice = {};
    calcNaturalBonusText(cmp, calcdAtts, "InitDice", initiativeDiceModifiers);

    // only need to set text for initiative
    calcdAtts.Initiative = { text: `${calcdAtts.Reaction__c.text} + ${calcdAtts.InitDice.text}D6` };
};

function calcNaturalBonusText(cmp, attObj, att, modifiers){

    attObj[att].natural = cmp.selectedChar[att] + (!!modifiers?.natural ? modifiers.natural : 0);

    if (!!modifiers?.bonus) {
        attObj[att].bonus = attObj[att].natural + modifiers.bonus;
    }
    attObj[att].text = String(attObj[att].natural) + (attObj[att].bonus ? ` (${attObj[att].bonus})` : "");


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
    if (!cmp.selectedChar.SkillAssigns__r) {
        cmp.selectedChar.SkillAssigns__r = [];
    }
    let skillPoints = cmp.selectedChar.SkillAssigns__r.reduce(((previous, current) => previous + current.Rating__c), 0);
    basicInfo.skills = {
        label: `${cmp.labels.skills} (${skillPoints})`,
        cost: COSTS_PER_POINT.skills * skillPoints
    };
    cmp.SkillAssigns__r = [ ...cmp.selectedChar.SkillAssigns__r ];


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

        eventHelper.rebuildAdjusAndBasicInfo(cmp);
        
    },

    randomizeName: (cmp) => {
        eventHelper.changeValue(cmp, "Name", cmp.handles[randomNameIndex++]);
        if (randomNameIndex >= cmp.handles.length) randomNameIndex = 0;
    },

    rebuildAdjusAndBasicInfo: (cmp) => {
        buildAdjuEffects(cmp);
        buildBasicInfo(cmp);
        //calculateReadonlyAtts(cmp);
    },


    clearChar: (cmp) => {
        cmp.selectedChar = undefined;
        cmp.saveDisabled = true;
    },

    changeValue: (cmp, field, value) => {
        cmp.selectedChar[field] = value;
        cmp.saveDisabled = false;

        //console.log('value changed');
        //console.log(JSON.stringify(cmp.selectedChar));
    },



    handlemetarace_and_atts: (cmp, payload) => {
        for (const [key, value] of Object.entries(payload)) {
            cmp.selectedChar[key] = (isNaN(value) ? value : parseInt(value));
        }


    },

    handleskill_change: (cmp, payload) => {
        // find if existing skill
        let skillIndex = cmp.selectedChar.SkillAssigns__r.findIndex(assign => assign.Id == payload.skillId);

        switch (payload.type) {
            case "save":
                if (skillIndex === undefined || skillIndex === -1) {
                    // add
                    let newAssign = {
                        SkillTemplateId__c: payload.templateId,
                        Rating__c: payload.rating,
                        Special_Skill_Name__c: payload.name,
                        Id: placeholderIdGenerator.next().value
                    };
                    cmp.selectedChar.SkillAssigns__r.push(newAssign);
                } else {
                    // replace
                    cmp.selectedChar.SkillAssigns__r[skillIndex].Rating__c = payload.rating;
                    cmp.selectedChar.SkillAssigns__r[skillIndex].Special_Skill_Name__c = payload.name;
                }

                break;
            case "delete":
                cmp.objectsBeingDeleted.skillAssigns.push(...cmp.selectedChar.SkillAssigns__r.splice(skillIndex, 1));
                break;
        }






        // handle upsert and delete
        //console.log('payload.templateId: ' + payload.templateId);
        //console.log('skillIndex: ' + skillIndex);
        // let skillIndex = cmp.selectedChar.SkillAssigns__r.findIndex(assign => assign.SkillTemplateId__c == payload.templateId);

        // if (payload.rating) {
        //     // upsert
        //     if (skillIndex === undefined || skillIndex === -1) {
        //         // add
        //         let newAssign = {
        //             SkillTemplateId__c: payload.templateId,
        //             Rating__c: payload.rating,
        //             Special_Skill_Name__c: payload.name,
        //             Id: placeholderIdGenerator.next().value
        //         };
        //         cmp.selectedChar.SkillAssigns__r.push(newAssign);
        //     } else {
        //         // replace
        //         cmp.selectedChar.SkillAssigns__r[skillIndex].Rating__c = payload.rating;
        //     }
        // } else if (!(skillIndex === undefined || skillIndex === -1)) {
        //         // delete
        //         cmp.objectsBeingDeleted.skillAssigns.push(...cmp.selectedChar.SkillAssigns__r.splice(skillIndex, 1));
        // }
        //console.log('cmp.selectedChar.SkillAssigns__r');
        //console.log(JSON.stringify(cmp.selectedChar.SkillAssigns__r));
        // rebuild so @track picks up on the changes
        cmp.SkillAssigns__r = [ ...cmp.selectedChar.SkillAssigns__r ];
    },

    resetObjectsBeingDeleted: (cmp) => {
        cmp.objectsBeingDeleted = {
            skillAssigns: []
        };
    }
  
    // buildBasicInfo(cmp) {
    //     let basicInfo = {};
    //     // add metarace
    //     basicInfo.metarace = {
    //         label: cmp.templates.metaraceTemplateMap[cmp.selectedChar.MetaraceTemplate__c].Label,
    //         cost: cmp.templates.metaraceTemplateMap[cmp.selectedChar.MetaraceTemplate__c].Build_Point_Cost__c
    //     };

    //     // add attributes
    //     let attPoints = BASE_ATTS.reduce(((previous, current) => previous + cmp.selectedChar[current]), 0);
    //     basicInfo.attributes = {
    //         label: `${cmp.labels.attributes} (${attPoints})`,
    //         cost: COSTS_PER_POINT.attributes * attPoints
    //     };

    //     cmp.basicInfo = basicInfo;

    //     console.log('buildBasicInfo:')
    //     console.log(JSON.stringify(cmp.basicInfo));

    // }

    // buildAdjus: (cmp) => {
    //     let returnList = [];

    //     // metarace
    //     if (!!cmp.templates.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]) {
    //         returnList = returnList.concat(cmp.templates.metaraceAdjustmentMap[cmp.selectedChar.MetaraceTemplate__c]);
    //     }

    //     // helper.buildBonusEffects(this, returnList);

    //     return returnList;
    // },


    // buildAdjuEffects: (cmp) => {
    //     // object containing usable info about adjustments
    //     let adjuEffects = {
    //         adjuListText: [], // text list to display
    //         atts: {}
    //     };

    //     eventHelper.buildAdjus(cmp).forEach(adju => {
    //         // add to text list
    //         adjuEffects.adjuListText.push(adju.Description__c);

    //         // attributes
    //         if (adju.Category__c === "Attribute") {
    //             if (!adjuEffects.atts[adju.Field__c]) {
    //                 adjuEffects.atts[adju.Field__c] = { natural: 0, bonus: 0 };
    //             }

    //             if (adju.Bonus__c) {
    //                 adjuEffects.atts[adju.Field__c].bonus += adju.Value__c;
    //             } else {
    //                 adjuEffects.atts[adju.Field__c].natural += adju.Value__c;
    //             }
    //         }
    //     });

    //     console.log('buildAdjuEffects 1:')
    //     console.log(JSON.stringify(cmp.adjuEffects));

    //     // compile att into calculated attributes
    //     let calcdAtts = {};
    //     BASE_ATTS.forEach(att => {
    //         let modifiers = adjuEffects.atts[att];
    //         calcdAtts[att] = {};


    //         calcdAtts[att].natural = cmp.selectedChar[att] + (!!modifiers?.natural ? modifiers.natural : 0);
    //         if (!!modifiers?.bonus) {
    //             calcdAtts[att].bonus = calcdAtts[att].natural + modifiers.bonus;
    //         }
    //         calcdAtts[att].text = String(calcdAtts[att].natural) + (calcdAtts[att].bonus ? ` (${calcdAtts[att].bonus})` : "");
    //     });
    //     adjuEffects.atts = calcdAtts;

    //     cmp.adjuEffects = adjuEffects;

    //     console.log('buildAdjuEffects 2:')
    //     console.log(JSON.stringify(cmp.adjuEffects));

    //     //return returnObj;
    // }


};

export default eventHelper;