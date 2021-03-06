import 'manifest.json'

import 'font-awesome/scss/font-awesome.scss'
import 'animate.css'
import 'index.scss'

import choo from 'choo'
import chooLog from 'choo-log'
import chooDevTools from 'choo-devtools'

// import sw from 'utils/sw'

import appService from 'services/app'
import bootService from 'services/boot'
import timerService from 'services/timer'
import userService from 'services/user'
import settingsService from 'services/settings'
import detailsService from 'services/details'
import dateSelectorService from 'components/date-selector/service'

const app = choo()

// @TODO Re-activate
// sw.register()

// if (debug) !
if (process.env.NODE_ENV !== 'production') {
  app.use(chooLog())
  app.use(chooDevTools())
}

app.use(bootService)
app.use(userService)
app.use(settingsService)
app.use(timerService)
app.use(detailsService)
app.use(dateSelectorService)

appService.init(app)

app.mount('body')
