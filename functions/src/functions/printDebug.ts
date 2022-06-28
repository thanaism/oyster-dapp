import * as util from 'ethereumjs-util';

const readableMessage = 'test';

const verifyNonce = async (data: { signature: string; uuid: string }) => {
  const { signature, uuid } = data;
  const message = readableMessage + uuid;
  console.log(message);
  const nonce = '\x19Ethereum Signed Message:\n' + message.length + message;
  console.log(nonce);
  const nonceBuffer = util.keccak(Buffer.from(nonce, 'utf-8'));
  console.log(nonceBuffer);
  const { v, r, s } = util.fromRpcSig(signature);
  console.log(v);
  console.log(r);
  console.log(s);
  const pubKey = util.ecrecover(util.toBuffer(nonceBuffer), v, r, s);
  console.log(pubKey);
  const addrBuf = util.pubToAddress(pubKey);
  console.log(addrBuf);
  const account = util.bufferToHex(addrBuf);
  console.log(account);
};

verifyNonce({
  signature:
    '0xd8f7aec0171b2db5134033236928bbf6a99f7821f3b4f227b421e82d14bec5b860d9c991c317222192a50b50484cc7971cd177e60670e9b0f53168d0e9e241bc1b',
  uuid: '',
});
