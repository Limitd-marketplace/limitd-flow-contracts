export const BUY_TOKEN = `
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD
  import LimitdItems from 0xec6c7c6152a317ea
  import LimitdNFTStorefront from 0xec6c7c6152a317ea
  
  transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {
    let paymentVault: @FungibleToken.Vault
    let limitdItemsCollection: &LimitdItems.Collection{NonFungibleToken.Receiver}
    let storefront: &LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}
    let saleOffer: &LimitdNFTStorefront.SaleOffer{LimitdNFTStorefront.SaleOfferPublic}
    prepare(account: AuthAccount) {
      self.storefront = getAccount(storefrontAddress)
        .getCapability<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(
          LimitdNFTStorefront.StorefrontPublicPath
        )!
        .borrow()
        ?? panic("Could not borrow Storefront from provided address")
      self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
        ?? panic("No Offer with that ID in Storefront")
      
      let price = self.saleOffer.getDetails().salePrice
      let mainFUSDVault = account.borrow<&FUSD.Vault>(from: /storage/fusdVault)
        ?? panic("Cannot borrow Kibble vault from account storage")
      
      self.paymentVault <- mainFUSDVault.withdraw(amount: price)
      self.limitdItemsCollection = account.borrow<&LimitdItems.Collection{NonFungibleToken.Receiver}>(
        from: LimitdItems.CollectionStoragePath
      ) ?? panic("Cannot borrow LimitdItems collection receiver from account")
    }
  
    execute {
      let item <- self.saleOffer.accept(
        payment: <-self.paymentVault
      )
      self.limitdItemsCollection.deposit(token: <-item)
      self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
  }
`;
