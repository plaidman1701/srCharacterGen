import { LightningElement, api, track } from 'lwc';

import helper from './helpers/helper.js';
import { oneToSixCombobox, placeholderIdGenerator, collectionContainers } from "c/sr_jsModules";

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
    //@api metaraceCollectionContainer;
    get metaraceCollectionContainer() {
        console.log('getting metaraceCollectionContainer');
        return collectionContainers.metarace.metaraces;
    }
   
    _selectedChar = {};
    @api
    get selectedChar() {
        return this._selectedChar;
    }
    set selectedChar(value) {
        this._selectedChar = Object.assign({}, value);
    }


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

    metaraceRadioName = placeholderIdGenerator.next().value;

    get selectedMetaraceTemplate() {
//        return this.metaraceTemplateMap[this.selectedChar.MetaraceTemplate__c];
        return this.metaraceCollectionContainer?.dataObj[this.selectedChar?.MetaraceTemplate__c];

    };

    _attComboxValues = {};
    get attComboxValues() {
        if (this.attMaxValues) {
            this._attComboxValues = {};
            for (const [key, value] of Object.entries(this.attMaxValues)) {
                this._attComboxValues[key] = oneToSixCombobox;

            }           
        }

        return this._attComboxValues;
    }

    labels = LABELS;

    //selectedOptions = {}; // options selcted by the player, to be sent up in an event

    _metaraceOptions;
    get metaraceOptions() {
        if (this._metaraceOptions) return this._metaraceOptions;

        this._metaraceOptions = [];
        if (!this.metaraceCollectionContainer) return this._metaraceOptions;

        // if (!this.metaraceTemplateMap) return returnList;

        for (const metarace of this.metaraceCollectionContainer.dataList) {
            this._metaraceOptions.push( {label: metarace.Label, value: metarace.Id} );
          }

        return this._metaraceOptions;
    }

    get selectedMetaraceName() {
        return this.selectedMetaraceTemplate?.Label;
//        return this.selectedMetaraceTemplate[this.selectedChar.MetaraceTemplate__c]?.Label;

    }

    connectedCallback() {
        //helper.setInitValues(this);
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