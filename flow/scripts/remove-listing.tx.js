export const REMOVE_LISTING = `
 import LimitdNFTStorefront from 0xec6c7c6152a317ea

transaction(saleOfferResourceID: UInt64) {
    let storefront: &LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontManager}>(from: LimitdNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed LimitdNFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeSaleOffer(saleOfferResourceID: saleOfferResourceID)
    }
}
`;
