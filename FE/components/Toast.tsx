import React from 'react';
import { useGraphStore } from '../stores/graphStore';

const Toast: React.FC = () => {
  const toast = useGraphStore((state) => state.toast);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '12px 24px',
      backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <span style={{ fontSize: '18px' }}>
        {toast.type === 'success' ? '✨' : '⚠️'}
      </span>
      {toast.message}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(24px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
