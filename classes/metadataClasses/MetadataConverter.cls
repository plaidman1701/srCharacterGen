public with sharing class MetadataConverter implements Metadata.DeployCallback {

    private static String spellTemplates = '[{"Category__c":"Manipulation","Subcategory__c":"Telekinetic Manipulations","Label":"Levitate Item","Type__c":"Physical","Description__c":"Levitation allows a magician to lift an item or person from the ground and move him or it around. The maximum \\"distance\\" that the target can be moved In meters is the magician\'s Magic Rating times the number of successes. This distance can be expressed as vertical distance (height), horizontal distance, or any combination of the two. A magician with a distance result of 12, for example, could move an object 12 meters horizontally, or 12 meters vertically or any combination of the two, as long as the total distance (horizontal plus vertical) equalled 12. This means that 10 horizontal and 2 vertical is fine (10 + 2 = 12), as is 5 horizontal and 7 vertical (5 + 7 = 12). The sum of the vertical and horizontal components must equal the \\"distance.\\" All movement is figured from the starting point of the target. The magician\'s target number for the Spell Success Test Is Increased by + 1 for every 1OO kilograms of mass the object has. (Figure a living being has 50 kilograms per point of body, and a vehicle 1,000 kilograms.) A magician can move a levitated object anywhere as long as the spell Is maintained and the target stays in view. Objects can move the full \\"distance\\" within one Action Phase. If the spellcaster is attempting to levitate an item attached or held by a living being, that being Is allowed to make a Strength Test agalnst a target number equal to the Force of the spell. Reduce the caster\'s successes by the successes from this test. The caster must have at least 1 net success to levitate the Item away.","Range__c":"LOS","Target__c":4,"Duration__c":"Sustained","Drain__c":"[(F/2)+1]L","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Telekinetic Manipulations","Label":"Levitate Person","Type__c":"Physical","Description__c":"Levitation allows a magician to lift an item or person from the ground and move him or it around. The maximum \\"distance\\" that the target can be moved In meters is the magician\'s Magic Rating times the number of successes. This distance can be expressed as vertical distance (height), horizontal distance, or any combination of the two. A magician with a distance result of 12, for example, could move an object 12 meters horizontally, or 12 meters vertically or any combination of the two, as long as the total distance (horizontal plus vertical) equalled 12. This means that 10 horizontal and 2 vertical is fine (10 + 2 = 12), as is 5 horizontal and 7 vertical (5 + 7 = 12). The sum of the vertical and horizontal components must equal the \\"distance.\\" All movement is figured from the starting point of the target. The magician\'s target number for the Spell Success Test Is Increased by + 1 for every 1OO kilograms of mass the object has. (Figure a living being has 50 kilograms per point of body, and a vehicle 1,000 kilograms.) A magician can move a levitated object anywhere as long as the spell Is maintained and the target stays in view. Objects can move the full \\"distance\\" within one Action Phase. If the spellcaster is attempting to levitate an item attached or held by a living being, that being Is allowed to make a Strength Test agalnst a target number equal to the Force of the spell. Reduce the caster\'s successes by the successes from this test. The caster must have at least 1 net success to levitate the Item away.","Range__c":"LOS","Target__c":4,"Duration__c":"Sustained","Drain__c":"[(F/2)+1]M","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Telekinetic Manipulations","Label":"Magic Fingers","Type__c":"Physical","Description__c":"Magic fingers is classic telekinesis. The magician creates \\"Invisible hands\\" and can hold or manipulate items by mental power. The Spell Success Test has a Target Number 6. The number of successes becomes the spell\'s ratings for Strength and Quickness. The character can use his own skills with the magic flngers spell, but all target numbers receive a +2 because of the problems of remote control. Even simple actions may require a Quickness Test. The magician can fight, pick a lock, or whatever, using magic fingers. The fingers can reach any point the magician can see. The casting magician can use a clairvoyance spell or even remoteviewing technology to get a close-up of the scene, as long as the actual location is within his view. The spell comes in very handy for disarming bombs.","Range__c":"LOS","Target__c":6,"Duration__c":"Sustained","Drain__c":"[(F/2)+2]M","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Telekinetic Manipulations","Label":"Poltergeist","Type__c":"Physical","Description__c":"Within the area of this spell, all small objects and debris, up to a kilogram In mass, whirl around in random pattems. This reduces the visibility factor of the area (+2 to all target numbers). The spell does Stun damage as well, whacking targets with flying debris. Targets within the area use their Quickness Rating, not Body, for their Resistance Tests agalnst such damage, with the Spell Force Rating as the target number. The Damage Category is Light. Impact armor provides protection agalnst this damage.","Range__c":"LOS","Target__c":"4 (R)","Duration__c":"Sustained","Drain__c":"[(F/2)+1]S","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Armor","Type__c":"Physical","Description__c":"A voluntary subject is required. The magician gives the subject built-in armor, knitting his tissues into tougher compounds. Treat one-half the successes made in the Spell Success Test as the Dermal Armor Rating (add to Body) for as long as the spell is maintained.","Range__c":"Limited","Target__c":4,"Duration__c":"Sustained","Drain__c":"[(F/2)+2]M","Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Barrier","Type__c":"Physical","Description__c":"Barrier is an area-effect spell in which the magician forms a force field of crackling energy. The Spell Success Test has a Target Number 6.The magician may form the barrier as a normal area spell, which would create a dome of energy, or he may create a wall. The wall\'s height is the spell\'s Force in meters. The length of the wall or radius of the dome is equal to the magician\'s Magic Rating. This length may be adjusted in the same way as the radius of an area effect, by withholding dice from the Success Test. The magician may make the wall into any shape. Anything the size of a molecule (or less) can pass the barrier, including air or other gases. Anything bigger treats a physical barrier as having a Barrier Rating equal to the spell\'s Force (and is therefore cumulative with armor). Attacks directed through a barrier spell have a visibility modifier of -1. Physical barriers do not impede spells, even manipulation spells.","Range__c":"Limited","Target__c":6,"Duration__c":"Sustained","Drain__c":"[(F/2)+2]S","Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Mana Barrier","Type__c":"Mana","Description__c":"Mana barriers do not stop physical weapons, but they do block movement by living beings. Unliving things (like bullets) pass right through. Passengers inside closed vehicles are not affected by a mana barrier spell, but it would knock the rider off a motorcycle. A mana barrier spell also acts as a defense against spells. Add one-half the spell\'s Force (the barrier\'s Rating) to the target numbers of all magicians casting spells across the barrier. It is also an astral barrier.","Range__c":"Limited","Target__c":6,"Duration__c":"Sustained","Drain__c":"[(F/2)+1]S","Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Ignite","Type__c":"Physical","Description__c":"The magician accelerates molecular speed in a target, making it catch fire. Anything that can bum is subject to this spell. The base time to ignite the target is 10 tums, divided by the magician\'s successes. Once the target ignites. it is burning until it either burns up or is extinguished by smothering, water, or a fire extinguisher. The spell must generate more successes than the Body Rating of living targets or the base Barrier Rating of inanimate objects.The ignite spell wraps a being in flames, causing (F)M damage on the first turn. The Power increases by 1 point per Combat Turn. At the end of each turn, make a Damage Resistance Test, counting one-half impact armor. Ammo or explosives carried by the victim may go off. If flames are not extinguished, they burn out in 1D6 Combat Turns.","Range__c":"LOS","Target__c":4,"Duration__c":"Permanent","Drain__c":"[(F/2)+2]D","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Flame Bomb","Type__c":"Physical","Description__c":"This area-effect spell creates a blast whose effects surround the target. Being of real flame, it causes easily flammable materials to ignite and burn. The Damage Code for this attack is (F)M . Every 2 successes increases the damage by one level. The spell is resisted by Body, and one-half the value of Impact Armor reduces the Power (Force) of the attack. Resolve using the ranged combat procedure.","Range__c":"LOS","Target__c":4,"Duration__c":"Instant","Drain__c":"[(F/2)+1]D","ElementalEffect__c":"fire","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Flamethrower","Type__c":"Physical","Description__c":"This spell creates a stream of flame from the caster to the target. Being of real flame, it causes easily flammable materials to ignite and burn. The Damage Code for this attack is (F)M. Every 2 successes increase the Damage Code by one level. The spell is resisted by Body, and one-half the value of Impact Armor reduces the Power (Force) of the attack. Resolve using the ranged combat procedure.","Range__c":"LOS","Target__c":4,"Duration__c":"Instant","Drain__c":"[(F/2)+1]S","ElementalEffect__c":"fire","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Ice Sheet","Type__c":"Physical","Description__c":"This spell creates a flat sheet of ice that covers a number of square meters equal to the caster\'s Magic Rating multiplied by the successes. Characters crossing the sheet must make a Quickness Test against a Target Number 3 to avoid falling prone. Vehicles must make a Handling Test to avoid having to make a Crash Test. The sheet melts at a rate of 1 square meters per minute.","Range__c":"LOS","Target__c":4,"Duration__c":"Instant","Drain__c":"[(F/2)+1]S","ElementalEffect__c":"ice","MatterBased__c":true,"Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Light","Type__c":"Physical","Description__c":"An area-effect spell. This spell creates a mobile point of light that illuminates an area equal to the magician\'s Magic Rating times the spell\'s successes in meters. The illumination is roughly equal to that from a good flashlight, but as an area-effect. This spell cannot be used to blind, but does offset visibility modifiers for darkness: 2 successes counters a + 1 modifier.","Range__c":"LOS","Target__c":4,"Duration__c":"Sustained","Drain__c":"[(F/2)+2]M","Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Shadow","Type__c":"Physical","Description__c":"An area-effect spell. This spell creates a pool of darkness equal to one-half the caster\'s Magic Rating times the spell\'s successes in meters. The target number depends on the local conditions: bright midday.6 ; day, 5; day. overcast, 4 ; twilight. 3; street light or darker, 2. Every 2 successes imposes a + 1 target modifier for Combat or Perception Tests against targets within the area of shadow.","Range__c":"LOS","Target__c":"Per description","Duration__c":"Sustained","Drain__c":"[(F/2)+2]M","Source__c":"SRII"},{"Category__c":"Manipulation","Subcategory__c":"Transformation Maniplulations","Label":"Spark","Type__c":"Physical","Description__c":"This spell creates a small spark of electricity that springs from the spellcaster to the target. The damage code for this attack is (F)M. Every 2 successes increase the Damage Code by one level. The spell is resisted by Body.and one-half the value of Impact Armor reduces the Power (Force) of the attack. Resolve using the ranged combat procedure.","Range__c":"LOS","Target__c":4,"Duration__c":"Instant","Drain__c":"[(F/2)+1]M","ElementalEffect__c":"lightning","Source__c":"SRII"}]';


    public MetadataConverter() {

    }

    private static void containerMethod() {
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();




    }


    public static void parseJson() {
        //Schema.SObjectType objType = MetaraceTemplate__mdt.SObjectType;
        //Type t = Type.forName('doof');


        //List<MetaraceTemplate__mdt> templates = (List<MetaraceTemplate__mdt>)JSON.deserialize(METARACE_JSON, List<MetaraceTemplate__mdt>.class);
        //ist<AdjustmentTemplate__mdt> templates = (List<AdjustmentTemplate__mdt>)JSON.deserialize(METARACE_ADJUS, List<AdjustmentTemplate__mdt>.class);

// SkillTemplate__mdt
        List<SpellTemplate__mdt> templates = (List<SpellTemplate__mdt>)JSON.deserialize(spellTemplates, List<SpellTemplate__mdt>.class);

        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();

        for (SObject obj : templates) {
            mdContainer.addMetadata(buildCustomMetadataRecord(obj));
        }

        System.debug(JSON.serializePretty(templates));

        deployCustomMetadataRecords(mdContainer);


    }

    // public static void parseList() {
    //     Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();


    //     for (String str : handles) {
    //         System.debug(str);


    //         mdContainer.addMetadata(buildCustomMetadataRecordFromString(str));
    //     }

    //     deployCustomMetadataRecords(mdContainer);


    // }

    public static void deployCustomMetadataRecords(Metadata.DeployContainer mdContainer){
        MetadataConverter callback = new MetadataConverter();
        Id jobId;
        jobId = Metadata.Operations.enqueueDeployment(mdContainer, new MetadataConverter());
        System.debug(' jobId : '+ jobId);

    }

    public void handleResult(Metadata.DeployResult result, Metadata.DeployCallbackContext context) {
        if (result.status == Metadata.DeployStatus.Succeeded) {
            System.debug(' success : '+ result);
        } else {
            System.debug(' fail : '+ result);
        }
    }



    public static Metadata.CustomMetadata buildCustomMetadataRecord(SObject obj) {

        DescribeSObjectResult dr = obj.getSObjectType().getDescribe();

        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();

        //customMetadata.fullName = dr.getName() + '.' + String.valueOf(obj.get('Label')).replaceAll(' |-|/', '_');
        customMetadata.fullName = dr.getName() + '.' + String.valueOf(obj.get('Label')).replaceAll('[^A-Za-z0-9]', '');

        customMetadata.label = String.valueOf(obj.get('Label'));

        Map<String, Schema.SObjectField> objFields = dr.fields.getMap();
        for (String fieldName : objFields.keySet()) {
            if (fieldName == 'label') { continue; }

            Schema.SObjectField field = objFields.get(fieldName);
            Schema.DescribeFieldResult dfr = field.getDescribe();
            Schema.DisplayType fieldType = dfr.getType();

            Object fieldValue = obj.get(fieldName);
            System.debug('fieldName:' + fieldName + ' value:' + fieldValue);


            if (fieldValue != null) {
                Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
                customField.field = fieldName;
                customField.value = fieldValue; 
                customMetadata.values.add(customField);
            }
        }

        return customMetadata;

    }

    public static Metadata.CustomMetadata buildCustomMetadataRecordFromString(String obj) {

        //DescribeSObjectResult dr = obj.getSObjectType().getDescribe();

        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();

        // customMetadata.fullName = 'SpellTemplate__mdt.' + obj.replaceAll(' |-|/|\\(|\\)', '_');
        customMetadata.fullName = 'SpellTemplate__mdt.' + obj.replaceAll('[^A-Za-z0-9]', '');

        customMetadata.label = obj;

        // Map<String, Schema.SObjectField> objFields = dr.fields.getMap();
        // for (String fieldName : objFields.keySet()) {
        //     if (fieldName == 'label') { continue; }

        //     Schema.SObjectField field = objFields.get(fieldName);
        //     Schema.DescribeFieldResult dfr = field.getDescribe();
        //     Schema.DisplayType fieldType = dfr.getType();

        //     Object fieldValue = obj.get(fieldName);
        //     System.debug('fieldName:' + fieldName + ' value:' + fieldValue);


        //     if (fieldValue != null) {
        //         Metadata.CustomMetadataValue customField = new Metadata.CustomMetadataValue();
        //         customField.field = fieldName;
        //         customField.value = fieldValue; 
        //         customMetadata.values.add(customField);
        //     }
        // }

        return customMetadata;
    }

}