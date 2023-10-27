import { Message, MessageCreateOptions, MessageEditOptions, MessageReplyOptions, TextChannel } from "discord.js";
import { ConfigInstance } from "../../Main-Handler/ConfigHandler";
import { CooldownsType } from "../../Main-Handler/handlers/Cooldowns";
import { Command } from "../../typings";

export class ResponseClass {
    public error(instance: ConfigInstance, message: Message, object: MessageReplyOptions | MessageCreateOptions, cooldownOptions?: {cooldownType: CooldownsType, commandName: string}, type?: 'MessageCreate' | 'MessageReply') {
        if (cooldownOptions) {
            const { cooldownType, commandName } = cooldownOptions
            instance._cooldownsManager!.removeCooldown(cooldownType, message, commandName)
        }
        type === 'MessageCreate' ? message.channel.send(object) : message.reply(object)
    }    
}