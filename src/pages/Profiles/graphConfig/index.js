let overview = require('./overview')
let education = require('./education')
let housing = require('./housing')
let socialWelfare = require('./socialWelfare')
module.exports = {

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
    'Housing': housing,
    'Poverty': [],
    'Education': [],
    'Health': []

}

