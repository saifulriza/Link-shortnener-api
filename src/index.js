import Koa from 'koa';

const app = new Koa();

// views
import render from 'koa-ejs';
render(
  app,
  {
    cache: process.env.NODE_ENV === 'production',
    root: __dirname + '/views',
    viewExt: 'ejs',
  }
);

// body parser
import bodyParser from 'koa-bodyparser';
app.use(bodyParser());

// static files
import serve from 'koa-static';
app.use(serve('./public'));


// normally, I'd split routes into multiple files but keeping in this one for demo
import Router from 'koa-router';
const router = new Router();

router
  .get('/', (ctx) => {
    return ctx.render('home');
  })
  .post('/', (ctx) => {
    console.log('ctx.request.body', ctx.request.body);
    ctx.body = ctx.request.body;
  });

app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV === 'production') {
	app.listen(8080, '127.0.0.1');
	console.log('Listening on port 127.0.0.1:8080');
} else {
	app.listen(8080);
	console.log('Listening on port 8080');
}

// cleanup on exit/restart
process.on('SIGINT', () => {
  // TODO require('./db/pg').end();
  process.exit();
});
