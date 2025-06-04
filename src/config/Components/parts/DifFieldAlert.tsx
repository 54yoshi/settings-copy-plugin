import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import styles from './DifFieldAlert.module.css';

const DifFieldAlert: React.FC = () => {
  return (
    <div className={styles.alertBox}>
      <WarningAmberIcon className={styles.icon} />
      <div className={styles.message}>
        <div>
          取得元のアプリとフィールドの構造が異なります。
          <br />
          プラグインの設定を反映できた場合でも、エラーが発生する可能性があります。
        </div>
      </div>
    </div>
  );
};

export default DifFieldAlert;
