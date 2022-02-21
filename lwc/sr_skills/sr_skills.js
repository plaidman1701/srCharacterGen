import { LightningElement, api, track } from 'lwc';
import helper from "./helpers/helper.js";
import { oneToSixCombobox, Enums, collectionContainers } from "c/sr_jsModules";

const LABELS = {
    chooseRating: "Choose Rating",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel"
};

export default class Sr_skills extends LightningElement {
    labels = LABELS;

    get skillTemplateCollectionContainer() {
        return collectionContainers.skills.skillTemplates;
    }
    
    _selectedSkills;
    @api
    get selectedSkills() {
        return this._selectedSkills;
    }
    set selectedSkills(value) {
        this._selectedSkills = JSON.parse(JSON.stringify(value)); // clone

        helper.buildSortedSkillListArray(this);
    }

    connectedCallback() {
        helper.buildSortedSkillListArray(this);
    }

    get selectedSkillObj() {
        return this.selectedSkills?.find(skill => skill.Id == this.newSkillObj?.Id);
    }

    get selectedTemplateObj(){
        return this.skillTemplateCollectionContainer?.dataObj[this.newSkillObj?.SkillTemplateId__c];
    }

    get disableSave() {
        return !this.newSkillObj?.Rating__c || (this.selectedTemplateObj?.Requires_Name__c && !this.newSkillObj?.Name);
    }

    get disableDelete() {
        return !this.selectedSkillObj;
    }

    get skillRatingOptions() {
        return oneToSixCombobox;
    }
    
    handleTemplateListClick(event) {
        event.stopPropagation();

        this.newSkillObj = {};
        this.newSkillObj.SkillTemplateId__c = event.detail.Id;

        // determine if multiskill
        if (this.selectedTemplateObj.Requires_Name__c) {
            // new multiskill,no skill Id to pick
            
        } else {
            this.newSkillObj.Id = this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.newSkillObj.SkillTemplateId__c)?.Id;
        }     
        // check if skill selected
        this.newSkillObj.Rating__c = this.selectedSkillObj?.Rating__c; 
    }

    handleSkillListClick(event) {
        event.stopPropagation();

        this.newSkillObj = {};

        this.newSkillObj.Id = event.detail.Id;

        Object.assign(this.newSkillObj, this.selectedSkillObj);

        // check if multiskill and remove leading template name
        if (this.selectedTemplateObj.Requires_Name__c) this.newSkillObj.Name = this.newSkillObj.Name.replace(this.selectedTemplateObj.Label + " - ", "");
    }

    @track newSkillObj;

    handleRatingChange(event) {
        event.stopPropagation();

        this.newSkillObj.Rating__c = parseInt(event.detail.value);
    }

    handleButtonClick(event) {
        event.stopPropagation();

        let crudType;

        switch (event.target.dataset.name) {
            case "save":
                crudType = Enums.CrudTypes.Save;
                break;
            case "delete":
                crudType = Enums.CrudTypes.Delete;
                break;
            case "cancel":

                break;

        }

        if (crudType) helper.updateSkillAssign(this, crudType);

        this.newSkillObj = undefined;
    }

    handleSkillNameChange(event) {
        this.newSkillObj.Name = event.detail.value;
    }}