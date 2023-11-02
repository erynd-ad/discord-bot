const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js')
const functions = require('../utils/functions')
const config = require('../../config/config')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get the information about the server!'),
    async run(client, interaction) {
        interaction.reply({
            embeds: [ new MessageEmbed()
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({dynamic: true})
                }).setTitle(`${config.name} Information`).setColor(config.bot.design.color)
                .setDescription('`💻` **Minecraft Information |**  Thats what im for! have fun inviting and playing with your friends in our different modes, remember that if you invite a lot of people you could win ranks or advantages inside our server.')
                .addFields({
                    name: '__(💳) Ranks and Support__',
                    value: '> `➜` Store (ranks): store.'+`${config.name.toLowerCase()}`+'.us\n> `➜` TeamSpeak (support): ts.'+`${config.name.toLowerCase()}`+'.us'
                }, {
                    name: '__(🔔) Social__',
                    value: '> `➜` Twitter: https://twitter.com/'+`${config.name}`+'\n> `➜` Discord: http://discord.'+`${config.name.toLowerCase()}`+'.us/\n> `➜` Website: http://www.'+`${config.name.toLowerCase()}`+'.us/'
                }, {
                    name: '__(🧼) Game__',
                    value: '> `➜` Minecraft Ip: '+`${config.name.toLowerCase()}`+'.us\n\nTake this and have fun playing on the server with your friends!'
                })
                .setFooter({
                    text: config.name,
                    iconURL: config.bot.icon
                })
                .setImage(config.bot.design['line-default'])
                .setTimestamp()]})
    }
}