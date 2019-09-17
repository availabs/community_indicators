 // import { host } from '../constants'
import { Model } from 'falcor'
import HttpDataSource from 'falcor-http-datasource'


//export let host =
// let host = 'https://graph.availabs.org/'
let host = 'https://graph.availabs.org/';
try {
// To run the API from localhost just add a new file named "useLocalHost.js",
// with the following single line: export const useLocalHost = 'http://localhost:4444/';
// You can supply a different port number if required.

// You can easily switch back to using the production API without deleting the "useLocalHost.js" file
// by changing the file to: export const useLocalHost = false;

// the file "useLocalHost.js" has been added to .gitignore.
  const { useLocalHost } = require("./useLocalHost");
  if (useLocalHost) {
    host = useLocalHost;
  }
}
catch {
  host = 'https://graph.availabs.org/'
}

console.log("API HOST:", host)

if (process.env.NODE_ENV === 'production') {
  host = 'https://graph.availabs.org/'
}

class CustomSource extends HttpDataSource {
  onBeforeRequest (config) {
    // var token = ''
    // if (localStorage) {
    //   token = localStorage.getItem('token')
    // }
    // config.headers['Authorization'] = `${token}`
    // // console.log('header', config.headers)
    // config.url = config.url.replace(/%22/g, '%27')
    // // config.url = config.url.replace(/"/g, "'")
    // var splitUrl = config.url.split('?')
    // if (splitUrl[1] && config.method === 'GET') {
    //   // config.url = splitUrl[0] + '?' + encodeURI(splitUrl[1])
    //   delete config.headers
    // } else if (config.method === 'POST') {
    //   config.method = 'GET'
    //   delete config.headers
    //   config.url = config.url + '?' + config.data.replace(/%22/g, '%27')
    //   // console.log(config.url)
    // }
    // console.log('FR:', config)
  }
}

function cacheFromStorage () {
  let falcorCache = {}
  // if (localStorage && localStorage.getItem('falcorCache')) {
  //   let token = localStorage.getItem('token')
  //   let user = localStorage.getItem('currentUser')
  //   if (token && user) {
  //     falcorCache = JSON.parse(localStorage.getItem('falcorCache'))
  //   }
  // }
  return falcorCache;
}

export const falcorGraph = (() =>
  new Model({
    source: new CustomSource(host + 'graph', {
      crossDomain: true,
      withCredentials: false,
      timeout: 120000
    }),
    errorSelector: (path, error) => {
      console.log('errorSelector', path, error);
      return error;
    },
    cache: cacheFromStorage()
  }).batch()
)()

window.addEventListener('beforeunload', function (e) {
  // var falcorCache = falcorGraph.getCache();
  // console.log('windowUnload', falcorCache);
  // localStorage.setItem('falcorCache', JSON.stringify(falcorCache));
})
