/**
 * AGRI MESH - Toast Notification Manager
 * Commercial Agricultural Direct Marketplace & Logistics Engine
 */

export function initToastSystem() {
  let toastContainer = document.getElementById('agrimeesh-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'agrimeesh-toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '24px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '10000';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }

  window.addEventListener('agrimeesh-toast', (e) => {
    const { title, message, type = 'info' } = e.detail;
    
    const toast = document.createElement('div');
    toast.className = 'glass-panel';
    toast.style.pointerEvents = 'auto';
    toast.style.minWidth = '280px';
    toast.style.maxWidth = '380px';
    toast.style.padding = '0.9rem 1.25rem';
    toast.style.borderRadius = '14px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'flex-start';
    toast.style.gap = '0.75rem';
    toast.style.animation = 'float 0.3s ease forwards';
    toast.style.borderLeft = type === 'success' ? '4px solid #10b981' : type === 'error' ? '4px solid #ef4444' : '4px solid #f59e0b';
    toast.style.background = 'var(--bg-card)';
    toast.style.color = 'var(--text-main)';

    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ️';

    toast.innerHTML = `
      <div style="font-size:1.1rem; font-weight:800; color:${type === 'success' ? '#10b981' : '#f59e0b'};">${icon}</div>
      <div style="flex:1;">
        <div style="font-weight:800; font-size:0.9rem; margin-bottom:2px;">${title}</div>
        <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">${message}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  });
}
