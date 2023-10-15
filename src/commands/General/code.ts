import { botConfig } from "@configs";
import { Category } from "@discordx/utilities";
import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
@Category("General")
export default class CodeCommand {

    @Slash({ name: "code", description: "Get a link to the bot's source code", guilds: [botConfig.test_guild_id, botConfig.prod_guild_id]})
    async code(interaction: CommandInteraction) {
        await interaction.followUp({ ephemeral: true, content: "Here you go: \nhttps://github.com/EvaIsReal/cheesebot" })
    }

}