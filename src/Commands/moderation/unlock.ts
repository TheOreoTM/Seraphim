import { ChannelType, EmbedBuilder, Guild, PermissionFlagsBits } from "discord.js";
import { ChannelClass } from "../../Classes/Misc/channel";
import { Callback, Command } from "../../../typings";
const channelClass = new ChannelClass();

export default {
    name: 'unlock',
    description: 'Unlocks the channel',
    permissions: [PermissionFlagsBits.ManageMessages],
    callback: async ({ message, args }: Callback) => {
        if (message) {
            const channel = message.mentions.channels.first() || channelClass.fetchChannel(message.guild as Guild, args[0] ?? message.channel.id) || message.channel;

            if (channel.type !== ChannelType.GuildText) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor('Green').setDescription('Channel must be a text type')] });
            }

            const permissions = channel.permissionsFor(message.guildId as string);
            if (permissions?.has(PermissionFlagsBits.SendMessages)) {
                return message.channel.send({ embeds: [new EmbedBuilder().setColor('Red').setDescription('Channel is already unlocked')] });
            }

            channel.permissionOverwrites.edit(message.guildId as string, {
                SendMessages: true
            });

            message.channel.send(`${channel} has been unlocked by ${message.author}`);
        }
    }
} as Command;
