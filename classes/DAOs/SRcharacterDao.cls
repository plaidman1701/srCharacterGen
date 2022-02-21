public inherited sharing class SRcharacterDao extends fflib_SObjectSelector {
 
    public Schema.SObjectType getSObjectType(){
       return SRcharacter__c.sObjectType;
    }
  
    public List<Schema.SObjectField> getSObjectFieldList(){
       return new List<Schema.SObjectField> {
          SRcharacter__c.Id,
          SRcharacter__c.Name,
          SRcharacter__c.Short_Notes__c
       };
    }


    public SRcharacterDao() {

    }

    public List<SRcharacter__c> getCharacters() {
        return [ SELECT Id,
        Name,
        Real_Name__c FROM SRcharacter__c ];
    }

    public List<SRcharacter__c> getCharacterNames() {
        fflib_QueryFactory qFactory = newQueryFactory();

        return (List<SRcharacter__c>) Database.query( qFactory.toSOQL() );


        // return [ SELECT Id, Name FROM SRcharacter__c ];
    }

    public SRcharacter__c getCharById(Id charId) {
        fflib_QueryFactory qFactory = newQueryFactory();
        qFactory.selectFields(new List<String>{
            'Real_Name__c',
            'Body__c',
            'Strength__c',
            'Quickness__c',
            'Willpower__c',
            'Intelligence__c',
            'Charisma__c',
            'MetaraceTemplate__c',
            'TotemId__c',
            'ElementalOption__c',
            'MagicalTradition__c',
            'MagicianTypeId__c'
        })
        .setCondition('Id = :charId');

        qFactory.subSelectQuery('SkillAssigns__r')
        .selectFields(new List<String>{
            'Name',
            'Rating__c',
            'SkillTemplateId__c',
            'Special_Skill_Name__c'
        });

        qFactory.subSelectQuery('SpellAssigns__r')
        .selectFields(new List<String>{
            'Name',
            'Drain__c',
            'Duration__c',
            'Exclusive__c',
            'Fetish__c',
            'Rating__c',
            'SpellTemplateId__c',
            'SpellTemplateOption__c',
            'SpellTemplateVariantIndex__c'
        });

        return (SRcharacter__c) Database.query( qFactory.toSOQL() );

    }

    public Boolean saveChar(SR_AppWrapperCtrl.CharacterDataWrapper charWrapper) {
        fflib_ISObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
            new List<Schema.SObjectType>{
                SRcharacter__c.sObjectType,
                SkillAssign__c.sObjectType,
                SpellAssign__c.sObjectType
            }
        );


        System.debug('public Boolean saveChar:');
        System.debug(JSON.serializePretty(charWrapper.character));
        
        uow.registerUpsert(charWrapper.character);

        for (SkillAssign__c skill : charWrapper.skillAssigns) {
            if (skill.Id == null) {
                uow.registerNew(skill, SkillAssign__c.SRcharacter__c, charWrapper.character);
            } else {
                uow.registerUpsert(skill);
            }
        }
        for (SpellAssign__c spell : charWrapper.spellAssigns) {
            if (spell.Id == null) {
                uow.registerNew(spell, SpellAssign__c.SRcharacter__c, charWrapper.character);
            } else {
                uow.registerUpsert(spell);
            }
        }

        uow.registerDeleted(charWrapper.objectsBeingDeleted);

        try {
            uow.commitWork();
        } catch (Exception ex) {
            System.debug(ex.getMessage());
            return false;
        }

        return true;        
    }
}