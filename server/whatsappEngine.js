const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const sessions = new Map();
const qrCodes = new Map();

async function connectWhatsAppForTeacher(teacherId, res = null) {
    const sessionDir = path.join(__dirname, 'sessions', `teacher_${teacherId}`);
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            const qrImage = await QRCode.toDataURL(qr);
            qrCodes.set(teacherId, qrImage);
            if (res && !res.headersSent) {
                res.json({ status: 'qr_ready', qr: qrImage });
            }
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            qrCodes.delete(teacherId);
            if (shouldReconnect) {
                connectWhatsAppForTeacher(teacherId);
            } else {
                sessions.delete(teacherId);
            }
        } else if (connection === 'open') {
            qrCodes.delete(teacherId);
            sessions.set(teacherId, sock);
            console.log(`WhatsApp connected for teacher: ${teacherId}`);
        }
    });
}

function getSession(teacherId) {
    return sessions.get(teacherId);
}

function getQRCode(teacherId) {
    return qrCodes.get(teacherId);
}

module.exports = { connectWhatsAppForTeacher, getSession, getQRCode };
