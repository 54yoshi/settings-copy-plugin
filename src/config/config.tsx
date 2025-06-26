import styles from './Config.module.css';
import React, { useState, useEffect, useRef } from 'react';
import DropDown from './Components/parts/DropDown';
import CancelButton from './Components/parts/CancelButton';
import SubmitButton from './Components/parts/SubmitButton';
import PluginList from './Components/parts/PluginList';
import Confirm from './Components/parts/Confirm';
import Result from './Components/parts/Result';
import Loading from './Components/parts/Loading';
import Alert from './Components/parts/Alert';
import DifFieldAlert from './Components/parts/DifFieldAlert';

import { PluginType, App, Field } from '../type/kintoneData';
import { KINTONE_REST, KINTONE_UI_URLS } from './constants/endpoint';

type AppFields = {
  id: string;
  name: string;
  enabled: boolean;
}

type PluginFields = {
  id: string;
  config: string;
  name: string;
}

type AlertModal = {
  isOpen: boolean;
  errorMessage: React.ReactNode;
}

const Config: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apps, setApps] = useState<App[] | null>(null);
  const [plugins, setPlugins] = useState<AppFields[] | null>(null);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [nowSettingPlugins, setNowSettingPlugins] = useState<PluginType[]>([]);
  const [targetPlugins, setTargetPlugins] = useState<PluginType[]>([]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isOpenResultModal, setIsOpenResultModal] = useState(false);
  const [fetchedPluginDatas, setFetchedPluginDatas] = useState<PluginFields[]>([]);
  const [isSameFields, setIsSameFields] = useState(true);
  const [otherAppFields, setOtherAppFields] = useState<{[key: string]: Field;} | null>(null);
  const [isOpenAlertModal, setIsOpenAlertModal] = useState<AlertModal>({
    isOpen: false,
    errorMessage: <></>,
  });

  const pluginId = kintone.$PLUGIN_ID;
  const appId: number | null = kintone.app.getId();
  const baseUrl = location.origin;
  const fieldsRef = useRef<{[key: string]: Field;} | null>(null);
  
  useEffect(() => {
    try{
      if(!appId) return;
      fetchAllApps().then((apps) => {
        setApps(apps);
      });
  
      fetchPlugins(appId).then((plugins) => {
        const targetPlugins = plugins.filter((plugin: PluginType) => plugin.id !== pluginId);
        setNowSettingPlugins(targetPlugins);
      });
  
      // このアプリのフィールドデータを取得
      kintone.api(
        kintone.api.url(KINTONE_REST.GET_FORM_FIELDS_PREVIEW, true),
        'GET',
        {app: appId}
      ).then((resp) => {
        fieldsRef.current = resp.properties;
      });
    } catch (error) {
      console.error('APIエラー:', error);
      setIsOpenAlertModal({
        isOpen: true,
        errorMessage: 
        <>
          APIエラーが発生しました。<br/>
          もう一度お試しください。
        </>,
      });
    }
  }, []);

  useEffect(() => {
    if(otherAppFields !== null && fieldsRef.current !== null){
      const keysA = Object.keys(otherAppFields);
      const keysB = Object.keys(fieldsRef.current);
      setIsSameFields(
        keysA.every((key: string) => keysB.includes(key)) &&
        keysB.every((key: string) => keysA.includes(key))
      );
    }
  },[otherAppFields])

  function handleCancel(){
    const pluginListUrl = `${baseUrl}${KINTONE_UI_URLS.ADMIN_APP_PLUGINS}/${appId}/plugin/`;
    if (window.top) {
      window.top.location.href = pluginListUrl;
    } else {
      window.location.href = pluginListUrl;
    }
  }

  async function fetchAllApps(limit = 100, offset = 0) {
    let allApps: App[] = [];
    while (true) {
      const url = kintone.api.url(KINTONE_REST.LIST_APPS, true);
      const resp = await kintone.api(url, 'GET', { limit, offset });
      allApps = allApps.concat(resp.apps);
      if (resp.apps.length < limit) {
        break;
      }
      offset += limit;
    }
    return allApps;
  }

  async function fetchPlugins(appId: number){
    const url = kintone.api.url(KINTONE_REST.LIST_PLUGINS_PREVIEW, true);
    const resp = await kintone.api(url, 'GET', { app: appId });
    return resp.plugins;
  }

  async function savePlugins(){
    setIsLoading(true);
    const url = kintone.api.url(KINTONE_REST.GET_PLUGIN_CONFIG_PREVIEW, true);
    const selectedAppId = selectedApp?.appId;

    let configs: PluginFields[] = [];
    try{
      configs = await Promise.all(
        targetPlugins.map(async (plugin) => {
          const resp = await kintone.api(url, 'GET', { app: selectedAppId, id: plugin.id });
          return {id: plugin.id, config: resp.config, name: plugin.name};
        })
      );
    } catch (error) {
      if(error && typeof error === 'object' && 'code' in error && error.code === 'GAIA_OF02'){
        setIsLoading(false);
        setIsOpenAlertModal({
          isOpen: true,
          errorMessage: 
            <>
              データのコピーに失敗しました。<br/>
              プラグインをコピーする前に以下の項目が有効になっているか確認してください。<br/>
              <span>
                検討中の新機能　＞　APIラボ　＞　<br/>
                <a
                  href={`${baseUrl}${KINTONE_UI_URLS.ADMIN_NEW_FEATURES}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{borderBottom: '1px solid red', color: 'red'}}
                >
                  「アプリに追加されているプラグインの設定情報を取得または更新するREST API」
                </a>
              </span>
            </>
        });
        return error;
      } else {
        console.error('APIエラー:', error);
      }
    };

    for (const { id, config } of configs) {
      await kintone.api(url, 'PUT', {
        app:    appId,
        id:     id,
        config: config,
      });
    }
    setIsLoading(false);
    setIsOpenResultModal(true);
    setFetchedPluginDatas(configs);
  }

  return (
    <>
      {/* 設定反映中に開くローディングアイコン　*/}
      {isLoading && <Loading />}

      {/* 一括反映ボタンを押した時に出る確認モーダル */}
      {isOpenConfirmModal && 
        <Confirm 
          savePlugins={savePlugins} 
          targetPlugins={targetPlugins}
          setIsOpenConfirmModal={setIsOpenConfirmModal}
        />
      }

      {/* 一括反映後の結果モーダル */}
      {isOpenResultModal && !isLoading && 
        <Result 
          fetchedPluginDatas={fetchedPluginDatas}
          setIsOpenResultModal={setIsOpenResultModal}
        />
      }

      {/* API叩いた時のエラーモーダル */}
      {isOpenAlertModal.isOpen && 
        <Alert 
          setIsOpenAlertModal={() => setIsOpenAlertModal({
            isOpen: false,
            errorMessage: <></>,
          })}
        >
          {isOpenAlertModal.errorMessage}
        </Alert>
      }

      <div className={styles.config}>
        <div className={styles.configHeader}>
          <div className={styles.inputContainer}>
            <div className={styles.inputLabel}>
              コピー元アプリ
            </div>
            <DropDown 
              apps={apps} 
              setPlugins={setPlugins}
              selectedApp={selectedApp}
              setSelectedApp={setSelectedApp}
              setOtherAppFields={setOtherAppFields}
              setIsSameFields={setIsSameFields}
            />
          </div>
          <div className={styles.configHeaderButton}>
            <CancelButton onClick={handleCancel} text="キャンセル"/>
            <SubmitButton 
              onClick={() => setIsOpenConfirmModal(true)} 
              isActive={targetPlugins.length > 0}
              text="反映" />
          </div>
        </div>

        {/* アップデートオプションが本運用に移った時点でconfigDescriptionを丸ごと削除する*/}
        <div className={styles.configDescription}>
          <p>
            プラグイン設定をコピーする前に、
            <a
            href={`${baseUrl}${KINTONE_UI_URLS.ADMIN_NEW_FEATURES}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            こちらから
          </a>
            以下の設定を有効化してください。
            <br />
             検討中の新機能　＞　APIラボ　＞　<span>「アプリに追加されているプラグインの設定情報を取得または更新するREST API」</span>  
            <br />
          </p>
        </div>

        {/* フィールドが異なる場合に表示 */}
        {!isSameFields && <DifFieldAlert />}

        <div className={styles.selectContainer}>
          {selectedApp && plugins !== null ? (
              plugins.length > 0 ? (
                <PluginList 
                  plugins={plugins} 
                  nowSettingPlugins={nowSettingPlugins}
                  setTargetPlugins={setTargetPlugins}
                  selectedApp={selectedApp}
                />
              ) : (
                <div className={styles.announceMessage}>
                  共通で利用しているプラグインが見つかりません
                </div>
              )
            ) : (
              <div className={styles.announceMessage}>
               アプリを選択したら共通で導入されているプラグインが表示されます
              </div>
            )
          }
        </div>
      </div>
    </>
  )
};
export default Config;
