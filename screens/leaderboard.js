import { AppHeader } from '../components/common.js';

export function renderLeaderboard() {
  return `
    <div class="screen leaderboard-screen">
      ${AppHeader('Leaderboard')}
      
      <div class="leaderboard-podium">
        <div id="podium-container" class="flex items-end justify-center gap-12 mt-24">
          <!-- Podium will be rendered here -->
          <div class="loader"><div class="spinner"></div></div>
        </div>
      </div>

      <div class="leaderboard-list mt-24" id="leaderboard-list">
        <!-- List will be rendered here -->
      </div>
    </div>
  `;
}

export function renderLeaderboardItems(users) {
  let podiumHtml = '';
  // Top 3 for podium
  const top3 = users.slice(0, 3);
  const remaining = users.slice(3);

  // Reorder for visual podium: 2, 1, 3
  if (top3.length > 0) {
    const pOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
    podiumHtml = pOrder.map((u, i) => {
      const isFirst = u.id === top3[0].id;
      return `
        <div class="podium-item ${isFirst ? 'first' : ''}">
          <div class="podium-avatar">${u.avatar_url || '👨‍🎓'}</div>
          <div class="podium-name">${u.username}</div>
          <div class="podium-step">
            <div class="podium-rank">${users.indexOf(u) + 1}</div>
            <div class="podium-xp">${u.user_stats[0]?.xp || 0} XP</div>
          </div>
        </div>
      `;
    }).join('');
  }

  let listHtml = remaining.map((u, i) => `
    <div class="leaderboard-row">
      <div class="leaderboard-rank">${i + 4}</div>
      <div class="leaderboard-avatar-mini">${u.avatar_url || '👨‍🎓'}</div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">${u.username}</div>
        <div class="leaderboard-streak">🔥 ${u.user_stats[0]?.current_streak || 0} days</div>
      </div>
      <div class="leaderboard-xp-value">${u.user_stats[0]?.xp || 0} XP</div>
    </div>
  `).join('');

  return { podiumHtml, listHtml };
}
