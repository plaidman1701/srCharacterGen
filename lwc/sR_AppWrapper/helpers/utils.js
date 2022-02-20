export function processIncomingCharacterData(cmp) {
    // set these lists individually, so they're reactive

    console.log('processIncomingCharacterData pre:');


    cmp.SkillAssigns__r = cmp.selectedChar?.SkillAssigns__r || [];
    cmp.spellAssigns = cmp.selectedChar?.SpellAssigns__r || [];

    console.log('processIncomingCharacterData post:');

    //cmp.SkillAssigns__r = JSON.parse(JSON.stringify(cmp.selectedChar.SkillAssigns__r));

    //eventHelper.rebuildAdjusAndBasicInfo(cmp);
}