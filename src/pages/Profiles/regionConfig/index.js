import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'
import Economy from "./economy"
import Health from "./health"
import Transportation from "./transportation"
import Covid19 from "./covid19"

import { getConfigId } from "../graphConfig/utils"

const CONFIG = {
  // 'COVID-19': Covid19,
  Overview,
  Economy,
  'Social Welfare': SocialWelfare,
  Health,
  Education,
  Housing,
  Transportation,
}
export default Object.keys(CONFIG)
  .reduce((a, c, i) => {
    a[c] = CONFIG[c].map((config, ii) => {
      config.graphId = `${ c }-${ ii }`;
      config.id = config.id || `region-profile-${ config.type }-${ config.title || config.broadCensusKey }`;
      config.id = config.id.replace(/\s/g, "_");
      return config;
    })
    return a;
  }, {})
