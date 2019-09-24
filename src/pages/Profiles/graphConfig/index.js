import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'
import Economy from "./economy"
import Health from "./health"
import Transportation from "./transportation"

let ID = 0;
const getId = () => `id-${ ++ID }`;

const CONFIG = {
  Overview,
  Economy,
  Transportation,
  Housing,
  Education,
  Health,
  'SocialWelfare': SocialWelfare
}

export default (
  () => Object.keys(CONFIG).reduce((a, k) => ({
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
)()
