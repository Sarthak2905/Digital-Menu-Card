import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

const DEFAULT_BASE_URL = 'http://localhost:5173';
const DEFAULT_TABLE_COUNT = 10;

export default function TableQR() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [tableCount, setTableCount] = useState(DEFAULT_TABLE_COUNT);
  const printRef = useRef<HTMLDivElement>(null);

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    if (!win) { toast.error('Could not open print window'); return; }
    win.document.write(`
      <html><head><title>Table QR Codes — Digital Café</title>
      <style>
        body { font-family: sans-serif; margin: 0; }
        .print-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; padding: 24px; }
        .print-card { border: 2px solid #1a3c34; border-radius: 12px; padding: 20px; text-align: center; page-break-inside: avoid; }
        .print-card h3 { color: #1a3c34; margin: 12px 0 4px; font-size: 1.1rem; }
        .print-card p { color: #666; font-size: 0.8rem; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head>
      <body>${printContents}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Table QR Codes</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Print and place these QR codes on each table. Customers scan to open the menu and order directly.
        </p>
      </div>

      <div className="qr-config card" style={{ marginBottom: '1.5rem', padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: '1', minWidth: '240px', marginBottom: 0 }}>
          <label className="form-label">Customer App Base URL</label>
          <input
            className="form-input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value.replace(/\/$/, ''))}
            placeholder="https://your-cafe-domain.com"
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            QR will link to: {baseUrl}/menu?table=N
          </small>
        </div>
        <div className="form-group" style={{ width: '140px', marginBottom: 0 }}>
          <label className="form-label">Number of Tables</label>
          <input
            className="form-input"
            type="number"
            min={1}
            max={50}
            value={tableCount}
            onChange={(e) => setTableCount(Math.min(50, Math.max(1, Number(e.target.value))))}
          />
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          🖨️ Print All QR Codes
        </button>
      </div>

      <div ref={printRef} className="print-grid qr-grid">
        {tables.map((n) => {
          const url = `${baseUrl}/menu?table=${n}`;
          return (
            <div key={n} className="print-card qr-card">
              <QRCodeSVG
                value={url}
                size={160}
                bgColor="#ffffff"
                fgColor="#1a3c34"
                level="M"
              />
              <h3>Table {n}</h3>
              <p>Scan to view menu &amp; order</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
