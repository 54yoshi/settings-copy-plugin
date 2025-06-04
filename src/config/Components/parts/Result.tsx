import React, { Dispatch, SetStateAction } from "react";
import styles from "./Result.module.css";
import SubmitButton from "./SubmitButton";

type Props = {
  fetchedPluginDatas: any[];
  setIsOpenResultModal: Dispatch<SetStateAction<boolean>>;
};

const Result: React.FC<Props> = ({fetchedPluginDatas, setIsOpenResultModal}) => {

  function testObjectContent(objs: {id: string, config: any, name: string}[]) {
    const emptyConfigObj = objs.filter((obj) => Object.keys(obj.config).length === 0);
    return emptyConfigObj;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>反映結果</div>
        </div>
        {
            testObjectContent(fetchedPluginDatas).length === 0 ? (
              <div className={styles.success}>全てのプラグインの反映に成功しました。</div>
            )
            :
            (
            <div className={styles.failed}>
              <div className={styles.section}>
                以下のプラグインは
                <br />
                設定内容が空か、設定方法が特殊なため反映に失敗しました。
                <br />
                設定が必要な場合は手動で設定を行ってください。
              </div>
              <div className={styles.subTitle}>反映に失敗したプラグイン</div>
              <div className={styles.listContainer}>
                {
                  testObjectContent(fetchedPluginDatas).map((plugin) => {
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
            )
          }
        <div className={styles.footer}>
          <SubmitButton onClick={() => setIsOpenResultModal(false)} text="閉じる" />
        </div>
      </div>
    </div>
  );
};

export default Result;