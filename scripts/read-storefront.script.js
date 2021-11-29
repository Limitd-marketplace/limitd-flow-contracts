export const LIST_LIMITED_NFT = `
      import NonFungibleToken from 0xNonFungibleToken
    import LimitdItems from 0xLimitd

       // This script returns an array of all the NFT IDs in an account's collection.

    pub fun main(address: Address): [UInt64] {
        let account = getAccount(address)

        let collectionRef = account.getCapability(LimitdItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow capability from public collection")
        
    return collectionRef.getIDs()
}

`;
