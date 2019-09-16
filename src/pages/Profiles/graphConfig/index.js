import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'

let ID = 0;
const getId = () => `id-${ ++ID }`;

const CONFIG = {
<<<<<<< HEAD
   Overview,
    'Economy': [],
    'Transportation': [],
    Housing,
    Education,
    'Health': [],
    'Social Welfare': SocialWelfare
=======
  Overview,
  'Social Welfare': SocialWelfare,
  Education,
  Housing,
  Poverty: [],
  Health: [],
  Transportation: []
>>>>>>> ae1c620427d660ef35ce1c10f652575418bc0f0c
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
