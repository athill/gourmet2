import path from 'path';
import {config} from 'dotenv'
config({
  path: path.resolve(process.cwd(), './backend/.env'),
  quiet: true,
});

import createError  from 'http-errors';
import express  from 'express';
import cookieParser  from 'cookie-parser';
import logger  from 'morgan';
import sequelize from './sequelize.js';
import initializeDatabase from './initializeDatabase.js';
import indexRouter  from './routes/index.js';
const __dirname = path.resolve();

var app = express();

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

initializeDatabase(sequelize);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Static files will be served from the 'dist' directory, which is where Vite outputs the built frontend assets
app.use(express.static(path.join(process.cwd(), 'dist')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

export default app;
