const app = require('./src/app');

const APP_PORT = process.env.PORT || 4000;

app.listen(APP_PORT, () => console.log(`app is running on http://localhost:${APP_PORT}`)); // eslint-disable-line