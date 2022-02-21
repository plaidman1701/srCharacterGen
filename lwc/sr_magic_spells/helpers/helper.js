import { sendUpdateEvent, Enums, sortByListOrdering, filterAndBuildSpellLists, filterAndBuildSpellTemplateList } from "c/sr_jsModules";


const spellOrdering = [
    ["Combat"],
    ["Detection"],
    ["Health"],
    ["Illusion"],
    ["Manipulation", "Control Manipulations", "Telekinetic Manipulations", "Transformation Maniplulations"]      
];

let helper = {

    updateSpellAssign: (cmp, crudType) => {
        sendUpdateEvent(cmp, Enums.AssignObjTypes.Spell, cmp.newSpellAssign, crudType);
    },

    getFilteredSpellTemplatesAndAssigns: (cmp) => {

        if (cmp.selectedChar && cmp.spellAssigns) {
            let listData = filterAndBuildSpellLists(cmp);
            cmp.spellTemplateListToDisplay = listData.spellTemplateListToDisplay;
            cmp.filteredSpellAssignList = listData.spellAssigListToDisplay;
        }
    }
};

export default helper;

