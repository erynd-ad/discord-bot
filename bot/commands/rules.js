const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Get the rules about the server!'),
    async run(client, interaction) {
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle(`${config.name} Rules`).setColor(config.bot.design.color)
                .setDescription('`📑` **Rules Information |** To stay on the server we require you to follow the rules to the letter. If you break any of these rules, you could get a serious penalty. Please follow the rules and most of all have fun!\n\n`❌` Not be toxic\n`❌` Do not spend any kind of thing related to pornography, gore, etc.\n`❌` Do not impersonate the staff team\n`❌` Do not create SENSE tickets\n`❌` Do not pass External Links to the server\n`❌` No spam\n`❌` Do not use commands on an unseen channel\n\nWe dont want to ban you so please follow the rules!')
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()]})
    }
}