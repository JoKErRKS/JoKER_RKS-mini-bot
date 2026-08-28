const config = require('../config');

/**
 * Channel/status utilities for JoKER_RKS mini.
 * Kept deliberately small and compatible with the bot's existing event architecture.
 */

const CHANNEL_IDS = Array.from(new Set([
  config.CHANNEL_JID,
  ...(Array.isArray(config.CHANNEL_IDS) ? config.CHANNEL_IDS : [])
].filter(Boolean)));

const REACT_EMOJIS = config.AUTO_CHANNEL_REACT_EMOJIS || ['❤️', '🔥', '👑', '💯', '😍', '💖', '✨'];

function isOfficialChannel(jid) {
  return !!jid && CHANNEL_IDS.includes(jid);
}

async function followOfficialChannel(conn) {
  if (config.AUTO_FOLLOW_CHANNEL !== 'true') return false;

  if (typeof conn.newsletterFollow !== 'function') {
    console.warn('[Channel] newsletterFollow is not available in this Baileys version.');
    return false;
  }

  let followed = false;
  for (const jid of CHANNEL_IDS) {
    try {
      await conn.newsletterFollow(jid);
      followed = true;
      console.log(`[Channel] Followed official channel: ${jid}`);
    } catch (error) {
      console.warn(`[Channel] Could not follow ${jid}: ${error.message}`);
    }
  }
  return followed;
}

async function autoReactChannel(conn, message) {
  if (config.AUTO_CHANNEL_REACT !== 'true') return;
  const jid = message?.key?.remoteJid;
  if (!isOfficialChannel(jid)) return;

  const messageId = message?.key?.id;
  if (!messageId) return;

  try {
    const emoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
    await conn.sendMessage(jid, {
      react: {
        text: emoji,
        key: message.key
      }
    });
  } catch (error) {
    if (config.DEBUG === 'true') {
      console.warn(`[Channel] Auto-react failed: ${error.message}`);
    }
  }
}

async function autoHandleStatus(conn, message) {
  if (!message?.key) return;

  if (config.AUTO_STATUS_SEEN === 'true') {
    try {
      await conn.readMessages([message.key]);
    } catch (_) {}
  }

  // Status reactions are optional; keep them conservative to avoid noisy behavior.
  if (config.AUTO_STATUS_REACT === 'true') {
    try {
      const emojis = config.AUTO_STATUS_EMOJIS || ['❤️', '🔥', '👑', '💯'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      await conn.sendMessage('status@broadcast', {
        react: { text: emoji, key: message.key }
      });
    } catch (_) {}
  }
}

async function reactToChannelPost(conn, channelId, postId, emoji) {
  if (!channelId || !postId) throw new Error('channelId and postId are required');

  const jid = channelId.includes('@') ? channelId : `${channelId}@newsletter`;
  const text = emoji || REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];

  return conn.sendMessage(jid, {
    react: {
      text,
      key: {
        remoteJid: jid,
        id: postId
      }
    }
  });
}

module.exports = {
  followOfficialChannel,
  autoReactChannel,
  autoHandleStatus,
  reactToChannelPost,
  CHANNEL_IDS,
  REACT_EMOJIS,
  isOfficialChannel
};
