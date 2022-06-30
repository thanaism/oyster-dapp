/* eslint-disable @typescript-eslint/no-var-requires, import/newline-after-import */
const utils = require('ethers/lib/utils');
// const abi = require('../abis/OpenSeaERC1155.json');
const wabi = require('../abis/KakiCoin.json');
const iface = new utils.Interface(wabi.abi);
const readableInterface = iface.format(utils.FormatTypes.full);
console.log(readableInterface);
