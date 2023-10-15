import { ArgsOf, Client } from "discordx"

import { Discord, Guard, On } from "@decorators"
import { Maintenance } from "@guards"
import { executeEvalFromMessage, isDev, isInMaintenance } from "@utils/functions"

import { generalConfig } from "@configs"
import { Role } from "discord.js"

@Discord()
export default class MessageCreateEvent {

    @On("messageCreate")
    @Guard(
        Maintenance
    )
    async messageCreateHandler(
        [message]: ArgsOf<"messageCreate">, 
        client: Client
     ) {

        const maintenance = await isInMaintenance();

        if(!maintenance) {
            
            const fRole = "1147729399941185596";
            const mRole = "1147729514508591207";
            const nRole = "1147729571941187646";

            if(message.author.id == "714164995482714133" && message.content.toLowerCase() == "what am i") {
                await message.reply("You are mommy, Riri :3")
                return;
            }

            if(message.author.id == "293740213224734720" && message.content.toLowerCase() == "what am i") {
                await message.reply("UR MY AWESOME PRETTY SMART BEAUTIFUL HOT AND CHARISMATIC CREATOR <333333")
                return;
            }

            if(message.author.id == "326119117637812234" && message.content.toLowerCase() == "what am i") {
                await message.reply("A really good kitty :3")
                return;
            }

            if(message.author.id == "599967827520389185" && message.content.toLowerCase() == "what am i") {
                await message.reply("Good little mousey <3");
                return;
            }

            if(message.author.id == "522266363864154112" && message.content.toLowerCase() == "what am i") {
                await message.reply("The Goodest girl, lilypie <333");
                return;
            }

            if(message.author.id == "597073827314401293" && message.content.toLowerCase() == "what am i") {
                await message.reply("A good puppy :3");
                return;
            }

            if(message.author.id == "1018373900700229653" && message.content.toLowerCase() == "what am i") {
                await message.reply("Good pumpkin :3");
                return;
            }

            if(message.content.toLowerCase() == "what am i") {
                
                if(message.member?.roles.cache.has(fRole) && !(message.member.roles.cache.has(mRole) && !(message.member.roles.cache.has(nRole)))) {
                    // she/her
                    await message.reply(`Good girl, ${message.author.username} <3`);
                    return;
                }

                if(message.member?.roles.cache.has(mRole) && !(message.member.roles.cache.has(fRole) && !(message.member.roles.cache.has(nRole)))) {
                    // he/him
                    await message.reply(`Good boy, ${message.author.username} <3`);
                    return;
                }

                if(message.member?.roles.cache.has(nRole) && !(message.member.roles.cache.has(mRole) && !(message.member.roles.cache.has(fRole)))) {
                    // they/them
                    await message.reply(`Good they, ${message.author.username} <3`);
                    return;
                }
                await message.reply(`Good they, ${message.author.username} <3`);
            }
        } 

        // eval command
        if (
            message.content.startsWith(`\`\`\`${generalConfig.eval.name}`)
            && (
                (!generalConfig.eval.onlyOwner && isDev(message.author.id))
                || (generalConfig.eval.onlyOwner && message.author.id === generalConfig.ownerId)
            )
        ) {
            executeEvalFromMessage(message)
        }

        await client.executeCommand(message, false)
    }

}