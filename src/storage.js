'use strict'
var exports = module.exports = {}
const Ethereum = require('./ethereum/ethereumAPI.js')
let ipfsAPI
let ipfs

exports.init = function (type) {
  return new Promise(function (resolve, reject) {
    ipfsAPI = require('ipfs-api')
    let IPFS_HOST = '127.0.0.1'
    if (type.hasOwnProperty('ipfsHost')) {
      if (type.ipfsHost == IPFS_HOST) {
        console.log('--- Its the same ---')
        ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
      } else {
        IPFS_HOST = type.ipfsHost
        console.log('Provided custom ipfsHost ' + '/ip4/' + IPFS_HOST + '/tcp/5001')
        ipfs = ipfsAPI(IPFS_HOST, '5001', {protocol: 'http'})
      }
    } else {
      console.log('Default ipfsHost')
      ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    }
    // ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
    // ipfs = ipfsAPI('/ip4/' + IPFS_HOST + '/tcp/5001')

    Ethereum.init(type).then(resolve)
  })
}

exports.addItem = function (key, item) {
  console.log('Adding item')
  console.log('Key: ' + key + ' Item: ' + item.toString())
  return new Promise(function (resolve, reject) {
    addClaimToIPFS(Buffer.from(JSON.stringify(item))).then(value => {
      issueClaim(key, value).then(value2 => {
        resolve([key, item])
      })
    })
  })
}

exports.getClaimsListFromIpfs = function (key) {
  return new Promise(function (resolve, reject) {
    getClaimsList(key).then(metaList => {
      let pr = []
      let claimsList = {}

      for (let i = 0; i < metaList.length; i++) {
        pr.push(getFileFromIPFS(metaList[i].ipfsLink))
      }
      Promise.all(pr).then(resolve)
    })
  })
}

exports.getClaimsCount = function (key) {
  return new Promise(function (resolve, reject) {
    Ethereum.getClaimsListCount(key).then(resolve)
  })
}

exports.getUserId = function () {
  return new Promise(function (resolve, reject) {
    Ethereum.getUserId().then(resolve)
  })
}

function getClaimsList (key) {
  return new Promise(function (resolve, reject) {
    let claimsList = []
    Ethereum.getClaimsListCount(key).then(value => {
      let ps = []
      for (let i = 0; i < value; i++) {
        ps.push(Ethereum.getClaim(key, i))
      }
      Promise.all(ps)
    .then((results) => {
      for (let j = 0; j < results.length; j++) {
        let claim = {}
        claim.issuer = results[j][0]
        claim.ipfsLink = results[j][1]
        claim.revoked = results[j][2]

        claimsList.push(claim)
      }
      resolve(claimsList)
    }).catch(err => console.log(err))  // First rejected promise
    })
  })
}

function issueClaim (key, item) {
  return new Promise(function (resolve, reject) {
    Ethereum.issueClaim(key, item).then(function (value) {
      if (value) {
        resolve([key, value])
      } else {
        reject(false)
      }
    })
  })
}

function getLinkFromRegistry (key) {
  return new Promise(function (resolve, reject) {
    try {
      Ethereum.getItemFromStorage(key).then(link => {
        if (link) {
          resolve(link)
        } else {
          resolve(null)
        }
      })
    } catch (err) {
      console.log('Error getting key')
      resolve(null)
    }
  })
}

function addClaimToIPFS (claimsArrayBuffer) {
  return new Promise(function (resolve, reject) {
    ipfs.files.add(claimsArrayBuffer, function (err, result) {
      if (err) {
        reject('something went wrong adding the file')
      } else {
        console.log('added_to_ipfs')
        resolve(result[0].hash)
      }
    })
  })
}

function getFileFromIPFS (multihash) {
  return new Promise(function (resolve, reject) {
    try {
      ipfs.files.cat(multihash, function (err, file) {
        if (err) {
          console.log('Error connecting to IPFS. Check daemon is running')
          resolve(null)
        }
        try {
          var result = JSON.parse(file.toString('utf8'))
          resolve(result)
        } catch (err) {
          console.log('Error parsing JSON from a claim.')
          resolve(null)
        }
      })
    } catch (err) {
      console.log('File does not exist on IFPS')
      resolve(null)
    }
  })
}

exports.getItem = function (key) {
  return new Promise(function (resolve, reject) {
    getLinkFromRegistry(key).then(getFileFromIPFS).then(claimsList => {
      if (claimsList) {
        resolve([key, claimsList])
      } else {
        console.log('NO FILE')
        resolve(null)
      }
    })
  })
}
