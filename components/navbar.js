export function renderNavBar(activeId) {
  const items = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'modules', icon: '📚', label: 'Modules' },
    { id: 'flashcards', icon: '💾', label: 'Vocabulary' },
    { id: 'games', icon: '🎮', label: 'Games' }
  ];

  return `
    <nav class="bottom-nav">
      ${items.map(t => `
        <div class="nav-btn ${activeId === t.id ? 'active' : ''}" onclick="window._nav('${t.id}')">
          <div class="nav-icon">${t.icon}</div>
          <span>${t.label}</span>
        </div>
      `).join('')}
    </nav>
  `;
}
