import { sortByListOrdering, sendUpdateEvent, Enums } from "c/sr_jsModules";

let helper = {
    buildSortedSkillListArray: (cmp) => {
        if (!cmp.selectedSkills || !cmp.skillTemplateCollectionContainer) return;

        cmp.selectedSkills.forEach(skill => {
            let template = cmp.skillTemplateCollectionContainer.dataObj[skill.SkillTemplateId__c];

            skill.Type__c = template.Type__c;
            skill.Category__c = template.Category__c;
        })
        cmp.selectedSkills.sort(sortByListOrdering(cmp.skillTemplateCollectionContainer.orderingObj, ...cmp.skillTemplateCollectionContainer.sectionLabels));
    },

    updateSkillAssign: (cmp, crudType) => {
        sendUpdateEvent(cmp, Enums.AssignObjTypes.Skill, cmp.newSkillObj, crudType);
    }
};

export default helper;