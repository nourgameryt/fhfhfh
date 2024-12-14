const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const botToken = 'MTMxNzIwODgxOTMxMDM5OTUzOA.G3XEGh.t50WcxlpcNed6M5T07Zgn0uj-3NJwpFza-PkXw';
const channelId = '1300408644780818512';

// قائمة الأسئلة
const questions = [
    "السؤال 1: ما هو اسمك؟",
    "السؤال 2: ما هو عمرك؟",
    "السؤال 3: أمر قبول ريبورت",
    "السؤال 4: أمر قفل ريبورت",
    "السؤال 5:أمر ذهاب لشخص ",
    "السؤال 6: أمر سحب شخص",
    "السؤال 7: أمر ذهاب لمكان",
    "السؤال 8: أمر سحب سيارة ",
    "السؤال 9: أمر تفعيل شارة الأدمن",
    "السؤال 10: أمر صنع أنترو",
    "السؤال 11: أمر حذف أنترو",
    "السؤال 12: أمر معرفه ايدي الأنترو",
    "السؤال 13 :أمر رؤية قائمة الفاكشنات",
    "السؤال 14 : أمر دخول الفاكشن كاليدر",
    "السؤال 15 : أمر تصليح سيارة",
    "السؤال 16 : أمر قلب سيارة",
    "السؤال 17 : ايدي الديسكورد الخاص بك"
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(botToken).catch(err => {
    console.error('Failed to log in to Discord bot:', err.message);
});

client.once('ready', () => {
    console.log(`Discord Bot Logged in as ${client.user.tag}!`);
});

app.post('/submit-form', async (req, res) => {
    const responses = req.body.responses;

    if (!responses || !Array.isArray(responses)) {
        return res.status(400).json({ success: false, message: 'Invalid responses format.' });
    }

    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel || !channel.isTextBased()) {
            return res.status(500).json({ success: false, message: 'Channel not found or not text-based.' });
        }

        const formattedResponses = responses
            .map((response, index) => `**${questions[index]}**\n${response}`)
            .join('\n\n');

        const embed = new EmbedBuilder()
            .setColor('#062629')
            .setTitle('نموذج تقديم جديد')
            .setDescription(formattedResponses)
            .setThumbnail('https://cdn.discordapp.com/attachments/1317486181411455057/1317490115529932890/logo.png?ex=675edfc9&is=675d8e49&hm=cd2d60da14ccc598d91f153a904e6aa6b3106d47fa72538a116e83837bfb7f14&') // صورة صغيرة بجانب العنوان
            .setTimestamp()
            .setFooter({ text: 'تم الإرسال بواسطة نموذج الإدارة' });

        // إرسال الرسالة إلى قناة ديسكورد
        await channel.send({ embeds: [embed] });
        res.json({ success: true, message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ success: false, message: 'Failed to submit form.' });
    }
});

// بدء تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
