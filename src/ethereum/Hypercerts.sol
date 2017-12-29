pragma solidity ^0.4.0;
contract Hypercerts {
    
    struct Claim{
        address issuer;
        string ipfsLink;
        bool revoked;
    }
    
    
    mapping (bytes32 => string) public bigOldList;
    
    mapping (bytes32 => Claim[]) public newList;
    
    function issueClaim(bytes32 articleId, string ipfsLink) public {
        newList[articleId].push(Claim(msg.sender,ipfsLink,false));
    }
    
    function getClaimsListSize(bytes32 articleId) constant public returns (uint){
        return newList[articleId].length;
    }
    
    function getClaim(bytes32 articleId, uint claimIndex) constant public returns (address,string,bool){
        return (newList[articleId][claimIndex].issuer,newList[articleId][claimIndex].ipfsLink,newList[articleId][claimIndex].revoked);
    }


    function getIpfsLink(bytes32 articleId) constant public returns (string){
        return bigOldList[articleId];
    }
    
    function setIpfsLink(bytes32 articleId, string ipfsLink) public{
        bigOldList[articleId] = ipfsLink;
    }
      
}
