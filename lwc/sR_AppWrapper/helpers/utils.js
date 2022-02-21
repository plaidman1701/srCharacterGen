export function processIncomingCharacterData(cmp) {
    // set these lists individually, so they're reactive
    cmp.SkillAssigns__r = cmp.selectedChar?.SkillAssigns__r || [];
    cmp.spellAssigns = cmp.selectedChar?.SpellAssigns__r || [];
}

function getWorkingAttValue(calcdAtts, att){
    //console.log('getWorkingAttValue')
    //console.log(JSON.stringify(calcdAtts));
    return (calcdAtts[att].bonus ? calcdAtts[att].bonus : calcdAtts[att].natural);
};

function calcNaturalBonusText(cmp, attObj, att, modifiers){
    attObj[att].natural = cmp.selectedChar[att] + (!!modifiers?.natural ? modifiers.natural : 0);

    if (!!modifiers?.bonus) {
        attObj[att].bonus = attObj[att].natural + modifiers.bonus;
    }
    attObj[att].text = String(attObj[att].natural) + (attObj[att].bonus ? ` (${attObj[att].bonus})` : "");
}

export function calcReadOnlyAttsAndInitiavites(cmp, calcdAtts, adjuEffects){
    cmp.selectedChar.Reaction__c = Math.floor((getWorkingAttValue(calcdAtts, "Quickness__c") + getWorkingAttValue(calcdAtts, "Intelligence__c")) / 2);

    let reactionModifiers = adjuEffects.atts.Reaction__c;
    calcdAtts.Reaction__c = {};
    calcNaturalBonusText(cmp, calcdAtts, "Reaction__c", reactionModifiers);

    // dice
    cmp.selectedChar.InitDice = 1;

    let initiativeDiceModifiers = adjuEffects.atts.InitDice;
    calcdAtts.InitDice = {};
    calcNaturalBonusText(cmp, calcdAtts, "InitDice", initiativeDiceModifiers);

    // only need to set text for initiative
    calcdAtts.Initiative = { text: `${calcdAtts.Reaction__c.text} + ${calcdAtts.InitDice.text}D6` };
};