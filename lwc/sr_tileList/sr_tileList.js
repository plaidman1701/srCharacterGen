import { LightningElement, api, track } from 'lwc';

import helper from "./helpers/helper.js";
import { buildListForDisplay, sendEvt } from "c/sr_jsModules";

export default class Sr_tileList extends LightningElement {
    _sectionLabels;
    @api
    get sectionLabels() {
        return this._sectionLabels;
    }
    set sectionLabels(value) {
        this._sectionLabels = value;
        if (this.orderedListToDisplay) this.displayObject = buildListForDisplay(this.orderedListToDisplay, ...this.sectionLabels);
    }

    _orderedListToDisplay;
    @api
    get orderedListToDisplay() {
        return this._orderedListToDisplay;
    }
    set orderedListToDisplay(value) {
        this._orderedListToDisplay = value;
        if (this.sectionLabels) this.displayObject = buildListForDisplay(this.orderedListToDisplay, ...this.sectionLabels);
    }

    @track displayObject = {};

    /*
        
    @api sectionLabels = [];
    @api orderedListToDisplay = [];


    get displayObject() {
        // console.log('getting displayObject');
        // console.table(this.orderedListToDisplay);
        // console.log('this._displayObject:');
        // console.log(JSON.stringify(buildListForDisplay(this.orderedListToDisplay, ...this.sectionLabels)));
        return buildListForDisplay(this.orderedListToDisplay, ...this.sectionLabels);
    }
*/

    @api tilesPerColumn = 3;

    connectedCallback() {
        console.log('Sr_tileList');
        // console.log(JSON.stringify(this.orderedListToDisplay));
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