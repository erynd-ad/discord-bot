const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../config/config')
const functions = require('../utils/functions')

module.exports = {
    permission: 'ADMINISTRATOR',
    data: new SlashCommandBuilder()
    .setName('devlog')
    .setDescription('Send a devlog message with the bot!')
    .addStringOption(o => 
        o.setName('devlog')
        .setDescription('Design a devlog for the message')
        .setRequired(true))
    .addStringOption(o => 
        o.setName('type')
        .setDescription('Enter the type of the devlog')
        .setRequired(true))
    .addStringOption(o => 
        o.setName('modality')
        .setDescription('Enter the modality')
        .setRequired(true)),

    async run(client, interaction) {
        const description = interaction.options.getString('devlog')
        const type = interaction.options.getString('type')
        const modality = interaction.options.getString('modality')
        const devlog = client.guilds.cache.get(config.bot.guild).channels.cache.get(config.bot.channels.devlog)
        if (!devlog) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Devlog Error').setColor('RED')
                .setDescription(`The devlog channel was not configured`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        if (!['ADDED', 'UPDATED', 'FIXED', 'REMOVED'].includes(type.toUpperCase())) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Invalid Type').setColor('RED')
                .setDescription(`The class ${type} are invalid, here are the aviable classes...`)
                .setFields({
                    name: '__(🚁) Types__',
                    value: '> `➜` Added\n> `➜` Updated\n> `➜` Fixed\n> `➜` Removed'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        if (!['HCFACTIONS', 'KITMAP', 'DISCORD', 'GLOBAL'].includes(modality.toUpperCase())) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Invalid Modality').setColor('RED')
                .setDescription(`The modality ${modality} are invalid, here are the aviable servers...`)
                .setFields({
                    name: '__(🕹) Modaility__',
                    value: '> `➜` HCFactions\n> `➜` Kitmap\n> `➜` Discord\n> `➜` Global'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        const modalityname = (modality.toUpperCase() === 'HCFACTIONS') ? 'HCFactions' : ((modality.toUpperCase() === 'KITMAP') ? 'Kitmap' : ((modality.toUpperCase() === 'DISCORD') ? 'Discord' : ((modality.toUpperCase() === 'GLOBAL') ? 'Global' : 'Null')))
        const typename = (type.toUpperCase() === 'ADDED') ? '[+] Added' : ((type.toUpperCase() === 'UPDATED') ? '[$] Updated' : ((type.toUpperCase() === 'FIXED') ? '[%] Fixed' : ((type.toUpperCase() === 'REMOVED') ? '[-] Removed' : 'Null')))
        devlog.send({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('`📜`'+` New Devlog (#${modalityname})`).setColor(config.bot.design.color)
                .setDescription(`Staff was maked a new devlog!`)
                .setFields({
                    name: '• Description',
                    value: '```'+description+'```'
                }, {
                    name: '• Information',
                    value: `> Staff: ${interaction.user}\n> Modality: ${modalityname}\n> Type: ${typename}`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default']).setThumbnail(config.bot.icon)
                .setTimestamp()]
        })
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Devlog Message').setColor('GREEN')
                .setDescription(`I sussesfuly send the devlog message to ${devlog}`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-green'])
                .setTimestamp()]
        , ephemeral: true})
        return functions.log('Devlog', interaction.user, `New devlog messages was sended`, [
        {
            name: '• Description',
            value: '```'+description+'```'
        }, {
            name: '• Information',
            value: `> Type: ${typename}\n> Sender: ${interaction.user}\n> Channel: ${devlog}`
        }])
    }
}