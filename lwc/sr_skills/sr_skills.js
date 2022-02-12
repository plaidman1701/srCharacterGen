import { LightningElement, api, track } from 'lwc';
import helper from "./helpers/helper.js";
import { oneToSixCombobox, sendEvt } from "c/sr_jsModules";

const LABELS = {
    chooseRating: "Choose Rating",
    save: "Save",
    delete: "Delete"
};

export default class Sr_skills extends LightningElement {
    labels = LABELS;

    // sortFields = ["Type__c", "Category__c", "Label"];

    @api skillTemplateMap;

    _selectedSkills = [];
    @api
    get selectedSkills() {
        return this._selectedSkills;
    }
    set selectedSkills(value) {
        this._selectedSkills = value;
        //('got selectedSkills');
        //console.log(JSON.stringify(this.selectedSkills));


        helper.buildMinimalSelectedSkillList(this);
        helper.buildSortedSkillListArray(this);

        // refresh
        this.selectedSkillObj;
    }
    minimalSkillList = [];

    orderedSkillTemplateList = [];
    orderedSkillList = [];
    skillSectionLabels = [ "Type__c", "Category__c" ];
    
    get selectedSkillObj() {
        return this.selectedSkills?.find(skill => skill.Id == this.selectedSkillId);
        //return this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.selectedSkillTemplateId);
    }
    get selectedTemplateObj(){
        return this.skillTemplateMap[this.selectedSkillTemplateId];
    }

    skillTemplateList = [];
    skillTemplateObj = {};
    @track selectedSkillsObj = {};

    selectedSkillTemplateId;
    selectedSkillId;
    selectedSkillRating;

    skillName;

    get disableSave() {
        return !this.selectedSkillRating || (this.selectedTemplateObj.Requires_Name__c && !this.skillName);
    }

    get disableDelete() {
        return !this.selectedSkillObj;
    }

    get skillRatingOptions() {
        return oneToSixCombobox;
    }

    get skillTemplateDescription() {
        if (!this.selectedSkillTemplateId) {
            return;
        }

        return this.skillTemplateMap[this.selectedSkillTemplateId].Description__c;
    }

    
    connectedCallback() {
        //console.log("Sr_skills");
        //console.log(JSON.stringify(this.skillTemplateMap));
        //console.log(typeof this.skillTemplateMap);

        // let skillTemplateMap = JSON.parse(JSON.stringify(this.skillTemplateMap));

        // this.skillTemplateList = Object.entries(skillTemplateMap).map(([ key, value ]) => value);
        //this.skillTemplateList = Object.entries(this.skillTemplateMap);
        console.log('Sr_skills');
        sendEvt(this, "toggleSpinner");

        helper.buildMinimalSkillTemplateList(this);
        helper.buildSkillTemplateArray(this);

        helper.buildMinimalSelectedSkillList(this);
        helper.buildSortedSkillListArray(this);

        console.log('orderedSkillTemplateList ' + Array.isArray(this.orderedSkillTemplateList));
        console.table(this.orderedSkillTemplateList);
        console.log('orderedSkillList ' + Array.isArray(this.orderedSkillList));
        console.table(this.orderedSkillList);
        sendEvt(this, "toggleSpinner");

    }

    handleTemplateListClick(event) {
        event.stopPropagation();

        this.selectedSkillId = undefined;
        this.selectedSkillRating = undefined;
        this.skillName = undefined;

        this.selectedSkillTemplateId = event.detail.Id;

        // determine if multiskill
        let skillTemplate = this.skillTemplateMap[this.selectedSkillTemplateId];
        if (skillTemplate.Requires_Name__c) {
            // new multiskill
            
        } else {
            this.selectedSkillId = this.selectedSkills?.find(skill => skill.SkillTemplateId__c == this.selectedSkillTemplateId)?.Id;
            //this.selectedSkillRating = this.selectedSkillObj?.Rating__c;  
        }     
        // check if skill selected
        this.selectedSkillRating = this.selectedSkillObj?.Rating__c;                
    }

    handleSkillListClick(event) {
        event.stopPropagation();

        this.selectedSkillId = event.detail.Id;
        // find template Id
        // this.selectedSkillTemplateId = this.selectedSkills.filter(skill => skill.Id == this.selectedSkillId)[0].SkillTemplateId__c;
        this.selectedSkillTemplateId = this.selectedSkillObj?.SkillTemplateId__c;

        this.selectedSkillRating = this.selectedSkillObj?.Rating__c;   
        this.skillName = this.selectedSkillObj?.Special_Skill_Name__c;
    }

    handleRatingChange(event) {
        event.stopPropagation();
        //console.log('handleRatingChange');
        //console.log(event.detail.value);


        this.selectedSkillRating = parseInt(event.detail.value);
    }

    handleButtonClick(event) {
        //console.log(event.target.dataset.name)
        switch (event.target.dataset.name) {
            case "save":
                helper.saveSkill(this);
                break;
            case "delete":
                helper.deleteSkill(this);
                break;
        }

        this.selectedSkillTemplateId = undefined;
    }

    handleSkillNameChange(event) {
        this.skillName = event.detail.value;
    }
}