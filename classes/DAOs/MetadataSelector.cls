public with sharing class MetadataSelector {

    public MetadataSelector() {
//getAll()
    }

    public static List<SampleHandle__mdt> getSampleHandles() {
        return [ SELECT Id, Label FROM SampleHandle__mdt ];
    }

    
    public static Map<Id, SkillTemplate__mdt> getSkillTemplates() {
        return new Map<Id, SkillTemplate__mdt>( [
        SELECT Id, Label,
        Category__c,
        Concentrations__c,
        Description__c,
        Requires_Name__c,
        Type__c        
        FROM SkillTemplate__mdt]);
    }



    public static Map<Id, MagicianType__mdt> getMagicianTypes() {
        return new Map<Id, MagicianType__mdt>( [
            SELECT Id, Label,
            AllowsSpells__c,
            BuildPoints__c,
            Description__c,
            ForcePoints__c,
            RequiresSpellBonus__c,
            SpecialOptions__c,
            TraditionOptions__c,
            List_Order__c,
            Type__c
            FROM MagicianType__mdt]);
    }

    public static Map<Id, MagicalTradition__mdt> getMagicialTraditions() {
        return new Map<Id, MagicalTradition__mdt>( [
            SELECT Id, Label,
            Description__c
            FROM MagicalTradition__mdt]);
    }

    public static Map<Id, Totem__mdt> getTotems() {
        return new Map<Id, Totem__mdt>( [
            SELECT Id, Label,
            Advantages__c,
            Characteristics__c,
            Disadvantages__c,
            Favored_EnvIronment__c,
            Spell_Bonus__c
            FROM Totem__mdt]);
    }

    public static Map<Id, List<TotemAdjustment__mdt>> getTotemAdjustments() {

        Map<Id, List<TotemAdjustment__mdt>> returnMap = new Map<Id, List<TotemAdjustment__mdt>>();

        for (TotemAdjustment__mdt adju : [
            SELECT Id, Label,
            Category__c,
            Description__c,
            Totem__c,
            Value__c
            FROM TotemAdjustment__mdt]) {

                if (!returnMap.containsKey(adju.Totem__c)) {
                    returnMap.put(adju.Totem__c, new List<TotemAdjustment__mdt>());
                }

                returnMap.get(adju.Totem__c).add(adju);

            }





           return returnMap;
    }

    public static Map<Id, SpellTemplate__mdt> getSpellTemplates() {
        return new Map<Id, SpellTemplate__mdt>( [
            SELECT Id, Label,
            Category__c,
            DamageLevel__c,
            Description__c,
            Drain__c,
            Duration__c,
            ElementalEffect__c,
            MatterBased__c,
            Options__c,
            Range__c,
            RequiresName__c,
            Source__c,
            Subcategory__c,
            Target__c,
            Type__c,
            Variants__c
            FROM SpellTemplate__mdt]);
    }



    // public static List<SkillTemplate__mdt> getSkillTemplates() {
    //     return [
    //     SELECT Id, Label,
    //     Category__c,
    //     Concentrations__c,
    //     Description__c,
    //     Requires_Name__c,
    //     Type__c        
    //     FROM SkillTemplate__mdt];
    // }


    public static Map<Id, MetaraceTemplate__mdt> getMetaraceTemplates() {
        return new Map<Id, MetaraceTemplate__mdt>([
            SELECT Id, Label,
            Build_Point_Cost__c,
            Commentary__c,
            Habitat__c,
            Habits__c,
            Identification__c,
            Image__c,
            Notes__c,
            RunningMultiplier__c,
            Taxonomy__c,
            Young__c
            FROM MetaraceTemplate__mdt
        ]);


        //return new Map<Id, MetaraceTemplate__mdt>(MetaraceTemplate__mdt.getAll().values());
    }

    // metarace templatye Id -> list of adjustments
    public static Map<Id, List<MetaraceAdjustment__mdt>> getMetaraceAdjustments() {
        Map<Id, List<MetaraceAdjustment__mdt>> returnMap = new Map<Id, List<MetaraceAdjustment__mdt>>();


        // SOQL to get ordering

        for (MetaraceAdjustment__mdt mdt : [ SELECT Id, Label,
        Bonus__c,
        Category__c,
        Description__c,
        Field__c,
        MetaraceTemplate__c,
        Type__c,
        Value__c
        FROM MetaraceAdjustment__mdt ORDER BY Category__c, Bonus__c, Description__c

        ]) {
            if (!returnMap.containsKey(mdt.MetaraceTemplate__c)) {
                returnMap.put(mdt.MetaraceTemplate__c, new List<MetaraceAdjustment__mdt>());
            }

            returnMap.get(mdt.MetaraceTemplate__c).add(mdt);
        }

        return returnMap;
    }


    public static MetadataSelectorResponse getAllTemplates() {
        MetadataSelectorResponse response = new MetadataSelectorResponse();

        response.MetaraceTemplateMap = getMetaraceTemplates();
        response.MetaraceAdjustmentMap = getMetaraceAdjustments();
        response.skillTemplateMap = getSkillTemplates();
        response.magicianTypeMap = getMagicianTypes();
        response.totemMap = getTotems();
        response.spellTemplateMap = getSpellTemplates();
        response.totemAdjustmentMap = getTotemAdjustments();
        return response;
    }

    public class MetadataSelectorResponse {
        @AuraEnabled
        public Map<Id, MetaraceTemplate__mdt> metaraceTemplateMap;

        @AuraEnabled
        public Map<Id, List<MetaraceAdjustment__mdt>> metaraceAdjustmentMap;

        @AuraEnabled
        public Map<Id, SkillTemplate__mdt> skillTemplateMap;

        @AuraEnabled
        public Map<Id, MagicianType__mdt> magicianTypeMap;

        @AuraEnabled
        public Map<Id, Totem__mdt> totemMap;

        @AuraEnabled
        public Map<Id, List<TotemAdjustment__mdt>> totemAdjustmentMap;

        @AuraEnabled
        public Map<Id, SpellTemplate__mdt> spellTemplateMap;



        // Totem__mdt

        // @AuraEnabled
        // public List<SkillTemplate__mdt> skillTemplateList;

    }
}