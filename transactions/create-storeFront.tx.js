export const CREATE_STOREFRONT = `
  import LimitdNFTStorefront from 0xLimitd
  
  // This transaction installs the Storefront ressource in an account.
  transaction {
    prepare(acct: AuthAccount) {
        if acct.borrow<&LimitdNFTStorefront.Storefront>(from: LimitdNFTStorefront.StorefrontStoragePath) == nil {
          acct.save(<-LimitdNFTStorefront.createStorefront(), to: LimitdNFTStorefront.StorefrontStoragePath)
        }
        acct.unlink(LimitdNFTStorefront.StorefrontPublicPath)
        acct.link<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(LimitdNFTStorefront.StorefrontPublicPath, target: LimitdNFTStorefront.StorefrontStoragePath)
      }
    }
`;
