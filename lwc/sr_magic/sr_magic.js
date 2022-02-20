import { LightningElement, api, track } from 'lwc';
import { oneToSixCombobox, placeholderIdGenerator } from "c/sr_jsModules";

//import helper from "./helpers/helper.js";
const LABELS = {
    tabs: {
        typeAndTradition: "Type & Tradition",
        spells: "Spells"
    },
    magicianType: "Magician Type",
    none: "None",
    traditions: "Traditions",
    totems: "Totems",
    elementalOptions: "Elemental Options",
    characteristics: "Characteristics",
    favouredEnvironment: "Favoured Environment",
    advantagesDisadvantages: "Advantages / Disadvantages"

};

export default class Sr_magic extends LightningElement {
    labels = LABELS;

    // @track _selectedChar;
    // @api
    // get selectedChar() {
    //     return this._selectedChar;
    // };
    // set selectedChar(value) {
    //     //console.log('Sr_magic receiving new selectedChar');
    //     this._selectedChar = Object.assign({}, value);

    //     //console.log(JSON.stringify(this.selectedChar));

    //     //this.magicianTypeId = this.selectedChar.MagicianTypeId__c;
    //     //this.magicalTradition = this.selectedChar.MagicalTradition__c;
    //     //this.totemId = this.selectedChar.TotemId__c;

    //     //helper.buildSpellListsToDisplay(this);
    //     helper.buildSpellListsToDisplay(this);

    // }

    @api selectedChar;

    @api spellAssigns;

/*
    @api selectedSpellAssigns = [];

    _magicCollectionContainers;
    @api
    get magicCollectionContainers() {
        return this._magicCollectionContainers;
    }
    set magicCollectionContainers(value) {
        this._magicCollectionContainers = value;

        // do inits here
        helper.buildSpellListsToDisplay(this);
    }

    get spellTemplateCollectionContainer() {
        return this.magicCollectionContainers?.spellTemplates;
    }
    get totemCollectionContainer() {
        return this.magicCollectionContainers?.totems;
    }
    get magicianTypeCollectionContainer() {
        return this.magicCollectionContainers?.magicianTypes;
    }

    _magicianTypeRadioOptions;
    get magicianTypeRadioOptions() {
        if (!this._magicianTypeRadioOptions && this.magicianTypeCollectionContainer) {
            this._magicianTypeRadioOptions = [];
            this.magicianTypeCollectionContainer.dataList.forEach(magicType => {
                this._magicianTypeRadioOptions.push({ label:magicType.Label, value: magicType.Id });
            });
            this._magicianTypeRadioOptions.unshift({label: this.labels.none, value: this.labels.none });

        }

        return this._magicianTypeRadioOptions;
    }

    get selctedMagicianTypeId() {
        return (this.selectedChar?.MagicianTypeId__c || this.labels.none);
    }

    get magicianTypeObj() {
        return this.magicianTypeCollectionContainer?.dataObj[this.selectedChar?.MagicianTypeId__c];

        // if (this.magicianTypeCollectionContainer && this.selectedChar?.MagicianTypeId__c)
        //     return this.magicianTypeCollectionContainer.dataOdj[this.selectedChar.MagicianTypeId__c];
    }

    get selectedTotemObj() {
        return this.totemCollectionContainer?.dataObj[this.selectedChar?.TotemId__c];
    }

    get selectedSpellTemplateObj() {
        return this.spellTemplateCollectionContainer?.dataObj[this.selectedSpellTemplateId];
    }

    _spellTemplateVariants;
    get spellTemplateVariants() {
        if (this._spellTemplateVariants) return this._spellTemplateVariants;

        if (!this._spellTemplateVariants && this.selectedSpellTemplateObj?.Variants__c) {
            let count = 0;
            this._spellTemplateVariants = this.selectedSpellTemplateObj.Variants__c.split(";").map(variant => {
                console.log(JSON.stringify({ label: variant, value: count }));
                return { label: variant, value: count++ }
            });
        }

        return this._spellTemplateVariants;
    }

    get magicianTypeTraditionOptions() {
        return this.magicianTypeObj?.TraditionOptions__c?.split(";").map(tradition => {
            return { label: tradition, value: tradition }
        });
    }

    get elementalOptions() {
        return this.magicianTypeObj?.SpecialOptions__c?.split(";").map(elemental => { return { label: elemental, value: elemental }});
    }

    get availableTotemOptions() {
        if (this.magicianTypeObj?.TraditionOptions__c?.includes("Shamanic") && this.selectedChar.MagicalTradition__c === "Shamanic" && this.totemCollectionContainer) {
            return this.totemCollectionContainer.dataList
            .filter(totem => {
                return (this.magicianTypeObj.RequiresSpellBonus__c ? !!totem.Spell_Bonus__c : true);
            })
            .map(totem => {
                return { label: totem.Label, value: totem.Id }            
            });
        }
    }


    handleradio_change(event) {
        event.stopPropagation();

        this.selectedChar[event.target.dataset.attributeName] = (event.detail.value === this.labels.none ? null : event.detail.value);
        helper.sendEventToParent(this);
    }



    handleSpellDetailChange(event) {
        event.stopPropagation();

        // console.log('handleSpellDetailChange');
        // console.log(event.target.dataset.attributeName);

        let eventValue = event.detail.value;
        this.selectedSpellAssignObj[event.target.dataset.attributeName] = isNaN(eventValue) ? eventValue : Number(eventValue);
        // console.log('this.selectedSpellAssignObj');
        // console.log(JSON.stringify(this.selectedSpellAssignObj));

        //spellTemplateVariantIndex



    }

    @track spellTemplateListToDisplay;

    selectedSpellTemplateId;
    selectedSpellAssignId;
    handleSpellTemplateClick(event) {
        event.stopPropagation();

        this.selectedSpellAssignId = undefined;
        this.selectedSpellTemplateId = event.detail.Id;
        this._spellTemplateVariants = undefined;

        this._selectedSpellAssignObj = {SpellTemplateVariantIndex__c: 0}; // set new spell assign obj
    }

    handleSpellAssignClick(event) {
        event.stopPropagation();

        this.selectedSpellTemplateId = undefined;
        this.selectedSpellAssignId = event.detail.Id;

        console.log(event.detail.Id);
    }

    @track _selectedSpellAssignObj;
    get selectedSpellAssignObj() {
        console.log('getting selectedSpellAssignObj');
        console.log(JSON.stringify(this._selectedSpellAssignObj));
        return this._selectedSpellAssignObj;
    }

    get selectedDrain() {
        let drainArray = this.selectedSpellTemplateObj.Drain__c.split(";");
        return (drainArray.length === 1 ? drainArray[0] : drainArray[this.selectedSpellAssignObj?.SpellTemplateVariantIndex__c]);
    }

    get selectedDuration() {
        let durationArray = this.selectedSpellTemplateObj.Duration__c.split(";");
        return (durationArray.length === 1 ? durationArray[0] : durationArray[this.selectedSpellAssignObj?.SpellTemplateVariantIndex__c]);
    }






    handletypeAndTradition(event) {
        console.log("handletypeAndTradition");
        console.log(JSON.stringify(event.detail));

        this.selectedChar = event.detail.characterData;

        helper.sendEventToParent(this);
    }
*/
    handleUpdateEvent(event) {
        event.stopPropagation();

        let newEvent = new CustomEvent(event.type, event)
        this.dispatchEvent(newEvent);
    }


/*


    spellSectionLabels = [ "Category__c", "Subcategory__c" ];

    @api magicianTypeMap = {};
    @api totemMap = {};
    @api spellTemplateMap = {};
    @api selectedSpellAssigns = [];

    @track _selectedChar;
    @api
    get selectedChar() {
        return this._selectedChar;
    };
    set selectedChar(value) {
        console.log('Sr_magic receiving new selectedChar');
        this._selectedChar = value;

        this.magicianTypeId = this.selectedChar.MagicianTypeId__c;
        //this.magicalTradition = this.selectedChar.MagicalTradition__c;
        //this.totemId = this.selectedChar.TotemId__c;

        //helper.buildSpellListsToDisplay(this);

    }

    // set by the UI
    magicianTypeId;
    magicalTradition;
    totemId;
    elementalOption;

    filteredSpellTemplateIdSet = new Set();

    spellTemplateListToDisplay = [];
    spellAssignListToDisplay = [];

    selectedSpellTemplateId;
    selectedSpellAssignId;

    get selectedSpellTemplateObj() {
        let templateId = this.selectedSpellTemplateId || this.selectedSpellAssignObj?.SpellTemplateId__c;
        return this.spellTemplateCollectionContainer?.gataObj[templateId];
    }

    get selectedSpellAssignObj() {
        return this.selectedSpellAssigns.find(spellAssign => spellAssign.Id == this.selectedSpellAssignId);
    }

    get selectedTotemObj() {
        return this.totemMap[this.selectedChar.TotemId__c];
    }



    get magicianTypeObj() {
        if (this.magicianTypeCollectionContainer && this.selectedChar?.MagicianTypeId__c)
            return this.magicianTypeCollectionContainer.dataOdj[this.selectedChar.MagicianTypeId__c];
    }

    get magicianTypeTraditions() {
        return this.magicianTypeObj?.TraditionOptions__c?.split(";").map(tradition => {
            return { label: tradition, value: tradition }
        });
    }

    get showSpells() {
        return this.magicianTypeObj?.AllowsSpells__c && this.spellTemplateListToDisplay?.length;
    }

    get elementalOptions() {
        return this.magicianTypeObj?.SpecialOptions__c?.split(";").map(elemental => { return { label: elemental, value: elemental }});
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

    handleElementalOptionChange(event) {
        event.stopPropagation();
        this.elementalOption = event.detail.value;
        //helper.buildSpellTemplateListToDisplay(this);

        helper.sendEventToParent(this);
    }

    handleSpellTemplateClick(event) {
        event.stopPropagation();

        this.selectedSpellAssignId = undefined;
        this.selectedSpellTemplateId = event.detail.Id;

        console.log(event.detail.Id);
    }

    handleSpellAssignClick(event) {
        event.stopPropagation();

        this.selectedSpellTemplateId = undefined;
        this.selectedSpellAssignId = event.detail.Id;

        console.log(event.detail.Id);
    }
    */
}