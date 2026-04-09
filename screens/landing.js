// =====================================================
// LANDING PAGE — Pantalla de bienvenida
// =====================================================

export function renderLanding(navigate) {
  return `
    <div class="screen landing">
      <!-- Hero -->
      <div class="landing-hero">
        <div class="hero-badge">🔥 15-day streak!</div>
        <div class="hero-stats-card">
          <div class="hero-stats-label">Weekly Progress</div>
          <div class="hero-stats-value">80%</div>
          <div class="progress-bar mt-8" style="background:#e2e8f0">
            <div class="progress-bar-fill" style="width:80%;background:linear-gradient(90deg,#16A34A,#2563EB)"></div>
          </div>
          <div class="hero-dots mt-8">
            <div class="hero-dot"></div>
            <div class="hero-dot"></div>
            <div class="hero-dot"></div>
            <div class="hero-dot dim"></div>
            <div class="hero-dot dim"></div>
          </div>
        </div>
      </div>

      <!-- Tagline -->
      <div class="landing-tagline">🌐 Your bilingual future starts here</div>
      <h1 class="landing-title">Master English in a <em>fun</em> and natural way.</h1>
      <p class="landing-subtitle">Learn with immersive reading, games, and real practice. Designed to get you speaking from day one without getting bored.</p>

      <!-- Actions -->
      <div class="landing-actions">
        <button class="btn btn-primary" id="btn-start" onclick="window._nav('register')">
          Get Started Now →
        </button>
        <button class="btn btn-secondary" id="btn-login" onclick="window._nav('login')">
          I already have an account
        </button>
      </div>

      <!-- Metrics -->
      <div class="landing-metrics">
        <div class="landing-metric">
          <div class="landing-metric-value">500k+</div>
          <div class="landing-metric-label">Students</div>
        </div>
        <div class="landing-metric">
          <div class="landing-metric-value">4.9/5</div>
          <div class="landing-metric-label">App Store Rating</div>
        </div>
        <div class="landing-metric">
          <div class="landing-metric-value">150+</div>
          <div class="landing-metric-label">Countries</div>
        </div>
      </div>

      <!-- Features -->
      <div class="feature-list">
        <div class="feature-card">
          <div class="feature-icon blue">📖</div>
          <div>
            <div class="feature-title">Immersive Reading</div>
            <div class="feature-desc">Stories tailored to your level that help you absorb vocabulary contextually.</div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon green">🎮</div>
          <div>
            <div class="feature-title">Gaming Challenges</div>
            <div class="feature-desc">Compete in weekly leagues, unlock achievements, and keep your streak active while having fun.</div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon orange">🎤</div>
          <div>
            <div class="feature-title">Real Practice</div>
            <div class="feature-desc">Speech recognition technology to perfect your pronunciation from the very first day.</div>
          </div>
        </div>
      </div>

      <!-- Footer padding -->
      <div style="height:32px"></div>
    </div>
  `;
}
