const Koa = require('koa')
const fs = require('fs')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const settings = require('standard-settings')
const router = new Router()
const app = new Koa()

let optionsStatic = {rootDir: 'public'}

const writeJson = (data) => {
  if (data) {
    console.log(data)
    data = JSON.stringify(data, null, 2)
    fs.writeFileSync(settings.getSettings().settingsPath, data)
    return 0
  } else  {
    console.error('no data received', data)
    return -1
  }
}

router.get('/config', (ctx, next) => {
  const content = fs.readFileSync(settings.getSettings().settingsPath, 'utf8')
  try {
    const JSONData = JSON.parse(content)
    ctx.body = JSONData
  } catch (err) {
    console.error('an error occured')
  }
})

router.get('/wconfig', (ctx, next) => {
  writeJson()
  ctx.body = {
    msg: 'config written'
  }
})

router.post('/saveconfig', (ctx, next) => {
  let res = writeJson(ctx.request.body)
  if (res === 0) {
    ctx.body = {
      error: false,
      msg: 'La configuration a été sauvegardée.'
    }
  } else {
    ctx.body = {
      error: true,
      msg: 'Une erreur s\'est produite.'
    }
  }
  
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(require('koa-static-server')(optionsStatic))
  .use(router.allowedMethods());

app.listen(settings.getSettings().server.port)

console.log(`http://localhost:${settings.getSettings().server.port}`)