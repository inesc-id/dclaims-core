const fs = require('fs')
const Web3 = require('web3')
/*
try {
  const solc = require('solc')
} catch (err) {
  console.log('Not loading Solc.')
}
*/

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
    // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  // console.alert('You need to have a Web3 provider. Try Metamask.')
}

// const CONTRACT_ADDRESS = '0x01ffefba4281b08a4f66b77359c244ba665bbbf2'
const CONTRACT_ADDRESS = '0x53abb1d321dd254eff936f0caee94effd4e10621'

const mySenderAddress = web3.eth.accounts[0]
web3.eth.defaultAccount = mySenderAddress

exports.connectToNode = function (contractAddress) {
  return new Promise(function (resolve, reject) {
    if (contractAddress == 'undefined') {
      contractAddress = CONTRACT_ADDRESS
    }
    web3.eth.defaultAccount = web3.eth.accounts[0]
    var HypercertsContract = web3.eth.contract(ABI)
    var HypercertsInstance = HypercertsContract.at(contractAddress)

    resolve(HypercertsInstance)
  })
}

exports.deployTestContract = function () {
  return new Promise(function (resolve, reject) {
    const solc = require('solc')
    let source = fs.readFileSync(__dirname + '/Hypercerts.sol', 'utf8')
    let compiledContract = solc.compile(source, 1)
    let abi = compiledContract.contracts[':Hypercerts'].interface
    let bytecode = compiledContract.contracts[':Hypercerts'].bytecode
    // let gasEstimate = web3.eth.estimateGas({data: bytecode})
    let MyContract = web3.eth.contract(JSON.parse(abi))

    MyContract.new({
      from: mySenderAddress,
      data: bytecode,
      gas: 1000000}, function (err, myContract) {
      if (!err) {
   // NOTE: The callback will fire twice!
   // Once the contract has the transactionHash property set and once its deployed on an address.

   // e.g. check tx hash on the first call (transaction send)
        if (!myContract.address) {
          console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract

   // check address on the second call (contract deployed)
        } else {
          console.log(myContract.address) // the contract address
          // myContractReturned = myContract
          resolve(myContract)
        }
   // Note that the returned "myContractReturned" === "myContract",
   // so the returned "myContractReturned" object will also get the address set.
      } else {
        console.log('ERROR: ' + err)
      }
    })
  })
}

exports.getUserId = function () {
  return new Promise(function (resolve, reject) {
    resolve(web3.eth.accounts[0])
  })
}

const ABI = [
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'bytes32'
      },
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'name': 'newList',
    'outputs': [
      {
        'name': 'issuer',
        'type': 'address'
      },
      {
        'name': 'ipfsLink',
        'type': 'string'
      },
      {
        'name': 'revoked',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'articleId',
        'type': 'bytes32'
      }
    ],
    'name': 'getIpfsLink',
    'outputs': [
      {
        'name': '',
        'type': 'string'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'articleId',
        'type': 'bytes32'
      }
    ],
    'name': 'getClaimsListSize',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'articleId',
        'type': 'bytes32'
      },
      {
        'name': 'claimIndex',
        'type': 'uint256'
      }
    ],
    'name': 'getClaim',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      },
      {
        'name': '',
        'type': 'string'
      },
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'bytes32'
      }
    ],
    'name': 'bigOldList',
    'outputs': [
      {
        'name': '',
        'type': 'string'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'articleId',
        'type': 'bytes32'
      },
      {
        'name': 'ipfsLink',
        'type': 'string'
      }
    ],
    'name': 'issueClaim',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'articleId',
        'type': 'bytes32'
      },
      {
        'name': 'ipfsLink',
        'type': 'string'
      }
    ],
    'name': 'setIpfsLink',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }
]
