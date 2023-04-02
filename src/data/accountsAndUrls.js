// export const network = 'testnet'
export const network = 'mainnet'

var accounts_list = {
    testnet: {
        FT_CONTRACT: 'usdc.web3mon.testnet',
        BATTLE_CONTRACT: 'game-v1.web3mon.testnet',
    },
    mainnet: {
        FT_CONTRACT: 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
        BATTLE_CONTRACT: 'game-v1.web3mon.near',
    },
}

var loginUrl_list = {
    testnet: 'https://dev-server.web3mon.io/login',
    mainnet: 'https://server.web3mon.io/login',
}

var websocketUrl_list = {
    testnet: 'wss://dev-server.web3mon.io/ws-login?token=',
    mainnet: 'wss://server.web3mon.io/ws-login?token=',
}

var partner_nfts_list = {
    testnet: [
        { account_id: 'asac.web3mon.testnet', base_uri: 'https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/' },
        { account_id: 'nearnauts.web3mon.testnet', base_uri: 'https://nearnaut.mypinata.cloud/ipfs/' },
        { account_id: 'nftv1.web3mon.testnet', base_uri: '' },
    ],

    mainnet: [
        { account_id: 'nearnautnft.near', base_uri: 'https://nearnaut.mypinata.cloud/ipfs' },
        { account_id: 'asac.near', base_uri: 'https://ipfs.io/ipfs/bafybeicj5zfhe3ytmfleeiindnqlj7ydkpoyitxm7idxdw2kucchojf7v4/' },
        { account_id: 'near-punks.near', base_uri: '' },
        { account_id: 'tinkerunion_nft.enleap.near', base_uri: 'https://ipfs.fleek.co/ipfs/' },
        { account_id: 'v0.apemetaerror.near', base_uri: 'https://bafybeih2466d6jhz62i6oll22iwshi3adkuym6qk4kbvm7qzxwwjllhoay.ipfs.dweb.link/' },
        { account_id: 'cartelgen1.neartopia.near', base_uri: 'https://bafybeienu3old5yt7c23yftcb7pjx2oux7pyaliwgo4btzjbjjvqvjz4nm.ipfs.dweb.link/' },
        { account_id: 'realbirds.near', base_uri: 'https://api.therealbirds.com/metadata/' },
        { account_id: 'mrbrownproject.near', base_uri: '' },

        { account_id: 'rocketbois.neartopia.near', base_uri: 'https://bafybeibrteurbwo76af6c4l4jc3k5dvjd7f73l62peonbsni4qibkk27hq.ipfs.dweb.link/' },
        { account_id: 'lacrove.near', base_uri: 'https://bafybeicbqphe6h6axkkbfh2wlfo2cs5sy46cnh24csfepgtmlz7hrgyzzu.ipfs.dweb.link/' },
        { account_id: 'near_starter.near', base_uri: 'https://bafybeibaz6uuzo4rd3q75fljyka6rdzrymtklqovllkcgvnajirkdz7d44.ipfs.nftstorage.link/' },
        { account_id: 'nearcrashnft.near', base_uri: 'nearcrash.io/' },
        { account_id: 'classykangaroos1.near', base_uri: '' },
        { account_id: 'nft.classykangaroosv2.near', base_uri: '' },
        { account_id: 'nft.goodfortunefelines.near', base_uri: 'https://ewtd.mypinata.cloud/ipfs/QmNtWmU8LuNNexpcw3djhGcdudkUarX8oiovGCZrwrhYR4/' },
        { account_id: 'ff.nekotoken.near', base_uri: 'https://ewtd.mypinata.cloud/ipfs/Qma8y2hBMBxzB1jkJY2hh5W7hoeNCKqturVjXwKsQbNMxG' },
        { account_id: 'mmc-pups.nfts.fewandfar.near', base_uri: 'https://cloudflare-ipfs.com/ipfs/' },

        { account_id: 'nftv1.web3mon.near', base_uri: 'https://bafybeihppeux4ojitk5nii4znq4t4vw6oa26arg2u7tv276vnhsklibpgy.ipfs.dweb.link/' },

    ]
}

export const accounts = accounts_list[network]
export const loginUrl = loginUrl_list[network]
export const websocketUrl = websocketUrl_list[network]
export const partner_nfts = partner_nfts_list[network]