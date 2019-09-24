import Overview from './overview'


let ID = 0;
const getId = () => `id-${ ++ID }`;

const CONFIG = {
  Overview
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
