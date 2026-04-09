import { AppHeader } from '../components/common.js';

export function renderProfile(profile) {
  const { username, level } = profile;
  const avatars = ['👨‍🎓', '👩‍🎓', '🚀', '🦊', '🦉', '🦁', '🌟'];
  
  return `
    <div class="screen profile-screen">
      ${AppHeader('My Profile')}
      
      <div class="profile-hero">
        <div class="profile-main-avatar" id="current-avatar">
          ${profile.avatar_url || '👨‍🎓'}
        </div>
        <h2>${username}</h2>
        <div class="profile-level-badge">Level ${level} Student</div>
      </div>

      <div class="profile-settings-card">
        <div class="input-group">
          <label>Display Name</label>
          <input type="text" id="edit-username" class="input-field" value="${username}" placeholder="Your name">
        </div>

        <div class="input-group mt-16">
          <label>Choose your Avatar</label>
          <div class="avatar-selector">
            ${avatars.map(a => `
              <div class="avatar-option ${profile.avatar_url === a ? 'selected' : ''}" onclick="window._selectAvatar('${a}')">
                ${a}
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn btn-primary mt-24" id="btn-save-profile" style="width:100%">
          Save Changes
        </button>

        <button class="btn btn-secondary mt-12" onclick="window._logout()" style="width:100%; color: var(--danger)">
          Log Out
        </button>
      </div>
    </div>
  `;
}
