import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@jbwtickets/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)

app.use(currentUserRouter)
app.use(signupRouter)
app.use(signoutRouter)
app.use(signinRouter)
app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
