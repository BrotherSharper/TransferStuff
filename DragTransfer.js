// DragTransfer
// (c) 2021 David Zvekic

"use strict";

import {registerSettings} from './settings/settings.js';

let dragTransfer = new Object();

Hooks.once('init', () => {
    registerSettings();
});

function isAlt() {
    // check if Alt and only Alt is being pressed during the drop event.
    const alts = new Set(["Alt", "AltLeft"]);
    return (game.keyboard.downKeys.size == 1 && game.keyboard.downKeys.intersects(alts));
}

function checkCompatible(actorTypeName1, actorTypeName2) {
    console.info('DragNTransfer - Check Compatibility: Dragging Item:"' + String(dragSource.data.type) + '" from sourceActor.data.type:"' + String(actorTypeName1) + '" to dragTarget.data.type:"' + String(actorTypeName2) + '".');

    const transferBetweenSameTypeActors = game.settings.get('DragTransfer', 'actorTransferSame');
    if(transferBetweenSameTypeActors && actorTypeName1 == actorTypeName2) {
        return true;
    }
    try {
        const transferPairs = JSON.parse("{" + game.settings.get('DragTransfer', 'actorTransferPairs') + "}");
        const withActorTypeName1 = transferPairs[actorTypeName1];
        const withActorTypeName2 = transferPairs[actorTypeName2];
        if(Array.isArray(withActorTypeName1) && withActorTypeName1.indexOf(actorTypeName2) !== -1) return true;
        if(Array.isArray(withActorTypeName2) && withActorTypeName2.indexOf(actorTypeName1) !== -1) return true;
        if(withActorTypeName1 == actorTypeName2) return true;
        if(withActorTypeName2 == actorTypeName1) return true;
    }
    catch(err) {
        console.error('DragTransfer: ', err.message);
        ui.notifications.error('DragTransfer: ' + err.message);
    }
    return false;
};

Hooks.on('dropActorSheetData', (dragTarget, sheet, dragSource, user) => {
    if(isAlt()) {
        return;  // ignore Drag'N'Transfer when Alt is pressed to drop.
    }

    if(dragSource.type == "Item" && dragSource.actorId) {
        if(!dragTarget.data._id) {
            console.warn("Drag'n'Transfer - target has no data._id?", dragTarget);
            return;
        }
        if(dragTarget.data._id == dragSource.actorId) {
            return;  // ignore dropping on self
        }
        let sourceActor = game.actors.get(dragSource.actorId);
        if(sourceActor) {
            /* if both source and target have the same type then allow deleting original item. this is a safety check because some game systems may allow dropping on targets that don't actually allow the GM or player to see the inventory, making the item inaccessible. */

            if(checkCompatible(sourceActor.data.type, dragTarget.data.type)) {
                if(sourceActor.deleteEmbeddedDocuments != undefined) {
                    sourceActor.deleteEmbeddedDocuments("Item", [dragSource.data._id]);
                }
                else {
                    sourceActor.deleteOwnedItem(dragSource.data._id);
                }
            }
        }
    }
});
