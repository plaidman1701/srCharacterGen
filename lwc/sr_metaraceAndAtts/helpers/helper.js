import { sendUpdateEvent, Enums } from "c/sr_jsModules";

let helper = {
    applyAttChange: (cmp, att, value) => {
        cmp.selectedChar[att] = (isNaN(value) ? value : parseInt(value));
    },

    sendEvt: (cmp) => {
        sendUpdateEvent(cmp, Enums.Character, cmp.selectedChar);
    }
};

export default helper;