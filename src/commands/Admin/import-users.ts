import { Category } from "@discordx/utilities";
import { User } from "@entities";
import { Database } from "@services";
import { simpleSuccessEmbed } from "@utils/functions";
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { Discord, Slash } from "discordx";
import { injectable } from "tsyringe";

@Discord()
@injectable()
@Category("Admin")
export default class ImportUserCommand {

    constructor(private db: Database) {}

    @Slash({ 
        name: "import-members",
        description: "Imports guild members to database, if and only if the database does not contain the members user-id",
        defaultMemberPermissions: [PermissionFlagsBits.Administrator],
        //@ts-ignore
        guilds: [process.env.TEST_GUILD_ID, process.env.PROD_GUILD_ID]
     })

     async import(interaction: CommandInteraction) {
        const members = await interaction.guild?.members.fetch();
        const userRepo = this.db.get(User);
        let skipped = 0;
        

        members?.forEach(async member => {
            if(!(await userRepo.findOne({ id: member.id }))) {
                // insert user
                const user = new User();
                user.id = member.id;

                await userRepo.persistAndFlush(user);
            } else {
                // user already exists
                skipped++;
            }
        });

        simpleSuccessEmbed(interaction, `Imported members. Skipped: ${skipped}.`);
     }

}