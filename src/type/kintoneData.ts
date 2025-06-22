
//操作対象のアカウントが所持しているアプリ情報を取得してきたといのデータ型
export interface TopLevel {
  apps: App[];
}

export interface App {
  appId:       string;
  code:        string;
  name:        string;
  description: string;
  createdAt:   string;
  creator:     string;
  modifiedAt:  string;
  modifier:    string;
  spaceId:     null;
  threadId:    null;
}

export interface Creator {
  code: string;
  name: string;
}

//操作対象のアプリに導入されているプラグインの情報を取得してきた時のデータ型
export interface PluginListType {
  plugins:  PluginType[];
  revision: string;
}

export interface PluginType {
  id:      string;
  name:    string;
  enabled: boolean;
}


// kintoneフィールドの基本インターフェース
interface BaseField {
  type: string;
  code: string;
  label: string;
  required?: boolean;
  noLabel?: boolean;
}

// 文字列（1行）フィールド
export interface SingleLineTextField extends BaseField {
  type: "SINGLE_LINE_TEXT";
  defaultValue?: string;
  unique?: boolean;
  minLength?: string;
  maxLength?: string;
}

// 数値フィールド
export interface NumberField extends BaseField {
  type: "NUMBER";
  defaultValue?: string;
  minValue?: string;
  maxValue?: string;
  digit?: boolean;
  unit?: string;
  unitPosition?: string;
}

// 文字列（複数行）フィールド
export interface MultiLineTextField extends BaseField {
  type: "MULTI_LINE_TEXT";
  defaultValue?: string;
}

// 日付フィールド
export interface DateField extends BaseField {
  type: "DATE";
  defaultValue?: string;
}

// チェックボックスフィールド
export interface CheckBoxField extends BaseField {
  type: "CHECK_BOX";
  options: { [key: string]: { label: string; index: string } };
  defaultValue?: string[];
}

// ラジオボタンフィールド
export interface RadioButtonField extends BaseField {
  type: "RADIO_BUTTON";
  options: { [key: string]: { label: string; index: string } };
  defaultValue?: string;
  align?: string;
}

// フィールドの共用体型
export type Field = 
  | SingleLineTextField
  | NumberField
  | MultiLineTextField
  | DateField
  | CheckBoxField
  | RadioButtonField;

// フォームフィールド取得APIのレスポンス型
export interface GetFormFieldsResponse {
  properties: { [key: string]: Field };
  revision: string;
}
