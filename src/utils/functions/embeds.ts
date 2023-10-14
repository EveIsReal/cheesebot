import { CommandInteraction, EmbedBuilder, GuildMember, User } from "discord.js"

import { replyToInteraction } from "@utils/functions"
import { CommandLogAction } from "../types/commands"
import { botConfig } from "src/configs/bot"
/**
 * Send a simple success embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export const simpleSuccessEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new EmbedBuilder()
        .setColor(0x57f287) // GREEN // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
        .setDescription(`✅ ${message}`)

    replyToInteraction(interaction, { embeds: [embed] })
}

/**
 * Send a simple error embed
 * @param interaction - discord interaction
 * @param message - message to log
 */
export const simpleErrorEmbed = (interaction: CommandInteraction, message: string) => {

    const embed = new EmbedBuilder()
        .setColor(0xed4245) // RED // see: https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Colors.js
        .setDescription(`❌ ${message}`)

    replyToInteraction(interaction, { embeds: [embed] })
}

