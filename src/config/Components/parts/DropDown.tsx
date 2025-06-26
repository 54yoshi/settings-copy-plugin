import React ,{ useState, useEffect, useRef, useMemo, Dispatch, SetStateAction } from 'react';
import styles from './DropDown.module.css';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { App, Field, PluginType } from '../../../type/kintoneData';
import { KINTONE_REST } from '../../constants/endpoint';

type InsertPositionSelectProps = {
  apps: App[] | null;
  setPlugins: Dispatch<SetStateAction<{id: string; name: string, enabled: boolean}[] | null>>;
  selectedApp: App | null;
  setSelectedApp: Dispatch<SetStateAction<App | null>>;
  setOtherAppFields: Dispatch<SetStateAction<{[key: string]: Field;} | null>>;
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
  // const [regex, setRegex] = useState<RegExp | null>(null);
  // const [isInclude, setIsInclude] = useState<boolean>(false);
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
    const url  = kintone.api.url(KINTONE_REST.LIST_PLUGINS_PREVIEW, true);
    kintone.api(url, 'GET', body).then(resp => {
      const targetPlugins = resp.plugins.filter((plugin: PluginType) => plugin.id !== pluginId);
      setPlugins(targetPlugins);
    })
  }, [selectedApp]);


  const regex = useMemo(() => {
    if(inputValue === ''){
      return null;
    }
    return new RegExp('^' + escapeRegExp(inputValue), 'i');
  }, [inputValue]);

  const isInclude = useMemo(() => {
    if(regex === null || !apps){
      return false;
    }
    return apps.filter(app => regex.test(app.name)).length  > 0;
  }, [inputValue, regex, apps]);

  function getOtherAppFields(appId: string) {
    const body = { app: appId };
    const url  = kintone.api.url(KINTONE_REST.GET_FORM_FIELDS, true);
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
          { apps?.length === 0 || (regex !== null && !isInclude)? (
            <div className={styles.app}>
              該当アプリなし
            </div>
          ) 
          : 
          (
            apps?.map((app, index) => 
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
