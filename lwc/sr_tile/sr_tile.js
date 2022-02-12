import { LightningElement, api } from 'lwc';
import { sendEvt } from "c/sr_jsModules";


export default class Sr_tile extends LightningElement {
    @api tileObj = {};

    handleOnClick(event) {
        //console.log('tile click');
        //console.log(this.tileObj.Id);
        event.stopPropagation();
        sendEvt(this, 'tileclick', { Id: this.tileObj.Id });
    }
}