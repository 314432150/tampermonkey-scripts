// ==UserScript==
// @name         草榴社区一键迅雷下载助手(GitHub反拦截纯净版)
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  左手大拇指优化：完美绕过rmdown广告拦截机制，零延迟直达标准磁力下载
// @author       Gemini
// @match        *://*.t66y.com/htm_mob/*/*/*.html*
// @match        *://*.rmdown.com/link.php?hash=*
// @grant        none
// @run-at       document-end
//
// === GitHub 自动更新地址 ===
// @updateURL    https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/t66y-thunder.user.js
// @downloadURL  https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/t66y-thunder.user.js
// ==/UserScript==

(function () {
  "use strict";

  const currentUrl = window.location.href;

  // ================= 一级页面逻辑 (t66y) =================
  if (currentUrl.includes("t66y.com")) {
    const rmLink =
      document.getElementById("rmlink") || document.querySelector("a.sgreen");
    if (!rmLink) return;

    const downloadBtn = document.createElement("div");
    downloadBtn.innerHTML = "⚡";

    // 左手大拇指专属防误触样式（缩进35px避开系统返回手势）
    Object.assign(downloadBtn.style, {
      position: "fixed",
      left: "35px",
      bottom: "100px",
      zIndex: "99999",
      width: "52px",
      height: "52px",
      backgroundColor: "#0084ff",
      color: "#ffffff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
      transition: "transform 0.1s ease, background-color 0.1s ease",
      userSelect: "none",
      webkitUserSelect: "none",
      webkitTapHighlightColor: "transparent",
    });

    downloadBtn.addEventListener(
      "touchstart",
      () => {
        downloadBtn.style.backgroundColor = "#006edb";
        downloadBtn.style.transform = "scale(0.9)";
      },
      { passive: true },
    );

    downloadBtn.addEventListener(
      "touchend",
      () => {
        downloadBtn.style.backgroundColor = "#0084ff";
        downloadBtn.style.transform = "scale(1.0)";
      },
      { passive: true },
    );

    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (rmLink.href) {
        try {
          const targetUrl = new URL(rmLink.href);
          targetUrl.searchParams.set("auto_thunder", "1");
          window.location.href = targetUrl.href; // 当前页平滑跳转
        } catch (err) {
          window.location.href = rmLink.href;
        }
      }
    });

    document.body.appendChild(downloadBtn);
  }

  // ================= 二级页面逻辑 (rmdown) =================
  if (currentUrl.includes("rmdown.com")) {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("auto_thunder") === "1") {
      // 1. 强力防拦截：直接屏蔽流氓广告弹窗
      window.open = function () {
        console.log("油猴助手：已成功拦截流氓广告弹窗");
        return null;
      };

      // 2. 函数劫持：直接覆盖原页面的 magnet_decider，干掉 1000ms 延迟，实现标准磁力秒唤起
      window.magnet_decider = function (data, copy, cbtn) {
        if (!copy && data) {
          console.log("油猴助手：已成功抓取真实磁力，正在唤起标准磁力协议...");
          window.location.href = data; // 零延迟直接变轨到 magnet 协议
        }
      };

      // 3. 自动触发原网页的磁力请求逻辑
      const triggerClick = () => {
        const magnetBtn =
          document.querySelector('button[title="Open MAGNET link"]') ||
          document.querySelector('button[onclick*="magnet"]');
        if (magnetBtn) {
          magnetBtn.click();
        }
      };

      // 稍微给 150ms 缓冲确保原页面的 jQuery 绑定事件已就绪
      setTimeout(triggerClick, 150);
    }
  }
})();
