import { botConfig } from "@configs";

export const isTestserver = (guildId: string): boolean => {
    return guildId == botConfig.test_guild_id;
}