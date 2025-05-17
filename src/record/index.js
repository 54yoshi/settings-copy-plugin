(function() {
  'use strict';

  const PLUGIN_ID = kintone.$PLUGIN_ID;
  const rawConfig = kintone.plugin.app.getConfig(PLUGIN_ID);
  const appId = kintone.app.getId();
  const baseUrl = location.origin;


  let pluginConfig;
  if(rawConfig){
    pluginConfig = {
      tabSettings:  JSON.parse(rawConfig.tabSettings),
      editFormData: JSON.parse(rawConfig.editFormData),
    };
  }

  //   if(pluginConfig.editFormData || Array.isArray(pluginConfig.editFormData.layout)){
  //     pluginConfig.editFormData.layout.forEach(row => {
  //       if (!row.memberTabs.includes(row.id)) {
  //         row.memberTabs.push(row.id);
  //       }
  //       delete row.id;
  //     });
  //   }
  // } 

  kintone.events.on([
    'app.record.detail.show', 
    'app.record.edit.show',
    'app.record.create.show',
  ], async function() {
    if(!pluginConfig){
      return;
    }
    
    const {editFormData, tabSettings} = pluginConfig;
    const {backgroundColor, fontColor, spaceField, tabs} = tabSettings;

    const spaceFieldElement = kintone.app.record.getSpaceElement(tabSettings.spaceField);
    if(!spaceFieldElement){
      showBanner('タブプラグインで設定されていたスペースフィールドが見つかりません。');
      return;
    }

    //DOM要素を取得
    const rowNodes = Array.from(
      document.querySelectorAll(
        '#record-gaia .layout-gaia > .row-gaia, ' +
        '#record-gaia .layout-gaia > .subtable-row-gaia'
      )
    );

    //現在ログインしているユーザーの権限周りの情報
    
    // const user = kintone.getLoginUser();

    // // let rights, groups, organizationTitles, creator;
    // // try{
    // const { rights } = await kintone.api(
    //     kintone.api.url('/k/v1/app/acl.json', true),
    //     'GET',
    //     { app: appId }
    //   );

    // const { groups } = await kintone.api(
    //   kintone.api.url('/v1/user/groups.json', true),
    //   'GET',
    //   { code: user.code }
    // );

    // const { organizationTitles } = await kintone.api(
    //   kintone.api.url('/v1/user/organizations.json', true),
    //   'GET',
    //   { code: user.code }
    // );

    // const { creator } = await kintone.api(
    //   kintone.api.url('/k/v1/app.json', true),
    //   'GET',
    //     { id: kintone.app.getId() }
    //   );
    

    // 4. ACL の中から「現在のユーザーに当てはまるサブジェクト」を探す
    // const userRight = rights.find(r => {
    //   switch (r.entity.type) {
    //     case 'USER':
    //       return r.entity.code === user.code;

    //     case 'GROUP':
    //       return groups.some(g => g.code === r.entity.code);

    //     case 'ORGANIZATION':
    //       return organizationTitles.some(o => o.organization.code === r.entity.code);

    //     case 'CREATOR':
    //       return creator.code === user.code;

    //     default:
    //       return false;
    //   }
    // });

    const formLayout = await kintone.api(kintone.api.url('/k/v1/app/form/layout.json', true), 'GET', {app: appId})


    let targetIndex = 0;
    for (let i = 0; i < formLayout.layout.length; i++) {
      const item = formLayout.layout[i];
      switch(item.type){
        case 'GROUP':
          for (let j = 0; j < item.layout.length; j++) {
            const row = item.layout[j];
            for (let k = 0; k < row.fields.length; k++) {
              const field = row.fields[k];
              if(field?.elementId === spaceField) {
                targetIndex = i;
                break;
              }
            }
          }
          break;
        default:
          for(let k = 0; k < item.fields.length; k++) {
            const field = item.fields[k];
            if(field?.elementId === spaceField) {
              targetIndex = i;
              break;
            }
          }
      }
    }

    const lowerLayout = {
      layout: formLayout.layout.slice(targetIndex + 1)
    }

    const lowerRowNodes = rowNodes.slice(targetIndex + 1);

    // function extractFieldCodes(obj) {
    //   const reOneOf = /^(?:SPACER|LABEL|HR)/;
    //   if (Array.isArray(obj.fields)) {
    //     return obj.fields.map(f => (f.code != null && !reOneOf.test(f.code) ? f.code : ''));
    //   }
    //   if (Array.isArray(obj.layout)) {
    //     return obj.layout.flatMap(child => extractFieldCodes(child));
    //   }
    //   return [];
    // }

    // function diffFields(objA, objB) {
    //   const codesA = extractFieldCodes(objA);
    //   const codesB = extractFieldCodes(objB);
    //   return (
    //     codesA.length !== codesB.length ||
    //     codesA.some((code, index) => code !== codesB[index])
    //   );
    // }

    // const isDiff = diffFields(editFormData, lowerLayout);
    // if(!userRight?.editApp && isDiff){
    //   showBanner('タブプラグインの設定を更新してください。');
    // }

    console.log(lowerRowNodes,'lowerRowNodes');
    console.log(tabs,'tabs');

    const parentDiv = document.createElement('div');
    parentDiv.classList.add('parentDiv');
    parentDiv.style.borderBottom = `2px solid ${tabSettings.backgroundColor}`;

    tabs.forEach((tab, index) => {
      const tabDiv = document.createElement('div');
      tabDiv.classList.add('tab');

      parentDiv.appendChild(tabDiv);
      tabDiv.textContent = tab.tabName === '' ? `タブ${index + 1}` : tab.tabName;

      if(index === 0){
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;
      }

      tabDiv.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((tabElement) => {
          tabElement.style.backgroundColor ='rgb(229, 229, 229)';
          tabElement.style.color = '#8d8d8d';
          tabElement.style.border = '2px solid #e3e2e2';
        })
        tabDiv.style.backgroundColor = backgroundColor;
        tabDiv.style.color = fontColor;
        tabDiv.style.border = `2px solid ${tabSettings.backgroundColor}`;

        lowerRowNodes.forEach((rowDom, domIndex) => {
          rowDom.style.display = 'none';
          if(tab.startRowIndex <= domIndex && domIndex < tabs[index + 1]?.startRowIndex ||
            tab.startRowIndex <= domIndex && tabs[index + 1] === undefined
          ){
            rowDom.style.display = '';
          }
        })

        // editFormData.layout.forEach((row, index) => {
        //   const isContainTabId = row.memberTabs.includes(tab.tabId);
        //   //削除によりdomのlengthが減っている場合は早期return
        //   if(!lowerRowNodes[index]){
        //     return;
        //   }
        //   switch(row.type){
        //     case 'GROUP':
        //       if(isContainTabId){
        //         row.layout.forEach((row) => {
        //           const isValidContainer = valiedFieldContent(row);
        //           switch(isValidContainer){
        //             case true:
        //               lowerRowNodes[index].style.display = '';
        //               break;
        //             case false:
        //               row.fields.forEach((field) => {
        //                 kintone.app.record.setFieldShown(field.code, true);
        //               })
        //               break;
        //           }
        //         })
        //         kintone.app.record.setFieldShown(row.code, true);
        //       } else {
        //         row.layout.forEach((row) => {
        //           const isValidContainer = valiedFieldContent(row);
        //           switch(isValidContainer){
        //             case true:
        //             lowerRowNodes[index].style.display = 'none';
        //               break;
        //             case false:
        //               row.fields.forEach((field) => {
        //                 kintone.app.record.setFieldShown(field.code, false);
        //               })
        //               break;
        //           }
        //         })
        //         kintone.app.record.setFieldShown(row.code, false);
        //     }
        //       break;
        //     default:
        //       const isValidContainer  = valiedFieldContent(row);
        //       if(isContainTabId){
        //         switch(isValidContainer){
        //           case true:
        //             lowerRowNodes[index].style.display = '';
        //             break;
        //           case false:
        //             row.fields.forEach((field) => {
        //               kintone.app.record.setFieldShown(field.code, true);
        //             })
        //             if(row.type === 'SUBTABLE'){
        //               kintone.app.record.setFieldShown(row.code, true);
        //             }
        //           break;
        //         }
        //       } else {
        //         switch(isValidContainer){
        //           case true:
        //             lowerRowNodes[index].style.display = 'none';
        //             break;
        //           case false:
        //             row.fields.forEach((field) => {
        //               kintone.app.record.setFieldShown(field.code, false);
        //             })
        //             if(row.type === 'SUBTABLE'){
        //                 kintone.app.record.setFieldShown(row.code, false);
        //             }
        //           break;
        //         }
        //       }
        //   }
        // })
      })

      lowerRowNodes.forEach((row, index) => {
        row.style.display = 'none';
        if(0 <= index && index < tabs[1]?.startRowIndex ||
          0 <= index && tabs[1] === undefined
        ){
          row.style.display = '';
        }
      })

      // editFormData.layout.forEach((row, index) => {
      //   if(!lowerRowNodes[index]){
      //     return;
      //   }
      //   switch(row.type){
      //     case 'GROUP':
      //       if(row.memberTabs.some((memberId) => memberId === 1)){
      //         row.layout.forEach((row) => {
      //           const isValidContainer = valiedFieldContent(row);
      //           switch(isValidContainer){
      //             case true:
      //               lowerRowNodes[index].style.display = '';
      //               break;
      //             case false:
      //             row.fields.forEach((field) => {
      //               kintone.app.record.setFieldShown(field.code, true);
      //             })
      //             break;
      //           }
      //         })
      //         kintone.app.record.setFieldShown(row.code, true);
      //       } else {
      //         row.layout.forEach((row) => {
      //           const isValidContainer = valiedFieldContent(row);
      //           switch(isValidContainer){
      //             case true:
      //               lowerRowNodes[index].style.display = 'none';
      //               break;
      //             case false:
      //               row.fields.forEach((field) => {
      //                 kintone.app.record.setFieldShown(field.code, false);
      //               })
      //               break;
      //           }
      //         })
      //         kintone.app.record.setFieldShown(row.code, false);
      //       }
      //     break;
      //     default:
      //       const isValidContainer = valiedFieldContent(row);
      //       if(row.memberTabs.includes(1)){
      //         switch(isValidContainer){
      //           case true:
      //             lowerRowNodes[index].style.display = '';
      //             break;
      //           case false:
      //             row.fields.forEach((field) => {
      //               kintone.app.record.setFieldShown(field.code, true);
      //             })
      //             if(row.type === 'SUBTABLE'){
      //               kintone.app.record.setFieldShown(row.code, true);
      //             }
      //             break;
      //         }
      //       } else {
      //         switch(isValidContainer){
      //           case true:
      //             lowerRowNodes[index].style.display = 'none';
      //             break;
      //           case false:
      //             row.fields.forEach((field) => {
      //               kintone.app.record.setFieldShown(field.code, false);
      //             })
      //             if(row.type === 'SUBTABLE'){
      //                   kintone.app.record.setFieldShown(row.code, false);
      //             }
      //             break;
      //         }
      //       }
      //     }
      // })
    })
    spaceFieldElement.appendChild(parentDiv);

    // function valiedFieldContent(row){
    //   return row.fields.some(field => field.type === 'SPACER' || field.type === 'LABEL' || field.type === 'HR');
    // }

    function showBanner(message) {
      // バナー要素を作成
      const banner = document.createElement('div');
      banner.className = 'custom-alert-banner';
      // 設定画面へのリンク URL
      const pluginUrl = 
      baseUrl +
      `/k/admin/app/${appId}/plugin/`+
      `config?pluginId=${PLUGIN_ID}`;
      // バナーの中身をセット
      banner.innerHTML = message +
      '<a href="' + pluginUrl + '"" ' +
        'style="margin-left:8px;color:#fff;text-decoration:underline;">' +
        '設定画面を開く' +
      '</a>';
      
      // レコード画面のヘッダースペースに差し込む
      const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
      if (headerSpace) {
        headerSpace.appendChild(banner);
      } else {
        document.body.appendChild(banner);
      }
      // アニメーション用クラスを遅延追加
      setTimeout(() => {
        banner.classList.add('show');
      }, 20);
    }

    return;
  });
})();
