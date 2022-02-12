import { LightningElement, api, track } from 'lwc';

import helper from './helpers/helper.js';
import { oneToSixCombobox } from "c/sr_jsModules";

const LABELS = {
    selectMetarace: "Select Metarace",
    atts: {
        body: "Body",
        strength: "Strength",
        quickness: "Quickness",
        intelligence: "Intelligence",
        willpower: "Willpower",
        charisma: "Charisma",
        reaction: "Reaction"
    },
    initiative: "Initiative"
};


export default class Sr_metaraceAndAtts extends LightningElement {
    @api metaraceTemplateMap = {};
    // @api metaraceAdjustmentMap = {};
    @api selectedChar = {};
    @api attMaxValues = {};
    @api adjuEffects = {};

    // get adjuList() {
    //     let returnList = [];

    //     // metarace
    //     if (!!this.metaraceAdjustmentMap[this.selectedChar.MetaraceTemplate__c]) {
    //         returnList = returnList.concat(this.metaraceAdjustmentMap[this.selectedChar.MetaraceTemplate__c]);
    //     }

    //     // helper.buildBonusEffects(this, returnList);

    //     return returnList;
    // }

    // get adjuListListEffects() {
    //     // let returnObj = helper.buildAdjuEffects(this, this.adjuList);
    //     let returnObj = helper.buildAdjuEffects(this);

    //     console.log('adjuListListEffects:');
    //     console.log(JSON.stringify(returnObj));


    //     return returnObj;
    // }    

    get selectedMetaraceTemplate() {
        return this.metaraceTemplateMap[this.selectedChar.MetaraceTemplate__c];
    };

    _attComboxValues = {};
    get attComboxValues() {
        if (this.attMaxValues) {
            this._attComboxValues = {};
            for (const [key, value] of Object.entries(this.attMaxValues)) {
                // let options = [];
                // for (let i = 1; i <= value; ++i) {
                //     options.push({ label: i, value: i});
                // }
                // this._attComboxValues[key] = options;
                this._attComboxValues[key] = oneToSixCombobox;

            }           
        }

        return this._attComboxValues;
    }

    labels = LABELS;

    selectedOptions = {}; // options selcted by the player, to be sent up in an event

    get metaraceOptions() {
        let returnList = [];

        // if (!this.metaraceTemplateMap) return returnList;

        for (const [key, value] of Object.entries(this.metaraceTemplateMap)) {
            returnList.push( {label: value.Label, value: key} );
          }

        return returnList;
    }

    get selectedMetaraceName() {
        return this.metaraceTemplateMap[this.selectedChar.MetaraceTemplate__c].Label;
    }

    connectedCallback() {
        helper.setInitValues(this);
    }

    handleAttChange(event) {
        event.stopPropagation();

        if (!event.target.dataset.attributename) {
            return;
        }

        helper.applyAttChange(this, event.target.dataset.attributename, event.target.value);

        helper.sendEvt(this);

    }


}