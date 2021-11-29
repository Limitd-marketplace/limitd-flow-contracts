export const CHECK_STOREFRONT = `
  import LimitdNFTStorefront from 0xLimitd

   pub fun main(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(LimitdNFTStorefront.StorefrontPublicPath)
      .check()
  }
  `;
