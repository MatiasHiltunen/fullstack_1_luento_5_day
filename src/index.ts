import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db/sqlite_db'
import { users } from './db/schema'

const app = new Hono()

app.get('/', (c) => {

  return c.html(`
    <html>
      <head>
      </head>
      <body>
        <div>
          <h1> ${(new Date()).toLocaleString('fi')} </h1>
        </div>
      </body>
    </html>
    
    `)

})

app.get('/account', (c)=>{

  return c.json({
    username: "testaaja"
  })
})

const userRoute = new Hono()

userRoute.post('/', async (c)=>{

  const data = await c.req.json()

  if(data.username == null){
    return c.json({err: "username is required"}, 400)
  }

  const user = await db.insert(users).values({
    username: data.username
  }).returning()

  console.log(user)
  return c.json(user)
})

userRoute.get('/', async (c)=>{

  const data = await db.select().from(users)

  return c.json(data)
})

app.route('/user', userRoute)

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)


serve({
  fetch: app.fetch,
  port
})
