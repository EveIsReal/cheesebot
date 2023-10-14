import { ActivityType } from "discord.js"
import { Client } from "discordx"
import { injectable } from "tsyringe"

import { generalConfig, logsConfig } from "@configs"
import { Discord, Once, Schedule } from "@decorators"
import { Data } from "@entities"
import { Database, Logger, Scheduler, Store } from "@services"
import { isInMaintenance, resolveDependency, syncAllGuilds } from "@utils/functions"

@Discord()
@injectable()
export default class ReadyEvent {

    constructor(
        private db: Database,
        private logger: Logger,
        private scheduler: Scheduler,
        private store: Store
    ) {}

    private activityIndex = 0

    @Once('ready')
    async readyHandler([client]: [Client]) {

        // make sure all guilds are cached
        await client.guilds.fetch()

        // synchronize applications commands with Discord
        await client.initApplicationCommands({
            global: {
                disable: {
                    delete: false
                }
            }
        })

        // update last startup time in the database
        await this.db.get(Data).set('lastStartup', Date.now())

        // start scheduled jobs
        this.scheduler.startAllJobs()

        // log startup
        await this.logger.logStartingConsole()

        // synchronize guilds between discord and the database
        await syncAllGuilds(client)

        // the bot is fully ready
        this.store.update('ready', (e) => ({ ...e, bot: true }))

        const maintenance = await isInMaintenance();

        if(!maintenance) {
            client.user?.setStatus("online");
            client.user?.setActivity("cute people chat :3", { type: ActivityType.Watching });
        } else {
            client.user?.setActivity("MAINENANCE");
			client.user?.setStatus("dnd");
        }
    }
}