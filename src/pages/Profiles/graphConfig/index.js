import socialWelfare from './socialWelfare'
import education from './education'

let overview = require('./overview')
let housing = require('./housing')

console.log("socialWelfare",socialWelfare)

const graph_config = {

    /*
    NOTES :

    1)While copy pasting from the console.log, please make sure to copy the whole array (of objects)
    and paste it here as the value pair of the key overview or socialWelfare(respectively)

    2) For Graph Type : CensusStatBox
        colorRange array is as following:
        1st color : Main title color ( Demographics, housing Poverty, Education etc..)
        2nd color : SubTitle color ( Overall population, median age etc ...)
        3rd color : Year color( 2017 etc)
        4th color : Value color

     */

    //-------------------------------------------Overview--------------------------------------
    Overview: overview,
    //---------------------------------------Social Welfare------------------------------------
    'Social Welfare': socialWelfare,
    // //---------------------------------------Education-----------------------------------------
    'Education': education,
    // //---------------------------------------Housing-----------------------------------------
    // 'Housing': housing,
    // 'Poverty': [],
    // 'Education': [],
    // 'Health': [],
    // 'Transportation': []

}
console.log("GRAPH CONFIG:", graph_config)
export default graph_config
