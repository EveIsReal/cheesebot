import { botConfig } from "@configs";
import { Category } from "@discordx/utilities";
import { AttachmentBuilder, CommandInteraction } from "discord.js";
import fetch from "node-fetch";
import { Discord, Slash } from "discordx";

@Discord()
@Category("General")
export default class CatCommand {

    @Slash({ 
        description: "Gives cat :3", 
        name: "give-cat", 
        defaultMemberPermissions: ["SendMessages"],
        guilds: [botConfig.test_guild_id, botConfig.prod_guild_id]
    })
    
    async giveCat(interaction: CommandInteraction) {
        const url = "https://api.thecatapi.com/v1/images/search";

        const response = await fetch(url);
        const data = await response.json();

        //@ts-ignore
        await interaction.followUp(data[0].url);

    }

}