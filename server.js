const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // لإصلاح مشاكل CORS
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // تفعيل CORS

// إعداد بوت ديسكورد
const botToken = 'MTMxNzIwODgxOTMxMDM5OTUzOA.G3XEGh.t50WcxlpcNed6M5T07Zgn0uj-3NJwpFza-PkXw'; // ضع توكن البوت الخاص بك
const channelId = '1317132857495257110'; // ضع رقم القناة المستهدفة هنا

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.login(botToken);

client.once('ready', () => {
    console.log(`Discord Bot Logged in as ${client.user.tag}!`);
});

// نقطة النهاية لاستقبال الاقتراحات
app.post('/send-suggestion', (req, res) => {
    const suggestion = req.body.suggestion;

    if (!suggestion) {
        return res.status(400).json({ success: false, message: 'No suggestion provided.' });
    }

    // إرسال الاقتراح إلى قناة ديسكورد
    const channel = client.channels.cache.get(channelId);
    if (channel) {
        // إنشاء رسالة متقدمة باستخدام Embed
        const embed = new EmbedBuilder()
            .setColor('#062629') // اللون الأخضر
            .setTitle('اقتراح جديد 📩')
            .setDescription(`**تفاصيل الاقتراح:**\n${suggestion}`)
            .setThumbnail('https://cdn.discordapp.com/attachments/1317486181411455057/1317490115529932890/logo.png?ex=675edfc9&is=675d8e49&hm=cd2d60da14ccc598d91f153a904e6aa6b3106d47fa72538a116e83837bfb7f14&') // رابط الصورة
            .setFooter({ text: 'تم الإرسال بواسطة بوت الاقتراحات', iconURL: 'https://cdn.discordapp.com/attachments/1317486181411455057/1317490115529932890/logo.png?ex=675edfc9&is=675d8e49&hm=cd2d60da14ccc598d91f153a904e6aa6b3106d47fa72538a116e83837bfb7f14&' })
            .setTimestamp();

        channel.send({ embeds: [embed] })
            .then(() => res.json({ success: true, message: 'Suggestion sent successfully!' }))
            .catch(error => {
                console.error('Error sending message to Discord:', error);
                res.status(500).json({ success: false, message: 'Failed to send suggestion.' });
            });
    } else {
        console.error('Channel not found.');
        res.status(500).json({ success: false, message: 'Channel not found.' });
    }
});

// بدء تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
