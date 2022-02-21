import { LightningElement, api } from 'lwc';
import { collectionContainers } from "c/sr_jsModules";

const LABELS = {
    tabs: {
        typeAndTradition: "Type & Tradition",
        spells: "Spells",
        physadPowers: "Physical Adept Powers"
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

    get magicianTypeCollectionContainer() {
        return collectionContainers.magic.magicianTypes;
    }

    get magicianTypeObj() {
        return this.magicianTypeCollectionContainer?.dataObj[this.selectedChar?.MagicianTypeId__c];
    }

    get showSpells() {
        return this.magicianTypeObj?.AllowsSpells__c;
    }

    get showPhysad() {
        return this.magicianTypeObj?.AllowsPhysad__c;
    }


    @api selectedChar;

    @api spellAssigns;

    handleUpdateEvent(event) {
        event.stopPropagation();

        let newEvent = new CustomEvent(event.type, event)
        this.dispatchEvent(newEvent);
    }
}