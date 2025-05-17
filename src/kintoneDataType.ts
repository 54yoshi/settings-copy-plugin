// kinoneから取得してきたフィールド情報
//
//
//
//
interface KintoneFieldPropertyBase {
  type: string;
  code: string;
  label: string;
  noLabel?: boolean;
  required?: boolean;
  defaultValue?: string;
  minLength?: string;
  maxLength?: string;
  expression?: string;
  hideExpression?: boolean;
  unique?: boolean;
}

// 各フィールド種別ごとの型定義（追加プロパティがある場合のみ記述）
type KintoneFieldProperty =
  | (KintoneFieldPropertyBase & { type: "MULTI_LINE_TEXT" })
  | (KintoneFieldPropertyBase & { type: "RECORD_NUMBER" })
  | (KintoneFieldPropertyBase & { type: "MODIFIER" })
  | (KintoneFieldPropertyBase & { type: "SINGLE_LINE_TEXT" })
  | (KintoneFieldPropertyBase & { type: "STATUS"; enabled: boolean })
  | (KintoneFieldPropertyBase & { type: "FILE"; thumbnailSize?: string })
  | (KintoneFieldPropertyBase & { type: "GROUP"; openGroup?: boolean })
  | (KintoneFieldPropertyBase & {
      type: "DROP_DOWN";
      options: { [key: string]: { label: string; index: string } };
    })
  | (KintoneFieldPropertyBase & { type: "CATEGORY"; enabled: boolean })
  | (KintoneFieldPropertyBase & { type: "STATUS_ASSIGNEE"; enabled: boolean })
  | (KintoneFieldPropertyBase & { type: "CREATOR" })
  | (KintoneFieldPropertyBase & { type: "SUBTABLE"; 
      // サブテーブルの場合、内部のフィールド定義は再帰的にこの型のユニオンで表す
      fields: { [fieldCode: string]: KintoneFieldProperty };
    })
  | (KintoneFieldPropertyBase & { type: "UPDATED_TIME" })
  | (KintoneFieldPropertyBase & { type: "CREATED_TIME" });

// 最上位のフォーム情報（properties を持つオブジェクト）
export interface SubtableFieldProperty extends KintoneFieldPropertyBase {
  type: "SUBTABLE";
  fields: { [fieldCode: string]: KintoneFieldProperty };
}

export interface KintoneRecord {
  revision: string;
  properties: {
    [fieldCode: string]: KintoneFieldProperty;
  };
}

//
//
//
//
//
//フォームレイアウトの型定義
// 各フィールドのサイズ情報
export interface Size {
  width: string;
  height?: string;
  innerHeight?: string;
}

// 各フィールドの基本情報。
// ROW や SUBTABLE 内で扱われるフィールドは、ここで定義するプロパティで共通的に扱います。
export interface LayoutField {
  type: string;
  code?: string;
  elementId?: string;
  size?: Size;
  label?: string;
  fieldName?: string;
}

// 通常の ROW 型
export interface LayoutRow {
  type: "ROW";
  fields: LayoutField[];
}

// サブテーブルは、通常のフィールド群と異なり、
// サブテーブルとしてのコードと、内部のフィールドが配列で定義されます。
export interface LayoutSubtable {
  type: "SUBTABLE";
  code: string;
  fields: LayoutField[];
}

// グループの場合、
// グループ内のレイアウト（ROW 型の配列）がネストされている形式になります。
export interface LayoutGroup {
  type: "GROUP";
  code: string;
  fieldName?: string;
  label?: string;
  layout: LayoutRow[];
}

// これら３種類のレイアウト要素のユニオン型
export type LayoutItem = LayoutRow | LayoutSubtable | LayoutGroup;

// 最上位のフォームレイアウト情報を持つオブジェクトの型定義
export interface FormLayout {
  layout: LayoutItem[];
  revision: string;
}

//
//
//
//
//型変変更のプラグイン用の型定義

export interface EditLayoutField {
  type: string;
  code?: string;
  filedName?: string;
}

// 通常の ROW 型
export interface EditLayoutRow {
  type: "ROW";
  fields: LayoutField[];
  // memberTabs: number[];
}

// サブテーブルは、通常のフィールド群と異なり、
// サブテーブルとしてのコードと、内部のフィールドが配列で定義されます。
export interface EditLayoutSubtable {
  type: "SUBTABLE";
  code: string;
  fields: LayoutField[];
  // memberTabs: number[];
}

// グループの場合、
// グループ内のレイアウト（ROW 型の配列）がネストされている形式になります。
export interface EditLayoutGroup {
  type: "GROUP";
  code: string;
  label?: string;
  layout: LayoutRow[];
  // memberTabs: number[];
}

export type EditLayoutItem = EditLayoutRow | EditLayoutSubtable | EditLayoutGroup;

// 最上位のフォームレイアウト情報を持つオブジェクトの型定義
export interface EditFormLayout {
  layout: EditLayoutItem[];
  revision: string;
}

//
//
//
//
//tabsettingsの型定義

export interface Tab {
  startRowIndex: number;
  tabName: string;
}

export interface TabSettings {
  isFollow: boolean;
  backgroundColor: string;
  fontColor: string;
  spaceField: string;
  tabs: Tab[];
}

