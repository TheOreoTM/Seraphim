import p from "path";
import getFiles from "./getAllFiles";
import { Collection } from "discord.js";
import { Command } from "../../typings";
export default (path: string) => {
    const localCommands = new Collection<string, Command>()
    const commandCategories = getFiles(path, true) as string[];
    for (const commandCategory of commandCategories) {
        const commandFiles = getFiles(commandCategory) as string[];

        for (const commandFile of commandFiles) {
            const commandModule: Command = require(commandFile).default;
            if (commandModule && commandModule.name) {
                localCommands.set(commandModule.name.toLowerCase(), commandModule);
            }
        }
    }
    return localCommands;
};
