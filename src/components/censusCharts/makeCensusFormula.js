export const makeCensusFormula = ({ censusKeys = [], subtractKeys = [], divisorKeys = [], multi = false }) => {
  return `
    ${ subtractKeys.length && divisorKeys.length ? "(" : "" }
    (${ censusKeys.join(multi ? ", " : " + ") })
    ${ subtractKeys.length ? ` - (${ subtractKeys.join(" + ") })` : "" }
    ${ subtractKeys.length && divisorKeys.length ? ")" : "" }
    ${ divisorKeys.length ? ` / (${ divisorKeys.join(" + ") })` : "" }
  `
}
