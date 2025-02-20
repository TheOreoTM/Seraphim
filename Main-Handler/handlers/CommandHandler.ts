import { ClientApplication, Collection, Guild, Message } from "discord.js";
import { CommandType, ConfigInstance } from "../ConfigHandler";
import { Utils } from "../../src/Functions/Utils";
import getLocalCommands from "../utils/getLocalCommands";
import { Command } from "../../typings";
export class CommandHandler {
    private localCommands = new Collection<string, Command>()
    public instance!: ConfigInstance;
    async readFiles(instance: ConfigInstance, commandsdir: any, reloadslash?: boolean | false) {
        const { _chalk, _client } = instance
        console.log(`${instance._chalk.bold.white("➙ Loading legacy commands...")}`);
        this.localCommands = getLocalCommands(commandsdir);
        if (!reloadslash) return;
        console.log(`${instance._chalk.bold.white("➙ Loading slash commands...")}`);
        const slashcommands = this.localCommands.filter((c) => (typeof c.type !== 'undefined' && c.type !== CommandType.legacy))
        console.log(`${_chalk.bold.white(`➙ Iterating through ${slashcommands.size} slash commands...`)}`);
        const application = instance._client?.application as ClientApplication
        const commands = await application.commands.fetch()
        for (const localcommand of slashcommands) {
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

    public getLocalCommands() {
        return this.localCommands
    }

    public getAllCommands() {
        const localCommands = this.getLocalCommands()
        const commandAliases = new Map<string, Command[]>();
        localCommands.forEach((command) => {
            if (command.aliases) {
                command.aliases.forEach((alias) => {
                    if (!commandAliases.has(alias)) {
                        commandAliases.set(alias, []);
                    }
                    commandAliases.get(alias)!.push(command);
                });
            }
            commandAliases.set(command.name, [command]);
        });
        return commandAliases
    }
}
