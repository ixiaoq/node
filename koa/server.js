const Koa = require('koa');
const app = new Koa();
const PORT = 8080;

// 中间件
app.use(async(ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-response-Time', `${ms}ms`);
});

app.use(async ctx => {
    ctx.body = 'Hello World!'
});

app.on('error', err => {
    console.error('server error: %s', err);
});

app.listen(PORT, () => {
    console.log('server runing port %s', PORT);
});