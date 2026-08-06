import React, { useState } from 'react';

export default function App() {
  const [teacherId, setTeacherId] = useState('teacher_1');
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // طلب كود الـ QR للواتساب
  const fetchQR = async () => {
    setLoading(true);
    setStatus('جاري الاتصال بالسيرفر...');
    try {
      const res = await fetch(`/api/whatsapp/qr/${teacherId}`);
      const data = await res.json();

      if (data.status === 'qr_ready') {
        setQrCode(data.qr);
        setStatus('امسح كود الـ QR من تطبيق الواتساب في موبايلك');
      } else if (data.status === 'connected') {
        setStatus('الواتساب مرتبط بالفعل وبكفاءة! ✅');
        setQrCode(null);
      }
    } catch (err) {
      setStatus('حدث خطأ في الاتصال بالسيرفر');
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', direction: 'rtl', textAlign: 'center' }}>
      <h1>نظام العلومنجي / Smart Teacher 🚀</h1>
      <p>إدارة حضور الطلاب وإرسال رسائل الغياب تلقائيًا عبر الواتساب</p>

      <div style={{ margin: '30px auto', maxWidth: '400px', border: '1px solid #ddd', padding: '20px', borderRadius: '12px' }}>
        <h3>ربط الواتساب</h3>
        <button 
          onClick={fetchQR} 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'جاري التحميل...' : 'إظهار كود QR الواتساب'}
        </button>

        {status && <p style={{ marginTop: '15px', color: '#555' }}>{status}</p>}

        {qrCode && (
          <div style={{ marginTop: '20px' }}>
            <img src={qrCode} alt="WhatsApp QR Code" style={{ width: '250px', height: '250px' }} />
          </div>
        )}
      </div>
    </div>
  );
}
