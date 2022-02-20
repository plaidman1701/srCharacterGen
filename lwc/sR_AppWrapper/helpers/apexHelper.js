import getInitData from '@salesforce/apex/SR_AppWrapperCtrl.getInitData';
import saveCharacter from '@salesforce/apex/SR_AppWrapperCtrl.saveCharacter';
import getCharacter from '@salesforce/apex/SR_AppWrapperCtrl.getCharacter';

import { simpleToast, filterAndBuildSpellTemplateList, setCollectionContainers, filterAndBuildSpellLists } from "c/sr_jsModules";
//import eventHelper from './eventHelper';
import { eventHelper, processIncomingCharacterData} from "./helper.js";


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

function stripPlaceholderIds(objList) {
    // console.log('stripPlaceholderIds enter');
    // console.log(JSON.stringify(objList));

    objList.forEach(element => {
        if (element.Id.startsWith("placeholder")) delete element.Id;
    });
   // console.log('stripPlaceholderIds done');

    /*
    // skills
    cmp.SkillAssigns__r.forEach(skill => {
        if (skill.Id.startsWith("placeholder")) delete skill.Id;
    });
    cmp.objectsBeingDeleted.skillAssigns =
        cmp.objectsBeingDeleted.skillAssigns.filter(skill => !skill.Id.startsWith("placeholder"));
    
    // spells
    cmp.spellAssigns.forEach(spell => {
        if (spell.Id.startsWith("placeholder")) delete spell.Id;
    });
    cmp.objectsBeingDeleted.spellAssigns =
        cmp.objectsBeingDeleted.spellAssigns.filter(spell => !spell.Id.startsWith("placeholder"));
*/
}



let apexHelper = {
    getInitData: (cmp) => {
        //console.log('getting init data');

        cmp.showSpinner = true;
        getInitData()
            .then(result => {
                //console.log('got init data');
                //console.log(JSON.stringify(result));

                cmp.characterNames = result.characterNames;

                cmp.handles = result.sampleHandles;
                randomizeArray(cmp.handles);

                cmp.templates = result.templates; // arrives as a list of objects

                setCollectionContainers(result.templates);

                // cmp.collectionContainers.metarace = {};
                // cmp.collectionContainers.metarace.metaraces = new CollectionContainer(result.templates.metaraceTemplateMap, null, null);
                cmp.adjustmentTemplates.metarace = result.templates.metaraceAdjustmentMap;

                // cmp.collectionContainers.skills = {};
                // cmp.collectionContainers.skills.skillTemplates = new CollectionContainer(result.templates.skillTemplateMap, skillOrdering, skillSectionLabels);

                // cmp.collectionContainers.magic = {};
                // cmp.collectionContainers.magic.magicianTypes = new CollectionContainer(result.templates.magicianTypeMap, null, null);
                // cmp.collectionContainers.magic.totems = new CollectionContainer(result.templates.totemMap, null, null);
                // cmp.collectionContainers.magic.spellTemplates = new CollectionContainer(result.templates.spellTemplateMap, spellOrdering, spellSectionLabels);
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
        console.log('saveCharacter');
        cmp.showSpinner = true;

        // let objectsToUpsert = removeIllegalObjects(cmp);
        // console.log('objectsToUpsert');
        // console.log(JSON.stringify(objectsToUpsert));

        let spellData = filterAndBuildSpellLists(cmp);

        let spellAssignsToUpsert = spellData.spellAssigListToDisplay;
        // any spell assign not being upserted must be deleted
        cmp.spellAssigns.forEach(spell => {
            if (!spellData.spellAssigListToDisplayIds.has(spell.Id)) {
                cmp.objectsBeingDeleted.push(spell);
            }
        });

        // console.log('spellAssignsToUpsert');
        // console.log(JSON.stringify([ ...spellAssignsToUpsert, ...cmp.SkillAssigns__r ]));


        let objectsBeingDeleted = cmp.objectsBeingDeleted.filter(obj => !obj.Id.startsWith("placeholder"));

        stripPlaceholderIds([ ...spellAssignsToUpsert, ...cmp.SkillAssigns__r ]);

        // delete cmp.selectedChar.SkillAssigns__r;
        // delete cmp.selectedChar.spellAssigns;
/*
        let charDataWrapper = {
            character: cmp.selectedChar,
            skillAssigns: cmp.SkillAssigns__r || [],
            skillAssignsToDelete: cmp.objectsBeingDeleted?.skillAssigns || [],
            spellAssigns: spellAssignsToUpsert || [],
            spellAssignsToDelete: cmp.objectsBeingDeleted?.spellAssigns || []
        };
        */

        let charDataWrapper = {
            character: cmp.selectedChar,
            skillAssigns: cmp.SkillAssigns__r || [],
            spellAssigns: spellAssignsToUpsert || [],
            objectsBeingDeleted: objectsBeingDeleted || []
        };

        
        charDataWrapper = JSON.parse(JSON.stringify(charDataWrapper)); // this may not be req'd
        delete charDataWrapper.character.SkillAssigns__r;
        delete charDataWrapper.character.SpellAssigns__r;

        // console.log('charDataWrapper');
        // console.log(JSON.stringify(charDataWrapper));

        saveCharacter( {charDataWrapper} )
            .then(result => {
                console.log('saveCharacter result');
                console.log(JSON.stringify(result));
                if (result.isSuccess) {
                    cmp.characterNames = result.characterNames;
                    
                    cmp.selectedChar = result.character;

                    processIncomingCharacterData(cmp);
                    eventHelper.rebuildAdjusAndBasicInfo(cmp);


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
        processIncomingCharacterData(cmp);

    },

    getCharacter: (cmp, charId) => {
        cmp.showSpinner = true;
        eventHelper.resetObjectsBeingDeleted(cmp);

        getCharacter( {charId} )
            .then(result => {
                cmp.selectedChar = result.character;

                processIncomingCharacterData(cmp);
                eventHelper.rebuildAdjusAndBasicInfo(cmp);

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

export { apexHelper };