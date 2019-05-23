
// -- Landing Routes
//import Landing from './pages/Landing'

import MapPage from "./pages/MapPage"
import Report from "./pages/Report"
import GraphLayoutOverview from "./pages/Overview"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Overview from "./pages/Report/Overview"
import GraphLayoutSocial from './pages/SocialWelfare'
import Social from './pages/Report/Social'

// -- Util Routes
// import Login from './pages/Login'
// import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  MapPage,
  Report,
  Overview,
  GraphLayoutOverview,
  Social,
  GraphLayoutSocial,
  Login,
  Signup,
  NoMatch

]

export default routes
