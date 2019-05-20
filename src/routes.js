
// -- Landing Routes
//import Landing from './pages/Landing'

import MapPage from "./pages/MapPage"
import Report from "./pages/Report"
import GraphLayout from "./pages/Analysis/GraphLayout"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import GeoPage from "./pages/Report/GeoPage.js"
import GeoReport from "./pages/Report/GeoReport"

// -- Util Routes
// import Login from './pages/Login'
// import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  MapPage,
  Report,
  GeoPage,
  GeoReport,
  GraphLayout,
  Login,
  Signup,
  NoMatch

]

export default routes
