const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const config = require('../../config/config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lff')
    .setDescription('Send a LFF with the bot!')
    .addStringOption(o => 
        o.setName('description')
        .setDescription('Select a description of your lff')
        .setRequired(true))
    .addStringOption(o => 
        o.setName('class')
        .setDescription('Enter the class (Ej: Archer)')
        .setRequired(true))
    .addStringOption(o => 
        o.setName('modality')
        .setDescription('Enter the modality')
        .setRequired(true)),

    async run(client, interaction) {
        const description = interaction.options.getString('description')
        const classs = interaction.options.getString('class')
        const modality = interaction.options.getString('modality')
        const lff = client.guilds.cache.get(config.bot.guild).channels.cache.get(config.bot.channels.lff)
        if (!lff) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('LFF Error').setColor('RED')
                .setDescription(`The lff channel was not configured`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        if (!['DIAMOND', 'BARD', 'ROGUE', 'ARCHER', 'BUILDER', 'MINER', 'ALL'].includes(classs.toUpperCase())) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Invalid Class').setColor('RED')
                .setDescription(`The class ${classs} are invalid, here are the aviable classes...`)
                .setFields({
                    name: '__(⚔️) Classes__',
                    value: '> `➜` Diamond\n> `➜` Bard\n> `➜` Rogue\n> `➜` Archer\n> `➜` Builder\n> `➜` Miner\n> `➜` All'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        if (!['HCFACTIONS', 'KITMAP', 'GLOBAL'].includes(modality.toUpperCase())) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Invalid Modality').setColor('RED')
                .setDescription(`The modality ${modality} are invalid, here are the aviable servers...`)
                .setFields({
                    name: '__(🕹) Modaility__',
                    value: '> `➜` HCFactions\n> `➜` Kitmap\n> `➜` Global'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        const modalityname = (modality.toUpperCase() === 'HCFACTIONS') ? 'HCFactions' : ((modality.toUpperCase() === 'KITMAP') ? 'Kitmap' : ((modality.toUpperCase() === 'GLOBAL') ? 'Global' : 'Null'))
        const classname = (classs.toUpperCase() === 'DIAMOND') ? 'Diamond' : ((classs.toUpperCase() === 'BARD') ? 'Bard' : ((classs.toUpperCase() === 'ROGUE') ? 'Rogue' : ((classs.toUpperCase() === 'ARCHER') ? 'Archer' : ((classs.toUpperCase() === 'BUILDER') ? 'Builder' : ((classs.toUpperCase() === 'MINER') ? 'Miner' : ((classs.toUpperCase() === 'ALL') ? 'All' : 'Null'))))))
        lff.send({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('`🛡️`'+` New LFF (#${modalityname})`).setColor(config.bot.design.color)
                .setDescription(`A player is looking for a faction!`)
                .setFields({
                    name: '• Description',
                    value: '```'+description+'```'
                }, {
                    name: '• Information',
                    value: `> Class: ${classname}\n> Modality: ${modalityname}\n> From: ${interaction.user}`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default']).setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()]
        })
        return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('LFF Message').setColor('GREEN')
                .setDescription(`I sussesfuly send the lff message to ${lff}`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-green'])
                .setTimestamp()]
        , ephemeral: true})
    }
}