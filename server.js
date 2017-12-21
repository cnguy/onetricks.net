/* eslint-disable no-restricted-syntax */
const express = require('express');

const app = express();
const compression = require('compression');
app.use(compression());

require('dotenv').config();

// Express only serves static assets in production.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.set('port', (process.env.PORT || 3001));

app.use((req, res, next) =>
  res.render('404', { status: 404, url: req.url }),
);

app.use((err, req, res, next) => {
  res.render('500', {
    status: err.status || 500,
    error: err,
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
