// ==========================================
// 等待DOM載入完成
// ==========================================
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 手機版選單開關
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // 切換選單顯示狀態
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ==========================================
    // 手機版下拉選單處理
    // ==========================================
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    // 檢測是否為手機/平板裝置
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    dropdownItems.forEach(function(item) {
        const link = item.querySelector('.nav-link');

        if (link) {
            link.addEventListener('click', function(e) {
                // 在手機版時，點擊選單項目時展開下拉選單
                if (isMobileDevice()) {
                    // 如果菜單已經展開，則允許跳转（不阻止默認行為）
                    // 如果菜單未展開，則展開菜單（阻止跳转）
                    if (!item.classList.contains('active')) {
                        e.preventDefault();

                        // 關閉其他已展開的下拉選單
                        dropdownItems.forEach(function(otherItem) {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });

                        // 展開當前下拉選單
                        item.classList.add('active');
                    }
                    // 如果已經是active狀態，不阻止默認行為，允許跳转
                }
                // 桌面版不阻止默認行為，允許直接跳转
            });
        }

        // 為下拉選單中的子項添加事件處理，阻止事件冒泡
        const dropdownLinks = item.querySelectorAll('.dropdown-menu a, .dropdown-submenu-list a');
        dropdownLinks.forEach(function(dropdownLink) {
            dropdownLink.addEventListener('click', function(e) {
                // 阻止事件冒泡到父元素，確保直接跳轉到子項的連結
                e.stopPropagation();
                // 不阻止默認行為，允許正常跳轉
            });
        });
    });

    // ==========================================
    // 手機版子選單處理
    // ==========================================
    const dropdownSubmenus = document.querySelectorAll('.dropdown-submenu');

    dropdownSubmenus.forEach(function(submenu) {
        // 只选择直接子元素的 a 标签，避免选到嵌套子选单中的 a
        const link = submenu.querySelector(':scope > a');

        if (link) {
            link.addEventListener('click', function(e) {
                // 在手機版時，點擊子選單項目時展開下一級選單
                if (isMobileDevice()) {
                    // 检查是否有直接子元素的子选单列表
                    const submenuList = submenu.querySelector(':scope > .dropdown-submenu-list');
                    if (submenuList) {
                        // 计算点击位置相对于链接元素的位置
                        const linkRect = link.getBoundingClientRect();
                        const clickX = e.clientX - linkRect.left;
                        const linkWidth = linkRect.width;

                        // 定义箭头区域：最右边50px（或链接宽度的20%，取较小值）
                        const arrowZoneWidth = Math.min(50, linkWidth * 0.2);
                        const isClickOnArrow = clickX > (linkWidth - arrowZoneWidth);

                        // 調試信息
                        console.log('點擊選單:', link.textContent.trim(), '點擊位置:', clickX, '/', linkWidth, '是否點擊箭頭:', isClickOnArrow);

                        if (isClickOnArrow) {
                            // 如果點擊箭頭區域，則展開/收起子選單
                            e.preventDefault();
                            e.stopPropagation();

                            // 檢查當前選單是否已展開
                            const isActive = submenu.classList.contains('active');

                            if (isActive) {
                                // 如果已展開，只收起它自己
                                console.log('收起選單:', link.textContent.trim());
                                submenu.classList.remove('active');
                                // 同时递归收起所有子选单
                                const nestedSubmenus = submenu.querySelectorAll('.dropdown-submenu');
                                nestedSubmenus.forEach(function(nested) {
                                    nested.classList.remove('active');
                                });
                            } else {
                                console.log('展開選單:', link.textContent.trim());
                                // 如果未展開，先關閉同級的其他子選單，再展開自己
                                const parentList = submenu.parentElement;
                                if (parentList) {
                                    const siblings = parentList.querySelectorAll(':scope > .dropdown-submenu');
                                    siblings.forEach(function(sibling) {
                                        if (sibling !== submenu) {
                                            sibling.classList.remove('active');
                                            // 同时递归收起兄弟选单的所有子选单
                                            const nestedSubmenus = sibling.querySelectorAll('.dropdown-submenu');
                                            nestedSubmenus.forEach(function(nested) {
                                                nested.classList.remove('active');
                                            });
                                        }
                                    });
                                }
                                // 展開當前選單
                                submenu.classList.add('active');
                            }
                        } else {
                            // 如果點擊文字區域，允許正常跳轉
                            console.log('允許跳轉:', link.textContent.trim());
                            // 不阻止默認行為，允許跳轉
                        }
                    }
                    // 如果沒有子選單，則允許正常跳轉
                }
                // 桌面版允許正常跳轉或顯示子選單
            });
        }
    });

    // ==========================================
    // 點擊頁面其他地方時關閉選單
    // ==========================================
    document.addEventListener('click', function(e) {
        // 如果點擊的不是選單區域，則關閉選單
        if (!e.target.closest('.navbar')) {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }

            // 同時關閉所有下拉選單
            dropdownItems.forEach(function(item) {
                item.classList.remove('active');
            });

            // 關閉所有子選單
            dropdownSubmenus.forEach(function(submenu) {
                submenu.classList.remove('active');
            });
        }
    });

    // ==========================================
    // 視窗大小改變時重置選單狀態
    // ==========================================
    window.addEventListener('resize', function() {
        // 當螢幕變大時，重置手機版選單狀態
        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
            dropdownItems.forEach(function(item) {
                item.classList.remove('active');
            });
            dropdownSubmenus.forEach(function(submenu) {
                submenu.classList.remove('active');
            });
        }
    });

    // ==========================================
    // 平滑滾動增強 (可選)
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // 確保不是 # 本身
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // 關閉手機版選單
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            }
        });
    });

    // ==========================================
    // 控制台訊息 (可選 - 用於除錯)
    // ==========================================
    console.log('網站已成功載入！');
    console.log('當前裝置寬度：' + window.innerWidth + 'px');
    console.log('是否為手機裝置：' + isMobileDevice());
});
