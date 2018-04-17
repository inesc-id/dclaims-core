var exports = module.exports = {}
const HOST = 'http://localhost:8000'
let HypercertsCore = require('../hc-core.js')

exports.issueWithPublisherNoIPFS = function (key, item) {
  return new Promise(function (resolve, reject) {
    console.log('issued')
    var data = null
    let claim = item

    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        resolve()
      }
    })

    xhr.open('GET', HOST + '/issue?id=0&claim=' + claim)
    // xhr.setRequestHeader('cache-control', 'no-cache')
    // xhr.setRequestHeader('postman-token', 'b1c158f2-94e3-2402-2dd2-2624481334a8')

    xhr.send(data)
  })
}

exports.issueWithPublisher = function (key, item) {
  return new Promise(function (resolve, reject) {
    console.log('issued')
    var data = null
    let claim = JSON.parse(item)

    var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

    var xhr = new XMLHttpRequest()
    xhr.withCredentials = true

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        resolve()
      }
    })

    HypercertsCore.addClaimToIPFS(claim).then(ipfsLink => {
      xhr.open('GET', HOST + '/issueipfs?id=0&claim=' + ipfsLink)
    // xhr.setRequestHeader('cache-control', 'no-cache')
    // xhr.setRequestHeader('postman-token', 'b1c158f2-94e3-2402-2dd2-2624481334a8')
      xhr.send(data)
    })
  })
}

// let claimS = '{"id":"hypercerts-news-b5544adb-58ac-43df-a9b0-2061e900b950","type":["hypercerts-news-single-claim-0.0.1"],"issuer":"issuerId","issued":"default-yyyy-mm-dd","claim":{"id":"0xf4d3d3ce6f10230567174b616eb0d298685220e2af65674064421f904057aeac","category":"category","freeText":"freeText"},"signature":{"type":"default-something","created":"default-timestamp","creator":"default-someone","domain":"default-something","nonce":"default-1234","signatureValue":"default-signature"},"revocation":{"id":"default-articleId","type":"default-SimpleRevocationList2017"}}'

// issueWithPublisher('1234', claimS)
let claim = JSON.parse('{"id":"hypercerts-news-60ef86bb-2e4b-4c03-b709-ade0c93e3f2f","type":["hypercerts-news-single-claim-0.0.1"],"issuer":"0x3296c51bc98dd4dcd5605469ec3a736c0e60ef43","issued":"default-yyyy-mm-dd","claim":{"id":"0x92e343f083451ff6ad2f524f135d140a0d4813cec9c7ab97aa00d5e201003562","category":"Fake News","freeText":""},"signature":{"type":"eth_signTypedData","created":"default-timestamp","creator":"0x3296c51bc98dd4dcd5605469ec3a736c0e60ef43","domain":"default-something","nonce":"default-1234","signatureValue":"0x44ea2c3525e17acbb2358a23b88d040ea7079e2075e71250f24875816d4e28c635308a672c1e437a8f2b95538d13140f51756b09d8d6e4d553e995b1eb8343a81b"},"revocation":{"id":"default-articleId","type":"default-SimpleRevocationList2017"}}')
