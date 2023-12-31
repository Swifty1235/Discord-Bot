const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: 'YOUR_YOUTUBE_API_KEY' // Replace with your YouTube Data API key
});

const client = new Discord.Client();
const prefix = '!'; // Command prefix

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        if (!args.length) {
            return message.channel.send('Please provide the name of the song!');
        }
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        const searchResponse = await youtube.search.list({
            part: 'snippet',
            q: args.join(' '),
            maxResults: 1,
            type: 'video'
        });

        const videoId = searchResponse.data.items[0].id.videoId;
        const songUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const connection = await voiceChannel.join();
        const stream = ytdl(songUrl, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
    }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
