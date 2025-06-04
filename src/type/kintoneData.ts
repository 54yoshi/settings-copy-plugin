
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
