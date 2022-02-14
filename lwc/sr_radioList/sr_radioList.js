import { LightningElement, api } from 'lwc';
import { sendEvt } from "c/sr_jsModules";
import { placeholderIdGenerator } from "c/sr_jsModules";


export default class Sr_radioList extends LightningElement {
    @api radioOptions = [];
    @api radioLabel;
    @api value;
    radioGroupName = placeholderIdGenerator.next().value;

    handleonchange(event) {
        sendEvt(this, "radio_event", { value: event.target.value });
    }
}