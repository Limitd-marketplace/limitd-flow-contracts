export const GET_LISTINGS = `
import LimitdNFTStorefront from 0xLimitd

// This script returns an array of all the NFTs uuids for sale through a Storefront

pub fun main(address: Address): [UInt64] {
    let storefrontRef = getAccount(address)
        .getCapability<&LimitdNFTStorefront.Storefront{LimitdNFTStorefront.StorefrontPublic}>(
            LimitdNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")

    return storefrontRef.getSaleOfferIDs()
}`;
