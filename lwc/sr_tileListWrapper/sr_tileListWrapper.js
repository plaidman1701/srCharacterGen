import { LightningElement, api } from 'lwc';
import { sendEvt } from "c/sr_jsModules";

export default class Sr_tileListWrapper extends LightningElement {
    @api leftSideList = [];
    @api rightSideList = [];
    @api sectionLabels = [];

    connectedCallback() {

    }

    handleLeftClick(event) {
        event.stopPropagation();

        sendEvt(this, 'leftclick', event.detail);
    }

    handleRightClick(event) {
        event.stopPropagation();

        sendEvt(this, 'rightclick', event.detail);
    }
}