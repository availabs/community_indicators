import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'
import Economy from "./economy"
import Health from "./health"
import Transportation from "./transportation"
import covid19 from "./covid19"

let ID = 0;
const getId = () => `profile-${ ++ID }`;

const CONFIG = {
  // 'COVID-19': covid19,
  Overview,
  Economy,
  'Social Welfare': SocialWelfare,
  Health,
  Education,
  Housing,
  Transportation,
  
  
}

export default Object.keys(CONFIG).reduce((a, k) => ({
  ...a,
  [k]: CONFIG[k].map(c => {
    const id = getId();
    return {
      ...c,
      id,
      layout: {
        ...c.layout,
        i: id
      }
    }
  })
}), {})
