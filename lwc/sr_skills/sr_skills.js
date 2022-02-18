import { LightningElement, api, track } from 'lwc';
import helper from "./helpers/helper.js";
import { oneToSixCombobox, Enums } from "c/sr_jsModules";

const LABELS = {
    chooseRating: "Choose Rating",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel"
};

export default class Sr_skills extends LightningElement {
    labels = LABELS;

    _skillTemplateCollectionContainer;
    @api
    get skillTemplateCollectionContainer() {
        return this._skillTemplateCollectionContainer;
    };
    set skillTemplateCollectionContainer(value) {
        this._skillTemplateCollectionContainer = value;
        //console.log('skillTemplateCollectionContainer:');
        //console.log(JSON.stringify());


        helper.buildSortedSkillListArray(this);
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

    //minimalSkillList = [];

    //orderedSkillTemplateList = [];
    //orderedSkillList = [];
    //skillSectionLabels = [ "Type__c", "Category__c" ];
    
    get selectedSkillObj() {
        return this.selectedSkills?.find(skill => skill.Id == this.newSkillObj?.Id);
        //return this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.selectedSkillTemplateId);
    }

    //selectedSkillTemplateId;
    get selectedTemplateObj(){
        return this.skillTemplateCollectionContainer?.dataObj[this.newSkillObj?.SkillTemplateId__c];
    }

    //skillTemplateList = [];
    //skillTemplateObj = {};
    //@track selectedSkillsObj = {};

    //selectedSkillId;
    // selectedSkillRating;

    // skillName;

    get disableSave() {
        return !this.newSkillObj?.Rating__c || (this.selectedTemplateObj?.Requires_Name__c && !this.newSkillObj?.Name);
    }

    get disableDelete() {
        return !this.selectedSkillObj;
    }

    get skillRatingOptions() {
        return oneToSixCombobox;
    }

    // get skillTemplateDescription() {
    //     // if (!this.selectedSkillTemplateId) {
    //     //     return;
    //     // }

    //     // return this.skillTemplateCollectionContainer?.dataObj[this.selectedSkillTemplateId].Description__c;
    //     return this.selectedTemplateObj?.Description__c;
    // }

    
    handleTemplateListClick(event) {
        event.stopPropagation();

        // this.selectedSkillId = undefined;
        // this.selectedSkillRating = undefined;
        // this.skillName = undefined;

        this.newSkillObj = {};
        this.newSkillObj.SkillTemplateId__c = event.detail.Id;

        //this.selectedSkillTemplateId = event.detail.Id;

        // determine if multiskill
        //let skillTemplate = this.skillTemplateCollectionContainer.dataObj[this.selectedSkillTemplateId];
        if (this.selectedTemplateObj.Requires_Name__c) {
            // new multiskill,no skill Id to pick
            
        } else {
            // this.selectedSkillId = this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.selectedSkillTemplateId)?.Id;
            this.newSkillObj.Id = this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.newSkillObj.SkillTemplateId__c)?.Id;
            //this.selectedSkillRating = this.selectedSkillObj?.Rating__c;  
        }     
        // check if skill selected
        // this.selectedSkillRating = this.selectedSkillObj?.Rating__c;   
        this.newSkillObj.Rating__c = this.selectedSkillObj?.Rating__c; 
    }

    handleSkillListClick(event) {
        event.stopPropagation();

        this.newSkillObj = {};

        this.newSkillObj.Id = event.detail.Id;
        // find template Id
        //this.newSkillObj.SkillTemplateId__c = this.selectedSkills.find(skill => skill.Id == this.newSkillObj.Id).SkillTemplateId__c;
        // this.selectedSkillTemplateId = this.selectedSkillObj?.SkillTemplateId__c;
        // this.selectedSkillRating = this.selectedSkillObj?.Rating__c;   
        // this.skillName = this.selectedSkillObj?.Special_Skill_Name__c;


        Object.assign(this.newSkillObj, this.selectedSkillObj);

        // check if multiskill and remove leading template name
        if (this.selectedTemplateObj.Requires_Name__c) this.newSkillObj.Name = this.newSkillObj.Name.replace(this.selectedTemplateObj.Label + " - ", "");

        console.log('this.newSkillObj after clone:');
        console.log(JSON.stringify(this.newSkillObj));
    }

    @track newSkillObj;

    handleRatingChange(event) {
        event.stopPropagation();
        //console.log('handleRatingChange');
        //console.log(event.detail.value);


        //this.selectedSkillRating = parseInt(event.detail.value);
        this.newSkillObj.Rating__c = parseInt(event.detail.value);
    }

    handleButtonClick(event) {
        //console.log(event.target.dataset.name)
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

        if (crudType) helper.updateSkillAssign(this, crudType);

        this.newSkillObj = undefined;
    }

    handleSkillNameChange(event) {
        //this.skillName = event.detail.value;
        this.newSkillObj.Name = event.detail.value;
    }}