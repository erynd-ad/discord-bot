const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const config = require('../../config/config')
const suggestdb = require('../../models/suggestdb')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Send a Suggest with the bot!')
    .addStringOption(o => 
        o.setName('suggest')
        .setDescription('Enter the suggest description')
        .setRequired(true))
    .addStringOption(o => 
        o.setName('modality')
        .setDescription('Enter the modality to the suggest')
        .setRequired(true)),

    async run(client, interaction) {
        const description = interaction.options.getString('suggest')
        const modality = interaction.options.getString('modality')
        const suggest = client.guilds.cache.get(config.bot.guild).channels.cache.get(config.bot.channels.suggest)
        if (!suggest) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Suggest Error').setColor('RED')
                .setDescription(`The suggest channel was not configured`)
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
        const suggestmessage = await suggest.send({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('`💡`'+` New Suggestion (#${modalityname})`).setColor(config.bot.design.color)
                .setDescription(`A player was gived a suggest!`)
                .setFields({
                    name: '• Suggest',
                    value: '```'+description+'```'
                }, {
                    name: '• Information',
                    value: `> Status: `+'`🕛`'+` Pending\n> Modality: ${modalityname}\n> From: ${interaction.user}`
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default']).setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()]
        , components: [
            new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('acceptsugg')
                    .setLabel('Accept')
					.setStyle('SUCCESS'),
			)
            .addComponents(
				new MessageButton()
					.setCustomId('denysugg')
                    .setLabel('Deny')
					.setStyle('DANGER'),
            )
        ]})
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Suggest Message').setColor('GREEN')
                .setDescription(`I sussesfuly send the suggest message to ${suggest}`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-green'])
                .setTimestamp()]
        , ephemeral: true})
        const newsugg = new suggestdb({
            id: suggestmessage.id,
            suggest: description,
            modality: modalityname,
            owner: interaction.user.id
        })
        return await newsugg.save()
    }
}