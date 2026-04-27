import { AppHeader } from '../components/common.js';

export function renderProfile(profile) {
  const { username, level } = profile;
  const avatars = ['👨‍🎓', '👩‍🎓', '🚀', '🦊', '🦉', '🦁', '🌟', '👻'];
  
  return `
    <div class="screen bg-white" style="min-height: 100vh; background: #F8FAFC; padding-bottom: 80px;">
      <div class="hangman-header" style="background:var(--bg-card); padding:16px; border-bottom:1px solid var(--border);">
        <button class="hangman-back-btn" onclick="window._nav('dashboard')">←</button>
        <div style="flex:1; text-align:center;">
          <div class="hangman-title" style="font-size:18px;">My Profile</div>
        </div>
        <div style="width:40px;"></div>
      </div>
      
      <div style="padding: 32px 24px; text-align: center;">
        <div id="current-avatar" style="width: 100px; height: 100px; margin: 0 auto 16px; background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 48px; border: 4px solid white; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);">
          ${profile.avatar_url || '👨‍🎓'}
        </div>
        <h2 style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">${username}</h2>
        <div style="display: inline-block; background: #FEF3C7; color: #D97706; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 100px;">
          Level ${level}
        </div>
      </div>

      <div style="padding: 0 24px;">
        <div style="background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <div class="input-group" style="margin-bottom: 24px;">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 0.5px;">Username</label>
            <input type="text" id="edit-username" class="input-field" value="${username}" placeholder="Your name" style="background: #F1F5F9; border: none; padding: 14px 16px; font-size: 16px; font-weight: 600; border-radius: 12px; width: 100%;">
          </div>

          <div class="input-group">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-secondary); margin-bottom: 12px; display: block; text-transform: uppercase; letter-spacing: 0.5px;">Choose your Avatar</label>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-start;">
              ${avatars.map(a => `
                <div class="avatar-option ${profile.avatar_url === a ? 'selected' : ''}" onclick="window._selectAvatar('${a}')" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 24px; background: ${profile.avatar_url === a ? '#DBEAFE' : '#F8FAFC'}; border: 2px solid ${profile.avatar_url === a ? '#2563EB' : 'transparent'}; border-radius: 14px; cursor: pointer; transition: all 0.2s;">
                  ${a}
                </div>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-primary" id="btn-save-profile" style="width: 100%; margin-top: 32px; padding: 16px; font-size: 16px; border-radius: 12px;">
            Save Changes
          </button>
        </div>

        <button onclick="window._logout()" style="width: 100%; margin-top: 24px; padding: 16px; font-size: 15px; font-weight: 700; color: #EF4444; background: transparent; border: 2px solid #FEE2E2; border-radius: 12px; cursor: pointer;">
          Log Out
        </button>
      </div>
    </div>
  `;
}

