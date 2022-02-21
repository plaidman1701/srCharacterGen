//The rules for Physad powers are individually complex, and will get more complex as new ones are added

import { collectionContainers } from "./dataTemplates.js";

// let skillTemplateCollectionContainer = collectionContainers.skills.skillTemplates;

const activeSkillCosts = [["Athletics", 0.25], ["Stealth", 0.25], ["Armed Combat", 0.5], ["Unarmed Combat", 0.5], ["Throwing Weapons", 0.5], ["Projectile Weapons", 0.5], , ["Firearms", 1], ["Gunnery", 1]];

let _combatSkillTemplateList;
function combatSkillTemplateList() {
    if (!_combatSkillTemplateList) {
        let skillTemplateCollectionContainer = collectionContainers.skills.skillTemplates;
        // let combatskills = skillTemplateCollectionContainer.dataList.filter(template => activeSkillSet().has(template.Label));

        _combatSkillTemplateList = activeSkillCosts.map(([ key, value ]) => {
            return { Label: key, cost: value, template: skillTemplateCollectionContainer.dataList.find(template => template.Label == key) };
        });

    }
    
    return _combatSkillTemplateList;
}

// returns skill name to an obj with skill Id and skill value
export function getActiveSkillValues(skillAssigns) {
    console.log('in getActiveSkillValues');
    let returnList = combatSkillTemplateList().map(templateObj => {
        let skillAssign = skillAssigns?.find(assign => assign.SkillTemplateId__c == templateObj.template.Id);

        let returnObj = { skillRating: skillAssign?.Rating__c || 0, skillAssignId: skillAssign?.Id };
        return Object.assign(returnObj, templateObj);
    });   
    return returnList;
};