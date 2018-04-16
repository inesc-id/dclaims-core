exports = module.exports

var HypercertsInstance = null

const EthereumConnector = require('./ethereum-connector.js')
// const CONTRACT_ADDRESS = '0x01ffefba4281b08a4f66b77359c244ba665bbbf2'
let CONTRACT_ADDRESS = '0x53abb1d321dd254eff936f0caee94effd4e10621'

var GAS_PRICE = 212000000
var GAS_Counter = 0

let gasValues = [
  2120000,
  21200000,
  212000000,
  2120000000,
  21200000000
]

function updateGasPrice () {
  GAS_PRICE = gasValues[GAS_Counter % gasValues.length]
  GAS_Counter++

  console.log('updated gas price: ' + GAS_PRICE)
}

exports.onlyForTesting_setGasPrice = function (gasPrices) {
  gasValues = gasPrices
  console.log('Set Gas values')
}

exports.init = function (type) {
  return new Promise(function (resolve, reject) {
    EthereumConnector.init(type).then(value => {
      let initType = 2
      if (type.hasOwnProperty('initType')) {
        console.log('Provided custom initType')
        initType = type.initType
      } else {
        console.log('Using default initType')
      }
      if (initType === 1) {
        EthereumConnector.deployTestContract().then(value => {
          HypercertsInstance = value
          resolve(value)
        })
      }

      if (initType === 2) {
        if (type.hasOwnProperty('contractAddress')) {
          CONTRACT_ADDRESS = type.contractAddress
          console.log('Provided custom contractAddress')
        }
        EthereumConnector.connectToNode(CONTRACT_ADDRESS).then(value => {
          HypercertsInstance = value
          resolve(value)
        })
      }
    })
  })
}

exports.issueClaim = function (key, ipfsLink) {
  return new Promise(function (resolve, reject) {
    // updateGasPrice()
    HypercertsInstance.issueClaim(key, ipfsLink, {gas: 179412, gasPrice: GAS_PRICE}, function (error, result) {
      if (!error) {
        // resolve(true)
        resolve(result)
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}

exports.getClaimsListCount = function (key) {
  return new Promise(function (resolve, reject) {
    HypercertsInstance.getClaimsListSize.call(key, function (error, result) {
      if (!error) {
        // console.log(result)
        resolve(result)
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}

exports.getUserId = function () {
  return new Promise(function (resolve, reject) {
    resolve(web3.eth.accounts[0])
  })
}

exports.getClaim = function (key, index) {
  return new Promise(function (resolve, reject) {
    HypercertsInstance.getClaim.call(key, index, function (error, result) {
      if (!error) {
        // console.log(result)
        resolve(result)
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}

exports.storeItem = function (key, item) {
  return new Promise(function (resolve, reject) {
    HypercertsInstance.setIpfsLink(key, item, function (error, result) {
      if (!error) {
        console.log(result)
        resolve(result)
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}

exports.getItemFromStorage = function (key) {
  return new Promise(function (resolve, reject) {
    HypercertsInstance.getIpfsLink.call(key, function (error, result) {
      if (!error) {
        console.log(result)
        resolve(result)
      } else {
        console.error(error)
        reject(error)
      }
    })
  })
}

exports.getUserId = EthereumConnector.getUserId
