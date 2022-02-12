import { LightningElement, api } from 'lwc';

export default class Sr_basicInfo extends LightningElement {
    @api basicInfo;
    @api buildPointsMax = 105;


    get totalCost() {
        if (!this.basicInfo) return;

        return this.buildPointsMax - Object.entries(this.basicInfo).reduce(((previousValue, currentValue) => previousValue + currentValue[1].cost), 0);
    }
}

