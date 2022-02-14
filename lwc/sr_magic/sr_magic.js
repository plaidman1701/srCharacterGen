import { LightningElement, api } from 'lwc';
import helper from "./helpers/helper.js";
const LABELS = {
    tabs: {
        typeAndTradition: "Type & Tradition",
        spells: "Spells"
    },
    magicianType: "Magician Type",
    none: "None",
    traditions: "Traditions",
    totems: "Totems",
    characteristics: "Characteristics",
    favouredEnvironment: "Favoured Environment",
    advantagesDisadvantages: "Advantages / Disadvantages"

};

export default class Sr_magic extends LightningElement {
    labels = LABELS;

    @api magicianTypeMap = {};
    @api totemMap = {};
    @api spellTemplateMap = {}

    _selectedChar;
    @api
    get selectedChar() {
        return this._selectedChar;
    };
    set selectedChar(value) {
        console.log('Sr_magic receiving new selectedChar');
        this._selectedChar = value;
        helper.buildSpellTemplateListToDisplay(this);

    }


    magicianTypeId;
    magicalTradition;
    totemId;

    spellSectionLabels = [ "Category__c", "Subcategory__c" ];
    spellTemplateListToDisplay;

    minifiedSpellTemplateList;


    connectedCallback(){
        // set init values
        this.magicianTypeId = this.selectedChar.MagicianTypeId__c;
        this.magicalTradition = this.selectedChar.MagicalTradition__c;
        this.totemId = this.selectedChar.TotemId__c;

        helper.buildSpellTemplateListToDisplay(this);
    }

    get selectedTotemObj() {
        return this.totemMap[this.selectedChar.TotemId__c];
    }

    get selctedMagicianTypeId() {
        return (this.selectedChar.MagicianTypeId__c ? this.selectedChar.MagicianTypeId__c : this.labels.none);
    }

    get magicianTypeObj() {
        return this.magicianTypeMap[this.selectedChar.MagicianTypeId__c];
    }

    get magicianTypeTraditions() {
        return this.magicianTypeObj?.TraditionOptions__c?.split(";").map(tradition => {
            return { label: tradition, value: tradition }
        });
    }

    get showSpells() {
        return this.magicianTypeObj?.AllowsSpells__c && this.spellTemplateListToDisplay;
    }

    get availableTotems() {
        if (this.magicianTypeObj?.TraditionOptions__c?.includes("Shamanic") && this.selectedChar.MagicalTradition__c === "Shamanic") {
            return Object.entries(this.totemMap)
            .filter(([ key, value ]) => {
                return (this.magicianTypeObj.RequiresSpellBonus__c ? value.Spell_Bonus__c : true);
            })
            .sort((a, b) => {
                return (a[1].Label > b[1].Label ? 1 : -1);
            })
            .map(([ key, value ]) => {
                return { label: value.Label, value: key }            
            });
        }
    }

   
    _magicianTypeRadioOptions;
    get magicianTypeRadioOptions() {
        if (!this._magicianTypeRadioOptions) {
            // console.log('building magicianTypeRadioOptions');
            this._magicianTypeRadioOptions = [];

            let magTypeList = Object.entries(this.magicianTypeMap); // 2d array
            magTypeList.sort((a, b) => a[1].List_Order__c - b[1].List_Order__c);
            magTypeList.forEach(([ key, value ]) => this._magicianTypeRadioOptions.push({ label:value.Label, value: key }));
            this._magicianTypeRadioOptions.unshift({label: this.labels.none, value: this.labels.none });
            console.table(this._magicianTypeRadioOptions);

        }

        return this._magicianTypeRadioOptions;
    }


    // selectedMagicianTypeId;


    handleTypeChange(event) {
        event.stopPropagation();
        console.log('handleTypeChange: ' + event.detail.value);
        this.magicianTypeId = (event.detail.value === this.labels.none ? undefined : event.detail.value);

        // helper.setValuesFromMagicianType(this);
        //helper.buildSpellTemplateListToDisplay(this);

        helper.sendEventToParent(this);

    }

    handleTraditionChange(event) {
        event.stopPropagation();
        console.log('handleTraditionChange: ' + event.detail.value);

        this.magicalTradition = event.detail.value;

        helper.sendEventToParent(this);

    }

    handleTotemChange(event) {
        event.stopPropagation();
        this.totemId = event.detail.value;
        //helper.buildSpellTemplateListToDisplay(this);

        helper.sendEventToParent(this);
    }
}