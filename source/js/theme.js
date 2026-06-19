(function () {
    const storageKey = 'site-theme';

    function getSavedTheme() {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === 'dark' || saved === 'light') return saved;
        return window.localStorage.getItem('dark') === '1' ? 'dark' : 'light';
    }

    function syncThemeControls() {
        const isDark = document.documentElement.classList.contains('dark');
        document.querySelectorAll('[data-theme-toggle], button[onclick="toggleDarkMode()"]')
            .forEach(function (button) {
                const icon = button.querySelector('i');
                const label = isDark ? '切换为白色主题' : '切换为黑色主题';
                button.dataset.themeToggle = '';
                button.title = label;
                button.setAttribute('aria-label', label);
                button.setAttribute('aria-pressed', String(isDark));
                if (icon) icon.className = isDark ? 'ri-sun-line' : 'ri-moon-line';
            });
    }

    function applyTheme(theme, persist) {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        if (persist !== false) {
            window.localStorage.setItem(storageKey, theme);
            window.localStorage.setItem('dark', isDark ? '1' : '0');
        }
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = isDark ? '#171717' : '#ffffff';
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        syncThemeControls();
    }

    window.toggleDarkMode = function () {
        applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark', true);
    };
    window.darkMode = function () { applyTheme(getSavedTheme(), false); };
    window.syncThemeControls = syncThemeControls;

    window.darkMode();
    document.addEventListener('DOMContentLoaded', syncThemeControls);
})();
