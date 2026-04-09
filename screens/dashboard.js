export function renderDashboard(profile) {
  const { username, level, user_stats } = profile;
  const stats = user_stats[0] || { xp: 0, current_streak: 0 };
  
  // Nivel y Lecciones (Simuladas visualmente)
  let nextLevel = 'A2';
  let pct = 30;
  if(level==='A2') { nextLevel='B1'; pct=65; }
  else if(level==='B1') { nextLevel='B2'; pct=40; }
  else if(level==='B2') { nextLevel='C1'; pct=15; }
  else if(level==='C1') { nextLevel='C2'; pct=90; }

  return `
    <div class="screen dashboard">
      <!-- Header -->
      <header class="header">
        <div class="flex items-center gap-12">
          <div class="avatar" onclick="window._nav('profile')" style="cursor:pointer" title="View Profile">
            ${profile.avatar_url || username.substring(0,2).toUpperCase()}
          </div>
          <div style="font-weight:700;font-size:18px;">Linguist</div>
        </div>
        <div class="header-stats">
          <div class="stat-chip"><span style="color:var(--fire)">🔥</span> ${stats.current_streak}</div>
          <div class="stat-chip"><span style="color:var(--gold)">⚡</span> ${stats.xp} XP</div>
        </div>
      </header>

      <!-- Progress Section -->
      <div class="dash-hero">
        <div class="dash-progress-card">
          <div class="dash-progress-label">Hello, ${username}! 👋</div>
          <div class="dash-progress-title">Your progress towards ${nextLevel}</div>
          <div class="dash-progress-sub">You are only a few lessons away from reaching the next level.</div>
          
          <div class="dash-circle-container">
            <div class="circle-progress">
              <svg>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(37,99,235,0.15)" stroke-width="10"></circle>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" stroke-width="10" stroke-dasharray="314" stroke-dashoffset="${314 - (314 * pct / 100)}" style="transition: stroke-dashoffset 1s ease"></circle>
              </svg>
              <div class="circle-progress-text">
                <div class="circle-percent">${pct}%</div>
                <div class="circle-label">Completed</div>
              </div>
            </div>
          </div>
          
          <button class="btn btn-primary mt-24" onclick="window._nav('reading_list')">
            Continue Course →
          </button>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="dash-modules-grid">
        <div class="module-card" onclick="window._nav('reading_list')">
          <div class="module-icon" style="background:#DBEAFE;color:#2563EB;">📖</div>
          <div class="module-name">Immersive Reading</div>
          <div class="module-detail">Level ${level}</div>
        </div>
        
        <div class="module-card" onclick="window._nav('writing')">
          <div class="module-icon" style="background:#E0E7FF;color:#4F46E5;">✍️</div>
          <div class="module-name">Practical Writing</div>
          <div class="module-detail">12 Exercises</div>
        </div>

        <div class="module-card" onclick="window._nav('listening')">
          <div class="module-icon" style="background:#FCE7F3;color:#DB2777;">🎧</div>
          <div class="module-name">Listening Skills</div>
          <div class="module-detail">Daily Podcast</div>
        </div>

        <div class="module-card" onclick="window._nav('speaking')">
          <div class="module-icon" style="background:#FEF3C7;color:#D97706;">🎤</div>
          <div class="module-name">Oral Practice</div>
          <div class="module-detail">Recommended</div>
        </div>
      </div>

      <!-- Event -->
      <div class="dash-event-card">
        <div class="event-label">⭐ Special Event</div>
        <div class="event-title">Daily Challenge:<br>Themed Hangman</div>
        <div class="event-actions">
          <div class="event-timer">🕒 2h left</div>
          <button class="event-play-btn" onclick="window._nav('hangman')">Play Now</button>
        </div>
      </div>

      <!-- League -->
      <div class="dash-league-card" onclick="window._nav('leaderboard')" style="cursor:pointer">
        <div class="league-icon">
          <span style="color:#fff">🎖️</span>
          <div class="league-badge">1</div>
        </div>
        <div style="flex:1">
          <div class="league-title">Silver League</div>
          <div class="league-pos">#4 in global ranking</div>
          <div class="league-link">View leaderboard</div>
        </div>
      </div>

    </div>
  `;
}
