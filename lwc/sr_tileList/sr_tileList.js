import { LightningElement, api, track } from 'lwc';

import helper from "./helpers/helper.js";
import { buildListForDisplay, sendEvt } from "c/sr_jsModules";

export default class Sr_tileList extends LightningElement {
    @api sectionLabels = [];
    
    
    // @api displayObject = {};
    // @track _displayObject = {};
    // @api
    // get displayObject() {
    //     return this._displayObject;
    // }
    // set displayObject(value) {
    //     this._displayObject = value;
    //     console.log('set displayobject:');
    //     console.log(JSON.stringify(this.displayObject));
    // }

    @api orderedListToDisplay = [];
    get displayObject() {
        // console.log('getting displayObject');
        // console.table(this.orderedListToDisplay);
        return buildListForDisplay(this.orderedListToDisplay, ...this.sectionLabels);
    }


    @api tilesPerColumn = 3;

    connectedCallback() {
        console.log('Sr_tileList');
        console.log(JSON.stringify(this.orderedListToDisplay));
        console.log(...this.sectionLabels)
        //console.log("displayObject:");
        //console.log(JSON.stringify(this.displayObject));
        
    }

    get tileClass() {
        return `slds-col slds-size_1-of-${this.tilesPerColumn}`;
    }

    handleOnClick(event) {
        event.stopPropagation();
        sendEvt(this, 'tileclick', event.detail);
    }
}