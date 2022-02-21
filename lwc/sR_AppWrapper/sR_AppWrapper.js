import { LightningElement, track } from 'lwc';

import { BASE_ATTS, Enums } from "c/sr_jsModules";

import { apexHelper, eventHelper } from "./helpers/helper.js";

const LABELS = {
    attributes: "Attributes",
    skills: "Skills",
    magic: "Magic",
    forcePoints: "Force Points",
    tabs: {
        
        basic: "Basic info",
        metaraceAtts: "Metarace and Attributes",
        skills: "Skills",
        magic: "Magic"
        
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
    },
    handle: "Handle",
    realName: "Real Name",
    notes: "Notes"
};

export default class SR_AppWrapper extends LightningElement {
    objectsBeingDeleted;

    labels = LABELS;

    handles;

    showSpinner = false;

    @track selectedChar;
    @track SkillAssigns__r = [];
    @track spellAssigns = [];

    basicInfo = {};
    templates;
    characterNames = [];

    adjuEffects = [];

    saveDisabled = true;

    get attMaxValues() {
        let maxVals = {};
        BASE_ATTS.forEach(element => {
            maxVals[element] = 6;
        });

        return maxVals;
    }

    collectionContainers = {};
    adjustmentTemplates = {};


    connectedCallback() {
        console.log('connectedCallback SR_AppWrapper');

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

        this.selectedChar[field] = value;
        this.saveDisabled = false;
    }

    handleUpdateEvent(event) {
        //console.log('handleUpdateEvent');

        let payload = event.detail

        switch (payload.updateType) {
            case Enums.Character:
                //console.log('Enums.Character event caught');

                this.selectedChar = Object.assign({}, payload.updateObj);

                //console.log('new this.selectedChar:');
                //console.log(JSON.stringify(this.selectedChar));
                break;
            case Enums.AssignObjTypes.Skill:
                eventHelper.handleSkillChange(this, payload);
                break;
            case Enums.AssignObjTypes.Spell:
                eventHelper.handleSpellChange(this, payload);
                break;

        }

        eventHelper.rebuildAdjusAndBasicInfo(this);
        this.saveDisabled = false;
    }
}