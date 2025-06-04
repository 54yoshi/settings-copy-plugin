import React from 'react';
import styles from './Loading.module.css';

type LoadingProps = {
  text?: string;
};

const Loading: React.FC<LoadingProps> = ({ text = '設定反映中…' }) => (
  <div className={styles.overlay}>
    <div className={styles.spinner} />
    <div className={styles.text}>{text}</div>
  </div>
);

export default Loading;