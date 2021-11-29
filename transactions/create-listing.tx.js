export const CREATE_LISTING = `
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD
 import LimitdItems from 0xec6c7c6152a317ea
   import LimitdNFTStorefront from 0xec6c7c6152a317ea
 // import NFTStorefront from 0xec6c7c6152a317ea
  transaction(saleItemID: UInt64, saleItemPrice: UFix64) {
    let fusdReceiver: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let LimitdItemsCollection: Capability<&LimitdItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &LimitdNFTStorefront.Storefront
    prepare(account: AuthAccount) {
      // We need a provider capability, but one is not provided by default so we create one if needed.
      let LimitdItemsCollectionProviderPrivatePath = /private/LimitdItemsCollectionProvider
      self.fusdReceiver = account.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!
      assert(self.fusdReceiver.borrow() != nil, message: "Missing or mis-typed FUSD receiver")
      if !account.getCapability<&LimitdItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(LimitdItemsCollectionProviderPrivatePath)!.check() {
        account.link<&LimitdItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(LimitdItemsCollectionProviderPrivatePath, target: LimitdItems.CollectionStoragePath)
      }
      self.LimitdItemsCollection = account.getCapability<&LimitdItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(LimitdItemsCollectionProviderPrivatePath)!
      assert(self.LimitdItemsCollection.borrow() != nil, message: "Missing or mis-typed LimitdItemsCollection provider")
      
      self.storefront = account.borrow<&LimitdNFTStorefront.Storefront>(from: LimitdNFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed LimitdNFTStorefront Storefront")
    }
    execute {
      let saleCut = LimitdNFTStorefront.SaleCut(
        receiver: self.fusdReceiver,
        amount: saleItemPrice
      )
      self.storefront.createSaleOffer(
        nftProviderCapability: self.LimitdItemsCollection,
        nftType: Type<@LimitdItems.NFT>(),
        nftID: saleItemID,
        salePaymentVaultType: Type<@FUSD.Vault>(),
        saleCuts: [saleCut]
      )
    }
  }
`;
