const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDA0Mjc1MDc2NjI0NTQ3ODYw.DUVWPw.9SZDeQHOZJ5hHSdj_mhqn24pWso";
const PREFIX = "!";

function play(connection, message) {
    var server = server[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}
var eightBall = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "utlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
    console.log("Ready");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;
    
    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        case "about":
            message.channel.sendMessage("I'm FriendsNone' own personal bot!");
            break;
        case "ask":
            if (args[1]) message.channel.sendMessage(eightBall[Math.floor(Math.random() * eightBall.length)]);
            else message.channel.sendMessage("Can't read that");
            break;
        case "info":
            var embed = new Discord.RichEmbed()
                .setAuthor(message.author.username + "#" + message.author.discriminator + "'s Information")
                .addField("User ID:", message.author.id)
                .addField("User created at:", message.author.createdAt)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
            message.channel.sendEmbed(embed);
            break;
        case "notice":
            message.channel.sendMessage(message.author.toString() + " You've got pinged!");
            break;
        case "hilfe":
            message.channel.sendMessage("!Info);
            break;  
         
        case "play":
            if (!args[1]) {
                message.channel.sendMessage("No link provided");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel");
                return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var servers = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = server[message.guild.id];

            if (server.dispatcher) server.d.end();
            break;
        case "stop":
            var server = server[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        default:
            message.channel.sendMessage("Invaild command");
    }
});

bot.login(TOKEN);
