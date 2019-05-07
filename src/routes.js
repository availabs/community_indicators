
// -- Landing Routes
//import Landing from './pages/Landing'

// import PublicPlan from './pages/PublicPlan'
import MapPage from "./pages/MapPage"
import Report from "./pages/Report"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import CountyPage from "./pages/Report/CountyPage.js"


// -- Util Routes
// import Login from './pages/Login'
// import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  MapPage,
  Report,
  CountyPage,
  Login,
  Signup,
  NoMatch
]

export default routes