const config = require('../../config/config')
const client = require('../../index')
const { MessageEmbed } = require('discord.js')

function log (type, user, about, fields, files) {
    if (config.bot.logs.enabled) {
        const guild = client.guilds.cache.get(config.bot.guild)
        if (!guild.channels.cache.get(config.bot.channels.logs)) return interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: user.displayAvatarURL({dynamic: true})
                }).setTitle('Logs Error').setColor('RED')
                .setDescription(`The logs channel was not configured`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
        })
        const embed = new MessageEmbed()
            .setAuthor({
                 name: user.tag,
                 iconURL: user.displayAvatarURL({dynamic: true})
            }).setTitle('`🧾` New log'+` (#${type})`).setColor(config.bot.design.color)
            .setDescription(`${about}`)
            .setFooter({
                text: config.name,  
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-default'])
            .setTimestamp()
        if (fields) {
            embed.addFields(fields)
        }
        if (files) return guild.channels.cache.get(config.bot.channels.logs).send({
            embeds: [ embed ], files: [files]})
        return guild.channels.cache.get(config.bot.channels.logs).send({
            embeds: [ embed ]})
    }
}

function role (interaction, role) {
    const member = client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id)
    if (member.roles.cache.has(role)) {
            member.roles.remove(role)
            return interaction.reply({ embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle('Removed Role').setColor('RED')
                .setDescription(`I sussesfuly removed to you the role <@&${role}>`)
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-red'])
                .setTimestamp()]
            , ephemeral: true})
        }
    member.roles.add(role)
    return interaction.reply({ embeds: [ new MessageEmbed()
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({dynamic: true})
        }).setTitle('Gived Role').setColor('GREEN')
        .setDescription(`I sussesfuly gived to you the role <@&${role}>`)
        .setFooter({
            text: config.name,
            iconURL: config.bot.icon
        })
        .setImage(config.bot.design['line-green'])
        .setTimestamp()]
    , ephemeral: true})
}

module.exports = {
    log: log,
    role: role
}