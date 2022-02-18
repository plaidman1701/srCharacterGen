import { sortByListOrdering, sendEvt, sendUpdateEvent, Enums } from "c/sr_jsModules";

const skillOrdering = [
    ["Active", "Combat", "Physical", "Technical", "Magical"],
    ["Social", "Ettiquette"],
    ["Vehicle"],
    ["Build and Repair", "Active", "Vehicle"],
    ["Knowledge"],
    ["Special"]            
];

let helper = {
//     buildSkillTemplateArray: (cmp) => {

// // ordering is a 2d array to sort by, eg [ ["Active", "Combat", "Technical", "Magical", "Physical"], ["Vehicle"], etc ]
// //export const buildListForDisplay = (cmp, entries, ordering, h1label, h2label) => {

//         //cmp.skillTemplateObj = buildListForDisplay(cmp.skillTemplateList, skillOrdering, "Type__c", "Category__c");
//         cmp.orderedSkillTemplateList = cmp.skillTemplateList.sort(sortByListOrdering(skillOrdering, ...cmp.skillSectionLabels));
//         console.log("sorted buildSkillTemplateArray");
//         //console.log("cmp.skillTemplateObj:");
//         //console.log(JSON.stringify(cmp.skillTemplateObj));
//     },

//     buildMinimalSkillTemplateList: (cmp) => {
// /*
//         let minimalskillTemplateList = [];

//         Object.entries(cmp.skillTemplateMap).forEach(([ key, value ]) => minimalskillTemplateList.push({
//             Id: key,
//             Label: value.Label,
//             Type__c: value.Type__c,
//             Category__c: value.Category__c
//         }));



//         cmp.skillTemplateList = minimalskillTemplateList;
// */
//         cmp.skillTemplateList = Object.entries(cmp.skillTemplateCollectionContainer.dataObj).map(([ key, value ]) => {
//             return {
//                 Id: key,
//                 Label: value.Label,
//                 Type__c: value.Type__c,
//                 Category__c: value.Category__c
//             }
//         })
//         console.log("built buildMinimalSkillTemplateList");

//     },

    // buildMinimalSelectedSkillList: (cmp) => {
    //     let minimalskillList = [];

    //     cmp.selectedSkills.forEach(skill => {
    //         let template = cmp.skillTemplateCollectionContainer.dataObj[skill.SkillTemplateId__c];

    //         minimalskillList.push({
    //             Id: skill.Id,
    //             Label: template.Label + (skill.Special_Skill_Name__c ? " - " + skill.Special_Skill_Name__c : ""),
    //             Type__c: template.Type__c,
    //             Category__c: template.Category__c,
    //             Rating__c: skill.Rating__c
    //         });
    //     });

    //     cmp.minimalSkillList = minimalskillList;
    // },

    buildSortedSkillListArray: (cmp) => {
        if (!cmp.selectedSkills || !cmp.skillTemplateCollectionContainer) return;

        //console.log("sorting buildSortedSkillListArray");
        //console.table(cmp.selectedSkills);


        //cmp.selectedSkillsObj = buildListForDisplay(cmp.minimalSkillList, skillOrdering, "Type__c", "Category__c");
        //cmp.orderedSkillList = cmp.minimalSkillList.sort(sortByListOrdering(skillOrdering, "Type__c", "Category__c"));
        cmp.selectedSkills.forEach(skill => {
            let template = cmp.skillTemplateCollectionContainer.dataObj[skill.SkillTemplateId__c];

            skill.Type__c = template.Type__c;
            skill.Category__c = template.Category__c;
        })
        cmp.selectedSkills.sort(sortByListOrdering(cmp.skillTemplateCollectionContainer.orderingObj, ...cmp.skillTemplateCollectionContainer.sectionLabels));

        //console.log("sorted buildSortedSkillListArray");
        //console.table(cmp.selectedSkills);

        //console.log("cmp.selectedSkillsObj:");  sectionLabels
        //console.log(JSON.stringify(cmp.selectedSkillsObj));

    },

    

    // saveSkill: (cmp) => {
    //     sendEvt(cmp, "skill_change", { type: "save", skillId: cmp.selectedSkillId, templateId: cmp.selectedSkillTemplateId, rating: cmp.selectedSkillRating, name: cmp.skillName });
    // },

    // deleteSkill: (cmp) => {
    //     cmp.selectedSkillRating = undefined;
    //     sendEvt(cmp, "skill_change", { type: "delete", skillId: cmp.selectedSkillId });
    // },

    updateSkillAssign: (cmp, crudType) => {
        sendUpdateEvent(cmp, Enums.AssignObjTypes.Skill, cmp.newSkillObj, crudType);
    }

};

export default helper;