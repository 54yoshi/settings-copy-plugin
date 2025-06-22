import React from "react";
import { Dispatch, SetStateAction } from "react";
import styles from "./Confirm.module.css";
import CancelButton from "./CancelButton";
import SubmitButton from "./SubmitButton";
import { PluginType } from "../../../type/kintoneData";

type Props = {
  savePlugins: () => void;
  targetPlugins: PluginType[];
  setIsOpenConfirmModal: Dispatch<SetStateAction<boolean>>;
};

const Confirm: React.FC<Props> = ({savePlugins, targetPlugins, setIsOpenConfirmModal}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>確認</div>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            以下のプラグイン設定をこのアプリのプラグインに反映します。
          </div>
          <div className={styles.subTitle}>選択されたプラグイン</div>
          <div className={styles.listContainer}>
            {
              targetPlugins.map((plugin) => {
                const iconUrl = `${location.origin}/k/api/dev/plugin/content/downloadIcon.do` +
                `?pluginId=${plugin.id}&size=SMALL`;
                return (
                  <div className={styles.plugin}>
                    <img src={iconUrl} alt='プラグインのアイコン画像' className={styles.iconImage} />
                    <div className={styles.pluginName}>{plugin.name}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className={styles.footer}>
          <CancelButton onClick={() => setIsOpenConfirmModal(false)} text="キャンセル" />
          <SubmitButton onClick={() => {
            savePlugins();
            setIsOpenConfirmModal(false);
          }} text="反映"/>
        </div>
      </div>
    </div>
  );
};

export default Confirm;