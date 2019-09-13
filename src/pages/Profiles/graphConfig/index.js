import SocialWelfare from './socialWelfare'
import Education from './education'
import Overview from './overview'
import Housing from './housing'

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
    Overview,
    //---------------------------------------Social Welfare------------------------------------
    'Social Welfare': SocialWelfare,
    // //---------------------------------------Education-----------------------------------------
    Education,
    // //---------------------------------------Housing-----------------------------------------
    Housing,
    // 'Poverty': [],
    // 'Education': [],
    // 'Health': [],
    // 'Transportation': []

}
console.log("GRAPH CONFIG:", graph_config)
export default graph_config
