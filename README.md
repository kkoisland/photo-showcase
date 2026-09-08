# photo-showcase

Vite + React + TypeScriptで作った、旅行アルバムを周りの人に見せるためのアプリ。

## 写真公開機能(S3連携)設計案

周りの人に旅行アルバムを見せるため、写真とアプリをS3で公開する機能の設計メモ。ログイン機能は使わず、ローカル環境(管理者)とデプロイ先(閲覧者)で振る舞いを分ける方式を採用。

### 進捗

**Phase 1: データモデル整理 + 管理者UI出し分け(完了・マージ済み)**
ブランチ: `refactor/admin-mode-foundation`(mainにマージ済み)

**Phase 2: S3公開機能(完了・マージ済み)**
残作業: ダミーデータを実際の写真に差し替え

**Phase 3: Import時S3同期 + アルバム表示管理(実装完了、マージ待ち)**
ローカルとS3の食い違いをそもそも起こしにくくするための設計変更。「Importした瞬間にS3へアップロードし、Publishはmanifest.jsonの更新だけにする」という方針に転換する。詳細は下記チェックリスト参照

実装中に判明した重要な制約: `AlbumCard.tsx`・`PhotoModal.tsx`・`AlbumImportForm.tsx`は`routes.tsx`経由で閲覧者向けビルド(`App.tsx`/`main.viewer.tsx`)にも含まれる共有コンポーネントで、`import.meta.env.DEV`のJSX条件分岐だけでは、そこからAWS鍵を読み込む`s3Utils.ts`が閲覧者向けビルドに紛れ込むのを防げない(実際に試して、鍵がビルド成果物に埋め込まれることを確認した)。そのため、`s3Utils.ts`の実装をReact Context(`src/adminS3Context.ts`、AWS SDKへの依存なし)経由で注入する方式にした。実際に注入するのは`AdminApp.tsx`(閲覧者ビルドには絶対に含まれない)のみ。Import時のアップロードも、この後の削除API呼び出しも、この仕組みの上に実装する

### やること一覧

**インフラ(夫と一緒に)**

1. S3バケットを1つ作る(公開読み取り可)(完了: `photo-showcase-612708912687-us-east-1-an`)
2. 自分専用のAWSアカウント/IAMユーザーを発行してもらう(バケットへの書き込み権限のみ)(完了、`.env` に格納・gitignore済み)
3. S3の「静的ウェブサイトホスティング」を有効にする(アプリ自体を置くため)(完了)
   公開URL: http://photo-showcase-612708912687-us-east-1-an.s3-website-us-east-1.amazonaws.com
   (Index document: `index.html` / Error document: `index.html`(SPAのクライアントサイドルーティング対応)、Bucket policyで `s3:GetObject` を全員に許可済み)

GitHub ActionsによるS3への自動デプロイ、AWS CLIのセットアップは不要と判断し対象から外した(理由は後述の「AWS鍵の扱いについて」を参照。既存の [biome.yml](.github/workflows/biome.yml) によるlintチェックの自動化とは無関係で、そちらは今まで通り継続する)。

**アプリ側**

- [x] データモデルの整理: `Photo.albumId` と `Album.photoIds` の二重管理を解消し、`Photo.albumId` を唯一の正とする
- [x] 管理者専用UI(インポート・削除・編集ボタンなど)を `import.meta.env.DEV` で出し分ける
- [x] `src/main.tsx`(ローカル`pnpm dev`のデフォルト。常に管理用の`AdminApp`を描画)と `src/main.viewer.tsx` + `viewer.html`(公開ビルド専用の入り口。`App`のみを描画し、AWS関連コードを一切importしない)にエントリを分ける。**別URLを開く必要はなく、`pnpm dev`はこれまで通り1つのURLのまま**
- [x] `vite.viewer-build.config.ts` を作り、`pnpm build` がこの`viewer.html`だけをビルド対象にするよう変更する(出力後に`dist/viewer.html`を`dist/index.html`にリネーム)。これにより「うっかり管理用の内容ごとビルドしてしまう」という事故が構造的に起きなくなる
- [x] `AdminApp`に「公開(Publish)」ボタンを実装する。現在のアルバム状態から `manifest.json` を生成し、写真ファイルとあわせて `@aws-sdk/client-s3` で直接S3にアップロードする。すでにS3にある写真ファイルはスキップし差分のみアップロード(manifest.jsonは毎回全体を上書き)。1枚失敗しても他の写真の公開は止めず、失敗分はスキップして続行する
- [x] `pnpm run deploy` スクリプト(`scripts/deploy.mjs`)を作る(`pnpm build`の出力である`dist/`をS3にアップロードする)
- [x] 閲覧用エントリ(`src/main.viewer.tsx`)は常にS3の`manifest.json`をfetchして表示する
- [x] (改善) ローカルストレージへの永続化: `useAlbumsStore`/`usePhotosStore`に`persist`を追加。起動時は「ローカルストレージ→S3のmanifest.json→ダミーデータ」の優先順位で復元する
- [x] (バグ修正) `manifest.json`がブラウザにキャッシュされ、Publish後も古い内容が表示される問題を修正(S3側で`CacheControl: "no-cache"`を指定、fetch側で`cache: "no-store"`を指定)
- [x] (改善) S3上の削除済み写真ファイルのクリーンアップ: Publish時、ローカルにもう存在しない写真ファイルをS3から実際に削除する(`ListObjectsV2Command` / `DeleteObjectsCommand`。IAMユーザーのバケットポリシーに`s3:ListBucket`/`s3:DeleteObject`を追加して対応)
- [x] (改善) アルバム削除時に、そのアルバムに属する写真も連動して削除する(Undo対応)
- [x] (改善) カバー写真の紐付けをURL文字列比較からID参照(`coverPhotoId`)に変更する
- [x] (改善) Publish失敗時の通知を明示的なダイアログで表示する(それまではコンソールログのみだった)

**アプリ側(Phase 3)**

- [x] `Album.shared`/`sharedUrl`フィールドを廃止する。ベースURLの定数を`s3Utils.ts`から切り出した`publicUrls.ts`(AWS SDK非依存)に置き、`publicUrlFor`(写真用)と`albumUrlFor`(アルバム用、新規)の両方がそれを参照するようにする。`AlbumCard.tsx`のリンクコピー部分は、常に同じリンクをコピーするだけの固定表示ボタンに変更する。リンクコピーはアルバム一覧ページのみとし、`PhotoGrid.tsx`(アルバム詳細ページ)からは削除する
- [x] `Album`に`hidden`フィールドを追加する。新規作成時は`hidden: true`をデフォルトにし、アルバムカード上のバッジ(クリックで即トグル、Hidden⇔Show)からON/OFFできるようにする
- [x] Publish時、`hidden`なアルバムとその写真はmanifest.jsonから除外する(S3上の写真ファイル自体は削除しない。表示/非表示は一覧に載せるかどうかだけの制御)
- [x] AWS鍵を読み込む`s3Utils.ts`を、閲覧者ビルドにも含まれる共有コンポーネントから隔離するため、React Context(`src/adminS3Context.ts`)経由の依存性注入に変更(上記「実装中に判明した重要な制約」参照)。`albumUtils.importPhotos`は`uploadPhoto`関数を引数で受け取る形にした
- [x] Import時に各写真をその場でS3へアップロードする(`URL.createObjectURL`の`blob:` URLではなく、最初からS3の恒久URLをローカルにも保存する)。既存のhashベース重複チェックはそのまま維持
- [x] アップロードに失敗した写真はエラーメッセージを配列に集約し、全件終了後にまとめて表示する(`AdminPublishButton`と同じダイアログ形式)。失敗した写真はローカルにも追加しない
- [x] 新規アルバム作成時の`coverPhotoId`は、アップロードに成功した写真の中からのみ選ぶ
- [x] Import中は「アップロード中...」のローディング表示を出し、フォームを操作不可にする
- [x] 写真削除: `ConfirmModal`で確認 → S3の削除APIを呼び出し、成功した場合のみローカルからも削除する。失敗時はローカルの状態を変えずエラーを表示し、再度削除を試せるようにする。既存のUndo(スナックバーの取り消し)は廃止する。削除APIも`adminS3Context.ts`経由で注入する
- [x] アルバム削除: 写真も含めて`DeleteObjectsCommand`でまとめてS3から削除し、成功した場合のみローカルからも削除する。Photo削除と同様に確認ダイアログのみとし、既存のUndoは廃止する
- [x] `publishToS3`のアップロードループは、`keyFromPublicUrl`で既にS3の恒久URLを持っている写真を判別し、そのままmanifestに使う(S3への問い合わせ自体をスキップ)。Import時点で何らかの理由でS3に上がらなかった写真だけ、ここで改めてアップロードを試みる。オーファンクリーンアップ(`deleteOrphanedPhotos`)はそのまま保険として残した

**今後の検討事項**

- サブドメイン(`photos.kkoisland.com`など)にするかどうか(保留中、今のS3のURLのままでも動作する)
- 複数回に分けてImportし、まとめてPublishする運用にしたい場合の対応(Phase 3で解消見込み。写真の実体はImport時点でS3に確定保存されるため、サーバーなしで複数回Import→まとめてPublishが安全にできるようになる)
- ドラッグ&ドロップでのインポート対応

**AWS鍵の扱いについて(重要)**

「公開」はReactアプリ内のボタンとして実装するが、**「ローカルで動かすもの」と「ビルドしてS3に上げるもの」で、実際に使われるエントリファイル自体を分離**することで安全性を保つ。

- `pnpm dev` は常に `src/main.tsx` → `AdminApp` を描画する。ここには `VITE_AWS_ACCESS_KEY_ID` などの鍵を読み込み、S3へ直接アップロードする処理が含まれる。**このエントリは`pnpm dev`(開発サーバー)以外の方法でビルド・どこかへのアップロードを絶対に行わない**(そのため`.env`には`VITE_`接頭辞ありのキーを別途追加する)
- `pnpm build`(および`pnpm run deploy`)は `vite.viewer-build.config.ts` を使い、`viewer.html` → `src/main.viewer.tsx` → `App` のみをビルド対象にする。このモジュールの依存関係の中に、`AdminApp`やAWSの鍵を読み込む処理は一切登場しないため、ビルド成果物にも鍵の文字列は含まれない
- 「表示を条件分岐で隠す」のではなく、「そもそもビルドの材料(import)に含まれない」という構造で保証している点がポイント(詳しくは下記システム構成を参照)
- GitHub Secretsに書き込み権限のあるAWSの鍵を登録する必要もない(夫の方針)。AWSの鍵は常に自分のPCの `.env` にしか存在しない

**運用の流れ(完成後)**

- `pnpm dev` でアルバムを編集 → 「公開」ボタンでS3へ直接アップロード(同じURL、別の入り口を開く必要はない)
- アプリ自体の反映は `pnpm run deploy` を実行(`pnpm build`の安全な成果物をS3にアップロード)

### ページ構成

ルーティングは変更せず、既存ページ内の要素を管理者かどうかで出し分ける。

| ページ | 管理者のみ表示 | 誰でも表示 |
|---|---|---|
| `/albums` (AlbumGrid) | 新規インポートボタン、3点メニュー(削除・名前変更・エクスポート) | アルバム一覧 |
| `/albums/:albumId` (PhotoGrid) | 削除ボタン、追加インポート | メイソンリー表示 |
| PhotoModal | 削除ボタン、「カバーに設定」 | 拡大表示、前後移動 |
| Header(**`pnpm dev`で開いたときのみ**) | 「公開(Publish)」ボタン | ― |

「公開」ボタンは、`pnpm dev`(ローカル)で動く`AdminApp`にのみ存在する。`pnpm build`/`pnpm run deploy`でS3にアップロードされる方(`App`)にはこのボタン自体、それを支えるコードも一切含まれない。URLはどちらも同じで、別のページを開く必要はない。アプリ自体のデプロイは `pnpm run deploy` というターミナルコマンドで行う(理由は後述)。

### システム構成

```mermaid
flowchart TD
    subgraph LocalDev["pnpm dev(ローカル、常に同じ1つのURL)"]
        L0["index.html → src/main.tsx"]
        A1["AdminApp: アルバム編集 / 写真追加"]
        A2["公開(Publish)ボタン"]
        A3["VITE_AWS_*の鍵を読み込み\n@aws-sdk/client-s3で直接アップロード"]
        L0 --> A1 --> A2 --> A3
    end

    subgraph BuildCmd["pnpm build / pnpm run deploy"]
        D0["vite.viewer-build.config.ts で\nviewer.html → src/main.viewer.tsx だけをビルド"]
        D1["App: アルバム一覧・写真表示のみ\nAWSの鍵・AdminAppは依存関係に一切登場しない"]
        D0 --> D1
    end

    subgraph S3["S3バケット(公開読み取り可)"]
        S1["アプリ本体(dist/index.html 等)"]
        S2["manifest.json"]
        S3photos["写真ファイル"]
    end

    subgraph Deployed["デプロイ先(誰でもアクセス可、閲覧専用)"]
        DD1["アプリを開く"]
        DD2["manifest.jsonをfetch"]
        DD3["メイソンリー表示・モーダル"]
        DD1 --> DD2 --> DD3
    end

    A3 -->|直接アップロード| S3photos
    A3 -->|直接アップロード| S2
    D1 -->|pnpm run deployでアップロード| S1

    S1 --> DD1
    S2 -.読み込み.-> DD2
    S3photos -.表示.-> DD3
```

`pnpm dev`(ローカル)と`pnpm build`/`pnpm run deploy`(公開用)は、同じ`localhost`のURLでも、実際にビルドの起点として使うエントリファイル(`src/main.tsx` vs `src/main.viewer.tsx`)がそもそも別物であるように設計している。`pnpm build`が辿るモジュールの依存関係の中に`AdminApp`やAWSの鍵を読み込む処理は一切登場しないため、公開されるJSファイルにも鍵の文字列は含まれない。「表示を隠す」のではなく「ビルドの材料に含まれない」という構造で保証している点がポイント。GitHub Actionsは使わない(既存のBiome lintチェックのworkflowのみ従来通り継続)。

### クラス構成

`Photo.albumId` を唯一の正とするデータモデル(Phase 1で実装済み)。以前は `Album.photoIds` にも同じ関係を重複して持っており、削除処理などで同期が崩れる問題があったため廃止した。

```mermaid
classDiagram
    class Photo {
        +string id
        +string albumId
        +string title
        +string url
        +string type
        +string hash
        +string date
        +string description
        +string createdAt
        +boolean favorite
    }

    class Album {
        +string id
        +string title
        +string coverPhotoId
        +boolean shared
        +string sharedUrl
        +string createdAt
        +string updatedAt
    }

    Photo "多" --> "1" Album : albumId

    note for Photo "albumId: 表示(PhotoGrid)や\n枚数計算(AlbumCard)で使われる唯一の参照"
```

### 検討した選択肢(初期案)

アプリはGitHub Pagesにおき、写真をS3に置く場合(gh-pagesを使って手動で公開する):

1. S3バケットを1つ作る(公開読み取り可)
2. 自分専用のAWSアカウント/IAMユーザーを発行してもらう(そのバケットへの書き込み権限のみ)
3. AWS CLIのセットアップ(ターミナルから `aws s3 sync` でファイルをアップロードできるようにする)
4. CORSの設定(ブラウザからJSONファイルをfetchするので、そのままだとブロックされることがある)
5. 写真ファイルを実際にアップロードし、そのS3 URLを含むJSON(マニフェスト)を作る仕組みを用意する
6. `main.tsx` の編集
7. gh-pagesで公開

S3にアプリも写真も置く場合(採用案):

1. S3バケットを1つ作る(公開読み取り可)
2. 自分専用のAWSアカウント/IAMユーザーを発行してもらう(そのバケットへの書き込み権限のみ)
3. S3の「静的ウェブサイトホスティング」を有効にする(← アプリ自体を置くために追加)
4. AWS CLIのセットアップ(写真を手動アップロードするため)
5. GitHub Actionsのworkflowを作成し、AWSの認証情報をGitHub Secretsに登録する(← 自動デプロイのために追加)
6. 写真ファイルを実際にアップロードし、そのS3 URLを含むマニフェストJSONを作る仕組みを用意する
7. `main.tsx` の編集(S3のJSONをfetchするように変更)
8. `git push` する → GitHub Actionsが自動でビルド・S3へ反映(以降、編集のたびにこのpushだけでOK)

後者を採用した理由: アプリとデータを同一オリジン(S3)にまとめることで、CORS設定が不要になるため。なお、この案では当初「GitHub Actionsでpushするだけ自動デプロイ」を想定していたが、AWSの書き込み鍵をGitHub Secretsに置きたくないという判断から、ローカルからの手動コマンド(`pnpm run publish` / `pnpm run deploy`)に変更した。

その後さらに、「写真の公開もアプリ内のボタンで完結させたい(ターミナル操作は現実的でない)」という要望から、`pnpm run publish`(Node.jsスクリプト)も廃止し、管理用/閲覧用でViteのビルドエントリ自体を分離する方式に変更した。

最後に、「`admin.html`のような別URLを開かせる必要はなく、公開ビルドからAWS関連コードさえ除外できればよい」という指摘を受け、`admin.html`という別ファイルは廃止した。代わりに`pnpm dev`(ローカル)は常に`src/main.tsx`(管理用)を使い、`pnpm build`/`pnpm run deploy`だけが専用の設定(`vite.viewer-build.config.ts`)で`src/main.viewer.tsx`(閲覧用)をビルドするようにした。これにより、日常的に開くURLは1つのままで、安全性の担保(ビルドの依存関係にAWS関連コードが含まれない)はそのまま維持している(現行案)。詳細は上記「AWS鍵の扱いについて」を参照。
