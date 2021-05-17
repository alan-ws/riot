// When somebody buys a home they have to pay tax (Stamp Duty) to the government. Stamp Duty is calculated by taking the property value and applying a set of tax bands to it. The set of bands used is determined by the type of buyer you are.

// First Time Buyers
// Buyers who are buying their first home to live in

// Returning Buyers
// Buyers who are selling their home and moving to a new one

// Second Home Buyers
// Buyers who are buyer a second property (probably as an investment)

// Write a function that calculates the amount of Stamp Duty tax that is due for a given property price
// The tax bands to use for this problem are as follows:

// First Time Buyers
// 0 to £300,000 - 0%
// £300,000 to £925,000 - 5%
// £925000 to £1,500,000 - 10%
// £1,500,000 and above - 12%

// Returning Buyers
// 0 to £125,000 - 0%
// £125,000 to £250,000 - 2%
// £250,000 to £925,000 - 5%
// £925,000 to £1,500,000 - 10%
// £1,500,000 and above - 12%

// Second Home Buyers
// 0 to £125,000 - 3%
// £125,000 to £250,000 - 5%
// £250,000 to £925,000 - 8%
// £925,000 to £1,500,000 - 13%
// £1,500,000 and above - 15%

// 100000 { ftb: 0, rtb: 0, shb: 3000 }
// 200000 { ftb: 0, rtb: 1500, shb: 7500 }
// 300000 { ftb: 0, rtb: 5000, shb: 14000 }
// 400000 { ftb: 5000, rtb: 10000, shb: 22000 }
// 500000 { ftb: 10000, rtb: 15000, shb: 30000 }
// 1000000 { ftb: 38750, rtb: 43750, shb: 73750 }
// 2000000 { ftb: 148750, rtb: 153750, shb: 213750 }


const BANDS = {
  'ftb': [
    {
        value: 0,
        tax: 0
    },
    {
        value: 300000,
        tax: 5
    },
    {
        value: 925000,
        tax: 10
    },
    {
        value: 1500000,
        tax: 12
    }
  ]
}

const BASE = 300

function stampDuty(propVal, buyer, taxSum)
{
  const bands = BANDS[buyer]

  if (propVal < BASE && propVal >= 0)
  {
    return taxSum
  }
  else
  {
     taxSum += ((propVal - BASE) * 5) /100
     return stampDuty(propVal - BASE, buyer, taxSum)
  }
}

console.log(stampDuty(1000, "ftb", 0))
