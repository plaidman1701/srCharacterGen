import { LightningElement, api } from 'lwc';
import { sendEvt } from "c/sr_jsModules";

export default class Sr_tileListWrapper extends LightningElement {
    // @api objLeftSide = {};
    // @api objRightSide = {};

    @api leftSideList = [];
    @api rightSideList = [];
    @api sectionLabels = [];

    connectedCallback() {
        console.log('Sr_tileListWrapper');
        console.log(JSON.stringify(this.leftSideList));
        console.log(JSON.stringify(this.rightSideList));
        console.log(Array.isArray(this.leftSideList));
        console.log(Array.isArray(this.rightSideList));
        console.table(this.leftSideList);
        console.table(this.rightSideList);

    }

    handleLeftClick(event) {
        event.stopPropagation();
        //console.log('heard left click');

        //console.log(JSON.stringify(event.detail));
        sendEvt(this, 'leftclick', event.detail);

    }

    handleRightClick(event) {
        event.stopPropagation();
        //console.log('heard right click');

        //console.log(JSON.stringify(event.detail));
        sendEvt(this, 'rightclick', event.detail);
    }




}