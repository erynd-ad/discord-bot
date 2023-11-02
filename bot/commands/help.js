const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get all commands of the discord bot!'),
    async run(client, interaction) {
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Discord Help').setColor(config.bot.design.color)
                .setDescription('`🔋` **Bot Commands |** All Out-Sense bot commands are here, i will be separate the user and staff commands... !')
                .addFields({
                    name: '__(🏐) Normal Commands__',
                    value: '> `➜` /info\n> `➜` /rules\n> `➜` /media\n> `➜` /suggest\n> `➜` /lff'
                }, {
                    name: '__(👮) Staff Commands__',
                    value: '> `➜` /devlog\n> `➜` /panel'
                }, {
                    name: '__(🎫) Ticket Commands__',
                    value: '> `➜` /ticket add\n> `➜` /ticket remove'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design.banner).setThumbnail(config.bot.icon)
                .setTimestamp()]})
    }
}