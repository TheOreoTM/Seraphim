import { ApplicationCommand, ApplicationCommandOption, ApplicationCommandOptionType, Client, ClientApplication, Guild, Message } from "discord.js";
import { CommandType, ConfigInstance } from "../ConfigHandler";
import { Utils } from "../../functions/Utils";
import getLocalCommands from "../utils/getLocalCommands";
import { Callback, Command } from "../../typings";

export class CommandHandler {
    public instance!: ConfigInstance;
    async readFiles(instance: ConfigInstance, Commandsdir: string,) {
        const { _chalk, _client } = instance
        console.log(`${instance._chalk.bold.white("➙ Loading commands...")}`);
        const localcommands = getLocalCommands().filter((c) => (typeof c.type !== 'undefined' && c.type !== CommandType.legacy))
        console.log(`${_chalk.bold.white(`➙ Iterating through ${localcommands.size} slash commands...`)}`);
        const application = instance._client?.application as ClientApplication
        const commands = await application.commands.fetch()
        for (const localcommand of localcommands) {
            const [name, commandObject] = localcommand
            const description = commandObject.description
            const options = commandObject.options as any
            const existingCommand = commands.find(c => c.name == name)
            if (existingCommand) {
                if (commandObject.deleted) {
                    await application.commands.delete(name)
                    console.log(_chalk.redBright(`Deleting command: ${name}`))
                }
            } else {
                if (commandObject.testServersOnly) {
                    instance._testServers?.forEach(async (id: string) => {
                        const guild = _client?.guilds.cache.get(id) as Guild
                        const exists = guild.commands.cache.find((c) => c.name === name)
                        if (exists) {
                            return;
                        } else {
                            await guild.commands.create({
                                name,
                                description,
                                options
                            })
                            console.log(_chalk.blueBright(`Creating guild command: ${name} for guild name: ${guild.name}.`))
                        }
                    })
                } else if (commandObject.deleted === true) {
                    console.log(`Skipping ${name} command since deleted is set to true.`)
                    break;
                };
                await application.commands.create({
                    name,
                    description,
                    options,
                })
                console.log(_chalk.yellowBright(`Creating  global slash command: ${name}.`))
            }
        }
    }

    public canRun(instance: ConfigInstance, command: any, message: Message, args: string[], prefix: string): boolean {
        const { devOnly, HandlehasPermissions, CheckArgs } = Utils
        if (devOnly(instance, command, message.author.id) === false) return false;
        if (HandlehasPermissions(command, message, undefined, instance) === false) return false;
        if (CheckArgs(command, args, prefix, message, undefined) === false) return false;
        return true;
    }

    public async run(command: Command, callbackData: any) {
        await command.callback(callbackData)
    }
}
