const { MessageEmbed } = require("discord.js")
const config = require('../../config/config')
const client = require('../../index')

client.on('guildMemberAdd', async (member) => {
    let users = client.guilds.cache.get(config.bot.guild).members.cache.filter((m) => !m.user.bot).size
    client.guilds.cache.get(config.bot.guild).channels.cache.get(config.bot.channels.join).send({
        embeds: [ new MessageEmbed()
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL({dynamic: true})
            }).setTitle('`📩` New join (#User)').setColor(config.bot.design.color)
            .setDescription(`Wellcome ${member} to **Out-Sense | Network**, remind read the rules and information channel, you can create ticket in <#1049385603692777563> if you have a problem. See the Out-Sense bot commands with the command /help\n\n**• Information**\n> Date: <t:${parseInt((new Date(new Date()).getTime() / 1000).toFixed(0))}:R>\n> New User: ${client.users.cache.get(member.id).tag}\n> New Total Users: ${users}`)
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-default'])
            .setTimestamp()]
    , ephemeral: true})
})