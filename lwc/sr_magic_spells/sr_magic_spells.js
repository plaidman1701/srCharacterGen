import { LightningElement, api, track } from 'lwc';
import { oneToSixCombobox, Enums, collectionContainers, filterAndBuildSpellTemplateList } from "c/sr_jsModules";

import helper from "./helpers/helper.js";

const LABELS = {
    save: "Save",
    delete: "Delete",
    cancel: "Cancel"
};

export default class Sr_magic_spells extends LightningElement {
    oneToSixCombobox = oneToSixCombobox;
    labels = LABELS;

    _selectedChar;
    @api
    get selectedChar() {
        return this._selectedChar;
    }
    set selectedChar(value) {
        this._selectedChar = value; 
        helper.getFilteredSpellTemplatesAndAssigns(this);
    }
  
    @track _spellAssigns;
    @api
    get spellAssigns() {
        return this._spellAssigns;
    }
    set spellAssigns(value) {
        this._spellAssigns = JSON.parse(JSON.stringify(value));
        helper.getFilteredSpellTemplatesAndAssigns(this);
    }

    get spellTemplateCollectionContainer() {
        return collectionContainers.magic.spellTemplates;
    }

    connectedCallback() {
        helper.getFilteredSpellTemplatesAndAssigns(this);
    }

    @track spellTemplateListToDisplay;
    @track newSpellAssign;

    filteredSpellTemplateIdSet;
    @track filteredSpellAssignList;

    get selectedSpellTemplateObj() {
        return this.spellTemplateCollectionContainer?.dataObj[this.newSpellAssign?.SpellTemplateId__c];
    }

    get selectedSpellAssignObj() {
        return this.spellAssigns?.find(spellAssign => spellAssign.Id == this.newSpellAssign?.Id);
    }

    get spellOptionList() {
        return this.selectedSpellTemplateObj?.Options__c?.split(";").map(option => {
            return ( { label: option, value: option });
        });
    }

    get selectedDrain() {
        let drainArray = this.selectedSpellTemplateObj.Drain__c.split(";");
        return (drainArray.length === 1 ? drainArray[0] : drainArray[this.newSpellAssign?.SpellTemplateVariantIndex__c]);       
    }

    get selectedDuration() {
        let durationArray = this.selectedSpellTemplateObj.Duration__c.split(";");
        return (durationArray.length === 1 ? durationArray[0] : durationArray[this.newSpellAssign?.SpellTemplateVariantIndex__c]);
    }

    get spellTemplateVariants() {
        let count = 0;
        return this.selectedSpellTemplateObj?.Variants__c?.split(";").map(variant => {
            return { label: variant, value: count++ }
        });
    }

    handleSpellTemplateClick(event) {
        event.stopPropagation();

        this.newSpellAssign = {};
        this.newSpellAssign.SpellTemplateId__c = event.detail.Id;
    }

    handleSpellAssignClick(event) {
        event.stopPropagation();

        this.newSpellAssign = {};

        this.newSpellAssign.Id = event.detail.Id;

        Object.assign(this.newSpellAssign, this.selectedSpellAssignObj);
    }

    handleSpellDetailChange(event) {
        event.stopPropagation();

        // console.log('handleSpellDetailChange');
        // console.log(event.target.dataset.attributeName);

        let eventValue = event.detail.value;
        this.newSpellAssign[event.target.dataset.attributeName] = isNaN(eventValue) ? eventValue : Number(eventValue);
        console.log('this.newSpellAssign');
        console.log(JSON.stringify(this.newSpellAssign));
    }

    // need a rating to save, and if requirs name or options, also a name
    get disableSave() {
        return !this.newSpellAssign?.Rating__c ||
            ((this.selectedSpellTemplateObj?.RequiresName__c || this.selectedSpellTemplateObj?.Options__c) && !this.newSpellAssign?.SpellTemplateOption__c) ||
            (this.selectedSpellTemplateObj?.Variants__c && (this.newSpellAssign?.SpellTemplateVariantIndex__c == undefined));
    }

    get disableDelete() {
        return !this.newSpellAssign?.Id;
    }

    handleButtonClick(event) {
        event.stopPropagation();
        let crudType;

        switch (event.target.dataset.name) {
            case "save":
                //helper.saveSkill(this);
                crudType = Enums.CrudTypes.Save;
                break;
            case "delete":
                //helper.deleteSkill(this);
                crudType = Enums.CrudTypes.Delete;
                break;
            case "cancel":

                break;

        }

        if (crudType) helper.updateSpellAssign(this, crudType);

        this.newSpellAssign = undefined;
    }
}