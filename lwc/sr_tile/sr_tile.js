import { LightningElement, api } from 'lwc';
import { sendEvt } from "c/sr_jsModules";

const LABELS = {
    varies: "Varies"
}

export default class Sr_tile extends LightningElement {
    @api tileObj = {};

    labels = LABELS;

    handleOnClick(event) {
        //console.log('tile click');
        //console.log(this.tileObj.Id);
        event.stopPropagation();
        sendEvt(this, 'tileclick', { Id: this.tileObj.Id });
    }

    get drain() {
         if (!this.tileObj.Drain__c) return;

         return (this.tileObj.Drain__c.includes(";") ? this.labels.varies : this.tileObj.Drain__c)
    }
}