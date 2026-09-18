import express from 'express';

const router = express.Router();

// POST /api/auth/login or /api/admin/login
router.post('/login', (req, res) => {
  const { email, username, password } = req.body;
  const inputIdentifier = (email || username || '').trim().toLowerCase();
  const inputPassword = (password || '').trim();

  const envAdminEmail = (process.env.ADMIN_EMAIL || 'test@gmail.com').trim().toLowerCase();
  const envAdminPassword = (process.env.ADMIN_PASSWORD || 'senora2026').trim();

  // Allow login with configured ADMIN_EMAIL or 'admin' or 'umair142005@gmail.com'
  const isIdentifierValid = 
    inputIdentifier === envAdminEmail || 
    inputIdentifier === 'admin' ||
    inputIdentifier === 'umair142005@gmail.com';

  const isPasswordValid = inputPassword === envAdminPassword;

  if (isIdentifierValid && isPasswordValid) {
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token: 'senora_admin_token_' + Date.now(),
      user: {
        email: envAdminEmail,
        role: 'superadmin',
        name: 'Senora Boutique Admin'
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid Admin credentials. Check your .env file settings.'
  });
});

export default router;
