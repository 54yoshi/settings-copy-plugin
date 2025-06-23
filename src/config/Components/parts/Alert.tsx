import React from 'react';
import SubmitButton from './SubmitButton';

type Props = {
  setIsOpenAlertModal: () => void;
  children: React.ReactNode;
}

const baseUrl = location.origin;

const Alert: React.FC<Props> = ({ 
  setIsOpenAlertModal,
  children,
}) => {

  return(
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '1000',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '680px',
          height: '360px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div 
          style={{
            fontSize: '24px', 
            width: '100%',
            height: '80px',
            padding: '0 32px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          注意
        </div>
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: '200px',
            padding: '32px',
            backgroundColor: '#F7F9FA',
            color: 'red',
            gap: '16px',
          }}
        >
          {/* データのコピーに失敗しました。<br/>
          プラグインをコピーする前に以下の項目が有効になっているか確認してください。<br/>
          <span>
            検討中の新機能　＞　APIラボ　＞　<br/>
            <a
            href={`${baseUrl}/k/admin/system/newfeature/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{borderBottom: '1px solid red', color: 'red'}}
            >
              「アプリに追加されているプラグインの設定情報を取得または更新するREST API」
            </a>
          </span> */}
          {children}
        </div>
        <div 
          style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '80px',
              padding: '0 32px',
              gap: '24px',
        }}>
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