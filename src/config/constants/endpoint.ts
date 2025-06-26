
/** REST API のエンドポイント（一部はプレビュー環境用） */
export const KINTONE_REST = {
  /** テナント内のアプリ一覧取得（最大100件） */
  LIST_APPS: '/k/v1/apps.json',

  /** 本番アプリにデプロイ済みのフォーム定義を取得 */
  GET_FORM_FIELDS: '/k/v1/app/form/fields.json',

  /** プレビュー環境のフォーム定義を取得（未デプロイ状態） */
  GET_FORM_FIELDS_PREVIEW: '/k/v1/preview/app/form/fields.json',

  /** プレビュー環境のプラグイン一覧を取得 */
  LIST_PLUGINS_PREVIEW: '/k/v1/preview/app/plugins.json',

  /** 特定プラグインの設定（config.json）を取得 */
  GET_PLUGIN_CONFIG_PREVIEW: '/k/v1/preview/app/plugin/config.json',
} as const;

/** 固定URL（プラグインUIや管理画面へのリンク） */
export const KINTONE_UI_URLS = {
  /** プラグインのアイコン画像を取得するURL */
  PLUGIN_ICON_DOWNLOAD: '/k/api/dev/plugin/content/downloadIcon.do',

  /** 管理画面：アプリ単位のプラグイン管理ページ（管理者向け） */
  ADMIN_APP_PLUGINS: '/k/admin/app',

  /** 管理画面：ベータ新機能一覧ページ */
  ADMIN_NEW_FEATURES: '/k/admin/system/newfeature/',
} as const;
