import { Interaction, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, APIEmbedField } from "discord.js";
import { ConfigInstance } from "../../../../../Main-Handler/ConfigHandler";
import { AdvancedSettingFields, AutomodClass } from "../../../../../classes/moderation/automod";

const automodClass = AutomodClass.getInstance();
export default async (instance: ConfigInstance, interaction: Interaction) => {
    if (!interaction.isButton() || !interaction.customId.startsWith(`${interaction.guildId}Automod_Setup_AdvancedSetting`)) return;

    switch (interaction.customId) {
        case `${interaction.guildId}Automod_Setup_AdvancedSetting_IgnoredChannels_Confirm`: {
            const object = automodClass.utils(interaction).constants.AdvancedSettings.IgnoredRoles;
            const embeds = [...object.embeds];
            if (interaction?.message?.embeds[1]?.title === "Info:") embeds.push(new EmbedBuilder(interaction.message.embeds[1].data));
            interaction.update({ embeds, components: object.components });
        }
        break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting`:
            interaction.update(automodClass.utils(interaction).constants.AdvancedSettings.Main);
            break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_IgnoredChannels`:
            interaction.update(automodClass.utils(interaction).constants.AdvancedSettings.IgnoredChannels);
            break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_IgnoredChannels_Cancel`:
            interaction.update(automodClass.utils(interaction).constants.AdvancedSettings.IgnoredChannels);
            break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_IgnoredRoles_Cancel`: {
            const [main, info] = interaction.message.embeds;
            const embeds = automodClass.utils(interaction).functions.General.RemoveField(main, info, "Role");
            interaction.update({ embeds, components: automodClass.utils(interaction).constants.AdvancedSettings.IgnoredRoles.components });
        }
        break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_IgnoredRoles`:
            interaction.update(automodClass.utils(interaction).constants.AdvancedSettings.IgnoredRoles);
            break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_CustomAction_Cancel`: {
            const [main, info] = interaction.message.embeds;
            const embeds = automodClass.utils(interaction).functions.General.RemoveField(main, info, "Action");
            interaction.update({ embeds, components: automodClass.utils(interaction).constants.AdvancedSettings.CustomAction.components });
        }
        break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_Threshold_Setup`: {
            const modal = new ModalBuilder()
                .setTitle("Threshold")
                .setCustomId(`${interaction.guildId}Automod_Setup_AdvancedSetting_Threshold_Modal`)
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`${interaction.guildId}Modal_Threshold`)
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                                .setMaxLength(1)
                                .setLabel("Threshold")
                                .setValue('2')
                        )
                );
            await interaction.showModal(modal);
        }
        break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_Threshold_Cancel`: {
            const [main, info] = interaction.message.embeds;
            const embeds = automodClass.utils(interaction).functions.General.RemoveField(main, info, "Threshold");
            interaction.update({ embeds, components: automodClass.utils(interaction).constants.AdvancedSettings.Threshold.components });
        }
        break;

        case `${interaction.guildId}Automod_Setup_AdvancedSetting_Threshold_Confirm`: {
            const fields = interaction.message.embeds[1]?.fields ?? [];
            
            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Blue')
                        .setAuthor({ name: `${interaction.client.user?.username}`, iconURL: `${interaction.client.user?.displayAvatarURL()}` })
                        .setDescription(`<a:loading:1166992405199859733> Processing your submission`)
                ],
                components: []
            });
        
            const defaultSettings: AdvancedSettingFields = {
                Channel: [],
                Role: [],
                Action: 'None',
                Threshold: 2
            };
        
            for (const key in defaultSettings) {
                if (Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
                    const field = fields.find((val) => val.name.toLowerCase() === key.toLowerCase());
                    const fieldKey = key as keyof AdvancedSettingFields;
                    defaultSettings[fieldKey] = (getValue(fieldKey, field)) as never;
                }
            }
        
            const settingsString = Object.entries(defaultSettings).map(([key, value]) => {
                const formattedValue = Array.isArray(value) ? value.length > 0 ? value.map((val) => `<${key === 'Role' ? "@&" : "#"}${val}>`).join(", ") : "None" : value;
                return `${key} – **${formattedValue}**`;
            });
        
            console.log(defaultSettings);
            console.log(settingsString);
        
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Blue')
                        .setDescription(settingsString.join("\n"))
                        .setAuthor({ name: `${interaction.client.user?.username}`, iconURL: `${interaction.client.user?.displayAvatarURL()}` })
                ]
            });
        }
        break;
        
    }
};


function getDefault(key: keyof AdvancedSettingFields): string | string[] | 'None' | number {
    const defaultValues: Record<keyof AdvancedSettingFields, string | string[] | 'None' | number> = {
        Channel: [],
        Role: [],
        Action: 'None',
        Threshold: 2
    };

    return defaultValues[key];
}

function getID(value: string) {
    const idArray = value.split(',').map(mention => mention.match(/\d+/)?.[0]);
    return idArray.filter(id => id !== null) as string[];
}

function getValue(key: keyof AdvancedSettingFields, field: APIEmbedField | undefined) {
    return field 
    ? key === 'Channel' || key === 'Role' ? getID(field.value) : field.value 
    : getDefault(key)
}