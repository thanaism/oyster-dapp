# KAKI Portal

牡蠣ポータルは[牡蠣若手の会][1]や[AbyssCrypto][2]を応援する人たちのための DApp です。

## 主な機能

- 牡蠣若手の会 EC サイトで牡蠣または牡蠣の加工品を購入された方に KAKI コインを発行
- Twitter で牡蠣若手の会や AbyssCrypto を宣伝してくれた方に KAKI コインを発行

KAKI コインの実装は[こちらのリポジトリ][3]にあります。

デプロイ後の追加ミントを可能にしている以外は ERC777 標準と同じトークンになります。
Mumbai テストネットにデプロイしており、金銭的価値はありません。

## 技術スタック

牡蠣ポータルは React を使用して作成しています。

バージョンは React 18 です。

### 状態管理

- ~~Redux~~
- ~~Context API~~
- Recoil

最新の状態では、Recoil と Suspence を用いて状態管理しています。

### web3

- ethers.js
- @metamask/detect-provider

スマートコントラクト周りの処理は、フロントエンド・バックエンドともに ethers.js を使用しています。

### スタイリング

- ~~Semantic UI React~~
- Chakra UI

以前は Semantic UI React を使用していましたが、知人から勧められた Chakra UI を使ってみています。

### ホスティング環境

- Firebase
  - Hosting
  - Functions
  - Firestore

本業では Azure をメインで使用しているため、せっかくなら別の環境を使おうと思い Firebase にしています。
『[りあクト！ Firebase で始めるサーバーレス React 開発][4]』の影響も大きいです。

[1]: https://kakiwakatenokai.myshopify.com/
[2]: https://opensea.io/collection/abysscrypto-polygon
[3]: https://github.com/thanaism/KakiCoin
[4]: https://booth.pm/ja/items/1572683
