/* ============ 入口 ============ */
document.addEventListener('DOMContentLoaded', () => {
  System.init();
  System.boot(() => {
    setTimeout(() => {
      System.notify('macOS Web', '欢迎回来!试试 ⌘K 聚焦搜索,或右键点击桌面。', Apps.registry.finder.icon);
    }, 800);
  });
});
