import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'
import Economy from "./economy"
import Health from "./health"
import Transportation from "./transportation"
import covid19 from "./covid19"

import Links from "./links"

import { getConfigId } from "./utils"

const CONFIG = {
  // 'COVID-19': covid19,
  Overview,
  Economy,
  'Social Welfare': SocialWelfare,
  Health,
  Education,
  Housing,
  Transportation,
  Links
}
export default Object.keys(CONFIG)
  .reduce((a, c, i) => {
    a[c] = CONFIG[c].map((config, ii) => {
      config.graphId = `${ c }-${ ii }`;
      config.id = config.id || `local-profile-${ config.type }-${ config.title || config.broadCensusKey || config.header }`;
      return config;
    })
    return a;
  }, {})
