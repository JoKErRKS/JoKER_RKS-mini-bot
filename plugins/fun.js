const { cmd } = require('../redx');

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const replies = {
  wife: [
    "💍 Wife detector says: *SYSTEM BUSY* 😂",
    "👀 Your wife is currently in the imagination server. 😂",
    "😂 JoKER_RKS mini checked the database: *No wife record found!*",
    "💔 Error 404: Wife not found. 😭😂",
    "👑 AFTAB RKS says: Pehle group mein survive karo, phir wife! 😂"
  ],
  husband: [
    "😂 Husband database says: *Loading... forever!*",
    "💀 Error 404: Husband not found.",
    "👀 JoKER_RKS mini says: Maybe he is hiding from the group admins. 😂",
    "🤣 Search result: *Too much attitude, not enough husband.*"
  ],
  love: [
    "❤️ Love level: ${Math.floor(Math.random() * 101)}%",
    "💖 Status: Feelings detected. 😂",
    "🥰 JoKER_RKS mini approves the vibes!",
    "😂 Love.exe is running... probably."
  ],
  joke: [
    "😂 Why did the programmer bring a ladder? Because the code had too many levels!",
    "🤣 I told my bot to relax. It replied: `404 Chill Not Found`.",
    "😎 My code has no bugs. They are just undocumented features."
  ],
  truth: [
    "🎯 Truth: You opened this command because you had nothing better to do. 😂",
    "👀 Truth mode: The group chat is probably louder than your notifications.",
    "🤣 Truth: Someone here is reading this and pretending not to."
  ],
  dare: [
    "🔥 Dare: Send your next message using only emojis.",
    "😂 Dare: Say 'JoKER_RKS mini is the GOAT' in the group.",
    "👑 Dare: Give a genuine compliment to someone in the group."
  ],
  rate: [
    "📊 Random rating: ${Math.floor(Math.random() * 101)}%",
    "🎲 Today’s rating: ${Math.floor(Math.random() * 101)}%",
    "😂 Scientific calculation complete: ${Math.floor(Math.random() * 101)}%"
  ],
  '8ball': [
    "🎱 Absolutely!",
    "🎱 Probably not 😂",
    "🎱 Ask again later.",
    "🎱 The bot has no idea. 😭",
    "🎱 Signs point to YES."
  ]
};

for (const [name, list] of Object.entries(replies)) {
  cmd({
    pattern: name,
    desc: `Fun ${name} command`,
    category: "fun",
    react: name === "8ball" ? "🎱" : "😂",
    filename: __filename
  }, async (conn, mek, m, { reply }) => {
    const message = pick(list);
    reply(message.replace(/\$\{Math\.floor\(Math\.random\(\) \* 101\)\}/g, () => String(Math.floor(Math.random() * 101))));
  });
}

cmd({
  pattern: "ship",
  desc: "Randomly ship two mentioned users",
  category: "fun",
  react: "💞",
  filename: __filename
}, async (conn, mek, m, { reply, mentionedJid }) => {
  const users = mentionedJid || [];
  if (users.length < 2) return reply("💞 Mention two users!\nExample: .ship @user1 @user2");
  const score = Math.floor(Math.random() * 101);
  reply(`💞 *JoKER_RKS mini SHIP METER*\n\n@${users[0].split("@")[0]} ❤️ @${users[1].split("@")[0]}\n\nCompatibility: *${score}%* 😂`, { mentions: users.slice(0, 2) });
});

cmd({
  pattern: "roast",
  desc: "Harmless random roast",
  category: "fun",
  react: "🔥",
  filename: __filename
}, async (conn, mek, m, { reply, mentionedJid }) => {
  const target = mentionedJid?.[0];
  const name = target ? `@${target.split("@")[0]}` : "You";
  const lines = [
    `${name}, your Wi-Fi has more stability than your decisions. 😂`,
    `${name}, even autocorrect gives up sometimes. 😭`,
    `${name}, your typing speed is faster than your logic. 😂`,
    `${name}, you're not late—the timeline just moved without you. 🤣`
  ];
  reply(`🔥 ${pick(lines)}`, target ? { mentions: [target] } : undefined);
});

cmd({
  pattern: "meme",
  desc: "Send a random harmless meme-style text",
  category: "fun",
  react: "🤣",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  reply(pick([
    "🤣 *ME:* I'll sleep early today.\n*ALSO ME:* 3 AM scrolling.",
    "😂 *BOT:* Need help?\n*USER:* No.\n*BOT:* Then why did you call me?",
    "💀 *GROUP ADMIN:* Be respectful.\n*GROUP:* 700 unread messages later..."
  ]));
});
