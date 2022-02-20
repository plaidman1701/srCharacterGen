import { LightningElement, api } from 'lwc';
import { sendUpdateEvent, Enums, collectionContainers } from "c/sr_jsModules";

const LABELS = {
    magicianType: "Magician Type",
    none: "None",
    traditions: "Traditions",
    totems: "Totems",
    elementalOptions: "Elemental Options",
    characteristics: "Characteristics",
    favouredEnvironment: "Favoured Environment",
    advantagesDisadvantages: "Advantages / Disadvantages"
};


export default class Sr_magic_typeAndTradition extends LightningElement {
    labels = LABELS;

    _selectedChar;
    @api
    get selectedChar() {
        return this._selectedChar;
    }
    set selectedChar(value) {
        this._selectedChar = Object.assign({}, value);
    }

    get totemCollectionContainer() {
        return collectionContainers.magic.totems;
    }
    get magicianTypeCollectionContainer() {
        return collectionContainers.magic.magicianTypes;
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
        sendUpdateEvent(this, Enums.Character, this.selectedChar);
    }
}