import { CollectionContainer } from "./util.js";

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

export let collectionContainers;

export function setCollectionContainers(dataTemplates) {

    collectionContainers = {};
    collectionContainers.metarace = {};
    collectionContainers.metarace.metaraces = new CollectionContainer(dataTemplates.metaraceTemplateMap, null, null);

    collectionContainers.skills = {};
    collectionContainers.skills.skillTemplates = new CollectionContainer(dataTemplates.skillTemplateMap, skillOrdering, skillSectionLabels);

    collectionContainers.magic = {};
    collectionContainers.magic.magicianTypes = new CollectionContainer(dataTemplates.magicianTypeMap, null, null);
    collectionContainers.magic.totems = new CollectionContainer(dataTemplates.totemMap, null, null);
    collectionContainers.magic.spellTemplates = new CollectionContainer(dataTemplates.spellTemplateMap, spellOrdering, spellSectionLabels);
};
