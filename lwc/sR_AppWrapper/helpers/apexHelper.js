import getInitData from '@salesforce/apex/SR_AppWrapperCtrl.getInitData';
import saveCharacter from '@salesforce/apex/SR_AppWrapperCtrl.saveCharacter';
import getCharacter from '@salesforce/apex/SR_AppWrapperCtrl.getCharacter';

import { simpleToast } from "c/sr_jsModules";
import eventHelper from './eventHelper';

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
    cmp.selectedChar.SkillAssigns__r.forEach(skill => {
        if (skill.Id.startsWith("placeholder")) delete skill.Id;
    });
    cmp.objectsBeingDeleted.skillAssigns =
        cmp.objectsBeingDeleted.skillAssigns.filter(skill => !skill.Id.startsWith("placeholder"));
    

}

let apexHelper = {
    getInitData: (cmp) => {
        cmp.showSpinner = true;
        getInitData()
            .then(result => {
                cmp.handles = result.sampleHandles;
                randomizeArray(cmp.handles);

                cmp.templates = result.templates; // arrives as a list of objects

                // JSON.parse(JSON.stringify(this.skillTemplateList))
                //cmp.templates.skillTemplateList = JSON.parse(JSON.stringify(this.skillTemplateList));

                console.table(cmp.templates.skillTemplateMap);
                cmp.characterNames = result.characterNames;

            })
            .catch(error => {
                console.log('error');
                console.log(JSON.stringify(error));
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
            skillAssigns: cmp.selectedChar.SkillAssigns__r,
            skillAssignsToDelete: cmp.objectsBeingDeleted.skillAssigns
        };
        //console.log('charDataWrapper:');
        //console.log(JSON.stringify(charDataWrapper));
        saveCharacter( {charDataWrapper} )
            .then(result => {
                //console.log('result');
                //console.log(JSON.stringify(result));
                if (result.isSuccess) {
                    cmp.characterNames = result.characterNames;
                    
                    cmp.selectedChar = result.character;
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
                eventHelper.resetObjectsBeingDeleted(cmp);
                cmp.showSpinner = false;
            });
    },

    getCharacter: (cmp, charId) => {
        cmp.showSpinner = true;
        getCharacter( {charId} )
            .then(result => {
                //console.log('result');
                //console.log(JSON.stringify(result));
                cmp.selectedChar = result.character;

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

export default apexHelper;