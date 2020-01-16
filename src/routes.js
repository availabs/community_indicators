
// -- Landing Routes
//import Landing from './pages/Landing'

import Maps from "./pages/Maps"
import Profiles from "./pages/Profiles/"

import Test from "./pages/Test"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Landing from './pages/Landing'
import About from './pages/About'
import NoMatch from './pages/404.js'

const routes = [
  Landing,
  ...Profiles,
  ...Test,
  Maps,
  About,
  Login,
  Signup,
  NoMatch

]

export default routes
