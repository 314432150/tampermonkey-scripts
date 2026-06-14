// ==UserScript==
// @name         自动点击“我已认真阅读”按钮
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用正则完全修复域名匹配问题，支持从 GitHub 自动更新
// @author       YourName
// @include      /^https?:\/\/.*beibei.*\/dashboard/
// @updateURL    https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/auto-click-beibei.user.js
// @downloadURL  https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/auto-click-beibei.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  function clickTargetButton() {
    const buttons = document.querySelectorAll('button[aria-label="close"]');

    for (const button of buttons) {
      if (button.textContent.trim() === "我已认真阅读") {
        button.click();
        console.log(
          "%c[油猴脚本] 成功自动点击“我已认真阅读”按钮！",
          "color: #10b981; font-weight: bold;",
        );
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
    subtree: true,
  });
})();
