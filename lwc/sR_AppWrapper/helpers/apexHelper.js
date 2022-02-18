import getInitData from '@salesforce/apex/SR_AppWrapperCtrl.getInitData';
import saveCharacter from '@salesforce/apex/SR_AppWrapperCtrl.saveCharacter';
import getCharacter from '@salesforce/apex/SR_AppWrapperCtrl.getCharacter';

import { simpleToast, CollectionContainer } from "c/sr_jsModules";
import eventHelper from './eventHelper';

const skillSectionLabels = [ "Type__c", "Category__c" ];
const skillOrdering = [
    ["Active", "Combat", "Physical", "Technical", "Magical"],
    ["Social", "Ettiquette"],
    ["Vehicle"],
    ["Build and Repair", "Active", "Vehicle"],
    ["Knowledge"],
    ["Special"]            
];

const spellSectionLabels = [ "Category__c", "Subcategory__c" ];
const spellOrdering = [
    ["Combat"],
    ["Detection"],
    ["Health"],
    ["Illusion"],
    ["Manipulation", "Control Manipulations", "Telekinetic Manipulations", "Transformation Maniplulations"]      
];

let randomizeArray = (arr) => {
    for (let index = 0; index < arr.length; ++index) {
        let tempIndex = Math.floor(Math.random() * arr.length);
        let tempValue = arr[tempIndex];
        arr[tempIndex] = arr[index];
        arr[index] = tempValue;
    }
};

function stripPlaceholderIds(cmp) {
    // skills
    cmp.SkillAssigns__r.forEach(skill => {
        if (skill.Id.startsWith("placeholder")) delete skill.Id;
    });
    cmp.objectsBeingDeleted.skillAssigns =
        cmp.objectsBeingDeleted.skillAssigns.filter(skill => !skill.Id.startsWith("placeholder"));
    

}

function processIncomingCharacterData(cmp) {
    // set these lists individually, so they're reactive
    cmp.SkillAssigns__r = cmp.selectedChar.SkillAssigns__r;
    //cmp.SkillAssigns__r = JSON.parse(JSON.stringify(cmp.selectedChar.SkillAssigns__r));

    eventHelper.rebuildAdjusAndBasicInfo(cmp);
}

let apexHelper = {
    getInitData: (cmp) => {
        console.log('getting init data');

        cmp.showSpinner = true;
        getInitData()
            .then(result => {
                console.log('got init data');
                console.log(JSON.stringify(result));

                cmp.characterNames = result.characterNames;

                cmp.handles = result.sampleHandles;
                randomizeArray(cmp.handles);

                cmp.templates = result.templates; // arrives as a list of objects

                cmp.collectionContainers.metarace = {};
                cmp.collectionContainers.metarace.metaraces = new CollectionContainer(result.templates.metaraceTemplateMap, null, null);
                cmp.adjustmentTemplates.metarace = result.templates.metaraceAdjustmentMap;

                cmp.collectionContainers.skills = {};
                cmp.collectionContainers.skills.skillTemplates = new CollectionContainer(result.templates.skillTemplateMap, skillOrdering, skillSectionLabels);

                cmp.collectionContainers.magic = {};
                cmp.collectionContainers.magic.magicianTypes = new CollectionContainer(result.templates.magicianTypeMap, null, null);
                cmp.collectionContainers.magic.totems = new CollectionContainer(result.templates.totemMap, null, null);
                cmp.collectionContainers.magic.spellTemplates = new CollectionContainer(result.templates.spellTemplateMap, spellOrdering, spellSectionLabels);
                cmp.adjustmentTemplates.totems = result.templates.totemAdjustmentMap;


            })
            .catch(error => {
                console.log('error');
                console.log(error);
            })
            .finally(() => {
                cmp.showSpinner = false;
            });
    },

    saveCharacter: (cmp) => {
        cmp.showSpinner = true;

        stripPlaceholderIds(cmp);
        let charDataWrapper = {
            character: cmp.selectedChar,
            skillAssigns: cmp.SkillAssigns__r || [],
            skillAssignsToDelete: cmp.objectsBeingDeleted?.skillAssigns || []
        };
        console.log('charDataWrapper:');
        console.log(JSON.stringify(charDataWrapper));
        saveCharacter( {charDataWrapper} )
            .then(result => {
                console.log('result');
                console.log(JSON.stringify(result));
                if (result.isSuccess) {
                    cmp.characterNames = result.characterNames;
                    
                    cmp.selectedChar = result.character;

                    processIncomingCharacterData(cmp);
                    // eventHelper.rebuildAdjusAndBasicInfo(cmp);


                    cmp.saveDisabled = true;
                    simpleToast(cmp, cmp.labels.toast.success, cmp.labels.toast.charSaved, "success");
                } else {
                    console.log('error: ' + result.errorMessage);
                }
            })
            .catch(error => {
                console.log('error');
                console.log(JSON.stringify(error));
            })
            .finally(() => {
                cmp.showSpinner = false;
            });

        cmp.selectedChar = undefined; // result will have a clean load
    },

    getCharacter: (cmp, charId) => {
        cmp.showSpinner = true;
        eventHelper.resetObjectsBeingDeleted(cmp);

        getCharacter( {charId} )
            .then(result => {
                console.log('getCharacter result');
                console.log(JSON.stringify(result));
                cmp.selectedChar = result.character;
                //cmp.selectedChar = JSON.parse(JSON.stringify(result.character));

                processIncomingCharacterData(cmp);

                // // set these lists individually, so they're reactive
                // cmp.SkillAssigns__r = cmp.selectedChar.SkillAssigns__r;
                // //cmp.SkillAssigns__r = JSON.parse(JSON.stringify(cmp.selectedChar.SkillAssigns__r));

                // eventHelper.rebuildAdjusAndBasicInfo(cmp);
            })
            .catch(error => {
                console.log('error');
                console.log(JSON.stringify(error));
            })
            .finally(() => {
                cmp.showSpinner = false;
            });
    }

};

export default apexHelper;