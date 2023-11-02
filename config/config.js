const config = require('./config.json')

module.exports = {
    name: config.name,
    mongo: {
        uri: config.mongo.uri
    },
    bot: {
        token: config.bot.token,
        guild: config.bot.guildid,
        icon: config.bot.icon || 'https://portfolio.d2siado.repl.co/resources/favicon.gif',
        design: {
            banner: config.bot.design.banner || 'https://cdn.discordapp.com/attachments/928452988417237072/939637690155024444/standard.gif',
            color: config.bot.design.color || '7D00FF',
            ['line-default']: config.bot.design['line-default'] || '',
            ['line-green']: config.bot.design['line-green'] || '',
            ['line-red']: config.bot.design['line-red'] || ''
        },
        channels: {
            lff: config.bot.channels.lff,
            suggest: config.bot.channels.suggest,
            devlog: config.bot.channels.devlog,
            logs: config.bot.channels.logs,
            join: config.bot.channels.join,
            categories: {
                tickets: config.bot.channels.categories['tickets'],
            }
        },
        logs: {
            enabled: config.bot.logs.enabled
        },
        roles: {
            user: config.bot.roles.user,
            staff: config.bot.roles.staff,
            headstaff: config.bot.roles.headstaff,
            media: {
                partner: config.bot.roles.media.partner,
                famous: config.bot.roles.media.famous,
                youtuber: config.bot.roles.media.youtuber,
                miniyoutuber: config.bot.roles.media.miniyoutuber,
                streamer: config.bot.roles.media.streamer
            },
            auto: {
                spoilers: config.bot.roles.auto.spoilers,
                giveaways: config.bot.roles.auto.giveaways,
                events: config.bot.roles.auto.events
            }
        },
        presence: {
            enabled: config.bot.presence.enabled || true,
            type: config.bot.presence.type || 'PLAYING',
            interval: config.bot.presence.interval || '1m',
            activities: config.bot.presence.activities || [ "I see a %members% members on the network !",
            "Supporting %tickets% tickets !",
            "The network ip is SOON...",
            "Get support on teamspeak3 @ SOON" ]
        }
    }
}