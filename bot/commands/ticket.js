const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')
const ticketdb = require('../../models/ticketdb')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Manage people to the ticket !')
    .addSubcommand(o=>
        o.setName('add')
        .setDescription('Add a member to the ticket!')
        .addUserOption(o => 
            o.setName('user')
            .setDescription('Select a User')
            .setRequired(true)))
    .addSubcommand(o=>
        o.setName('remove')
        .setDescription('Remove a member to the ticket!')
        .addUserOption(o => 
            o.setName('user')
            .setDescription('Select a User')
            .setRequired(true))),

    async run(client, interaction) {
        const ticket = await ticketdb.findOne({
            id: interaction.channel.id
        })
        if (!ticket) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Not a ticket').setColor('RED')
                .setDescription('I only can add or remove people in a ticket...')
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        , ephemeral: true})
        const user = interaction.options.getUser('user')
        if (interaction.options.getSubcommand() === 'add') {
            if (!client.guilds.cache.get(config.bot.guild).members.cache.get(user.id).permissionsIn(interaction.channel).has('VIEW_CHANNEL')) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('User is not on the ticket').setColor('RED')
                    .setDescription('This user is not on the ticket...')
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            interaction.channel.permissionOverwrites.edit(user, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGE_HISTORY: true
            })
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('Member Added').setColor('GREEN')
                    .setDescription(`I sussesfuly added ${user} to the ticket`)
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-green'])
                    .setTimestamp()]
            , ephemeral: true})
        } else if (interaction.options.getSubcommand() === 'remove') {
            if (client.guilds.cache.get(config.bot.guild).members.cache.get(user.id).permissionsIn(interaction.channel).has('VIEW_CHANNEL')) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('Already in').setColor('RED')
                    .setDescription('This user are not in the ticket...')
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            interaction.channel.permissionOverwrites.edit(user, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false
            })
            interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('Member Removed').setColor('RED')
                    .setDescription(`I sussesfuly removed ${user} to the ticket`)
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
        }
    }
}