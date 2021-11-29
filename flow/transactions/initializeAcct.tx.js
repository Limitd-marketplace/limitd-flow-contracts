export const INITIALIZE = `
  import LimitdItems from 0xec6c7c6152a317ea
  import LimitdNFTStorefront from 0xec6c7c6152a317ea
  import FungibleToken from 0xFungibleToken
  import NonFungibleToken from 0xNonFungibleToken
  import FUSD from 0xFUSD

  pub fun hasFUSD(_ address: Address): Bool {
    let receiver = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)
      .check()
    let balance = getAccount(address)
      .getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance)
      .check()
    return receiver && balance
  }
  pub fun hasItems(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&LimitdItems.Collection{NonFungibleToken.CollectionPublic, LimitdItems.LimitdItemsCollectionPublic}>(LimitdItems.CollectionPublicPath)
      .check()
  }
  pub fun hasStorefront(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(LimitdNFTStorefront.StorefrontPublicPath)
      .check()
  }
  transaction {
    prepare(acct: AuthAccount) {
      if !hasFUSD(acct.address) {
        if acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil {
          acct.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
        }
        acct.unlink(/public/fusdReceiver)
        acct.unlink(/public/fusdBalance)
        acct.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
        acct.link<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance, target: /storage/fusdVault)
      }
      if !hasItems(acct.address) {
        if acct.borrow<&LimitdItems.Collection>(from: LimitdItems.CollectionStoragePath) == nil {
          acct.save(<-LimitdItems.createEmptyCollection(), to: LimitdItems.CollectionStoragePath)
        }
        acct.unlink(LimitdItems.CollectionPublicPath)
        acct.link<&LimitdItems.Collection{NonFungibleToken.CollectionPublic, LimitdItems.LimitdItemsCollectionPublic}>(LimitdItems.CollectionPublicPath, target: LimitdItems.CollectionStoragePath)
      }
      if !hasStorefront(acct.address) {
        if acct.borrow<&LimitdNFTStorefront.Storefront>(from: LimitdNFTStorefront.StorefrontStoragePath) == nil {
          acct.save(<-LimitdNFTStorefront.createStorefront(), to: LimitdNFTStorefront.StorefrontStoragePath)
        }
        acct.unlink(LimitdNFTStorefront.StorefrontPublicPath)
        acct.link<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(LimitdNFTStorefront.StorefrontPublicPath, target: LimitdNFTStorefront.StorefrontStoragePath)
      }
    }
  }
`;
