var Storage = require('./storage.js')
var Publisher = require('./publisher/publisherAPI.js')
var Unpacker = require('./unpacker.js')

var exports = module.exports

/**
* Initializes Hypercerts-Core. It connects to the IPFS node and to Ethereum
* @param {number} type 1 for starting a testnode with testrpc or 2 for connecting to an existing node
* @returns {Object} Instance of Ethereum smart-contract
*/

exports.init = function (type) {
  return new Promise(function (resolve, reject) {
    Storage.init(type).then(resolve)
  })
}

exports.issueWithPublisher = function (nkey, newClaim) {
  return new Promise(function (resolve, reject) {
    Publisher.issueWithPublisher(nkey, JSON.stringify(newClaim)).then(resolve)
  })
}

/**
* Issues a Claim in Hypercerts
* @param {string} claimIndex The key used to index the Claim
* @param {object} newClaim hypercerts-news-claims SingleClaim object
* @returns {Array} [claimIndex,newClaim]
*/
exports.issue = function (nkey, newClaim) {
  return new Promise(function (resolve, reject) {
    Storage.addItem(nkey, newClaim).then(resolve)
  })
}

/**
* Returns Claims from that index
* @param {string} claimIndex Value used to index the claim
* @return {Array} Array of hypercerts-news-claims SingleClaim objects
*/

exports.getClaimsByIndex = function (claimIndex) {
  return new Promise(function (resolve, reject) {
    Storage.getClaimsListFromIpfs(claimIndex).then(value => {
      Unpacker.unpackClaims(value).then(res => {
        let claimsJSON = {}
        claimsJSON.claimsList = res
        resolve(claimsJSON)
      })
      // resolve(claimsJSON)
    })
  })
}

/**
* Returns the number of Claims indexed by that claimIndex
* @param {string} claimIndex Value used to index the claim
* @return {number} The count
*/
exports.getClaimsCountsByIndex = function (claimIndex) {
  return new Promise(function (resolve, reject) {
    Storage.getClaimsCount(claimIndex).then(value => resolve(value.toString()))
  })
}

/**
* Returns the Ethereum address of the active account.
* @return {string} Ethereum address
*/
exports.getUserId = function () {
  return new Promise(function (resolve, reject) {
    Storage.getUserId().then(resolve)
  })
}

exports.getClaimsCountsJSONByUrl = exports.getClaimsCountsByIndex
exports.getClaimsJSONByUrl = exports.getClaimsByIndex
exports.handleVerification = exports.issue
exports.getFileFromIPFS = Storage.getFileFromIPFS
exports.addClaimToIPFS = Storage.addClaimToIPFS

const RPC_ADDRESS = 'http://146.193.41.153:8545'
const CONTRACT_ADDRESS = '0xF2F2f7C36fbBA17ad8a28a4680a7059B44C4B626'

let hypercertsSetup =
  {
    initType: 2,
    ethereumRPC: RPC_ADDRESS,
    contractAddress: CONTRACT_ADDRESS // rinkeby
  }

// topic: 0x92e343f083451ff6ad2f524f135d140a0d4813cec9c7ab97aa00d5e201003562
// ipfs link: QmTUbrrWNXAg9dXyCv58V1zhBbL3uASkAYZwzMNvGx4H6h
let claimIndex = '0x92e343f083451ff6ad2f524f135d140a0d4813cec9c7ab97aa00d5e201003562'

exports.init(hypercertsSetup).then(value => {
  exports.getClaimsByIndex(claimIndex).then(console.log)
})
