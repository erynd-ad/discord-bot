const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('media')
    .setDescription('Get the media ranks about the server!'),
    async run(client, interaction) {
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle(`${config.name} Media`).setColor(config.bot.design.color)
                .setDescription("`📹` **Requeriments for Postulation |** The media ranks have some rewards in game, create a ticket for claim a media rank.\n\n"+`**<@&${config.bot.roles.media.partner}> Requeriments**\n> 800 Subs\n> 300 Visits per video\n> __(Alert) ${config.name} dont pay partners__\n\n**<@&${config.bot.roles.media.famous}> Requeriments**\n> 400 Subs\n> 150 Visits per video\n\n**<@&${config.bot.roles.media.youtuber}> Requeriments**\n> 150 Subs\n> 80 Visits per video\n\n**<@&${config.bot.roles.media.miniyoutuber}> Requeriments**\n> 50 Subs\n> 30 Visits per video\n\nFor media ranks requeriments we have exceptions all media ranks have a special rewards, to claim rank go to tickets or dm a owner, you can get more information creating a ticket`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()]})
    }
}