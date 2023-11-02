const config = require('../../config/config')
const client = require('../../index')
const suggestdb = require('../../models/suggestdb')
const {MessageEmbed} = require('discord.js')
const functions = require('../utils/functions')

client.on('interactionCreate', async(interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'acceptsugg') {
            const message = interaction.message
            const suggest = await suggestdb.findOne({
                id: interaction.message.id
            })
            if (!suggest) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('Not a suggest').setColor('RED')
                    .setDescription('I only can accept or deny a suggests...')
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            if (!(client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(config.bot.roles.headstaff) 
            || client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(config.bot.roles.staff))) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('No permissions').setColor('RED')
                    .setDescription(`Only staff with the role <@&${config.bot.roles.headstaff}> <@&${config.bot.roles.staff}> can modify the suggest`)
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            const embed = message.embeds[0]
            await message.edit({embeds: [embed.setFields(
            {
                name: '• Suggest',
                value: '```'+suggest.suggest+'```'
            }, {
                name: '• Information',
                value: `> Status: `+'`✔️`'+` Accepted\n> Modality: ${suggest.modality}\n> Staff: ${interaction.user} \n> From: ${client.users.cache.has(suggest.owner) ? client.users.cache.get(suggest.owner) : ('<@'+suggest.owner+'>')}`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            })
            .setImage(config.bot.design['line-green'])
            .setColor("GREEN")], components: []})
            await suggest.deleteOne()
            await functions.log('Suggest', interaction.user, `New suggest was be accepted`, [
                {
                    name: '• Suggest',
                    value: '```'+suggest.suggest+'```'
                }, {
                name: '• Information',
                value: `> Status: `+'`✔️`'+` Accepted\n> Modality: ${suggest.modality}\n> Staff: ${interaction.user} \n> From: ${client.users.cache.has(suggest.owner) ? client.users.cache.get(suggest.owner) : ('<@'+suggest.owner+'>')}`
            }])
            return await interaction.deferUpdate()
        } else if (interaction.customId === 'denysugg') {
            const message = interaction.message
            const suggest = await suggestdb.findOne({
                id: interaction.message.id
            })
            if (!suggest) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('Not a suggest').setColor('RED')
                    .setDescription('I only can accept or deny a suggests...')
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            if (!(client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(config.bot.roles.headstaff)
            || client.guilds.cache.get(config.bot.guild).members.cache.get(interaction.user.id).roles.cache.has(config.bot.roles.staff))) return interaction.reply({
                embeds: [ new MessageEmbed()
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({dynamic: true})
                    }).setTitle('No permissions').setColor('RED')
                    .setDescription(`Only staff with the role <@&${config.bot.roles.headstaff}> <@&${config.bot.roles.staff}> can modify the suggest`)
                    .setFooter({
                        text: config.name,
                        iconURL: config.bot.icon
                    })
                    .setImage(config.bot.design['line-red'])
                    .setTimestamp()]
            , ephemeral: true})
            const embed = message.embeds[0]
            await message.edit({embeds: [ embed.setFields(
            {
                name: '• Suggest',
                value: '```'+suggest.suggest+'```'
            }, {
                name: '• Information',
                value: `> Status: `+'`❌`'+` Denied\n> Modality: ${suggest.modality}\n> Staff: ${interaction.user} \n> From: ${client.users.cache.has(suggest.owner) ? client.users.cache.get(suggest.owner) : ('<@'+suggest.owner+'>')}`
            })
            .setFooter({
                text: config.name,
                iconURL: config.bot.icon
            }).setColor("RED")
            .setImage(config.bot.design['line-red'])], components: []})
            await suggest.deleteOne()
            await functions.log('Suggest', interaction.user, `New suggest was be denied`, [
                {
                    name: '• Suggest',
                    value: '```'+suggest.suggest+'```'
                }, {
                name: '• Information',
                value: `> Status: `+'`❌`'+` Denied\n> Modality: ${suggest.modality}\n> Staff: ${interaction.user} \n> From: ${client.users.cache.has(suggest.owner) ? client.users.cache.get(suggest.owner) : ('<@'+suggest.owner+'>')}`
            }])
            return await interaction.deferUpdate()
        }
    }
})