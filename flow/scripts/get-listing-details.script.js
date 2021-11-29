export const GET_LISTING_DETAILS = `
import NonFungibleToken from 0xNonFungibleToken
import LimitdNFTStorefront from 0xec6c7c6152a317ea
import LimitdItems from 0xec6c7c6152a317ea

pub struct SaleItem {
  pub let itemID: UInt64
  pub let typeID: UInt64
  pub let owner: Address
  pub let price: UFix64
  init(itemID: UInt64, typeID: UInt64, owner: Address, price: UFix64) {
    self.itemID = itemID
    self.typeID = typeID
    self.owner = owner
    self.price = price
  }
}
pub fun main(address: Address, saleOfferResourceID: UInt64): SaleItem? {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(LimitdNFTStorefront.StorefrontPublicPath).borrow() {
    if let saleOffer = storefrontRef.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID) {
      let details = saleOffer.getDetails()
      let itemID = details.nftID
      let itemPrice = details.salePrice
      if let collection = account.getCapability<&LimitdItems.Collection{NonFungibleToken.CollectionPublic, LimitdItems.LimitdItemsCollectionPublic}>(LimitdItems.CollectionPublicPath).borrow() {
        if let item = collection.borrowLimitdItem(id: itemID) {
          return SaleItem(itemID: itemID, typeID: item.typeID, owner: address, price: itemPrice)
        }
      }
    }
  }

  return nil
}`;
