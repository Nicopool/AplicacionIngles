export function renderAuth(type) {
  // type: 'login' o 'register'
  const isLogin = type === 'login';
  
  return `
    <div class="screen auth-screen">
      <div class="auth-top">
        <h1>${isLogin ? 'Welcome back!' : 'Create your account'}</h1>
        <p>${isLogin ? 'Improve your level every day' : 'Join thousands of students worldwide'}</p>
      </div>

      <form class="auth-form" id="auth-form">
        <div class="input-group">
          <label>Email Address</label>
          <input type="email" id="email" class="input-field" placeholder="your@email.com" required>
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input type="password" id="password" class="input-field" placeholder="••••••••" required>
        </div>

        ${!isLogin ? `
        <div class="input-group">
          <label>Username</label>
          <input type="text" id="username" class="input-field" placeholder="Your name" required>
        </div>
        ` : ''}

        <button type="submit" class="btn btn-primary mt-8" id="submit-btn" style="width:100%">
          ${isLogin ? 'Log In' : 'Continue →'}
        </button>

        <div class="auth-divider mt-16 mb-0">or</div>

        <div class="auth-switch">
          ${isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onclick="window._nav('${isLogin ? 'register' : 'login'}')">
            ${isLogin ? 'Sign up here' : 'Log In'}
          </button>
        </div>
      </form>
    </div>
  `;
}
