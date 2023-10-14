import { ActivityType, ApplicationCommandOptionType, CommandInteraction } from "discord.js"
import { Client } from "discordx"

import { Discord, Guard, Slash, SlashOption } from "@decorators"
import { Disabled } from "@guards"
import { isDev, setMaintenance, simpleErrorEmbed, simpleSuccessEmbed } from "@utils/functions"
import { botConfig } from "@configs"

@Discord()
export default class MaintenanceCommand {

	@Slash({ 
		name: 'maintenance',
		defaultMemberPermissions: ["BanMembers"],
		guilds: [botConfig.test_guild_id, botConfig.prod_guild_id]
	})
	@Guard(
		Disabled
	)
	async maintenance(
		@SlashOption({ name: 'state', type: ApplicationCommandOptionType.Boolean, required: true }) state: boolean,
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {

		if(!isDev(interaction.user.id)) {
			simpleErrorEmbed(interaction, "Maintenance can only be activated by a developer.")
			return;
		}

		await setMaintenance(state);

		if(state) {
			client.user?.setActivity("MAINTENANCE");
			client.user?.setStatus("dnd");
		} else {
			client.user?.setActivity("cute people chat :3", { type: ActivityType.Watching });
			client.user?.setStatus("online");
		}

		simpleSuccessEmbed(
			interaction, 
			localize.COMMANDS.MAINTENANCE.EMBED.DESCRIPTION({
				state: state ? 'on' : 'off'
			})
		)
	}
}