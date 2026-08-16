from pathlib import Path
path = Path(__file__).with_name('controllers/usersController.js')
text = path.read_text(encoding='utf-8')
start = text.find('const forgotPassword = async (req, res) =>')
if start == -1:
    raise SystemExit('no forgotPassword start')
# Replace from start to end of file with corrected block
new_block = '''const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await Users.findUserByEmail(normalizedEmail);
    if (user) {
      console.log(`Password recovery requested for ${normalizedEmail}`);
      // In production, send a secure reset link to the user's email here.
    }

    res.json({
      message: 'If an account exists for that email, recovery instructions have been sent.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};
'''
text = text[:start] + new_block
path.write_text(text, encoding='utf-8')
print('updated')
