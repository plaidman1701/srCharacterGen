public with sharing class SR_AppWrapperCtrl {

    // @TestVisible
    // private static MetadataSelector metadataSelector = new MetadataSelector();
    @TestVisible
    private static SRcharacterDao charDao = new SRcharacterDao();

    public SR_AppWrapperCtrl() {

    }


    @AuraEnabled
    public static ResponseWrapper getInitData() {
        // add checks for isSuccess
        ResponseWrapper reponse = new ResponseWrapper();

        reponse.templates = MetadataSelector.getAllTemplates();
        reponse.characterNames = charDao.getCharacterNames();
        List<String> sampleHandles = new List<String>();
        for (SampleHandle__mdt handleMdt : MetadataSelector.getSampleHandles()) {
            sampleHandles.add(handleMdt.Label);
        }
        reponse.sampleHandles = sampleHandles;

        return reponse;
    }

    @AuraEnabled
    public static ResponseWrapper saveCharacter(CharacterDataWrapper charDataWrapper){

        System.debug('saveCharacter');
        System.debug(JSON.serializePretty(charDataWrapper));

        ResponseWrapper response = new ResponseWrapper();
        //Database.UpsertResult upsertResult = charDao.saveChar(charDataWrapper.character);


        response.isSuccess = charDao.saveChar(charDataWrapper);
        if (response.isSuccess) {
            // refresh short list
            response.characterNames = charDao.getCharacterNames();
            response.character = getFullCharData(charDataWrapper.character.Id);
        } else {
            // List<String> errs = new List<String>();
            // for (Database.Error err : upsertResult.getErrors()) {
            //     errs.add(err.getMessage());
            // }
            // response.errorMessage = String.join(errs, ', ' );
        }

        return response;
    }

    @AuraEnabled
    public static ResponseWrapper getCharacter(Id charId) {
        ResponseWrapper response = new ResponseWrapper();

        response.character = getFullCharData(charId);

        return response;

    }

    private static SRcharacter__c getFullCharData(Id charId) {
        return charDao.getCharById(charId);
    }



    public class CharacterDataWrapper {
        @AuraEnabled
        public SRcharacter__c character {get; set;}

        @AuraEnabled
        public List<SkillAssign__c> skillAssigns {get; set;}
        @AuraEnabled
        public List<SkillAssign__c> skillAssignsToDelete {get; set;}
    }


    // only one for the whole class
    class ResponseWrapper extends BackendResponse{
        @AuraEnabled
        public MetadataSelector.MetadataSelectorResponse templates;

        @AuraEnabled
        public List<SRcharacter__c> characterNames;

        @AuraEnabled
        public List<String> sampleHandles;

        @AuraEnabled
        public SRcharacter__c character;
    }
}