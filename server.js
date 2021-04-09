const express = require('express');
const app = express();
const port = 9999;

app.use(express.json());
app.use(express.urlencoded());

// Import routes

const medicsRoutes = require('./routes/medics');

app.use('/api', medicsRoutes);

app.listen(port, () => {
  console.log(`server up on ${port}!`);
});
