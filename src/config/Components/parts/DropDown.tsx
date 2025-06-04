import React ,{ useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import styles from './DropDown.module.css';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

type InsertPositionSelectProps = {
  apps: any[];
  setPlugins: Dispatch<SetStateAction<any[] | null>>;
  selectedApp: any;
  setSelectedApp: Dispatch<SetStateAction<any>>;
  setOtherAppFields: Dispatch<SetStateAction<any[] | null>>;
  setIsSameFields: Dispatch<SetStateAction<boolean>>;
};

const nowAppId: number | null = kintone.app.getId();
const pluginId = kintone.$PLUGIN_ID;

const DropDown: React.FC<InsertPositionSelectProps> = ({
  apps,
  setPlugins,
  selectedApp,
  setSelectedApp,
  setOtherAppFields,
  setIsSameFields,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [regex, setRegex] = useState<RegExp | null>(null);
  const [isInclude, setIsInclude] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(!selectedApp){
      return;
    }
    const body = { app: selectedApp.appId };
    const url  = kintone.api.url('/k/v1/preview/app/plugins.json', true);
    kintone.api(url, 'GET', body).then(resp => {
      const targetPlugins = resp.plugins.filter((plugin: any) => plugin.id !== pluginId);
      setPlugins(targetPlugins);
    })
  }, [selectedApp]);

  useEffect(() => {
    if(inputValue === ''){
      setRegex(null);
      setIsInclude(false);
      return;
    }
    const regex = new RegExp('^' + escapeRegExp(inputValue), 'i');
    setRegex(regex);
    setIsInclude(apps.filter(app => regex.test(app.name)).length > 0);
  }, [inputValue]);

  function getOtherAppFields(appId: number) {
    const body = { app: appId };
    const url  = kintone.api.url('/k/v1/app/form/fields.json', true);
    kintone.api(url, 'GET', body).then(resp => {
      setOtherAppFields(resp.properties);
    })
  }

  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  return (
    <div 
      className={styles.insertPosition}
      ref={dropdownRef}
    >
      {/* <div>
        <span className={style.insertPositionLabel}>{font}</span>
        <span style={{
          color: 'red',
          padding: '0 4px',
        }}>
          *
        </span>
      </div> */}
      <div className={styles.container}>
        <input
          type="text"
          className={`${styles.insertPositionDropdown} ${(!isFocus  && selectedApp) && styles.placeholderColor}`}
          placeholder={!isFocus ? (!selectedApp ? 'アプリ名で検索' : selectedApp.name) : ''}
          onClick={() => {
            setIsOpen(true);
          }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onFocus={() => {
            if(!selectedApp){
              return;
            }
            setIsFocus(true);
            const name = selectedApp.name;
            setInputValue(name);
          }}
          onBlur={() => {
            setIsFocus(false);
            setInputValue('');
          }}
        />
        <div className={styles.cancelIconDiv}>
          {selectedApp && 
            <CancelIcon 
              className={styles.cancelIcon}
              onClick={() => {
                setInputValue('');
                setSelectedApp(null);
                setPlugins(null);
                setIsOpen(false);
                setOtherAppFields(null);
                setIsSameFields(true);
              }}
            />
          }
        </div>
      </div>
      {isOpen ? (
        <div className={styles.selectList}>
          { apps.length === 0 || (regex !== null && !isInclude)? (
            <div className={styles.app}>
              該当アプリなし
            </div>
          ) 
          : 
          (
            apps.map((app, index) => 
              (app.appId !== String(nowAppId) && (regex?.test(app.name) || !inputValue || selectedApp?.name.length === inputValue.length)) && (
                <div 
                  className={`${styles.appItem} ${app === selectedApp && styles.selected}`}
                  key={`アプリ-${index}`}
                  onMouseDown={() => {
                    setSelectedApp(app);
                    setIsOpen(false);
                    getOtherAppFields(app.appId);
                  }} 
                >
                  {app === selectedApp && <CheckIcon style={{fontSize: '13px'}}/>}
                  {app.name.length > 18 ? app.name.substring(0, 18) + '...' : app.name}
                </div>
              )
            )
          )}
        </div>
        ) : null}
    </div>
  );
};

export default DropDown;
