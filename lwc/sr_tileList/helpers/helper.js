import { buildListForDisplay, sendEvt } from "c/sr_jsModules";


let helper = {
    checkForListBuild: (cmp) => {
        if (cmp.orderedListToDisplay && cmp.sectionLabels) cmp.displayObject = buildListForDisplay(cmp.orderedListToDisplay, ...cmp.sectionLabels);
    }
};

export default helper;