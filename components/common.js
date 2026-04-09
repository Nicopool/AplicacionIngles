export const AppHeader = (title, metaHtml = '') => `
  <header class="header">
    <div class="flex items-center gap-12">
      <button class="back-btn" onclick="window._back()">←</button>
      <div style="font-weight:700;font-size:18px;">${title}</div>
    </div>
    ${metaHtml}
  </header>
`;

export const Toast = (message, type = 'success') => {
  // Configuración de SweetAlert2 tipo Toast para notificaciones rápidas
  const ToastConfig = window.Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: 'var(--bg-card)',
    color: 'var(--text-main)',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', window.Swal.stopTimer)
      toast.addEventListener('mouseleave', window.Swal.resumeTimer)
    }
  });

  // Para errores críticos es mejor un modal completo, para el resto toast
  if (type === 'error') {
    window.Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: message,
      confirmButtonText: 'Understood',
      confirmButtonColor: 'var(--primary)',
      background: 'var(--bg-card)',
      color: 'var(--text-main)',
      borderRadius: '24px'
    });
  } else {
    // success, warning, info
    ToastConfig.fire({
      icon: type,
      title: message
    });
  }
}
