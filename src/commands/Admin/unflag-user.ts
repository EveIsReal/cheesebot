import { Category } from "@discordx/utilities";
import { Database } from "@services";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionFlagsBits, User } from "discord.js";
import { Discord } from "discordx";
import { injectable } from "tsyringe";
import * as DatabaseEntities from "@entities";
import { Slash, SlashOption } from "@decorators";
import { isTestserver, simpleErrorEmbed, simpleSuccessEmbed } from "@utils/functions";
import { CommandLogAction } from "src/utils/types/commands";
import { botConfig } from "@configs";

@Discord()
@injectable()
@Category("Admin")
export default class UnflagUserCommand {

    constructor(private db: Database) {}

    @Slash({
        name: "unflag-user",
        description: "Removes flag from a user.",
        defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
        //@ts-ignore
        guilds: [botConfig.test_guild_id, botConfig.prod_guild_id]
    })

    async unflagUser(
        @SlashOption({
            description: "The user to unflag",
            name: "user",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        userToUnflag: User,
        @SlashOption({
            name: "reason",
            description: "A short description on why the user got flagged.",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reason: string,

    interaction: CommandInteraction) {
        
        const userRepo = this.db.get(DatabaseEntities.FlaggedUser);
        let dbUser = await userRepo.findOne({ id: userToUnflag.id });

        if(!dbUser) {
            simpleErrorEmbed(interaction, "This user is not flagged");
            return;
        } else {
            
            await userRepo.removeAndFlush(dbUser);
    
            simpleSuccessEmbed(interaction, `Flag from User <@${userToUnflag.id}> has been removed.`);

            cmdLogEmbed(interaction, interaction.user, userToUnflag, reason, "UNFLAGGED_USER", isTestserver(interaction.guild?.id ?? ""));

            return;
        }
        
        simpleErrorEmbed(interaction, "An unexpected error occoured. Please reach out to <@293740213224734720>.")
    }
}

export const cmdLogEmbed = async (
    interaction: CommandInteraction,
    mod: User, 
    target: User, 
    reason: string, 
    action: CommandLogAction,
    isTestserver: boolean
) => {

    if(action == "UNFLAGGED_USER") {
        const embed = new EmbedBuilder()
        .setColor(0xffb52b)
        .setTitle(":bangbang: User flag has been revoked.")
        .addFields({ name: "User", value: `<@${target.id}>`, inline: true })
        .addFields({ name: "Unflagged by", value: `<@${mod.id}>`, inline: true })
        .addFields({ name: "Reason", value: `${reason}`, inline: true })
        .setThumbnail("https://images.twinkl.co.uk/tw1n/image/private/t_630/u/ux/exclamation-mark_ver_1.jpg")

        if(isTestserver) {
            const botChannel = interaction.guild?.channels.cache.get(botConfig.test_guild_bot_channel);
            if(botChannel?.isTextBased())
                await botChannel.send({embeds: [embed]});
        } else {
            const botChannel = interaction.guild?.channels.cache.get(botConfig.prod_guild_bot_channel);
            if(botChannel?.isTextBased())
                await botChannel.send({embeds: [embed]});
        }
    }


} 