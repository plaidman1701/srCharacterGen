
import { buildListForDisplay, sortByListOrdering, sendEvt } from "c/sr_jsModules";

const skillOrdering = [
    ["Active", "Combat", "Physical", "Technical", "Magical"],
    ["Social", "Ettiquette"],
    ["Vehicle"],
    ["Build and Repair", "Active", "Vehicle"],
    ["Knowledge"],
    ["Special"]            
];

let helper = {
    buildSkillTemplateArray: (cmp) => {

// ordering is a 2d array to sort by, eg [ ["Active", "Combat", "Technical", "Magical", "Physical"], ["Vehicle"], etc ]
//export const buildListForDisplay = (cmp, entries, ordering, h1label, h2label) => {

        //cmp.skillTemplateObj = buildListForDisplay(cmp.skillTemplateList, skillOrdering, "Type__c", "Category__c");
        cmp.orderedSkillTemplateList = cmp.skillTemplateList.sort(sortByListOrdering(skillOrdering, ...cmp.skillSectionLabels));

        //console.log("cmp.skillTemplateObj:");
        //console.log(JSON.stringify(cmp.skillTemplateObj));
    },

    buildMinimalSkillTemplateList: (cmp) => {

        let minimalskillTemplateList = [];

        Object.entries(cmp.skillTemplateMap).forEach(([ key, value ]) => minimalskillTemplateList.push({
            Id: key,
            Label: value.Label,
            Type__c: value.Type__c,
            Category__c: value.Category__c
        }));

        cmp.skillTemplateList = minimalskillTemplateList;
    },

    buildMinimalSelectedSkillList: (cmp) => {
        let minimalskillList = [];

        cmp.selectedSkills.forEach(skill => {
            let template = cmp.skillTemplateMap[skill.SkillTemplateId__c];

            minimalskillList.push({
                Id: skill.Id,
                Label: template.Label + (skill.Special_Skill_Name__c ? " - " + skill.Special_Skill_Name__c : ""),
                Type__c: template.Type__c,
                Category__c: template.Category__c,
                Rating__c: skill.Rating__c
            });
        });

        cmp.minimalSkillList = minimalskillList;
    },

    buildSortedSkillListArray: (cmp) => {
        //cmp.selectedSkillsObj = buildListForDisplay(cmp.minimalSkillList, skillOrdering, "Type__c", "Category__c");
        cmp.orderedSkillList = cmp.minimalSkillList.sort(sortByListOrdering(skillOrdering, "Type__c", "Category__c"));

        //console.log("cmp.selectedSkillsObj:");
        //console.log(JSON.stringify(cmp.selectedSkillsObj));

    },

    

    saveSkill: (cmp) => {
        sendEvt(cmp, "skill_change", { type: "save", skillId: cmp.selectedSkillId, templateId: cmp.selectedSkillTemplateId, rating: cmp.selectedSkillRating, name: cmp.skillName });
    },

    deleteSkill: (cmp) => {
        cmp.selectedSkillRating = undefined;
        sendEvt(cmp, "skill_change", { type: "delete", skillId: cmp.selectedSkillId });
    }

};

export default helper;