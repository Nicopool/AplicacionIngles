// =====================================================
// LANDING PAGE — Pantalla de bienvenida (Diseño Simple)
// =====================================================

export function renderLanding(navigate) {
  return `
    <div class="screen landing" style="display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; min-height:100vh; background: linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%); padding: 24px;">
      
      <!-- Icono central flotante -->
      <div style="font-size: 96px; line-height: 1; margin-bottom: 24px; animation: float 3s ease-in-out infinite;">
        🌎
      </div>

      <!-- Título Principal -->
      <h1 style="font-size: 36px; font-weight: 900; color: var(--text-main); line-height: 1.1; margin-bottom: 16px; letter-spacing: -1px;">
        Inglés <span style="color: var(--primary);">Sin Fricción</span>
      </h1>
      
      <!-- Subtítulo -->
      <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 40px; max-width: 320px;">
        Aprende con lectura inmersiva, juegos interactivos y reconocimiento de voz. Directo al grano y sin aburrirte.
      </p>

      <!-- Botón de acción -->
      <div style="width: 100%; max-width: 300px;">
        <button class="btn btn-primary" style="width: 100%; padding: 18px; font-size: 18px; font-weight: 800; border-radius: 100px; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);" onclick="window._nav('dashboard')">
          Comenzar ahora →
        </button>
      </div>

      <!-- Footer simple -->
      <div style="margin-top: 32px; font-size: 13px; color: var(--text-muted); font-weight: 600;">
        100% Gratis • Aprende Jugando
      </div>

      <!-- Keyframe local para animación -->
      <style>
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      </style>
    </div>
  `;
}
