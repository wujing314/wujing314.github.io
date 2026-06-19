const dataCache = {};
const dataBaseUrl = new URL('./', document.currentScript.src);

async function loadData(fileName) {
    if (dataCache[fileName]) {
        return dataCache[fileName];
    }
    
    const response = await fetch(new URL(`${fileName}.json`, dataBaseUrl));
    const data = await response.json();
    dataCache[fileName] = data;
    return data;
}

async function loadAllData() {
    const [Layout, Home, Resume, Project, About] = await Promise.all([
        loadData('Layout'),
        loadData('Home'),
        loadData('Resume'),
        loadData('Project'),
        loadData('About')
    ]);

    renderSiteChrome(Layout);
    
    return {
        Layout,
        Home,
        Resume,
        Project,
        About,
        profile: Home.profile,
        contact: About.contact,
        education: Resume.education,
        skills: Resume.skills,
        projects: Resume.projects,
        posts: Project,
        home: Home,
        archives: Project,
        about: Resume,
        links: About
    };
}

function isPageInSubDirectory() {
    return /\/pages\//i.test(location.pathname.replace(/\\/g, '/'));
}

function withBasePath(path) {
    if (!path) return '#';
    if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
    if (!isPageInSubDirectory()) return path;
    if (path === 'Home.html') return '../Home.html';
    if (path.indexOf('pages/') === 0) return path.replace('pages/', '');
    return '../' + path;
}

function isCurrentPath(path) {
    const current = location.pathname.replace(/\\/g, '/').split('/').pop();
    const target = path.replace(/\\/g, '/').split('/').pop();
    return current === target || (current === '' && target === 'Home.html');
}

function renderActionButtons(actions, includeMenu) {
    const buttons = (actions || []).map(action => `
        <button class="hover:text-black dark:hover:text-white" title="${action.label}" aria-label="${action.label}" onclick="${action.onclick}">
            <i class="${action.icon}" ${action.icon === 'ri-contrast-2-line' ? 'id="darkModelIcon"' : ''}></i>
        </button>
    `).join('');

    return includeMenu ? buttons + '<button title="Menu" aria-label="Menu" onclick="toggleNav()"><i class="ri-menu-3-line"></i></button>' : buttons;
}

function renderNavItems(navigation, centered) {
    return (navigation || []).map(item => {
        const active = isCurrentPath(item.path) ? ' text-black dark:text-white font-semibold tracking-wide' : '';
        const center = centered ? ' text-center' : '';
        return `<li><a class="hover:text-black dark:hover:text-white block w-full hover:tracking-wider duration-300${center}${active}" href="${withBasePath(item.path)}">${item.label}</a></li>`;
    }).join('');
}

function renderSiteChrome(layout) {
    if (!layout) return;

    const brand = layout.brand || {};
    const copyright = layout.copyright || {};
    const search = layout.search || {};
    const brandHome = withBasePath(brand.home || 'Home.html');
    const brandImage = withBasePath(brand.image || 'images/head.jpg');
    const searchAction = withBasePath(search.action || 'search.html');
    const desktopHeader = document.querySelector('header.hidden.fixed');
    const mobileHeader = document.querySelector('header.lg\\:hidden');
    const searchBox = document.getElementById('search');

    const styleId = 'site-chrome-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .site-avatar-frame {
                width: 88px;
                height: 88px;
                border-radius: 9999px;
                padding: 4px;
                background: linear-gradient(145deg, rgba(255,255,255,.95), rgba(226,232,240,.76));
                box-shadow: 0 18px 40px rgba(15, 23, 42, .12);
            }
            .dark .site-avatar-frame {
                background: linear-gradient(145deg, rgba(64,64,64,.9), rgba(23,23,23,.8));
                box-shadow: 0 18px 40px rgba(0, 0, 0, .32);
            }
            .site-avatar-frame img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
                border-radius: inherit;
            }
            .site-avatar-frame-sm {
                width: 36px;
                height: 36px;
                padding: 2px;
                box-shadow: 0 8px 20px rgba(15, 23, 42, .1);
            }
        `;
        document.head.appendChild(style);
    }

    if (desktopHeader) {
        desktopHeader.innerHTML = `
            <div class="logo">
                <a href="${brandHome}" title="${brand.title || brand.name || 'Home'}" class="site-avatar-frame block">
                    <img src="${brandImage}" alt="${brand.name || 'avatar'}">
                </a>
            </div>
            <div class="nav">
                <ul class="text-767676 dark:text-[#999] space-y-2">
                    ${renderNavItems(layout.navigation, false)}
                </ul>
            </div>
            <div class="flex justify-start text-767676 dark:text-[#999] text-lg space-x-3">
                ${renderActionButtons(layout.actions, false)}
            </div>
            <div class="copyright text-767676 dark:text-[#999]">
                <p>&copy; ${copyright.year || new Date().getFullYear()} <a class="text-black dark:text-white" href="${brandHome}">${copyright.owner || brand.name || ''}</a></p>
            </div>
        `;
    }

    if (mobileHeader) {
        mobileHeader.innerHTML = `
            <div class="flex justify-between p-4">
                <div class="logo">
                    <a href="${brandHome}" title="${brand.title || brand.name || 'Home'}" class="site-avatar-frame site-avatar-frame-sm block">
                        <img src="${brandImage}" alt="${brand.name || 'avatar'}">
                    </a>
                </div>
                <div class="menu dark:text-[#999] space-x-3">
                    ${renderActionButtons(layout.actions, true)}
                </div>
            </div>
            <div class="mobile-nav right-0 bg-white h-full w-full dark:bg-neutral-900" id="mobileNav" style="display: none">
                <ul class="text-767676 dark:text-[#999] space-y-6 py-6">
                    ${renderNavItems(layout.navigation, true)}
                </ul>
            </div>
        `;
    }

    if (searchBox) {
        searchBox.innerHTML = `
            <div class="absolute right-2 top-2">
                <button class="text-3xl text-767676 cursor-pointer hover:text-black dark:text-[#999] dark:hover:text-white" onclick="toggleSearch()"><i class="ri-close-circle-line"></i></button>
            </div>
            <div class="search-wrap">
                <form method="get" action="${searchAction}" role="search" class="flex justify-start content-center">
                    <input autocomplete="off" class="border-b border-stone-300 dark:border-[#999] focus:outline-none focus:border-b w-full bg-transparent" type="search" name="keyword" placeholder="${search.placeholder || 'Search'}" required>
                    <button type="submit" class="dark:text-[#999] dark:hover:text-white"><i class="ri-search-2-line"></i></button>
                </form>
            </div>
        `;
    }
}

