const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder (React build output)
app.use(express.static(path.join(__dirname, 'public')));

// Serve PHP-style API (proxy or direct serve if needed)
app.use('/api', express.static(path.join(__dirname, 'api')));

// For any other route, serve React's index.html (handles client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`NurdiansyahLabs server running on port ${PORT}`);
});
