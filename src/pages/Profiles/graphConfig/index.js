import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'
import Economy from "./economy"
import Health from "./health"
import Transportation from "./transportation"
import covid19 from "./covid19"

const CONFIG = {
  // 'COVID-19': covid19,
  Overview,
  Economy,
  'Social Welfare': SocialWelfare,
  Health,
  Education,
  Housing,
  Transportation
}
export default Object.keys(CONFIG)
  .reduce((a, c) => {
    a[c] = CONFIG[c].map((config, i) => {
      config.graphId = `${ c }-${ i }`;
      return config;
    })
    return a;
  }, {})
