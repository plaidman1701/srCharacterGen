import { LightningElement, track } from 'lwc';

import getInitData from '@salesforce/apex/SR_AppWrapperCtrl.getInitData';

import { BASE_ATTS } from "c/sr_jsModules";

import eventHelper from './helpers/eventHelper.js';
import apexHelper from "./helpers/apexHelper.js";

const LABELS = {
    attributes: "Attributes",
    skills: "Skills",
    tabs: {
        
        basic: "Basic info",
        metaraceAtts: "Metarace and Attributes",
        skills: "Skills"
        
    },
    buttons: {
        newChar: "New Character",
        cancelAll: "Cancel All",
        random: "Random",
        save: "Save"
    },
    toast: {
        success: "Success",
        charSaved: "Character saved"
    }
};


export default class SR_AppWrapper extends LightningElement {
    objectsBeingDeleted;

    labels = LABELS;

    handles;

    showSpinner = false;

    @track selectedChar;
    @track SkillAssigns__r = [];

    basicInfo = {};
    templates;
    characterNames;

    adjuEffects = [];

    saveDisabled = true;

    get attMaxValues() {
        let maxVals = {};
        BASE_ATTS.forEach(element => {
            maxVals[element] = 6;
        });

        return maxVals;
    }


    connectedCallback() {
        apexHelper.getInitData(this);
        eventHelper.resetObjectsBeingDeleted(this);
    }

    handleClick(event) {
        event.stopPropagation();

        //console.log(event.target.dataset.name);

        switch (event.target.dataset.name) {
            case "NewChar":
                eventHelper.setNewChar(this);
                break;
            case "ClearChar":
                eventHelper.clearChar(this);
                break;
            case "SaveChar":
                apexHelper.saveCharacter(this);
                break;
            case "RandomName":
                eventHelper.randomizeName(this);
                break;   
            case "existingChar":
                //console.log('clicked existingChar');
                apexHelper.getCharacter(this, event.target.dataset.character_id);
                break;   
        }
    }

    handleChange(event) {
        event.stopPropagation();

        eventHelper.changeValue(this, event.target.dataset.name, event.target.value);

        // switch (event.target.dataset.name) {
        //     case "charName":
        //         eventHelper.changeName(this, event.target.value);
        //         break;
        // }
    }

    handleChildEvent(event) {
        event.stopPropagation();

        //console.log('handleChildEvent event:');
        //console.log(JSON.stringify(event));

        switch (event.type) {
            case "toggleSpinner":
                this.showSpinner = !this.showSpinner;
                break;
            case "metarace_and_atts":
                eventHelper.handlemetarace_and_atts(this, event.detail);
                break;
            case "skill_change":
                eventHelper.handleskill_change(this, event.detail);
                break;
        }

        eventHelper.rebuildAdjusAndBasicInfo(this);
        this.saveDisabled = false;
    }





}