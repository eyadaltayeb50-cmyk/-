const express = require('express');
const cors = require('cors');
const { connectWhatsAppForTeacher, getSession, getQRCode } = require('./whatsappEngine');

const app = express();
app.use(cors());
app.use(express.json());

// مسار طلب كود الـ QR
app.get('/api/whatsapp/qr/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    const session = getSession(teacherId);

    if (session) {
        return res.json({ status: 'connected', message: 'الواتساب مرتبط بالفعل' });
    }

    const existingQR = getQRCode(teacherId);
    if (existingQR) {
        return res.json({ status: 'qr_ready', qr: existingQR });
    }

    await connectWhatsAppForTeacher(teacherId, res);
});

// مسار إرسال رسائل الغياب
app.post('/api/whatsapp/send-absent', async (req, res) => {
    const { teacherId, teacherName, absentStudents } = req.body;
    const sock = getSession(teacherId);

    if (!sock) {
        return res.status(400).json({ error: 'حساب الواتساب غير مرتبط' });
    }

    try {
        for (const student of absentStudents) {
            let formattedPhone = student.parentPhone.replace(/[^0-9]/g, '');
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '20' + formattedPhone.substring(1);
            }
            const jid = `${formattedPhone}@s.whatsapp.net`;

            const message = `السلام عليكم ورحمة الله وبركاته،\n\nنحيطكم علمًا بأن الطالب/ة (*${student.name}*) قد تغيب اليوم عن حصة الأستاذ (*${teacherName}*).\n\nمع خالص التحية.`;

            await sock.sendMessage(jid, { text: message });
        }
        res.json({ success: true, message: 'تم إرسال جميع رسائل الغياب بنجاح' });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ أثناء إرسال الرسائل', details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
