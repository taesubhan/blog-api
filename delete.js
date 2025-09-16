// ----- LOGIN -----
app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = users.find(u => u.username === username); // Get user from DB
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // Create JWT
      const token = jwt.sign(
        { username: user.username },   // payload
        JWT_SECRET,                    // secret
        { expiresIn: '1h' }            // token expiry
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // ----- PROTECTED ROUTE -----
  const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
  
  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}. You accessed a protected route!` });
  });