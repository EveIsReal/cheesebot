import { Category } from "@discordx/utilities";
import { isDev, isTestserver, simpleErrorEmbed, simpleSuccessEmbed } from "@utils/functions";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { User } from "discord.js";
import * as DatabaseEntities from "@entities";
import { Discord, Slash, SlashOption } from "discordx";
import { Database } from "@services";
import { injectable } from "tsyringe";
import { CommandLogAction } from "src/utils/types/commands";
import { botConfig } from "@configs";

@Discord()
@injectable()
@Category("Admin")
export default class FlagUserCommand {

    constructor(private db: Database) {}

    @Slash({
        name: "flag-user",
        description: "Adds a flag to a User so mods will get notified when",
        defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
        //@ts-ignore
        guilds: [botConfig.test_guild_id, botConfig.prod_guild_id]
    })

    async flagUser(
        @SlashOption({
            description: "The user the flag gets added to.",
            name: "user",
            required: true,
            type: ApplicationCommandOptionType.User,
        })
        userToFlag: User,
        @SlashOption({
            name: "reason",
            description: "A short description on why the user got flagged.",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        reason: string,

    interaction: CommandInteraction) {

        if(isDev(userToFlag.id) || interaction.guild?.members.cache.get(userToFlag.id)?.permissions.has(PermissionFlagsBits.BanMembers)) {
            // user is mod
            simpleErrorEmbed(interaction, `This user can not be flagged.`);
            return;
        }
        
        const userRepo = this.db.get(DatabaseEntities.FlaggedUser);
        let dbUser = await userRepo.findOne({ id: userToFlag.id });

        if(dbUser) {
            simpleErrorEmbed(interaction, "This user is already flagged");
            return;
        } else {
            dbUser = new DatabaseEntities.FlaggedUser();
            dbUser.id = userToFlag.id;
            await userRepo.persistAndFlush(dbUser);
    
            simpleSuccessEmbed(interaction, `User <@${userToFlag.id}> has been flagged.`);

            cmdLogEmbed(interaction, interaction.user, userToFlag, reason, "FLAGGED_USER", isTestserver(interaction.guild?.id ?? ""));

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
    if(action == "FLAGGED_USER") {
        const embed = new EmbedBuilder()
        .setColor(0xffb52b)
        .setTitle(":bangbang: User has been flagged.")
        .addFields({ name: "User", value: `<@${target.id}>`, inline: true })
        .addFields({ name: "Flagged by", value: `<@${mod.id}>`, inline: true })
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