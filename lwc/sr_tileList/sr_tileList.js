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
        helper.checkForListBuild(this);
    }

    _orderedListToDisplay;
    @api
    get orderedListToDisplay() {
        return this._orderedListToDisplay;
    }
    set orderedListToDisplay(value) {
        this._orderedListToDisplay = value;
        helper.checkForListBuild(this);
    }

    @track displayObject = {};

    @api tilesPerColumn = 3;

    connectedCallback() {
        
    }

    get tileClass() {
        return `slds-col slds-size_1-of-${this.tilesPerColumn}`;
    }

    handleOnClick(event) {
        event.stopPropagation();
        sendEvt(this, 'tileclick', event.detail);
    }
}