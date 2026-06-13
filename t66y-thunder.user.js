// ==UserScript==
// @name         草榴社区一键迅雷下载助手(GitHub反拦截纯净版)
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  左手大拇指优化：完美绕过rmdown广告拦截机制，零延迟直达标准磁力下载
// @author       Gemini
// @match        *://*.t66y.com/htm_mob/*/*/*.html*
// @match        *://*.rmdown.com/link.php?hash=*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/t66y-thunder.user.js
// @downloadURL  https://raw.githubusercontent.com/314432150/tampermonkey-scripts/main/t66y-thunder.user.js
// ==/UserScript==

(function () {
  "use strict";

  const currentUrl = window.location.href;
  const isAndroid = /Android/i.test(navigator.userAgent);

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn("油猴助手：Clipboard API 复制失败，尝试降级复制", err);
    }

    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.left = "-9999px";
    input.style.top = "-9999px";
    document.body.appendChild(input);
    input.focus();
    input.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      console.warn("油猴助手：降级复制失败", err);
    }

    input.remove();
    return ok;
  };

  const showAndroidMagnetBar = (magnetUrl) => {
    const oldBar = document.getElementById("tm-xunlei-magnet-bar");
    if (oldBar) oldBar.remove();

    if (!document.getElementById("tm-xunlei-magnet-style")) {
      const style = document.createElement("style");
      style.id = "tm-xunlei-magnet-style";
      style.textContent = `
        #tm-xunlei-magnet-bar {
          position: fixed;
          left: 12px;
          right: 12px;
          bottom: 24px;
          z-index: 999999;
          display: grid;
          grid-template-columns: 1fr 96px 72px;
          gap: 8px;
          align-items: center;
          padding: 10px;
          background: rgba(20, 20, 24, 0.96);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 8px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.38);
          font-size: 15px;
        }
        #tm-xunlei-magnet-bar .tm-xunlei-title {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        #tm-xunlei-magnet-bar button {
          height: 38px;
          border: 0;
          border-radius: 6px;
          background: #1677ff;
          color: #fff;
          font-size: 15px;
        }
        #tm-xunlei-magnet-bar button[data-action="copy"] {
          background: #444b55;
        }
      `;
      document.head.appendChild(style);
    }

    const bar = document.createElement("div");
    bar.id = "tm-xunlei-magnet-bar";
    bar.innerHTML = `
      <div class="tm-xunlei-title">已获取磁力链接</div>
      <button type="button" data-action="open">打开迅雷</button>
      <button type="button" data-action="copy">复制</button>
    `;

    bar.addEventListener("click", async (e) => {
      const action = e.target && e.target.dataset && e.target.dataset.action;
      if (action === "open") {
        window.location.href = magnetUrl;
      }
      if (action === "copy") {
        const ok = await copyText(magnetUrl);
        e.target.textContent = ok ? "已复制" : "复制失败";
      }
    });

    document.body.appendChild(bar);
    copyText(magnetUrl);
  };

  const openMagnet = (magnetUrl) => {
    if (!magnetUrl) return;

    if (isAndroid && /^magnet:/i.test(magnetUrl)) {
      showAndroidMagnetBar(magnetUrl);
      return;
    }

    window.location.href = magnetUrl;
  };

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
          openMagnet(data); // Android 定向唤起迅雷，其他平台使用标准 magnet 协议
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
