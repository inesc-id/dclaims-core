// let HypercertsCore = require('./hc-core.js')
var Storage = require('./storage.js')
// let HypercertsNewsClaims = require('../../hypercerts-news-claims/src/index')
let HypercertsNewsClaims = require('hypercerts-news-claims')

/*
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

HypercertsCore.init(hypercertsSetup).then(value => {
  Storage.getClaimsListFromIpfs(claimIndex).then(value => {
    var claimsJSON = {}
    claimsJSON.claimsList = value
    unpackClaims(claimsJSON).then(res => {
      console.log(res)
    })
    // console.log(JSON.stringify(claimsJSON.claimsList))
  })
})
*/

let unpackedArray = []

exports.unpackClaims = function (claimList) {
  return new Promise(function (resolve, reject) {
    // let list = claimList.claimsList
    let list = claimList
    let unpackQeue = []

    for (let i = 0; i < list.length; i++) {
      let currClaim = list[i]
      let currType = currClaim.type

      console.log(i + ' .' + currType)
      if (currType == HypercertsNewsClaims.BatchClaimType) {
      // console.log('BatchClaim')
        unpackQeue.push(unpackBatch(currClaim))
      } else if (currType == HypercertsNewsClaims.SingleClaimType) {
        unpackedArray.push(currClaim)
      } else {
        console.log('unknown claimType')
      }
    }
    Promise.all(unpackQeue).then(res => {
      // this happens when all the items have been fetched
      resolve(unpackedArray)
    })
  })
}

function unpackBatch (batchClaim) {
  return new Promise(function (resolve, reject) {
    let IPFSLinksList = batchClaim.claim.claimsList
    let fetchList = []
    for (let i = 0; i < IPFSLinksList.length; i++) {
      // this is the list of IPFS links inside the batch
      let currLink = IPFSLinksList[i]
    // creating promises to get the files from IPFS
      fetchList.push(Storage.getFileFromIPFS(currLink))
    }
    Promise.all(fetchList).then(results => {
      unpackedArray = unpackedArray.concat(results)
      resolve(unpackedArray)
    })
  })
}
