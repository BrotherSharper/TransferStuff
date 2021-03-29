# Drag'n'Transfer v 1.1.0
A module for Foundry VTT 

Enable moving (rather than cloning) inventory between actors by dragging and dropping.

This tool is for GM who want to move items between character sheets, without duplicating them. 

Standard Foundry VTT behavior clones items when they are dragged and dropped from 1 actor-sheet to another. If you prefer the item to not be duplicated, this module might be what you are looking for: **Drag'n'Transfer**  causes the item to be deleted from the original sheet when it is dropped onto another actor sheet.

I've tested it with DND5e and alienrpg Systems.  **Drag'n'Transfer** depends on items being recorded using certain JSON values. (In the future I may make this JSON configurable if people send requests). Please tell me if you get it to work on other systems. I didn't specifically target any particular systems, but those are the 2 that I play, so I've tested it with both.

It is important for GM's to test this module in their world because Drag'n'Transfer **assumes** that the item will be cloned onto the destination.  Drag'n'Transfer hooks on the drop action, and doesnt know if another module ALSO hooks onto the drop action and changes the destiny of that dropped item.  For example: if another module canceled the cloning, preventing the item from being cloned, Drag'n'Transfer would not know and would still delete the item from the original actor sheet.

**Limitations :**  
1) If the actorSheet you are dragging from belongs to an unlinked actor (accessible by double clicking on an unlinked token) this module does not do anything because no dropActorSheetData event occurs. I am looking for a workaround to this.

2) To prevent deletion of items when they are dropped onto sheets that lack a compatable inventory section, by default this module will only respond when both the source and target of the drag and drop are both of the same "type".  There is no universal guaranteed way to know if an actor has a compatible inventory, but I assume that if you can access inventory to drag items from a specific type, that the destination will be compatable.

If you are playing a system that gives incompatable actors the same "type", then this safety check wont work and you must take responsibility to ensure you dont drop items onto target sheets that lack the ability to display the same items as the source.  This module will delete the original copy, and you may have no way to access the resulting copy made in the destination actor JSON.

In Drag'm'Transfer module settings, the GM can now explicitly specify that certain actor types are compatable with the "Compatable Actor Types" setting. For instance in dnd5e, its possible for both "character" and "npc" types to transfer inventory.  To specify compatable types, use a coma separated list of quoted string pairs separated by a colon character.  For instance :   "character":"npc"

**PRO TIP**: If players want to leave things in a room somewhere, you can create an Actor-sheet with a token that looks like a box or container, and then Drag'n'Transfer inventory into it's character sheet. Just leave the token of that actor on the map, and items players want to leave in that room can be recorded inside that actor and need not clutter up your sidebar.

**Future Plans:** If I can create a generic "Inventory Actory" that is system agnostic and serves as an actor with a token which items can be dragged and dropped from.  Such an actor would be cleaner than using a full blown character sheet, and if players had ownership rights over it, then they could access storage lockers placed on a map without the GM needing to move inventory for them.

