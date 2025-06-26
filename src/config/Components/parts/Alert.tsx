import React from 'react';
import SubmitButton from './SubmitButton';
import styles from './Alert.module.css';

type Props = {
  setIsOpenAlertModal: () => void;
  children: React.ReactNode;
}

const Alert: React.FC<Props> = ({ 
  setIsOpenAlertModal,
  children,
}) => {

  return(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          注意
        </div>
        <div className={styles.body}>
          {/* データのコピーに失敗しました。<br/>
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
          </span> */}
          {children}
        </div>
        <div className={styles.footer}>
          <SubmitButton 
            onClick={() => setIsOpenAlertModal()}
            text='閉じる'
            color='red'
            borderColor='#E6EAEA'
          />
        </div>
      </div>
    </div>
  )
};

export default Alert;