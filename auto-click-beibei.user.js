// ==UserScript==
// @name         贝贝云自动点击“我已认真阅读”按钮
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  通过全网页匹配+代码内正则过滤，完美兼容 222.2beibei.com / 999.beibeicloud.shop 等任何奇葩域名
// @author       Fishme
// @match        *://*/*dashboard*
// @updateURL    https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/auto-click-beibei.user.js
// @downloadURL  https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/auto-click-beibei.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 【核心防御】用标准 JS 正则检查当前网址是否包含 "beibei"
    // window.location.hostname 获取的是纯域名（例如 "222.2beibei.com" 或 "999.beibeicloud.shop"）
    if (!/beibei/.test(window.location.hostname)) {
        return; // 如果域名里不包含 beibei，直接退出，什么都不做
    }

    // 只有域名包含 beibei 才会执行下面的点击逻辑
    function clickTargetButton() {
        const buttons = document.querySelectorAll('button[aria-label="close"]');
        
        for (const button of buttons) {
            if (button.textContent.trim() === '我已认真阅读') {
                button.click();
                console.log('%c[油猴脚本] 成功自动点击“我已认真阅读”按钮！', 'color: #10b981; font-weight: bold;');
                break; 
            }
        }
    }

    clickTargetButton();

    const observer = new MutationObserver(() => {
        clickTargetButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();