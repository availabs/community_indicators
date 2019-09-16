import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'

let ID = 0;
const getId = () => `id-${ ++ID }`;

const CONFIG = {
  Overview,
  'Social Welfare': SocialWelfare,
  Education,
  Housing,
  Poverty: [],
  Education: [],
  Health: [],
  Transportation: []
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
