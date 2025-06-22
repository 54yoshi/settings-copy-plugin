import styles from './PluginList.module.css';
import React, { useState, useEffect } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { PluginType, App } from '../../../type/kintoneData';

type InsertPositionSelectProps = {
  plugins: PluginType[];
  setTargetPlugins: (plugins: PluginType[]) => void;
  nowSettingPlugins: PluginType[];
  selectedApp: App | null;
};

const PluginList: React.FC<InsertPositionSelectProps> = ({
  plugins, 
  setTargetPlugins, 
  nowSettingPlugins, 
  selectedApp
}) => {

  const [selectIndex, setSelectIndex] = useState<number[]>([]);

  function handleClickRow(clickIndex: number){
    const copySelectIndex = [...selectIndex];
    const copyPlugins = [...plugins];
    if(copySelectIndex.includes(clickIndex)){
      const idx = copySelectIndex.indexOf(clickIndex);
      copySelectIndex.splice(idx, 1);
    }else{
      copySelectIndex.push(clickIndex);
    }
    setSelectIndex(copySelectIndex);
    const targetPlugins = copyPlugins.filter((_, index) => copySelectIndex.includes(index));
    setTargetPlugins(targetPlugins);
  }

  function makeSelectAll () {
    setSelectIndex(plugins.filter((plugin) => nowSettingPlugins.some(nowPlugin => nowPlugin.id === plugin.id)).map((_, index) => index));
    setTargetPlugins(plugins.filter((plugin) => nowSettingPlugins.some(nowPlugin => nowPlugin.id === plugin.id)));
  }; 

  useEffect(() => {
    setSelectIndex([]);
    setTargetPlugins([]);
  }, [selectedApp])


  return (
    <>
      <div className={styles.pluginListHeader}>
        共通で導入されているプラグイン一覧
        
        <div 
          onClick={() => {
            makeSelectAll();
          }} 
          className={styles.allSelectButton}
        >
        </div>
      </div>
      <div className={styles.pluginListContainer}>
        {nowSettingPlugins.map((item, index) => {
          const iconUrl = `${location.origin}/k/api/dev/plugin/content/downloadIcon.do` +
          `?pluginId=${item.id}&size=SMALL`;
          return (
            plugins.some(plugin => plugin.id.includes(item.id)) && (
              <div 
                className={styles.itemContainer} 
                key={`plugin-${index}`}
                onClick={() => {
                  handleClickRow(index);
                }}
              >
                <div className={styles.listItem}>
                  <div className={styles.iconBox}>
                    <img className={styles.iconImage} src={iconUrl} alt='プラグインのアイコン画像'/>
                  </div>
                  <div className={styles.pluginName}>{item.name}</div>
                  {
                    <div className={styles.checkCircleBox}>
                      {selectIndex.includes(index) ? (
                        <CheckCircleRoundedIcon className={styles.checkedCircle}/>
                      ) : (
                        <RadioButtonUncheckedRoundedIcon className={styles.checkCircle}/>
                      )}
                    </div>
                  }
                </div>
              </div>
            )
          )
        })}
      </div>
    </>
  )
}

export default PluginList;