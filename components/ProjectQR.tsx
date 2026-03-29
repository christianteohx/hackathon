'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function ProjectQR({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [show, setShow] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/project/${projectId}` : '';

  return (
    <div style={{marginTop: '0.5rem'}}>
      <button
        onClick={() => setShow(!show)}
        style={{fontSize:'0.8rem',color:'#666',background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}
      >
        {show ? 'Hide' : 'Show'} QR Code
      </button>
      {show && url && (
        <div style={{marginTop: '8px', padding: '12px', background: 'white', display: 'inline-block', borderRadius: '8px'}}>
          <QRCodeSVG value={url} size={120} />
          <p style={{fontSize:'0.7rem',color:'#666',marginTop:'4px',textAlign:'center'}}>{projectName}</p>
        </div>
      )}
    </div>
  );
}
