
// -- Landing Routes
//import Landing from './pages/Landing'

import Maps from "./pages/Maps"
import Profiles from "./pages/Profiles/"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Landing from './pages/Landing'
import NoMatch from './pages/404.js'

const routes = [
  Landing,
  ...Profiles,
  Maps,
  Login,
  Signup,
  NoMatch

]

export default routes
