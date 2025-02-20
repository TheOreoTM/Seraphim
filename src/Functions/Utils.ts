import { ChatInputCommandInteraction, GuildMember, Message, PermissionFlags, PermissionsBitField } from 'discord.js';
import fs from 'fs'
import path from 'path'
import { ConfigInstance } from '../../Main-Handler/ConfigHandler';
export class Utils {
    /**
     * @param num - Converts Numbers like 10000 to "10,000" format.
     * @returns {string}
     */
    static formatNumber(num: number): string {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * @param {string} path_1 - ```javascript
     *      import path from 'path';
     *      const path = path.join(__dirname, "<your path here>", "<folder name here>");
     *      const folders = getAllFiles(path, true) // returns an array of all the sub folders of the given parent folder as given in the "path" declaration.
     * ```
     * @param {boolean} folderOnly - Whether to return folders or files
     */
    static getAllFiles(path_1: string, folderOnly?: boolean | false) {
        const getAllFiles = (path1 = path_1, foldersOnly = folderOnly) => {
            const files = fs.readdirSync(path1, {
                withFileTypes: true,
            });
            let filesFound: any[] = [];
            for (const file of files) {
                const filePath = path.join(path1, file.name);
                if (file.isDirectory()) {
                    if (foldersOnly) {
                        filesFound.push(filePath);
                    }
                    else {
                        filesFound = [...filesFound, ...getAllFiles(filePath)];
                    }
                    continue;
                }
                filesFound.push(filePath);
            }
            return filesFound;
        };
    };

    /**
     * @returns {boolean}
     */
    static isValidHex(hex: string): boolean {
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
            return true
        } else {
            return false
        }
    };

    /**
     * @param {Array<any>} inp - Input an array.
     */
    static removeDuplicates(inp: string | Array<any>) {
        if (typeof inp == 'string') {
            return [...new Set(inp.split(' '))].join(' ');
        } else {
            return [...new Set(inp)]
        }
    };

    /**
     * @param {Array<any>} array - Input an array
     * @returns - A shuffled array
     */
    static ShuffleArray(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    /**
     * @param {string} text - Input a string
     * @param {number} max_length - Max charaters your text should have
     * @returns {string} ```javascript
     * const string = "12345"
     * Compress_String(string, 2) // returns "12.."
     * ```
     */
    static Compress_String(text: string, max_length: number): string {
        if (max_length >= text.length) return "null"
        return text.substring(0, max_length).trim() + "..";
    }

    /**
     * @param {number | string} num - Input a number
     * @returns {string} ```javascript
     * toCompactNumber(num: "1900")// returns "1.9k"
     * ```
     */
    static toCompactNumber(num: number | string): string {
        if (typeof num === "number") {
            return new Intl.NumberFormat("en", { notation: "compact" }).format(num);
        } else if (typeof num === "string") {
            const abbrev = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "V"];
            const numValue = parseInt(num, 10);
            if (isNaN(numValue) || numValue < 0) {
                return "0";
            }
            if (numValue < 1000) {
                return numValue.toString();
            }
            const exponent = Math.min(
                Math.floor(Math.log10(numValue) / 3),
                abbrev.length - 1
            );
            const roundedNum = (numValue / Math.pow(10, exponent * 3)).toFixed(1);
            return `${roundedNum.replace(/\.0$/, "")}${abbrev[exponent]}`.replace(`${abbrev[abbrev.length - 1]}`, '');
        }
        return "0";
    }

    /**
     * @param {string} str - Input a string.
     * @returns {string} - Removes all spaces from the string and replaces it with "-" a.k.a a kebab case
     */
    static toKebabCase(str: string): string {
        return str.toLowerCase().replace(/\s+/g, '-');
    }

    /**
     * @param {string} str - Input a string
     * @returns ```javascript
     * toTitleCase("this is a general utility class") // returns This Is A General Utility Class.
     * ```
     */
    static toTitleCase(str: string) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
    }

    /**
     * @param {Array<any>} permissions - Feed an array of permissionflagbits
     * @returns More readable permissions.
     */
    static getReadablePermissions(permissions: Array<any>) {
        const formatPermission = (permission: string): string | undefined => {
            switch (permission) {
                case 'Administrator':
                    return 'Administrator';
                case 'BanMembers':
                    return 'Ban Members';
                case 'KickMembers':
                    return 'Kick Members';
                case 'ManageChannels':
                    return 'Manage Channels';
                case 'ManageMessages':
                    return 'Manage Messages';
                case 'ManageRoles':
                    return 'Manage Roles';
                case 'AddReactions':
                    return 'Add Reactions';
                case 'AttachFiles':
                    return 'Attach Files';
                case 'ChangeNickname':
                    return 'Manage Nicknames';
                case 'Connect':
                    return 'Connect';
                case 'CreateInstantInvite':
                    return 'Create Instant Invites';
                case 'CreatePrivateThreads':
                    return 'Create Private Threads';
                case 'CreatePublicThreads':
                    return 'Create Public Threads';
                case 'EmbedLinks':
                    return 'Embed Links';
                case 'ReadMessageHistory':
                    return 'Read Message History';
                case 'RequestToSpeak':
                    return 'Request to Speak';
                case 'SendMessages':
                    return 'Send Messages';
                case 'SendMessagesInThreads':
                    return 'Send Messages in Threads';
                case 'Speak':
                    return 'Speak';
                case 'Stream':
                    return 'Video';
                case 'UseApplicationCommands':
                    return 'Use Application Commands';
                case 'UseEmbeddedActivities':
                    return 'Use Embedded Activities';
                case 'UseExternalEmojis':
                    return 'Use External Emojis';
                case 'UseExternalStickers':
                    return 'Use External Stickers';
                case 'UseVAD':
                    return 'Use Voice Activity';
                case 'ViewChannel':
                    return 'View Channels';
            }
        };

        const descriptionList: string[] = [];
        const seen: Set<string> = new Set();

        for (const permission of permissions) {
            const description = formatPermission(permission);
            if (description && !seen.has(description)) {
                descriptionList.push(description);
                seen.add(description);
            }
        }
        return descriptionList;
    }

    static CheckArgs(
        command: any,
        args: string[],
        prefix: string | "?",
        message?: Message,
        interaction?: ChatInputCommandInteraction
    ) {
        if (!command.args) return true;

        const { minArgs = 0, maxArgs = -1, CustomErrorMessage = "Correct syntax: {PREFIX}{COMMAND} {ARGS}", expectedArgs = "" } = command.args;
        const { length } = args;

        if (length < minArgs || (length > maxArgs && maxArgs !== -1)) {
            const text = `Correct syntax:\n${CustomErrorMessage}`
                .replace("{PREFIX}", prefix)
                .replace("{COMMAND}", command.name)
                .replace("{ARGS}", expectedArgs);

            if (message) {
                message.reply(text).then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch((r) => { })
                    }, 1000 * 7);
                })
            } else if (interaction) interaction.reply(text);

            return false;
        }

        return true;
    }

    static devOnly(instance: ConfigInstance, command: any, id: string) {
        return !command.ownersOnly || instance._botOwners?.includes(id);
    }

    static HandlehasPermissions(command: { permissions?: bigint[] }, message?: Message, interaction?: ChatInputCommandInteraction, instance?: ConfigInstance): boolean {
      const member = (message ?? interaction)!.member as GuildMember
        if (instance && instance._botOwners?.includes(member.user.id)) return true
        const permissions = command.permissions || [];
        const text = `You can't use this command, use the help command to know more..`
        if (permissions.length > 0 && permissions.some(permission => !member.permissions.has(permission))) {
            if (interaction) interaction.reply({ content: text, ephemeral: true })
            return false;
        }
        return true;
    }

    static generateBar(value: number, maxValue: number, size: number) {
        const ProgressBar = {
            StartEmpty: `<:PB1E:1164479248271159306>`,
            StartHalfFull: `<:PB1HF:1164479266361200712>`,
            StartFull: `<:PB1C:1164479305947033600>`,
            MiddleEmpty: `<:PB2E:1164479915048050709>`,
            MiddleHalfFull: `<:PB2HF:1164479708021403698>`,
            MiddleFull: `<:PB2F:1164479717202743296>`,
            MiddleContinue: `<:PB2C:1164479713578852402>`,
            EndEmpty: `<:PB3E:1164479719316652076>`,
            EndHalfFull: `<:PB3HF:1164479711573983272>`,
            EndFull: `<:PB3F:1164479723225763892>`
        }

        return progressBar(
            ProgressBar.StartEmpty,
            ProgressBar.StartHalfFull,
            ProgressBar.StartFull,
            ProgressBar.MiddleEmpty,
            ProgressBar.MiddleHalfFull,
            ProgressBar.MiddleFull,
            ProgressBar.MiddleContinue,
            ProgressBar.EndEmpty,
            ProgressBar.EndHalfFull,
            ProgressBar.EndFull,
            value,
            maxValue,
            size,
            false
        );

        function progressBar(
            Bar1empty: string, Bar1mid: string, Bar1full: string,
            Bar2empty: string, Bar2mid: string, Bar2high: string, Bar2full: string,
            Bar3empty: string, Bar3mid: string, Bar3full: string,
            value: number, maxValue: number, size: number, percents: boolean
        ) {
            if (isNaN(value) || isNaN(maxValue)) throw new Error('maxValue or value is not a number');
            size = Math.max(3, Math.trunc(size));
            const percent = value > maxValue ? 100 : ((value / maxValue) * 100).toFixed(1);

            const full = Math.min(size, Math.floor(size * (value / maxValue)));
            const full_decimal = Math.max(0, full - Math.trunc(full)).toFixed(2);
            const empty = size - full;

            const barArray: string[] = [
                ...Array.from({ length: full }, () => Bar2full),
                ...Array.from({ length: empty }, () => Bar2empty),
            ];

            if (value < maxValue) {
                if (0.2 < parseFloat(full_decimal) && parseFloat(full_decimal) <= 0.8) barArray[full - 1] = Bar2mid;
                else if (parseFloat(full_decimal) <= 0.2 && full < 2) barArray[full - 1] = Bar2high;
                else if (parseFloat(full_decimal) <= 0.2) barArray[full - 1] = Bar2high;
                else if (parseFloat(full_decimal) > 0.8 && full < size - 1) barArray[full] = Bar2high;
                else if (parseFloat(full_decimal) > 0.8) barArray[full - 1] = Bar2high;
            }

            switch (barArray[0]) {
                case Bar2full:
                case Bar2high:
                    barArray[0] = Bar1full;
                    break;
                case Bar2mid:
                    barArray[0] = Bar1mid;
                    break;
                default:
                    barArray[0] = Bar1empty;
            }

            switch (barArray[barArray.length - 1]) {
                case Bar2full:
                case Bar2high:
                    barArray[barArray.length - 1] = Bar3full;
                    break;
                case Bar2mid:
                    barArray[barArray.length - 1] = Bar3mid;
                    break;
                default:
                    barArray[barArray.length - 1] = Bar3empty;
            }

            return percents
                ? { barString: barArray.join(''), percent: `${barArray.join('')} ${percent}` }
                : barArray.join('');
        }

    }
}
