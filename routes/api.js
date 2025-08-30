const router = require('express').Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CO-LAB Vault API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;

