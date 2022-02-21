import getInitData from '@salesforce/apex/SR_AppWrapperCtrl.getInitData';
import saveCharacter from '@salesforce/apex/SR_AppWrapperCtrl.saveCharacter';
import getCharacter from '@salesforce/apex/SR_AppWrapperCtrl.getCharacter';

import { simpleToast, filterAndBuildSpellTemplateList, setCollectionContainers, filterAndBuildSpellLists } from "c/sr_jsModules";
//import eventHelper from './eventHelper';
import { eventHelper, processIncomingCharacterData} from "./helper.js";

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

                cmp.adjustmentTemplates.metarace = result.templates.metaraceAdjustmentMap;
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
        // console.log('saveCharacter');
        cmp.showSpinner = true;

        let spellData = filterAndBuildSpellLists(cmp);

        let spellAssignsToUpsert = spellData.spellAssigListToDisplay;
        // any spell assign not being upserted must be deleted
        cmp.spellAssigns.forEach(spell => {
            if (!spellData.spellAssigListToDisplayIds.has(spell.Id)) {
                cmp.objectsBeingDeleted.push(spell);
            }
        });

        let objectsBeingDeleted = cmp.objectsBeingDeleted.filter(obj => !obj.Id.startsWith("placeholder"));

        stripPlaceholderIds([ ...spellAssignsToUpsert, ...cmp.SkillAssigns__r ]);

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