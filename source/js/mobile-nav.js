(function () {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 1023px) {
            header.lg\\:hidden { position: sticky; overflow: visible; }
            .mobile-menu-button {
                display: inline-flex; align-items: center; gap: 5px;
                min-width: 56px; min-height: 36px; justify-content: center;
                color: inherit;
            }
            .mobile-menu-button span { font-size: 13px; line-height: 1; }
            .mobile-nav {
                position: absolute; top: 100%; left: 0; right: 0;
                height: auto !important; max-height: calc(100vh - 68px);
                overflow-y: auto; border-top: 1px solid rgba(0, 0, 0, .07);
                box-shadow: 0 16px 30px rgba(0, 0, 0, .1);
            }
            .dark .mobile-nav { border-top-color: rgba(255, 255, 255, .08); }
            .mobile-nav ul {
                display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px; padding: 14px 16px 18px;
            }
            .mobile-nav li { margin: 0 !important; }
            .mobile-nav a {
                padding: 12px 10px; border: 1px solid rgba(0, 0, 0, .07);
                background: rgba(249, 250, 251, .86);
            }
            .dark .mobile-nav a {
                border-color: rgba(255, 255, 255, .08);
                background: rgba(38, 38, 38, .9);
            }
        }
    `;
    document.head.appendChild(style);

    function enhanceMobileControls() {
        document.querySelectorAll('button[onclick="toggleNav()"], [data-mobile-menu]').forEach(function (button) {
            button.classList.add('mobile-menu-button');
            button.dataset.mobileMenu = '';
            button.title = '打开导航菜单';
            button.setAttribute('aria-label', '打开导航菜单');
            button.setAttribute('aria-expanded', 'false');
            if (!button.querySelector('span')) {
                button.insertAdjacentHTML('beforeend', '<span>菜单</span>');
            }
        });
    }

    window.toggleNav = function () {
        const nav = document.getElementById('mobileNav');
        if (!nav) return;
        const opening = nav.style.display === 'none' || getComputedStyle(nav).display === 'none';
        nav.style.display = opening ? 'block' : 'none';
        document.querySelectorAll('[data-mobile-menu]').forEach(function (button) {
            button.setAttribute('aria-expanded', String(opening));
            button.title = opening ? '关闭导航菜单' : '打开导航菜单';
            button.setAttribute('aria-label', button.title);
        });
    };

    window.toggleSearch = function () {
        const search = document.getElementById('search');
        if (!search) return;
        search.style.display = search.style.display === 'none' || getComputedStyle(search).display === 'none' ? 'flex' : 'none';
    };

    window.enhanceMobileControls = enhanceMobileControls;
    document.addEventListener('DOMContentLoaded', function () {
        enhanceMobileControls();
        document.addEventListener('click', function (event) {
            if (event.target.closest('#mobileNav a')) {
                const nav = document.getElementById('mobileNav');
                if (nav) nav.style.display = 'none';
            }
        });
    });
})();
