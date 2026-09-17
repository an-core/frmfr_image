'use strict';

/* 
 *  КОНСТАНТЫ
 */
const CONFIG = Object.freeze({
    GITHUB_BASE_URL: 'https://an-core.github.io/frmfr_image/',
    JSON_CACHE_KEY: 'firemag_json_info',
    CART_KEY: 'firemag_cart',
    ORDERS_KEY: 'firemag_orders',
    ANNOUNCEMENT_CLOSED_KEY: 'announcement_closed',
    THEME_KEY: 'theme',
    ANIM_KEY: 'firemag_anim',
    CATEGORIES_VISIBLE_KEY: 'firemag_show_categories',
    CACHE_TTL_MS: 60 * 60 * 1000,
    PICKUP_POINTS_URL: 'cdek-points.json',
    CATALOG_URL: 'catalog.json',
    LOGO_FILE: 'images/store/icons/logo.png',
    ANNOUNCEMENT_TEXT: 'ВНИМАНИЕ! НОВЫЕ ПОСТУПЛЕНИЯ НА СКЛАД: Булавы от производителя Henrys - ' +
        'Delphin Long, Delphin Short, Loop, Loop Grip, кольца Standard, а также мячи, ' +
        'бинбеги и чехлы от отечественного производителя!',
    DEFAULT_LOGO_URL: 'images/store/icons/logo.png',
    PLACEHOLDER_PRODUCT: 'https://via.placeholder.com/400x400/cccccc/666666?text=Нет+фото',
    PLACEHOLDER_THUMB: 'https://via.placeholder.com/50/cccccc/666666?text=No+img',
    PLACEHOLDER_PARTNER: 'https://via.placeholder.com/80x40/cccccc/666666?text=',
    DELIVERY_COST_MOSCOW: 300,
    MAX_SPECS_BEFORE_COLLAPSE: 15,
});

const PARTNERS = Object.freeze([{
        name: 'Партнёр 1',
        file: 'images/store/icons/rosgos.png',
        url: 'https://www.circus.ru'
    },
    {
        name: 'Партнёр 2',
        file: 'images/store/icons/great-circus.png',
        url: 'https://www.greatcircus.ru'
    },
    {
        name: 'Партнёр 3',
        file: 'images/store/icons/gutsei.png',
        url: 'https://gutsei.ru'
    },
]);

const GLOSSARY = Object.freeze({
    'Радиосинхронизация': 'Радиосинхронизация позволяет синхронизировать несколько единиц реквизита по радиоканалу. ' +
        'Достаточно нажать кнопку на одном устройстве, и все остальные автоматически подстроятся под ' +
        'его режим, что упрощает управление шоу-программами.',
    'Стабилизация изображения': 'Стабилизация изображения - это технология, которая автоматически подстраивает отображение ' +
        'картинки под скорость вращения. Рисунок не растягивается и не сжимается, оставаясь чётким ' +
        'при любой частоте вращения.',
    'Автоматизация': 'Автоматизация позволяет легко создавать шоу-программы: достаточно поместить нужные картинки ' +
        'в папку, и устройство само составит программу с автоматическим переключением режимов через ' +
        'заданный интервал (по умолчанию 6 секунд).',
    'Энергосбережение': 'Энергосберегающий режим продлевает время работы устройства в 3 раза при одном нажатии. ' +
        'Особенно полезно на длительных выездах, фото- и видеосъёмках, а также при выступлениях в ' +
        'тёмных помещениях, где высокая яркость не требуется.',
    'Базовый вариант': 'Стафф конвертор + Пои, БЕЗ стабилизатора изображения, БЕЗ радиосинхронизации',
    'PRO комплект': 'Стафф конвертор + Пои, стабилизатор изображения + радиосинхронизация',
    'Базовая комплектация': 'БЕЗ стабилизатора изображения, БЕЗ радиосинхронизации',
    'Комплектация PRO': 'Стабилизатор изображения + радиоинхронизация',
});

const CATEGORY_ORDER = Object.freeze([
    'Реквизит для жонглирования',
    'Реквизит для тренировок',
    'Светодиодный реквизит',
    'Реквизит для фаершоу',
    'Реквизит для эквилибра',
    'Специальные предложения',
    'Сертификаты',
]);

const CATEGORY_ICONS = Object.freeze({
    'Реквизит для жонглирования': 'images/store/icons/juggling.png',
    'Реквизит для тренировок': 'images/store/icons/workout.png',
    'Светодиодный реквизит': 'images/store/icons/led.png',
    'Реквизит для фаершоу': 'images/store/icons/fire.png',
    'Реквизит для эквилибра': 'images/store/icons/equilibre.png',
    'Специальные предложения': 'images/store/icons/special_offer.png',
    'Сертификаты': 'images/store/icons/certificate.png',
});

const CATEGORY_TEXT_COLORS = Object.freeze({
    'Реквизит для жонглирования': '#ff00ff',
    'Реквизит для фаершоу': '#ff4500',
    'Светодиодный реквизит': '#00ffff',
    'Реквизит для тренировок': '#00cc66',
    'Реквизит для эквилибра': '#ffaa00',
    'Сертификаты': '#e84393',
    'Специальные предложения': '#00bfff',
});

const COUNTRY_LIST = Object.freeze([
    'Адыгея (Республика Адыгея)', 'Алтай (Республика Алтай)', 'Армения',
    'Башкортостан', 'Беларусь', 'Бурятия', 'Дагестан', 'Ингушетия',
    'Кабардино-Балкария', 'Казахстан', 'Калмыкия', 'Карачаево-Черкесия',
    'Карелия', 'Коми', 'Кыргызстан', 'Марий Эл', 'Мордовия', 'Россия',
    'Северная Осетия - Алания', 'Татарстан', 'Тыва', 'Удмуртия', 'Хакасия',
    'Чечня', 'Чувашия', 'Якутия (Республика Саха)',
]);

/* 
 *  УТИЛИТЫ
 */
const Utils = {
    /** Безопасный querySelector */
    $(sel, root = document) {
        return root.querySelector(sel);
    },

    $$(sel, root = document) {
        return Array.from(root.querySelectorAll(sel));
    },

    /** Создать элемент с атрибутами/классами */
    el(tag, {
        className,
        text,
        attrs = {},
        style = {}
    } = {}) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
        Object.assign(node.style, style);
        return node;
    },

    debounce(fn, wait = 300) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    },

    /** Throttle через requestAnimationFrame */
    rafThrottle(fn) {
        let ticking = false;
        return (...args) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                fn(...args);
                ticking = false;
            });
        };
    },

    /** Формат цены с пробелами и ₽ */
    formatPrice(value) {
        return Number(value).toLocaleString('ru-RU') + ' ₽';
    },

    /** Извлечь число из строки цены */
    parsePrice(str) {
        return parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
    },

    safeJSON(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    },

    downloadTextFile(filename, content) {
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, content], {
            type: 'text/plain;charset=utf-8'
        });
        const url = URL.createObjectURL(blob);
        const link = Utils.el('a', {
            attrs: {
                href: url,
                download: filename
            }
        });
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    getColorImageUrl(color, product) {
        if (!color) return product?.image || null;
        if (color.name === 'Все' || color.name === 'Стандарт') return product?.image || null;
        return color.image || product?.image || null;
    },

    getBadgeClass(badge) {
        if (!badge) return '';
        const b = badge.toLowerCase();
        if (b.includes('новинк') || b.includes('новый')) return 'badge-new';
        if (b.includes('хит')) return 'badge-hit';
        if (b.includes('предзаказ')) return 'badge-preorder';
        if (b.includes('есть в наличии') || b.includes('в наличии')) return 'badge-instock';
        if (b.includes('новое поступление')) return 'badge-newstock';
        if (b.includes('закончился') || b.includes('нет в наличии')) return 'badge-outofstock';
        if (b.includes('скоро поступление') || b.includes('ожидается')) return 'badge-comingsoon';
        if (b.includes('спеццена') || b.includes('спец цена')) return 'badge-special-price';
        return '';
    },

    isOutOfStock(product) {
        if (!product?.badge) return false;
        const b = product.badge.toLowerCase();
        return b.includes('закончился') || b.includes('нет в наличии');
    },

    isHit(product) {
        return !!product?.badge?.toLowerCase().includes('хит');
    },

    isSpecial(product) {
        const b = product?.badge?.toLowerCase() || '';
        return b.includes('спеццена') || b.includes('спец цена');
    },

    newPriority(badge) {
        if (!badge) return 0;
        const l = badge.toLowerCase();
        if (l.includes('новинк')) return 2;
        if (l.includes('новое поступление')) return 1;
        return 0;
    },
};

/*
 *  ХРАНИЛИЩЕ СОСТОЯНИЯ
 */
const State = {
    products: [],
    defaultProducts: [],
    cities: [],
    pickupPoints: [],
    cart: [],
    activeCategory: null,
    activeSubcategory: 'Все',
    sortOrder: 'default',
    isAnimEnabled: localStorage.getItem(CONFIG.ANIM_KEY) === 'on',
    currentModalProduct: null,
    currentCardImg: null,
    thumbnailElements: [],
    categoryIconCache: {},
    isSubmitting: false,
    announcementHiddenByScroll: false,
    announcementHiddenByModal: false,
    menuWasOpenBeforeModal: false,
    showCategories: localStorage.getItem(CONFIG.CATEGORIES_VISIBLE_KEY) === 'true',
    lastScrollY: 0,
};

/*
 *  DOM-КЭШ
 */
const DOM = {};

function cacheDOM() {
    const ids = [
        'topBar', 'announcementBar', 'announcementClose', 'categoriesRow', 'subcategoriesRow',
        'catalogContainer', 'categoriesIcon', 'categoriesText', 'toggleCategoriesBtn',
        'deliveryBtn', 'pickupBtn', 'desktopDeliveryBtn', 'desktopPickupBtn',
        'dropdownDelivery', 'dropdownPickup', 'deliveryDropdown', 'pickupDropdown',
        'modalOverlay', 'modalTitle', 'modalImage', 'modalDescription', 'modalSpecList',
        'modalColors', 'modalGallery', 'modalCloseBtn', 'modalFooterClose',
        'modalTermsContainer', 'modalTermsList', 'modalOptionsContainer', 'modalOptionsList',
        'modalVariantsContainer', 'modalVariantsList', 'modalAddToCartBtn', 'modalAddToCartText',
        'modalFullscreenBtn', 'glossaryModal', 'glossaryTitle', 'glossaryText',
        'glossaryCloseBtn', 'glossaryFooterClose', 'glossaryTooltip',
        'cdekCountry', 'countrySuggestions', 'cdekCity', 'citySuggestions',
        'cartIcon', 'cartCount', 'cartModal', 'cartItems', 'cartTotal',
        'cartCloseBtn', 'checkoutBtn', 'clearCartBtn', 'checkoutModal',
        'checkoutCloseBtn', 'checkoutBackBtn', 'submitOrderBtn', 'orderStatus',
        'checkoutTotalAmount', 'checkoutDeliveryInfo', 'checkoutGrandTotal',
        'customerName', 'customerPhone', 'customerEmail', 'customerComment',
        'moscowCountry', 'moscowCity', 'moscowStreet', 'moscowHouse', 'moscowFlat',
        'moscowDelivery', 'cdekDelivery', 'cdekPickupBlock', 'cdekPickup',
        'cdekPickupInput', 'pickupSuggestions', 'orderSuccessOverlay',
        'hamburger', 'slideMenu', 'menuClose', 'menuOverlay',
        'sortSelect', 'catalogDropdown', 'fireParticles',
        'animToggle', 'animIcon', 'animText',
        'themeToggle', 'themeIcon', 'themeText',
        'howToBuyBtn', 'howToBuyModal', 'howToBuyCloseBtn', 'howToBuyFooterClose',
        'deliveryModal', 'deliveryCloseBtn', 'deliveryFooterClose',
        'pickupModal', 'pickupCloseBtn', 'pickupFooterClose',
        'jugglingNewsBtn', 'jugglingNewsModal', 'jugglingNewsCloseBtn', 'jugglingNewsFooterClose',
        'fireNewsBtn', 'fireNewsModal', 'fireNewsCloseBtn', 'fireNewsFooterClose',
        'festivalsBtn', 'festivalsModal', 'festivalsCloseBtn', 'festivalsFooterClose',
        'logoImage', 'menuLogo', 'mobileLogo',
        'partnersHeader', 'partnersCollapsible',
    ];
    ids.forEach(id => {
        DOM[id] = document.getElementById(id);
    });

    DOM.headerWrapper = document.querySelector('.header-wrapper');
    DOM.partnersLogos = document.querySelector('.partners-logos');
    DOM.categoriesWrapper = document.querySelector('.categories-wrapper');
    DOM.dropdownContent = document.querySelector('.dropdown-content');
    DOM.catalogSection = document.querySelector('.catalog');
    DOM.cartEmptyHint = document.querySelector('.cart-empty-hint');
    DOM.cartIconEl = document.querySelector('.cart-icon');
    DOM.overlay = document.getElementById('menuOverlay');
    DOM.partnersArrow = document.querySelector('.partners-arrow');
}

/*
 *  СЕТЕВОЙ СЛОЙ
 */
const Api = {
    async fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.json();
    },

    /** Загрузка товаров с кэшем в localStorage */
    async loadProducts() {
        const saved = localStorage.getItem(CONFIG.JSON_CACHE_KEY);
        if (saved) {
            const parsed = Utils.safeJSON(saved);
            if (parsed && Date.now() - parsed.timestamp < CONFIG.CACHE_TTL_MS && Array.isArray(parsed.products)) {
                State.products = parsed.products;
                console.log('[Products] Из кэша:', State.products.length);
                return;
            }
        }

        try {
            const data = await this.fetchJSON(CONFIG.CATALOG_URL);
            if (Array.isArray(data) && data.length) {
                State.products = data;
                localStorage.setItem(CONFIG.JSON_CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    products: data,
                }));
                console.log('[Products] С GitHub:', data.length);
                return;
            }
        } catch (err) {
            console.warn('[Products] Ошибка загрузки catalog.json:', err);
        }

        if (saved) {
            const parsed = Utils.safeJSON(saved);
            if (parsed?.products) {
                State.products = parsed.products;
                console.log('[Products] Старый кэш:', State.products.length);
                return;
            }
        }

        State.products = JSON.parse(JSON.stringify(State.defaultProducts));
        console.log('[Products] Встроенный массив:', State.products.length);
    },

    /** Загрузка логотипов партнёров */
    async loadPartnerLogos() {
        if (!DOM.partnersLogos) return;

        DOM.partnersLogos.innerHTML = '';

        // предзагрузка
        await Promise.all(PARTNERS.map(p => {
            const img = new Image();
            img.src = CONFIG.GITHUB_BASE_URL + p.file;
            return img.decode().catch(() => {});
        }));

        const fragment = document.createDocumentFragment();
        for (const partner of PARTNERS) {
            const link = Utils.el('a', {
                attrs: {
                    href: partner.url,
                    target: '_blank',
                    rel: 'noopener noreferrer'
                },
            });
            const img = Utils.el('img', {
                attrs: {
                    src: CONFIG.GITHUB_BASE_URL + partner.file,
                    alt: partner.name,
                    loading: 'eager',
                },
            });
            img.onerror = function() {
                this.src = CONFIG.PLACEHOLDER_PARTNER + encodeURIComponent(partner.name);
            };
            link.appendChild(img);
            fragment.appendChild(link);
        }
        DOM.partnersLogos.appendChild(fragment);
    },

    /** Загрузка пунктов СДЭК */
    async loadPickupPoints(city) {
        if (!city) return;
        try {
            const data = await this.fetchJSON(CONFIG.PICKUP_POINTS_URL);
            const points = data.pvz || [];
            const cityLower = city.trim().toLowerCase();
            State.pickupPoints = points
                .filter(p => p.city && p.city.toLowerCase().includes(cityLower))
                .map(p => p.fullAddress || p.address)
                .filter(Boolean);

            const select = DOM.cdekPickup;
            if (!select) return;
            select.innerHTML = '<option value="">-- выберите пункт --</option>';
            if (State.pickupPoints.length) {
                for (const addr of State.pickupPoints) {
                    const opt = Utils.el('option', {
                        text: addr,
                        attrs: {
                            value: addr
                        }
                    });
                    select.appendChild(opt);
                }
            } else {
                select.innerHTML = '<option value="">Нет пунктов</option>';
            }
            if (DOM.cdekPickupBlock) DOM.cdekPickupBlock.style.display = 'block';
        } catch (err) {
            console.error('[Pickup] Ошибка загрузки точек:', err);
            alert('Не удалось загрузить список пунктов.');
        }
    },

    /** Загрузка списка городов для подсказок */
    async loadCities() {
        try {
            const data = await this.fetchJSON(CONFIG.PICKUP_POINTS_URL);
            const points = data.pvz || [];
            State.cities = [...new Set(points.map(p => p.city).filter(Boolean))].sort();
            console.log('[Cities] Загружено:', State.cities.length);
        } catch (err) {
            console.warn('[Cities] Ошибка:', err);
        }
    },
};

/*
 *  КОРЗИНА
 */
const Cart = {
    load() {
        const saved = localStorage.getItem(CONFIG.CART_KEY);
        State.cart = saved ? (Utils.safeJSON(saved) || []) : [];
        this.updateUI();
    },

    save() {
        localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(State.cart));
        this.updateUI();
        CartUI.renderModal();
    },

    add(product) {
        if (Utils.isOutOfStock(product)) {
            Toast.show('⚠️ Товар временно недоступен');
            return;
        }
        const key = product.id + '|';
        const existing = State.cart.find(i => i.uniqueKey === key);
        if (existing) {
            existing.quantity += 1;
        } else {
            State.cart.push({
                ...product,
                quantity: 1,
                options: [],
                totalPrice: null,
                optionKey: '',
                uniqueKey: key,
                image: product.image,
            });
        }
        this.save();
        Toast.show(`Товар ${product.name} добавлен в корзину!`);
    },

    addWithOptions(product, options, totalPrice, variant, color) {
        if (Utils.isOutOfStock(product)) {
            Toast.show('⚠️ Товар временно недоступен');
            return;
        }
        const optionKey = options.map(o => o.name).sort().join('|');
        const variantKey = variant?.name || '';
        const colorKey = color?.name || '';
        const uniqueKey = `${product.id}|${optionKey}|${variantKey}|${colorKey}`;

        const existing = State.cart.find(i => i.uniqueKey === uniqueKey);
        if (existing) {
            existing.quantity += 1;
        } else {
            State.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                totalPrice,
                options,
                optionKey,
                variant: variant || null,
                variantKey,
                color: color || null,
                colorKey,
                uniqueKey,
                quantity: 1,
                image: product.image,
            });
        }
        this.save();
    },

    addWithColor(product, color) {
        if (Utils.isOutOfStock(product)) {
            Toast.show('⚠️ Товар временно недоступен');
            return;
        }
        const colorKey = color?.name || '';
        const uniqueKey = `${product.id}|||${colorKey}`;
        const existing = State.cart.find(i => i.uniqueKey === uniqueKey);
        if (existing) {
            existing.quantity += 1;
        } else {
            State.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
                options: [],
                totalPrice: null,
                optionKey: '',
                variant: null,
                variantKey: '',
                color: color || null,
                colorKey,
                uniqueKey,
            });
        }
        this.save();
        Toast.show(`Товар ${product.name}${color ? ' (' + color.name + ')' : ''} добавлен в корзину!`);
    },

    remove(key) {
        State.cart = State.cart.filter(i => i.uniqueKey !== key);
        this.save();
    },

    clear() {
        State.cart = [];
        this.save();
    },

    changeQuantity(key, delta) {
        const item = State.cart.find(i => i.uniqueKey === key);
        if (!item) return;
        const newQty = item.quantity + delta;
        if (newQty <= 0) this.remove(key);
        else {
            item.quantity = newQty;
            this.save();
        }
    },

    totalItems() {
        return State.cart.reduce((s, i) => s + i.quantity, 0);
    },

    totalPrice() {
        return State.cart.reduce((s, i) => {
            const unit = i.totalPrice || Utils.parsePrice(i.price);
            return s + unit * i.quantity;
        }, 0);
    },

    updateUI() {
        const {
            cartCount,
            cartEmptyHint,
            cartIconEl
        } = DOM;
        if (!cartCount || !cartIconEl) return;
        const totalItems = this.totalItems();
        const totalSum = this.totalPrice();

        if (totalItems === 0) {
            cartCount.style.display = 'none';
            cartIconEl.classList.remove('has-items');
            if (cartEmptyHint) cartEmptyHint.style.display = 'inline';
        } else {
            cartCount.style.display = 'inline-flex';
            cartCount.textContent = Utils.formatPrice(totalSum);
            cartIconEl.classList.add('has-items');
            if (cartEmptyHint) cartEmptyHint.style.display = 'none';
        }
    },
};

/* 
 *  UI: КОРЗИНА (модалка)
 */
const CartUI = {
    renderModal() {
        const container = DOM.cartItems;
        const totalEl = DOM.cartTotal;
        if (!container) return;

        if (State.cart.length === 0) {
            container.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
            if (totalEl) totalEl.textContent = '';
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const item of State.cart) {
            const unitPrice = item.totalPrice || Utils.parsePrice(item.price);
            const itemTotal = unitPrice * item.quantity;
            const thumb = item.image || CONFIG.PLACEHOLDER_THUMB;

            const variantText = item.variant ? ` (вариант: ${item.variant.name})` : '';
            const optionsText = item.options?.length ? ` (+ ${item.options.map(o => o.name).join(', ')})` : '';
            const colorText = item.color ? ` (цвет: ${item.color.name})` : '';

            const row = Utils.el('div', {
                className: 'cart-item'
            });
            row.innerHTML = `
                <div class="cart-item-info">
                    <img class="cart-item-thumb" src="${thumb}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${item.price} ${variantText} ${colorText} ${optionsText} × ${item.quantity} = ${Utils.formatPrice(itemTotal)}</span>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    <div class="cart-item-controls">
                        <button class="qty-minus" data-key="${item.uniqueKey}" data-delta="-1">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-plus" data-key="${item.uniqueKey}" data-delta="1">+</button>
                    </div>
                    <button class="cart-item-remove" data-key="${item.uniqueKey}">✕</button>
                </div>
            `;
            fragment.appendChild(row);
        }
        container.innerHTML = '';
        container.appendChild(fragment);

        if (totalEl) {
            totalEl.innerHTML = `<span>Итого:</span><span>${Utils.formatPrice(Cart.totalPrice())}</span>`;
        }
    },

    /** Делегирование событий внутри модалки корзины */
    bindEvents() {
        const container = DOM.cartItems;
        if (!container) return;

        container.addEventListener('click', (e) => {
            const qtyBtn = e.target.closest('.qty-plus, .qty-minus');
            if (qtyBtn) {
                e.stopPropagation();
                Cart.changeQuantity(qtyBtn.dataset.key, parseInt(qtyBtn.dataset.delta, 10));
                return;
            }
            const removeBtn = e.target.closest('.cart-item-remove');
            if (removeBtn) {
                Cart.remove(removeBtn.dataset.key);
            }
        });
    },
};

/*
 *  UI: КАТАЛОГ
 */
const CatalogUI = {
    getCategories() {
        const set = new Set(State.products.map(p => p.category));
        return Array.from(set).sort((a, b) => {
            const ia = CATEGORY_ORDER.indexOf(a);
            const ib = CATEGORY_ORDER.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return 0;
        });
    },

    getSubcategories(category) {
        const target = category && category !== 'Все' ? category : null;
        const subs = new Set(
            State.products
            .filter(p => !target || p.category === target)
            .map(p => p.subcategory)
            .filter(s => s && s.trim() !== '')
        );
        return ['Все', ...Array.from(subs).sort()];
    },

    getFiltered() {
        let list = State.products.filter(p => {
            const catMatch = !State.activeCategory || p.category === State.activeCategory;
            const subMatch = State.activeSubcategory === 'Все' || p.subcategory === State.activeSubcategory;
            return catMatch && subMatch;
        });

        switch (State.sortOrder) {
            case 'price-asc':
                list.sort((a, b) => Utils.parsePrice(a.price) - Utils.parsePrice(b.price));
                break;
            case 'price-desc':
                list.sort((a, b) => Utils.parsePrice(b.price) - Utils.parsePrice(a.price));
                break;
            case 'hit-first':
                list.sort((a, b) => (Utils.isHit(b) ? 1 : 0) - (Utils.isHit(a) ? 1 : 0));
                break;
            case 'new-first':
                list.sort((a, b) => Utils.newPriority(b.badge) - Utils.newPriority(a.badge));
                break;
            case 'special-first':
                list.sort((a, b) => (Utils.isSpecial(b) ? 1 : 0) - (Utils.isSpecial(a) ? 1 : 0));
                break;
        }
        return list;
    },

    async loadCategoryIcons() {
        for (const cat of this.getCategories()) {
            const fileName = CATEGORY_ICONS[cat];
            if (fileName) State.categoryIconCache[cat] = CONFIG.GITHUB_BASE_URL + fileName;
        }
    },

    renderCategories() {
        const row = DOM.categoriesRow;
        if (!row) return;
        row.innerHTML = '';

        const fragment = document.createDocumentFragment();
        for (const cat of this.getCategories()) {
            const wrapper = Utils.el('div', {
                className: 'category-icon-wrapper' + (cat === State.activeCategory ? ' active' : ''),
                attrs: {
                    'data-category': cat
                },
            });

            const img = Utils.el('img', {
                className: 'category-icon-img',
                attrs: {
                    alt: cat,
                    loading: 'lazy'
                },
            });
            img.style.background = 'var(--bg-photo)';

            const iconUrl = State.categoryIconCache[cat];
            if (iconUrl) {
                img.src = iconUrl;
                img.onerror = () => this.setIconFallback(img, cat);
            } else {
                this.setIconFallback(img, cat);
            }

            const label = Utils.el('span', {
                className: 'category-icon-label',
                text: cat
            });

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            wrapper.addEventListener('click', () => {
                State.activeCategory = cat;
                State.activeSubcategory = 'Все';
                this.renderCategories();
                this.renderSubcategories();
                this.renderCatalog();
                DropdownCatalog.syncActive();
            });

            fragment.appendChild(wrapper);
        }
        row.appendChild(fragment);
        Categories.checkOverflow();
    },

    setIconFallback(img, cat) {
        const letter = cat.charAt(0);
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23d1d5db'/%3E%3Ctext x='60' y='78' font-size='48' text-anchor='middle' fill='%2364748b' font-family='Arial' font-weight='bold'%3E${letter}%3C/text%3E%3C/svg%3E`;
        img.style.padding = '12px';
    },

    renderSubcategories() {
        const row = DOM.subcategoriesRow;
        if (!row) return;
        row.innerHTML = '';

        const subs = this.getSubcategories(State.activeCategory);
        if (subs.length === 0 ||
            (subs.length === 1 && subs[0] === 'Все' && State.activeCategory && State.activeCategory !== 'Все')) {
            row.appendChild(Utils.el('span', {
                className: 'subcategories-empty',
                text: 'Нет подкатегорий',
            }));
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const sub of subs) {
            const btn = Utils.el('button', {
                className: 'subcategory-btn' + (sub === State.activeSubcategory ? ' active' : ''),
                text: sub,
                attrs: {
                    'data-subcategory': sub
                },
            });
            btn.addEventListener('click', () => {
                State.activeSubcategory = sub;
                this.renderSubcategories();
                this.renderCatalog();
            });
            fragment.appendChild(btn);
        }
        row.appendChild(fragment);
    },

    renderCatalog() {
        const catalog = DOM.catalogContainer;
        if (!catalog) return;
        catalog.innerHTML = '';

        const filtered = this.getFiltered();
        if (filtered.length === 0) {
            catalog.appendChild(Utils.el('div', {
                text: '😕 Товаров в этой категории нет',
                style: {
                    gridColumn: '1/-1',
                    textAlign: 'center',
                    padding: '3rem 0',
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                },
            }));
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const product of filtered) {
            fragment.appendChild(this.createCard(product));
        }
        catalog.appendChild(fragment);
        ColorSwatches.setupDragScroll();
    },

    createCard(product) {
        const card = Utils.el('div', {
            className: 'product-card'
        });

        // фото + бейджи
        const photoWrap = Utils.el('div', {
            className: 'photo-wrapper',
            attrs: {
                'data-id': product.id
            },
        });

        if (product.badge) {
            this.appendBadges(photoWrap, product.badge);
        }

        const img = Utils.el('img', {
            attrs: {
                src: product.image || CONFIG.PLACEHOLDER_PRODUCT,
                alt: product.name,
                loading: 'lazy',
            },
        });
        photoWrap.appendChild(img);

        // инфо
        const info = Utils.el('div', {
            className: 'card-info'
        });

        const name = Utils.el('div', {
            className: 'product-name',
            text: product.name
        });
        const price = Utils.el('div', {
            className: 'product-price',
            text: product.price
        });

        const tag = Utils.el('div', {
            className: 'product-category-tag'
        });
        tag.appendChild(this.createCategoryLink(product));
        if (product.subcategory) {
            tag.appendChild(document.createTextNode(' › '));
            tag.appendChild(this.createSubcategoryLink(product));
        }

        // кнопка "в корзину"
        const addIcon = Utils.el('button', {
            className: 'add-to-cart-icon'
        });
        addIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
        addIcon.setAttribute('aria-label', 'Добавить в корзину');
        addIcon.title = 'Добавить в корзину';

        if (Utils.isOutOfStock(product)) {
            addIcon.disabled = true;
            addIcon.title = 'Товар отсутствует';
        } else {
            addIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const activeSwatch = card.querySelector('.color-swatch.active-swatch');
                let selectedColor = null;
                if (activeSwatch?.dataset.colorName) {
                    const colorData = product.colors?.find(c => c.name === activeSwatch.dataset.colorName);
                    if (colorData) selectedColor = {
                        name: colorData.name,
                        hex: colorData.hex
                    };
                }
                Cart.addWithColor(product, selectedColor);
            });
        }

        const colorSwatches = ColorSwatches.create(product, img);
        if (!product.customizable && colorSwatches.children.length > 1) {
            info.appendChild(colorSwatches);
        }

        const priceCartWrapper = Utils.el('div', {
            className: 'price-cart-wrapper'
        });
        priceCartWrapper.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:auto;';
        priceCartWrapper.appendChild(price);
        priceCartWrapper.appendChild(addIcon);

        info.appendChild(tag);
        info.appendChild(name);
        if (colorSwatches.children.length > 0) info.appendChild(colorSwatches);
        info.appendChild(priceCartWrapper);

        card.appendChild(photoWrap);
        card.appendChild(info);

        photoWrap.addEventListener('click', () => {
            const id = parseInt(photoWrap.dataset.id, 10);
            const prod = State.products.find(p => p.id === id);
            if (prod) Modal.open(prod, img);
        });

        return card;
    },

    createCategoryLink(product) {
        const span = Utils.el('span', {
            className: 'category-link',
            text: product.category
        });
        span.style.cssText = 'cursor:pointer;text-decoration:underline dotted var(--text-hint);text-underline-offset:2px;pointer-events:auto;';
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            State.activeCategory = product.category;
            State.activeSubcategory = 'Все';
            this.renderCategories();
            this.renderSubcategories();
            this.renderCatalog();
            DOM.catalogSection?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        return span;
    },

    createSubcategoryLink(product) {
        const span = Utils.el('span', {
            className: 'subcategory-link',
            text: product.subcategory
        });
        span.style.cssText = 'cursor:pointer;text-decoration:underline dotted var(--text-hint);text-underline-offset:2px;pointer-events:auto;';
        span.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            State.activeCategory = product.category;
            State.activeSubcategory = product.subcategory;
            this.renderCategories();
            this.renderSubcategories();
            this.renderCatalog();
            DOM.catalogSection?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        return span;
    },

    appendBadges(container, badgeString) {
        const badges = badgeString.split(',').map(s => s.trim()).filter(Boolean);
        const left = Utils.el('div', {
            className: 'badge-left'
        });
        const right = Utils.el('div', {
            className: 'badge-right'
        });

        for (const b of badges) {
            const el = Utils.el('div', {
                className: 'product-badge ' + Utils.getBadgeClass(b),
                text: b,
            });
            const lower = b.toLowerCase();
            const isStatus = lower.includes('есть в наличии') || lower.includes('в наличии') ||
                lower.includes('закончился') || lower.includes('нет в наличии');
            (isStatus ? right : left).appendChild(el);
        }

        if (left.children.length) container.appendChild(left);
        if (right.children.length) container.appendChild(right);
    },
};

/*
 *  UI: ЦВЕТОВЫЕ ПЕРЕКЛЮЧАТЕЛИ (цветные кружки на лицевой стороне карточки товара)
 */
const ColorSwatches = {
    create(product, imgElement) {
        const wrapper = Utils.el('div', {
            className: 'color-swatches'
        });
        if (!product.colors?.length) return wrapper;

        let colors = [...product.colors];
        const hasAll = colors.some(c => c.name === 'Все' || c.name === 'Стандарт');
        if (!hasAll) colors.unshift({
            name: 'Все',
            hex: '#ffffff',
            image: product.image
        });

        colors.forEach((color, idx) => {
            const swatch = Utils.el('span', {
                className: 'color-swatch' + (idx === 0 ? ' active-swatch' : ''),
                attrs: {
                    'data-color-name': color.name,
                    title: color.name
                },
            });

            if (color.name === 'Белый/Чёрный') {
                swatch.style.background = 'conic-gradient(#000000 0deg 180deg, #ffffff 180deg 360deg)';
                swatch.style.border = '1px solid #888';
            } else if (color.name === 'Все' || color.name === 'Стандарт') {
                swatch.style.background = 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)';
                swatch.style.border = '1px solid #888';
            } else {
                swatch.style.background = color.hex || '#cccccc';
            }

            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setActive(swatch, product, imgElement);
            });

            wrapper.appendChild(swatch);
        });

        const first = wrapper.querySelector('.color-swatch');
        if (first) this.setActive(first, product, imgElement);

        return wrapper;
    },

    setActive(swatchElement, product, imgElement) {
        if (!swatchElement || !product) return;

        const parentSwatches = swatchElement.closest('.color-swatches');
        if (parentSwatches) {
            Utils.$$('.color-swatch', parentSwatches).forEach(s => s.classList.remove('active-swatch'));
            swatchElement.classList.add('active-swatch');
        }

        const colorName = swatchElement.dataset.colorName;
        if (!colorName) return;
        const color = (product.colors || []).find(c => c.name === colorName);
        if (!color) return;

        const imageUrl = Utils.getColorImageUrl(color, product);
        if (imgElement) {
            imgElement.src = imageUrl || CONFIG.PLACEHOLDER_PRODUCT;
            const card = imgElement.closest('.product-card');
            if (card) this.scrollActiveIntoView(card);
        }
    },

    scrollActiveIntoView(card) {
        const container = card?.querySelector('.color-swatches');
        const active = container?.querySelector('.color-swatch.active-swatch');
        if (!container || !active) return;

        const cRect = container.getBoundingClientRect();
        const sRect = active.getBoundingClientRect();
        const visible = sRect.left >= cRect.left && sRect.right <= cRect.right;
        if (!visible) {
            const scrollLeft = sRect.left - cRect.left + container.scrollLeft -
                (cRect.width - sRect.width) / 2;
            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    },

    setupDragScroll() {
        Utils.$$('.color-swatches').forEach(container => {
            if (container.dataset.dragBound) return;
            container.dataset.dragBound = '1';

            let isDown = false,
                startX = 0,
                scrollLeft = 0;
            container.style.cursor = 'grab';

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                container.style.cursor = 'grabbing';
            });
            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });
            container.addEventListener('mouseup', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });
            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                container.scrollLeft = scrollLeft - (x - startX) * 0.8;
            });
        });
    },
};

/*
 *  UI: МОДАЛКА ТОВАРА
 */
const Modal = {
    _checkboxes: [],
    _selectedVariantPrice: 0,
    _currentTotalPrice: 0,
    _customColorsGetter: null,
    _currentCustomProduct: null,

    open(product, cardImgElement) {
        Announcement.hideForModal();
        DOM.modalOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.innerWidth > 768) {
            DOM.modalOverlay?.classList.add('modal-fullscreen');
        }

        State.currentCardImg = cardImgElement;
        State.currentModalProduct = product;

        this.renderTitle(product);
        this.renderMainImage(product, cardImgElement);
        this.renderDescription(product);
        this.renderTerms(product);
        this.renderGallery(product);
        this.renderColors(product);
        this.renderSpecs(product);
        this.renderOptions(product);
        this.renderVariants(product);
        this.renderCustomizer(product);
        this.updatePrice(product);
        this.renderAddButton(product);
    },

    close() {
        if (State.currentCardImg && State.currentModalProduct) {
            const defaultImage = State.currentModalProduct.image || '';
            if (defaultImage) State.currentCardImg.src = defaultImage;
            const card = State.currentCardImg.closest('.product-card');
            if (card) {
                const swatches = Utils.$$('.color-swatch', card);
                swatches.forEach(sw => sw.classList.remove('active-swatch'));
                if (swatches.length) swatches[0].classList.add('active-swatch');
            }
        }

        DOM.modalOverlay?.classList.remove('modal-fullscreen');
        DOM.modalOverlay?.classList.remove('active');
        document.body.style.overflow = '';

        State.currentModalProduct = null;
        State.currentCardImg = null;
        State.thumbnailElements = [];
        Utils.$$('.gallery-scroll-arrow').forEach(el => el.remove());

        Announcement.showAfterModal();
        Scroll.handle();
    },

    renderTitle(product) {
        const titleEl = DOM.modalTitle;
        if (!titleEl) return;
        const basePrice = Utils.parsePrice(product.price);
        titleEl.innerHTML = `${product.name} • ${Utils.formatPrice(basePrice)}`;

        if (product.badge) {
            product.badge.split(',').map(s => s.trim()).filter(Boolean).forEach(b => {
                titleEl.appendChild(Utils.el('span', {
                    className: 'modal-badge ' + Utils.getBadgeClass(b),
                    text: b,
                }));
            });
        }
    },

    renderMainImage(product, cardImg) {
        let defaultImage = product.image;
        if (cardImg?.src) defaultImage = cardImg.src;
        if (!defaultImage || defaultImage.includes('placeholder')) defaultImage = product.image;

        if (DOM.modalImage) {
            DOM.modalImage.src = defaultImage;
            DOM.modalImage.alt = product.name;
        }
    },

    renderDescription(product) {
        if (!DOM.modalDescription) return;
        DOM.modalDescription.innerHTML = product.description || '';

        Utils.$$('.term', DOM.modalDescription).forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const term = el.dataset.term;
                if (GLOSSARY[term]) {
                    DOM.glossaryTitle.textContent = term;
                    DOM.glossaryText.textContent = GLOSSARY[term];
                    DOM.glossaryModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    },

    renderTerms(product) {
        const container = DOM.modalTermsContainer;
        const list = DOM.modalTermsList;
        if (!container || !list) return;

        const terms = product.terms || [];
        list.innerHTML = '';

        if (!terms.length) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        let hint = container.querySelector('.terms-hint');
        if (!hint) {
            hint = Utils.el('div', {
                className: 'terms-hint',
                text: '💡 Наведите курсор или коснитесь термина для пояснения',
            });
            hint.style.cssText = 'font-size:0.75rem;color:var(--text-muted);margin-bottom:0.4rem;';
            container.prepend(hint);
        }

        const isHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        for (const termName of terms) {
            const definition = GLOSSARY[termName];
            if (!definition) continue;

            const termEl = Utils.el('span', {
                className: 'term',
                text: termName,
                attrs: {
                    'data-term': termName
                },
            });

            termEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.innerWidth >= 768) return;
                if (GLOSSARY[termName]) {
                    DOM.glossaryTitle.textContent = termName;
                    DOM.glossaryText.textContent = GLOSSARY[termName];
                    DOM.glossaryModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            if (isHover) {
                termEl.addEventListener('mouseenter', () => {
                    const tooltip = DOM.glossaryTooltip;
                    if (!tooltip) return;
                    tooltip.textContent = definition;
                    tooltip.classList.add('visible');

                    const rect = termEl.getBoundingClientRect();
                    let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
                    let top = rect.top - tooltip.offsetHeight - 10;
                    if (left < 10) left = 10;
                    if (left + tooltip.offsetWidth > window.innerWidth - 10)
                        left = window.innerWidth - tooltip.offsetWidth - 10;
                    if (top < 10) top = rect.bottom + 10;

                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                });
                termEl.addEventListener('mouseleave', () => {
                    DOM.glossaryTooltip?.classList.remove('visible');
                });
            }

            list.appendChild(termEl);
        }

        if (!list.children.length) container.style.display = 'none';
    },

    renderGallery(product) {
        const gallery = DOM.modalGallery;
        if (!gallery) return;
        gallery.innerHTML = '';
        State.thumbnailElements = [];

        const allImages = [];
        if (product.image) allImages.push(product.image);
        if (product.images?.length) allImages.push(...product.images.filter(Boolean));
        if (!allImages.length) allImages.push(CONFIG.PLACEHOLDER_PRODUCT);

        if (allImages.length <= 1) {
            gallery.style.display = 'none';
            return;
        }
        gallery.style.display = 'flex';

        // подсчёт индексов цветов
        const colorIndexByImage = new Map();
        (product.colors || []).forEach((c, ci) => {
            if (c.name === 'Стандарт') return;
            if (c.image) colorIndexByImage.set(c.image, ci);
        });

        allImages.forEach((src, index) => {
            const thumb = Utils.el('img', {
                className: 'modal-gallery-thumb' + (index === 0 ? ' active' : ''),
                attrs: {
                    src,
                    alt: `Фото ${index + 1}`,
                    loading: 'lazy'
                },
            });
            thumb.dataset.url = src;
            thumb.onerror = function() {
                this.src = CONFIG.PLACEHOLDER_PRODUCT;
            };

            let colorIdx = -1;
            if (index === 0) colorIdx = 0;
            else colorIdx = colorIndexByImage.get(src) ?? -1;
            thumb.dataset.colorIndex = colorIdx;

            gallery.appendChild(thumb);
            State.thumbnailElements.push(thumb);
        });

        this.bindGalleryEvents(product);
        this.initGalleryArrows();
    },

    bindGalleryEvents(product) {
        const gallery = DOM.modalGallery;
        if (!gallery || gallery.dataset.bound) return;
        gallery.dataset.bound = '1';

        gallery.addEventListener('click', (e) => {
            const thumb = e.target.closest('.modal-gallery-thumb');
            if (!thumb) return;

            const newSrc = thumb.dataset.url || thumb.src;
            if (DOM.modalImage) DOM.modalImage.src = newSrc || CONFIG.PLACEHOLDER_PRODUCT;
            Utils.$$('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            const colorIndex = parseInt(thumb.dataset.colorIndex, 10);

            Utils.$$('#modalColors input[type="radio"]').forEach(radio => {
                radio.checked = parseInt(radio.dataset.colorIndex, 10) === colorIndex;
            });
            Utils.$$('.modal-color-swatch').forEach((sw, idx) => {
                sw.classList.toggle('active-modal-color', idx === colorIndex);
            });

            if (State.currentCardImg) {
                const card = State.currentCardImg.closest('.product-card');
                Utils.$$('.color-swatch', card).forEach((sw, idx) => {
                    sw.classList.toggle('active-swatch', idx === colorIndex);
                });
                State.currentCardImg.src = DOM.modalImage.src;
            }
        });
    },

    initGalleryArrows() {
        const gallery = DOM.modalGallery;
        if (!gallery) return;
        const wrapper = gallery.closest('.modal-gallery-wrapper');
        if (!wrapper) return;

        const left = wrapper.querySelector('.gallery-arrow-left');
        const right = wrapper.querySelector('.gallery-arrow-right');
        if (!left || !right) return;

        const update = () => {
            const canLeft = gallery.scrollLeft > 5;
            const canRight = gallery.scrollLeft + gallery.clientWidth < gallery.scrollWidth - 5;
            left.classList.toggle('visible', canLeft);
            right.classList.toggle('visible', canRight);
            wrapper.classList.toggle('fade-active', canRight);
        };

        const scroll = (dir) => {
            const step = gallery.clientWidth * 0.85;
            const target = dir === 'left' ?
                Math.max(0, gallery.scrollLeft - step) :
                Math.min(gallery.scrollWidth - gallery.clientWidth, gallery.scrollLeft + step);
            gallery.scrollTo({
                left: target,
                behavior: 'smooth'
            });
        };

        left.onclick = (e) => {
            e.stopPropagation();
            scroll('left');
        };
        right.onclick = (e) => {
            e.stopPropagation();
            scroll('right');
        };
        gallery.addEventListener('scroll', update);
        setTimeout(update, 200);
    },

    renderColors(product) {
        const container = DOM.modalColors;
        if (!container) return;
        container.innerHTML = '';

        const display = (product.colors || []).filter(c => c.name !== 'Стандарт' && c.name !== 'Все');
        if (!display.length) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'flex';

        container.appendChild(Utils.el('span', {
            className: 'modal-colors-label',
            text: 'Цвет:'
        }));

        display.forEach((color) => {
            const option = Utils.el('label', {
                className: 'modal-color-option'
            });
            const originalIndex = product.colors.findIndex(c => c.name === color.name);

            const radio = Utils.el('input', {
                attrs: {
                    type: 'radio',
                    name: 'modal-color-select',
                    value: originalIndex,
                    'data-color-index': originalIndex,
                    'data-color-name': color.name,
                    'data-color-hex': color.hex,
                },
            });

            const nameSpan = Utils.el('span', {
                text: color.name
            });
            option.appendChild(radio);
            option.appendChild(nameSpan);
            container.appendChild(option);

            radio.addEventListener('change', () => {
                const colorIndex = parseInt(radio.dataset.colorIndex, 10);
                const colorData = product.colors[colorIndex];
                const imageUrl = Utils.getColorImageUrl(colorData, product);
                if (DOM.modalImage) DOM.modalImage.src = imageUrl || CONFIG.PLACEHOLDER_PRODUCT;
                if (State.currentCardImg) State.currentCardImg.src = imageUrl;

                State.thumbnailElements.forEach(thumb => {
                    thumb.classList.toggle(
                        'active',
                        parseInt(thumb.dataset.colorIndex, 10) === colorIndex
                    );
                });

                if (State.currentCardImg) {
                    const card = State.currentCardImg.closest('.product-card');
                    Utils.$$('.color-swatch', card).forEach((sw, i) => {
                        sw.classList.toggle('active-swatch', i === colorIndex);
                    });
                }
            });
        });
    },

    renderSpecs(product) {
        const list = DOM.modalSpecList;
        if (!list) return;
        list.innerHTML = '';

        const specs = (product.specs || []).filter(s => {
            const l = s.trim().toLowerCase();
            return !l.startsWith('дополнительно:') &&
                !l.startsWith('выбрать другой вариант товара:') &&
                !l.startsWith('выбрать версию реквизита:');
        });

        const fragment = document.createDocumentFragment();
        specs.forEach((spec, index) => {
            const sep = spec.indexOf(':');
            let li;
            if (sep !== -1) {
                const label = spec.substring(0, sep).trim();
                const value = spec.substring(sep + 1).trim();
                li = Utils.el('li', {
                    className: 'spec-item' + (value.length > 30 ? ' spec-long-value' : '')
                });
                li.innerHTML = `<span class="spec-label">${label}:</span><span class="spec-value">${value}</span>`;
            } else {
                li = Utils.el('li', {
                    className: 'spec-item'
                });
                li.innerHTML = `<span class="spec-value">${spec}</span>`;
            }
            if (index >= CONFIG.MAX_SPECS_BEFORE_COLLAPSE) li.style.display = 'none';
            fragment.appendChild(li);
        });
        list.appendChild(fragment);

        if (specs.length > CONFIG.MAX_SPECS_BEFORE_COLLAPSE) {
            const hidden = specs.length - CONFIG.MAX_SPECS_BEFORE_COLLAPSE;
            const btn = Utils.el('button', {
                className: 'btn-show-more',
                text: `Показать все (${hidden})`,
            });
            btn.addEventListener('click', () => {
                Utils.$$('li[style*="display: none"]', list).forEach(item => item.style.display = 'flex');
                btn.style.display = 'none';
            });
            list.appendChild(btn);
        }
    },

    parseOptions(specs) {
        if (!specs) return [];
        const line = specs.find(s => s.trim().toLowerCase().startsWith('дополнительно:'));
        if (!line) return [];
        const parts = line.replace(/^ДОПОЛНИТЕЛЬНО\s*:/i, '').trim();
        return parts.split(',').map(s => s.trim()).filter(Boolean).map(item => {
            let m = item.match(/^(.*?)\s*-\s*([\d\s]+)\s*₽$/);
            if (m) return {
                name: m[1].trim(),
                price: parseInt(m[2].replace(/\s/g, ''), 10)
            };
            m = item.match(/^(.*?)\s*-\s*([\d\s]+)$/);
            if (m) return {
                name: m[1].trim(),
                price: parseInt(m[2].replace(/\s/g, ''), 10)
            };
            return {
                name: item.trim(),
                price: 0
            };
        });
    },

    parseVariants(specs) {
        if (!specs) return [];
        const line = specs.find(s => {
            const l = s.trim().toLowerCase();
            return l.startsWith('выбрать другой вариант товара:') ||
                l.startsWith('выбрать версию реквизита:');
        });
        if (!line) return [];
        const parts = line.replace(/^ВЫБРАТЬ ДРУГОЙ ВАРИАНТ ТОВАРА\s*:|^ВЫБРАТЬ ВЕРСИЮ РЕКВИЗИТА\s*:/i, '').trim();
        return parts.split(',').map(s => s.trim()).filter(Boolean).map(item => {
            let m = item.match(/^(.*?)\s*-\s*([\d\s]+)\s*₽$/);
            if (m) return {
                name: m[1].trim(),
                price: parseInt(m[2].replace(/\s/g, ''), 10)
            };
            m = item.match(/^(.*?)\s*-\s*([\d\s]+)$/);
            if (m) return {
                name: m[1].trim(),
                price: parseInt(m[2].replace(/\s/g, ''), 10)
            };
            return null;
        }).filter(Boolean);
    },

    renderOptions(product) {
        const container = DOM.modalOptionsContainer;
        const list = DOM.modalOptionsList;
        if (!container || !list) return;
        list.innerHTML = '';
        this._checkboxes = [];

        const opts = this.parseOptions(product.specs);
        if (!opts.length) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        opts.forEach(opt => {
            const wrapper = Utils.el('div');
            wrapper.style.cssText = 'display:flex;align-items:center;margin-bottom:6px;cursor:pointer;';

            const input = Utils.el('input', {
                attrs: {
                    type: opt.price > 0 ? 'checkbox' : 'radio',
                    name: opt.price > 0 ? '' : 'free-option',
                    'data-name': opt.name,
                    'data-price': opt.price,
                },
            });
            input.style.cssText = 'margin:0 8px 0 0;width:16px;height:16px;flex-shrink:0;accent-color:var(--price-color);';

            const text = Utils.el('span', {
                text: opt.name + (opt.price > 0 ? ` (+${Utils.formatPrice(opt.price)})` : ''),
            });
            text.style.cssText = 'font-size:.95rem;color:var(--text-secondary);line-height:1;';

            wrapper.appendChild(input);
            wrapper.appendChild(text);
            list.appendChild(wrapper);
            this._checkboxes.push(input);

            input.addEventListener('change', () => this.updatePrice(product));
        });
    },

    renderVariants(product) {
        const container = DOM.modalVariantsContainer;
        const list = DOM.modalVariantsList;
        if (!container || !list) return;
        list.innerHTML = '';

        const variants = this.parseVariants(product.specs);
        if (!variants.length) {
            container.style.display = 'none';
            this._selectedVariantPrice = Utils.parsePrice(product.price);
            return;
        }
        container.style.display = 'block';

        variants.forEach((v, index) => {
            const wrapper = Utils.el('div');
            wrapper.style.cssText = 'display:flex;align-items:center;margin-bottom:8px;cursor:pointer;';

            const radio = Utils.el('input', {
                attrs: {
                    type: 'radio',
                    name: 'product-variant',
                    value: v.name,
                    'data-price': v.price,
                    'data-name': v.name,
                },
            });
            radio.checked = index === 0;
            radio.style.cssText = 'margin:0 8px 0 0;width:16px;height:16px;flex-shrink:0;';

            const text = Utils.el('span', {
                text: `${v.name} - ${Utils.formatPrice(v.price)}`
            });
            text.style.cssText = 'font-size:.95rem;color:var(--text-secondary);line-height:1;';

            wrapper.appendChild(radio);
            wrapper.appendChild(text);
            list.appendChild(wrapper);

            radio.addEventListener('change', () => this.updatePrice(product));
        });

        this._selectedVariantPrice = variants[0].price;
    },

    renderCustomizer(product) {
        const container = document.getElementById('customizerContainer');
        const grid = document.getElementById('customizerGrid');
        if (!container || !grid) return;

        if (!product.customizable || !product.parts) {
            container.style.display = 'none';
            this._customColorsGetter = null;
            this._currentCustomProduct = null;
            return;
        }
        container.style.display = 'block';
        grid.innerHTML = '';

        const getColors = () => {
            const colors = {};
            Utils.$$('select', grid).forEach(sel => {
                colors[sel.dataset.part] = sel.value;
            });
            return colors;
        };
        this._customColorsGetter = getColors;

        const modelFolder = product.model ? product.model + '/' : '';
        const baseUrl = CONFIG.GITHUB_BASE_URL + 'images/clubs/custom/' + modelFolder;

        const updatePreview = (colors) => {
            Object.keys(colors).forEach(part => {
                const img = document.getElementById('preview-' + part);
                if (img) img.src = `${baseUrl}${part}_${colors[part]}.png`;
            });
        };

        Object.keys(product.parts).forEach(partKey => {
            const part = product.parts[partKey];
            const wrapper = Utils.el('div', {
                className: 'customizer-item'
            });
            const label = Utils.el('label', {
                text: part.label + ': '
            });

            const select = Utils.el('select', {
                attrs: {
                    'data-part': partKey
                }
            });
            part.colors.forEach(color => {
                select.appendChild(Utils.el('option', {
                    text: color.charAt(0).toUpperCase() + color.slice(1),
                    attrs: {
                        value: color
                    },
                }));
            });
            select.value = part.colors[0];

            wrapper.appendChild(label);
            wrapper.appendChild(select);
            grid.appendChild(wrapper);

            select.addEventListener('change', () => updatePreview(getColors()));
        });

        updatePreview(getColors());
        this._currentCustomProduct = product;
    },

    updatePrice(product) {
        const variantRadio = document.querySelector('input[name="product-variant"]:checked');
        let basePrice = Utils.parsePrice(product.price);
        if (variantRadio) basePrice = parseInt(variantRadio.dataset.price, 10);

        let total = basePrice;
        this._checkboxes.forEach(cb => {
            if (cb.checked) total += parseInt(cb.dataset.price, 10);
        });

        this._currentTotalPrice = total;
        this._selectedVariantPrice = basePrice;

        const titleEl = DOM.modalTitle;
        if (titleEl) {
            titleEl.innerHTML = `${product.name} • ${Utils.formatPrice(total)}`;
            Utils.$$('.modal-badge', titleEl).forEach(el => el.remove());
            if (product.badge) {
                product.badge.split(',').map(s => s.trim()).filter(Boolean).forEach(b => {
                    titleEl.appendChild(Utils.el('span', {
                        className: 'modal-badge ' + Utils.getBadgeClass(b),
                        text: b,
                    }));
                });
            }
        }
    },

    renderAddButton(product) {
        const btn = DOM.modalAddToCartBtn;
        const text = DOM.modalAddToCartText;
        if (!btn || !text) return;

        if (Utils.isOutOfStock(product)) {
            text.textContent = 'Нет в наличии';
            btn.disabled = true;
            btn.style.cssText = 'opacity:0.6;cursor:default;pointer-events:none;';
        } else {
            text.textContent = 'В корзину';
            btn.disabled = false;
            btn.style.cssText = '';
        }
    },

    handleAddToCart() {
        const product = State.currentModalProduct;
        if (!product) return;

        const selectedOptions = [];
        this._checkboxes.forEach(cb => {
            if (cb.checked) selectedOptions.push({
                name: cb.dataset.name,
                price: parseInt(cb.dataset.price, 10),
            });
        });

        let selectedColor = null;
        Utils.$$('#modalColors input[type="radio"]').forEach(radio => {
            if (radio.checked) selectedColor = {
                name: radio.dataset.colorName,
                hex: radio.dataset.colorHex,
            };
        });

        let selectedVariant = null;
        Utils.$$('input[name="product-variant"]').forEach(radio => {
            if (radio.checked) selectedVariant = {
                name: radio.dataset.name,
                price: parseInt(radio.dataset.price, 10),
            };
        });

        if (product.customizable && this._customColorsGetter) {
            const colors = this._customColorsGetter();
            if (colors) {
                Object.keys(colors).forEach(part => {
                    selectedOptions.push({
                        name: `${product.parts[part].label}: ${colors[part]}`,
                        price: 0,
                    });
                });
            }
        }

        if (selectedVariant) {
            selectedOptions.push({
                name: 'Вариант: ' + selectedVariant.name,
                price: 0
            });
        }

        const basePrice = selectedVariant ? selectedVariant.price : Utils.parsePrice(product.price);
        let totalPrice = basePrice;
        selectedOptions.forEach(opt => totalPrice += opt.price);

        Cart.addWithOptions(product, selectedOptions, totalPrice, selectedVariant, selectedColor);

        const colorName = selectedColor ? ` (${selectedColor.name})` : '';
        Toast.show(`Товар "${product.name}"${colorName} добавлен в корзину!`);
    },

    bindGlobalEvents() {
        [DOM.modalCloseBtn, DOM.modalFooterClose].forEach(btn => {
            btn?.addEventListener('click', () => this.close());
        });

        DOM.modalOverlay?.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.modalOverlay?.classList.contains('active')) {
                this.close();
            }
        });

        DOM.modalFullscreenBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) return;
            DOM.modalOverlay?.classList.toggle('modal-fullscreen');
        });

        DOM.modalAddToCartBtn?.addEventListener('click', () => this.handleAddToCart());
    },
};

/*
 *  UI: ВЫПАДАЮЩИЙ КАТАЛОГ
 */
const DropdownCatalog = {
    _closeTimer: null,

    init() {
        const desktopBtn = document.querySelector('.dropdown-btn');
        const mobileBtn = document.querySelector('.mobile-dropdown-btn');
        const content = DOM.dropdownContent;
        if (!desktopBtn || !content) return;

        const catalogContainer = desktopBtn.closest('.dropdown-catalog');
        this.populate();

        const toggle = (show) => {
            if (show) {
                clearTimeout(this._closeTimer);
                closeAllDropdowns();
                content.classList.add('show');
                DOM.categoriesRow?.classList.add('shifted');
                document.body.classList.add('dropdown-open');
            } else {
                content.classList.remove('show');
                DOM.categoriesRow?.classList.remove('shifted');
                document.body.classList.remove('dropdown-open');
            }
        };

        const handleLeave = (e) => {
            const related = e.relatedTarget;
            if (related && catalogContainer?.contains(related)) return;
            clearTimeout(this._closeTimer);
            this._closeTimer = setTimeout(() => toggle(false), 300);
        };

        const initHover = () => {
            if (window.innerWidth >= 768) {
                catalogContainer?.addEventListener('mouseenter', () => {
                    clearTimeout(this._closeTimer);
                    toggle(true);
                });
                catalogContainer?.addEventListener('mouseleave', handleLeave);
            }
        };
        initHover();
        window.addEventListener('resize', initHover);

        desktopBtn.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                e.stopPropagation();
                closeAllDropdowns();
                const isOpen = content.classList.toggle('show');
                DOM.categoriesRow?.classList.toggle('shifted', isOpen);
                document.body.classList.toggle('dropdown-open', isOpen);
            }
        });

        mobileBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            const isOpen = content.classList.toggle('show');
            DOM.categoriesRow?.classList.toggle('shifted', isOpen);
            document.body.classList.toggle('dropdown-open', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-btn') ||
                e.target.closest('.mobile-dropdown-btn') ||
                e.target.closest('.dropdown-content') ||
                e.target.closest('.category-icon-wrapper') ||
                e.target.closest('.category-link') ||
                e.target.closest('.subcategory-link') ||
                e.target.closest('.subcategory-btn')) return;

            if (content.classList.contains('show')) {
                content.classList.remove('show');
                DOM.categoriesRow?.classList.remove('shifted');
                document.body.classList.remove('dropdown-open');
            }

            if (State.activeCategory !== null) {
                State.activeCategory = null;
                State.activeSubcategory = 'Все';
                CatalogUI.renderCategories();
                CatalogUI.renderSubcategories();
                CatalogUI.renderCatalog();
            }
        });
    },

    populate() {
        const container = DOM.catalogDropdown;
        if (!container) return;
        container.innerHTML = '';

        const closeAndScroll = () => {
            const content = DOM.dropdownContent;
            content?.classList.remove('show');
            content?.removeAttribute('style');
            DOM.categoriesRow?.classList.remove('shifted');
            document.body.classList.remove('dropdown-open');
            DOM.catalogSection?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        };

        // "Все категории"
        const allItem = Utils.el('div', {
            className: 'category-item' + (State.activeCategory === null ? ' active-drop' : ''),
            text: 'Все категории',
            attrs: {
                'data-category': ''
            },
        });
        allItem.style.color = 'var(--text-secondary)';
        allItem.addEventListener('click', (e) => {
            e.stopPropagation();
            State.activeCategory = null;
            State.activeSubcategory = 'Все';
            CatalogUI.renderCategories();
            CatalogUI.renderSubcategories();
            CatalogUI.renderCatalog();
            this.syncActive();
            closeAndScroll();
        });
        container.appendChild(allItem);

        for (const cat of CatalogUI.getCategories()) {
            const item = Utils.el('div', {
                className: 'category-item' + (cat === State.activeCategory ? ' active-drop' : ''),
                text: cat,
                attrs: {
                    'data-category': cat
                },
            });
            item.style.color = CATEGORY_TEXT_COLORS[cat] || 'var(--text-secondary)';
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                State.activeCategory = cat;
                State.activeSubcategory = 'Все';
                CatalogUI.renderCategories();
                CatalogUI.renderSubcategories();
                CatalogUI.renderCatalog();
                this.syncActive();
                closeAndScroll();
            });
            container.appendChild(item);
        }
    },

    syncActive() {
        Utils.$$('.dropdown-content .category-item').forEach(item => {
            const cat = item.dataset.category;
            item.classList.toggle('active-drop', cat === '' ? State.activeCategory === null : cat === State.activeCategory);
        });
    },
};

function closeAllDropdowns() {
    DOM.dropdownContent?.classList.remove('show');
    DOM.categoriesRow?.classList.remove('shifted');
    document.body.classList.remove('dropdown-open');
    DOM.dropdownDelivery?.classList.remove('show');
    DOM.dropdownPickup?.classList.remove('show');
}

/*
 *  UI: ВЫПАДАЮЩИЕ ДОСТАВКА/САМОВЫВОЗ (десктоп)
 */
const DesktopDropdowns = {
    init() {
        const bind = (btn, dropdown) => {
            if (!btn || !dropdown) return;
            const fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);
            fresh.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeAllDropdowns();
                dropdown.classList.toggle('show');
            });
        };

        bind(DOM.desktopDeliveryBtn, DOM.dropdownDelivery);
        bind(DOM.desktopPickupBtn, DOM.dropdownPickup);

        // перезапрос после клонирования
        DOM.desktopDeliveryBtn = document.getElementById('desktopDeliveryBtn');
        DOM.desktopPickupBtn = document.getElementById('desktopPickupBtn');

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-btn') &&
                !e.target.closest('.dropdown-content') &&
                !e.target.closest('.desktop-delivery-btn') &&
                !e.target.closest('#dropdownDelivery') &&
                !e.target.closest('.desktop-pickup-btn') &&
                !e.target.closest('#dropdownPickup')) {
                closeAllDropdowns();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DOM.dropdownDelivery?.classList.remove('show');
                DOM.dropdownPickup?.classList.remove('show');
            }
        });
    },
};

/*
 *  UI: АНОНС (бегущая строка)
 */
const Announcement = {
    init() {
        const bar = DOM.announcementBar;
        if (!bar) return;

        if (localStorage.getItem(CONFIG.ANNOUNCEMENT_CLOSED_KEY) === 'true') {
            bar.style.display = 'none';
            this.updateLayout();
            return;
        }

        DOM.announcementClose?.addEventListener('click', () => {
            bar.style.display = 'none';
            localStorage.setItem(CONFIG.ANNOUNCEMENT_CLOSED_KEY, 'true');
            setTimeout(() => this.updateLayout(), 100);
        });

        setTimeout(() => this.updateLayout(), 50);
    },

    updateLayout(barHeight = 0) {
        const topBar = DOM.topBar;
        const header = DOM.headerWrapper;
        const announcement = DOM.announcementBar;

        let annH = 0;
        if (announcement &&
            announcement.style.display !== 'none' &&
            !announcement.classList.contains('hidden')) {
            annH = announcement.offsetHeight || 40;
        }

        const total = barHeight + annH;
        if (topBar) topBar.style.top = total + 'px';
        if (header) header.style.marginTop = (total + 80) + 'px';
    },

    hideForModal() {
        const bar = DOM.announcementBar;
        if (bar && !bar.classList.contains('hidden')) {
            bar.classList.add('hidden');
            State.announcementHiddenByModal = true;
        }
    },

    showAfterModal() {
        const bar = DOM.announcementBar;
        State.announcementHiddenByModal = false;
        if (bar && !State.announcementHiddenByScroll) bar.classList.remove('hidden');
    },
};

/*
 *  UI: СКРОЛЛ
 */
const Scroll = {
    modalSelectors: [
        '#modalOverlay', '#cartModal', '#checkoutModal',
        '#howToBuyModal', '#deliveryModal', '#pickupModal',
        '#jugglingNewsModal', '#fireNewsModal', '#festivalsModal',
        '#glossaryModal',
    ],

    init() {
        State.lastScrollY = window.scrollY;
        window.addEventListener('scroll', Utils.rafThrottle(() => this.handle()), {
            passive: true
        });
    },

    anyModalOpen() {
        return this.modalSelectors.some(sel => document.querySelector(sel)?.classList.contains('active'));
    },

    handle() {
        if (this.anyModalOpen()) return;

        const y = window.scrollY;
        const bar = DOM.announcementBar;
        const topBar = DOM.topBar;
        const header = DOM.headerWrapper;

        if (!bar || bar.style.display === 'none') {
            if (topBar) {
                if (y > State.lastScrollY && y > 0) {
                    topBar.classList.add('hidden');
                    header?.classList.add('hidden');
                } else if (y === 0) {
                    topBar.classList.remove('hidden');
                    header?.classList.remove('hidden');
                }
            }
            State.lastScrollY = y;
            return;
        }

        if (y > State.lastScrollY && y > 80) {
            topBar?.classList.add('hidden');
            header?.classList.add('hidden');
            bar.classList.add('hidden');
            State.announcementHiddenByScroll = true;
        } else if (y < State.lastScrollY || y <= 80) {
            topBar?.classList.remove('hidden');
            header?.classList.remove('hidden');
            if (!State.announcementHiddenByModal) {
                bar.classList.remove('hidden');
                State.announcementHiddenByScroll = false;
            }
        }

        State.lastScrollY = y;

        if (y <= 80) {
            topBar?.classList.remove('hidden');
            header?.classList.remove('hidden');
            if (bar && !State.announcementHiddenByModal) bar.classList.remove('hidden');
        }
    },
};

/*
 *  UI: КАТЕГОРИИ (оверфлоу + видимость)
 */
const Categories = {
    checkOverflow() {
        const wrapper = DOM.categoriesWrapper;
        if (!wrapper) return;
        const row = wrapper.querySelector('.categories-row');
        if (!row) return;
        wrapper.classList.toggle('has-overflow', row.scrollWidth > wrapper.clientWidth);
    },

    addFade() {
        if (DOM.categoriesWrapper && !DOM.categoriesWrapper.querySelector('.categories-fade')) {
            DOM.categoriesWrapper.appendChild(Utils.el('div', {
                className: 'categories-fade'
            }));
        }
    },

    observe() {
        const row = DOM.categoriesRow;
        if (!row) return;
        new MutationObserver(Utils.debounce(() => this.checkOverflow(), 100))
            .observe(row, {
                childList: true,
                subtree: true
            });
        window.addEventListener('resize', Utils.debounce(() => this.checkOverflow(), 150));
    },

    updateVisibility() {
        if (window.innerWidth > 600) {
            document.body.classList.remove('categories-hidden', 'categories-visible');
            return;
        }
        if (State.showCategories) {
            document.body.classList.add('categories-visible');
            document.body.classList.remove('categories-hidden');
            if (DOM.categoriesIcon) DOM.categoriesIcon.textContent = '🚫';
            if (DOM.categoriesText) DOM.categoriesText.textContent = 'Скрыть иконки категорий';
        } else {
            document.body.classList.remove('categories-visible');
            document.body.classList.add('categories-hidden');
            if (DOM.categoriesIcon) DOM.categoriesIcon.textContent = '👁️';
            if (DOM.categoriesText) DOM.categoriesText.textContent = 'Показать иконки категорий';
        }
    },
};

/*
 *  UI: МЕНЮ (бургер)
 */
const Menu = {
    init() {
        const overlay = DOM.overlay;
        if (!overlay) return;

        DOM.hamburger?.addEventListener('click', () => this.toggle());
        DOM.menuClose?.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.slideMenu?.classList.contains('open')) this.close();
        });
    },

    toggle() {
        const open = DOM.slideMenu?.classList.toggle('open');
        DOM.hamburger?.classList.toggle('active');
        DOM.overlay?.classList.toggle('active');
        document.body.style.overflow = open ? 'hidden' : '';
    },

    close() {
        DOM.slideMenu?.classList.remove('open');
        DOM.hamburger?.classList.remove('active');
        DOM.overlay?.classList.remove('active');
        document.body.style.overflow = '';
    },
};

/*
 *  UI: TOAST
 */
const Toast = {
    show(message, duration = 2000) {
        const toast = Utils.el('div', {
            className: 'toast-success',
            text: message
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },
};

/*
 *  UI: ТЕМА И ОГОНЬКИ (огоньки только для тёмной темы)
 */
const Theme = {
    init() {
        DOM.themeToggle?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            this.apply(current === 'dark' ? 'light' : 'dark');
        });
        this.apply(localStorage.getItem(CONFIG.THEME_KEY) || 'dark');
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(CONFIG.THEME_KEY, theme);

        if (DOM.themeIcon) DOM.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        if (DOM.themeText) {
            DOM.themeText.textContent = theme === 'dark' ?
                'Включить светлую тему' :
                'Включить тёмную тему';
        }
        Fire.update(theme === 'dark');
    },
};

const Fire = {
    init() {
        this.create();
        this.update(State.isAnimEnabled);
        DOM.animToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            State.isAnimEnabled = !State.isAnimEnabled;
            localStorage.setItem(CONFIG.ANIM_KEY, State.isAnimEnabled ? 'on' : 'off');
            this.update(State.isAnimEnabled);
        });
    },

    create() {
        const container = DOM.fireParticles;
        if (!container) return;
        const colors = [
            'rgba(255,200,50,0.8)', 'rgba(255,150,50,0.9)', 'rgba(255,100,20,0.7)',
            'rgba(255,220,80,0.8)', 'rgba(200,100,0,0.6)',
        ];
        for (let i = 0; i < 30; i++) {
            const p = Utils.el('div', {
                className: 'fire-particle'
            });
            const size = 6 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.cssText = `
                width:${size}px;height:${size}px;
                left:${Math.random() * 100}%;
                background:${color};
                box-shadow:0 0 ${size * 2}px ${size / 2}px ${color};
            `;
            p.style.setProperty('--duration', (6 + Math.random() * 10) + 's');
            p.style.setProperty('--delay', (Math.random() * 8) + 's');
            p.style.setProperty('--drift', ((Math.random() - 0.5) * 40) + 'vw');
            container.appendChild(p);
        }
    },

    update(enabled) {
        const container = DOM.fireParticles;
        if (!container) return;
        const particles = Utils.$$('.fire-particle', container);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (enabled && isDark) {
            if (DOM.animIcon) DOM.animIcon.textContent = '⛔';
            if (DOM.animText) DOM.animText.textContent = 'Выключить огоньки';
            container.style.opacity = '1';
            particles.forEach(p => {
                p.style.animation = '';
                p.style.opacity = '';
            });
        } else {
            if (DOM.animIcon) DOM.animIcon.textContent = '✨';
            if (DOM.animText) DOM.animText.textContent = 'Включить огоньки';
            container.style.opacity = '0';
            particles.forEach(p => {
                p.style.animation = 'none';
                p.style.opacity = '0';
            });
        }
    },
};

/*
 *  UI: ГЛОССАРИЙ
 */
const Glossary = {
    init() {
        DOM.glossaryCloseBtn?.addEventListener('click', () => this.close());
        DOM.glossaryFooterClose?.addEventListener('click', () => this.close());
        DOM.glossaryModal?.addEventListener('click', (e) => {
            if (e.target === DOM.glossaryModal) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.glossaryModal?.classList.contains('active')) this.close();
        });
    },
    close() {
        DOM.glossaryModal?.classList.remove('active');
        document.body.style.overflow = '';
    },
};

/*
 *  UI: ПРОЧИЕ МОДАЛКИ
 */
const InfoModals = {
    init() {
        const bind = (openBtn, modal, closeEls) => {
            if (!openBtn || !modal) return;
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                State.menuWasOpenBeforeModal = DOM.slideMenu?.classList.contains('open');
                if (State.menuWasOpenBeforeModal) Menu.close();
                Announcement.hideForModal();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            closeEls.forEach(el => el?.addEventListener('click', () => this.closeModal(modal)));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal);
            });
        };

        bind(DOM.howToBuyBtn, DOM.howToBuyModal, [DOM.howToBuyCloseBtn, DOM.howToBuyFooterClose]);
        bind(DOM.pickupBtn, DOM.pickupModal, [DOM.pickupCloseBtn, DOM.pickupFooterClose]);
        bind(DOM.jugglingNewsBtn, DOM.jugglingNewsModal, [DOM.jugglingNewsCloseBtn, DOM.jugglingNewsFooterClose]);
        bind(DOM.fireNewsBtn, DOM.fireNewsModal, [DOM.fireNewsCloseBtn, DOM.fireNewsFooterClose]);
        bind(DOM.festivalsBtn, DOM.festivalsModal, [DOM.festivalsCloseBtn, DOM.festivalsFooterClose]);

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            [DOM.howToBuyModal, DOM.pickupModal, DOM.jugglingNewsModal, DOM.fireNewsModal, DOM.festivalsModal]
            .forEach(m => {
                if (m?.classList.contains('active')) this.closeModal(m);
            });
        });
    },

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        Announcement.showAfterModal();
        if (State.menuWasOpenBeforeModal) {
            DOM.slideMenu?.classList.add('open');
            DOM.hamburger?.classList.add('active');
            DOM.overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
            State.menuWasOpenBeforeModal = false;
        }
        Scroll.handle();
    },
};

/*
 *  UI: ПАРТНЁРЫ (Лидеры цирковой сцены)
 */
const Partners = {
    init() {
        const header = DOM.partnersHeader;
        const collapsible = DOM.partnersCollapsible;
        if (!header || !collapsible) return;

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = collapsible.classList.toggle('open');
            DOM.partnersArrow?.classList.toggle('open');

            if (isOpen) {
                collapsible.style.display = 'block';
                // перезагрузка img для корректного отображения
                Utils.$$('img', collapsible).forEach(img => {
                    if (!img.complete || img.naturalWidth === 0) {
                        const src = img.src;
                        img.src = '';
                        img.src = src;
                    }
                });
                setTimeout(() => {
                    collapsible.style.opacity = '1';
                }, 50);
            } else {
                collapsible.style.opacity = '0';
                setTimeout(() => {
                    collapsible.style.display = 'none';
                }, 300);
            }
        });
    },
};

/*
 *  UI: НАСТРОЙКИ
 */
const Settings = {
    init() {
        const toggle = document.querySelector('.settings-toggle');
        const block = document.getElementById('settingsBlock');
        if (!toggle || !block) return;
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const hidden = block.style.display === 'none' || block.style.display === '';
            block.style.display = hidden ? 'block' : 'none';
        });
    },
};

/*
 *  UI: КОНТАКТЫ
 */
const Contacts = {
    init() {
        const toggle = document.querySelector('.contacts-toggle');
        const phoneBlock = document.getElementById('contactsPhoneBlock');
        const phone = document.getElementById('contactPhone');
        const actions = document.getElementById('contactsActions');
        if (!toggle || !phoneBlock) return;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            phoneBlock.classList.toggle('visible');
            if (!phoneBlock.classList.contains('visible')) actions?.classList.remove('visible');
        });
        phone?.addEventListener('click', (e) => {
            e.stopPropagation();
            actions?.classList.toggle('visible');
        });
    },
};

/*
 *  UI: ОФОРМЛЕНИЕ ЗАКАЗА
 */
const Checkout = {
    init() {
        DOM.cartIcon?.addEventListener('click', () => this.openCart());
        DOM.cartCloseBtn?.addEventListener('click', () => this.closeCart());
        DOM.cartModal?.addEventListener('click', (e) => {
            if (e.target === DOM.cartModal) this.closeCart();
        });

        DOM.checkoutBtn?.addEventListener('click', () => this.openCheckout());
        DOM.clearCartBtn?.addEventListener('click', () => {
            if (confirm('Очистить корзину?')) {
                Cart.clear();
                CartUI.renderModal();
                Toast.show('Корзина очищена');
            }
        });

        DOM.checkoutCloseBtn?.addEventListener('click', () => this.closeCheckout());
        DOM.checkoutBackBtn?.addEventListener('click', () => {
            this.closeCheckout();
            this.openCart();
        });
        DOM.checkoutModal?.addEventListener('click', (e) => {
            if (e.target === DOM.checkoutModal) this.closeCheckout();
        });
        DOM.submitOrderBtn?.addEventListener('click', () => this.submit());

        // доставка
        Utils.$$('input[name="delivery"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.toggleDeliveryBlock();
                this.updateTotal();
            });
        });
        this.toggleDeliveryBlock();
        this.updateTotal();
    },

    openCart() {
        Announcement.hideForModal();
        CartUI.renderModal();
        DOM.cartModal?.classList.add('active');
    },

    closeCart() {
        DOM.cartModal?.classList.remove('active');
        if (!DOM.checkoutModal?.classList.contains('active')) {
            Announcement.showAfterModal();
        }
        Scroll.handle();
    },

    openCheckout() {
        if (State.cart.length === 0) {
            Toast.show('⚠️ Корзина пуста');
            return;
        }
        const form = document.getElementById('checkoutForm');
        if (form) form.style.display = 'block';
        if (DOM.orderStatus) DOM.orderStatus.innerHTML = '';
        DOM.checkoutModal?.classList.add('active');
        Announcement.hideForModal();
        this.closeCart();
        this.updateTotal();
    },

    closeCheckout() {
        DOM.checkoutModal?.classList.remove('active');
        if (DOM.submitOrderBtn) {
            DOM.submitOrderBtn.disabled = false;
            DOM.submitOrderBtn.textContent = 'Отправить заказ';
        }
        State.isSubmitting = false;
        Announcement.showAfterModal();
        Scroll.handle();
    },

    toggleDeliveryBlock() {
        const selected = document.querySelector('input[name="delivery"]:checked');
        if (!selected) return;

        [DOM.moscowDelivery, DOM.cdekDelivery, DOM.cdekPickupBlock].forEach(el => {
            if (el) el.style.display = 'none';
        });

        if (selected.value === 'moscow') {
            if (DOM.moscowDelivery) DOM.moscowDelivery.style.display = 'block';
        } else if (selected.value === 'cdek') {
            if (DOM.cdekDelivery) DOM.cdekDelivery.style.display = 'block';
            if (DOM.cdekCity?.value.trim()) {
                if (DOM.cdekPickupBlock) DOM.cdekPickupBlock.style.display = 'block';
            }
        }
    },

    updateTotal() {
        const itemsPrice = Cart.totalPrice();
        const selected = document.querySelector('input[name="delivery"]:checked');
        let deliveryCost = 0;
        let deliveryText = '—';

        if (selected) {
            switch (selected.value) {
                case 'pickup':
                    deliveryCost = 0;
                    deliveryText = 'Самовывоз (0 ₽)';
                    break;
                case 'moscow':
                    deliveryCost = CONFIG.DELIVERY_COST_MOSCOW;
                    deliveryText = `Доставка по Москве (${CONFIG.DELIVERY_COST_MOSCOW} ₽)`;
                    break;
                case 'cdek':
                    deliveryCost = 0;
                    deliveryText = 'СДЭК (рассчитывается отдельно)';
                    break;
            }
        }

        if (DOM.checkoutTotalAmount) DOM.checkoutTotalAmount.textContent = Utils.formatPrice(itemsPrice);
        if (DOM.checkoutDeliveryInfo) DOM.checkoutDeliveryInfo.textContent = deliveryText;
        if (DOM.checkoutGrandTotal) DOM.checkoutGrandTotal.textContent = Utils.formatPrice(itemsPrice + deliveryCost);
    },

    submit() {
        if (State.isSubmitting) return;
        if (State.cart.length === 0) {
            DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Корзина пуста</span>';
            return;
        }

        const name = DOM.customerName?.value.trim() || 'Не указано';
        const phone = DOM.customerPhone?.value.trim() || 'Не указан';
        const email = DOM.customerEmail?.value.trim() || 'Не указан';
        const comment = DOM.customerComment?.value.trim() || 'Нет';

        const deliveryType = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
        let address = '';
        let deliveryInfo = '';

        if (deliveryType === 'moscow') {
            const city = document.getElementById('moscowCity')?.value.trim() || '';
            const street = document.getElementById('moscowStreet')?.value.trim() || '';
            const house = document.getElementById('moscowHouse')?.value.trim() || '';
            const flat = document.getElementById('moscowFlat')?.value.trim() || '';
            if (!street || !house) {
                DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Заполните улицу и номер дома</span>';
                return;
            }
            address = `${city}, ${street} ${house}${flat ? ', кв. ' + flat : ''}`;
            deliveryInfo = 'Доставка по Москве (курьером)';
        } else if (deliveryType === 'cdek') {
            const city = DOM.cdekCity?.value.trim() || '';
            const pickup = DOM.cdekPickup?.value || '';
            if (!State.cities.length) {
                DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Список городов ещё не загружен, подождите...</span>';
                return;
            }
            if (!city) {
                DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Введите город</span>';
                return;
            }
            if (!State.cities.some(c => c.toLowerCase() === city.toLowerCase())) {
                DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Город не найден. Выберите из списка подсказок.</span>';
                return;
            }
            if (!pickup) {
                DOM.orderStatus.innerHTML = '<span style="color:#ef4444;">⚠️ Выберите пункт выдачи</span>';
                return;
            }
            address = `г. ${city}, пункт выдачи: ${pickup}`;
            deliveryInfo = 'Доставка СДЭК';
        } else {
            address = 'Самовывоз (Москва, ул. Космонавтов, д. 14, корп. 2)';
            deliveryInfo = 'Самовывоз';
        }

        State.isSubmitting = true;
        const btn = DOM.submitOrderBtn;
        btn.disabled = true;
        btn.textContent = '⏳ Оформление...';
        DOM.orderStatus.innerHTML = '<span class="spinner"></span> Оформление заказа...';

        const total = Utils.formatPrice(Cart.totalPrice());
        const now = new Date();
        const orderDate = now.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const itemsText = State.cart.map((item, i) => {
            const unit = item.totalPrice || Utils.parsePrice(item.price);
            const itemTotal = Utils.formatPrice(unit * item.quantity);
            const variantText = item.variant ? ` (вариант: ${item.variant.name})` : '';
            const colorText = item.color ? ` (цвет: ${item.color.name})` : '';
            const optionsText = item.options?.length ? ` (опции: ${item.options.map(o => o.name).join(', ')})` : '';
            return `${i + 1}. ${item.name}${variantText}${colorText}${optionsText} — ${item.price} × ${item.quantity} = ${itemTotal}`;
        }).join('\n');

        const fileContent =
            `🧾 ЗАКАЗ №${String(Date.now()).slice(-6)}\n\n` +
            `📅 Дата: ${orderDate}\n` +
            `👤 Имя: ${name}\n` +
            `📞 Телефон: ${phone}\n` +
            `📧 Email: ${email}\n` +
            `🏠 Адрес: ${address}\n` +
            `🚚 Способ доставки: ${deliveryInfo}\n` +
            `📝 Комментарий: ${comment}\n\n` +
            `Товары:\n${itemsText}\n\nИТОГО: ${total}\n`;

        const dateStr = now.toISOString().slice(0, 10);
        const timeStr = [
            String(now.getHours()).padStart(2, '0'),
            String(now.getMinutes()).padStart(2, '0'),
            String(now.getSeconds()).padStart(2, '0'),
        ].join('-');
        Utils.downloadTextFile(`заказ_${dateStr}_${timeStr}.txt`, fileContent);

        // сохранение заказа
        const orders = Utils.safeJSON(localStorage.getItem(CONFIG.ORDERS_KEY)) || [];
        orders.push({
            id: Date.now(),
            date: orderDate,
            name,
            phone,
            email,
            address,
            delivery: deliveryInfo,
            comment,
            items: State.cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                options: item.options || [],
                totalPrice: (item.totalPrice || Utils.parsePrice(item.price)) * item.quantity,
            })),
            total: total + '',
            status: 'new',
        });
        localStorage.setItem(CONFIG.ORDERS_KEY, JSON.stringify(orders));

        Cart.clear();
        CartUI.renderModal();
        this.showSuccess();
        this.closeCheckout();
        State.isSubmitting = false;
    },

    showSuccess() {
        const overlay = DOM.orderSuccessOverlay;
        if (!overlay) return;
        overlay.classList.add('active');
        let seconds = 5;
        const interval = setInterval(() => {
            if (--seconds <= 0) {
                clearInterval(interval);
                overlay.classList.remove('active');
            }
        }, 1000);
        overlay.onclick = () => {
            clearInterval(interval);
            overlay.classList.remove('active');
        };
    },
};

/*
 *  UI: АВТОДОПОЛНЕНИЕ ГОРОДОВ/СТРАН
 */
const Autocomplete = {
    init() {
        this.initCountry();
        this.initCity();
        this.initPickupInput();
    },

    initCountry() {
        const input = DOM.cdekCountry;
        const box = DOM.countrySuggestions;
        if (!input || !box) return;

        input.addEventListener('input', () => {
            const val = input.value.toLowerCase();
            if (val.length < 2) {
                box.style.display = 'none';
                return;
            }
            const matched = COUNTRY_LIST.filter(c => c.toLowerCase().includes(val));
            box.innerHTML = matched.map(c =>
                `<div style="padding:6px 12px;cursor:pointer;border-bottom:1px solid var(--border-card);" data-value="${c.replace(/"/g, '&quot;')}">${c}</div>`
            ).join('');
            box.style.display = matched.length ? 'block' : 'none';
        });

        box.addEventListener('click', (e) => {
            const item = e.target.closest('div');
            if (!item) return;
            input.value = item.dataset.value;
            box.style.display = 'none';
        });

        input.addEventListener('blur', () => setTimeout(() => {
            box.style.display = 'none';
        }, 200));
    },

    initCity() {
        const input = DOM.cdekCity;
        const box = DOM.citySuggestions;
        if (!input || !box) return;

        input.addEventListener('input', () => {
            const val = input.value.trim().toLowerCase();
            if (val.length < 2) {
                box.style.display = 'none';
                return;
            }
            const matched = State.cities.filter(c => c.toLowerCase().includes(val));
            box.innerHTML = matched.map(c =>
                `<div style="padding:6px 12px;cursor:pointer;border-bottom:1px solid var(--border-card);" data-value="${c.replace(/"/g, '&quot;')}">${c}</div>`
            ).join('');
            box.style.display = matched.length ? 'block' : 'none';
        });

        box.addEventListener('click', (e) => {
            const item = e.target.closest('div');
            if (!item) return;
            input.value = item.dataset.value;
            box.style.display = 'none';
            Api.loadPickupPoints(input.value);
        });

        input.addEventListener('blur', () => setTimeout(() => {
            box.style.display = 'none';
        }, 200));

        // дебаунс загрузки пунктов (пользователь печатает город в поле, а запрос к серверу за пунктами выдачи отправляется не на каждую букву, а только когда он перестал печатать)
        const debouncedLoad = Utils.debounce((city) => {
            if (city.length >= 2) Api.loadPickupPoints(city);
            else if (DOM.cdekPickupBlock) DOM.cdekPickupBlock.style.display = 'none';
        }, 400);
        input.addEventListener('input', () => debouncedLoad(input.value.trim()));
    },

    initPickupInput() {
        const input = DOM.cdekPickupInput;
        const box = DOM.pickupSuggestions;
        if (!input || !box) return;

        input.addEventListener('input', () => {
            const val = input.value.trim().toLowerCase();
            if (val.length < 2) {
                box.style.display = 'none';
                return;
            }
            const matched = State.pickupPoints.filter(addr => addr.toLowerCase().includes(val));
            box.innerHTML = matched.map(addr =>
                `<div style="padding:6px 12px;cursor:pointer;border-bottom:1px solid var(--border-card);" data-value="${addr.replace(/"/g, '&quot;')}">${addr}</div>`
            ).join('');
            box.style.display = matched.length ? 'block' : 'none';
        });

        box.addEventListener('click', (e) => {
            const item = e.target.closest('div');
            if (!item) return;
            const value = item.dataset.value;
            input.value = value;
            box.style.display = 'none';
            const select = DOM.cdekPickup;
            if (select) {
                for (const opt of select.options) {
                    if (opt.value === value) {
                        select.value = value;
                        break;
                    }
                }
            }
        });

        input.addEventListener('blur', () => setTimeout(() => {
            box.style.display = 'none';
        }, 200));
    },
};

/*
 *  ИНИЦИАЛИЗАЦИЯ
 */
async function loadAllImages() {
    const catalog = DOM.catalogContainer;
    if (catalog) {
        catalog.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);">⏳ Загрузка изображений...</div>';
    }

    // логотипы
    const logoUrl = CONFIG.LOGO_FILE ? CONFIG.GITHUB_BASE_URL + CONFIG.LOGO_FILE : null;
    [DOM.logoImage, DOM.menuLogo, DOM.mobileLogo].forEach(img => {
        if (!img) return;
        if (logoUrl) {
            img.src = logoUrl;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    });

    // нормализация URL изображений товаров
    for (const product of State.products) {
        if (product.imageFile) product.image = CONFIG.GITHUB_BASE_URL + product.imageFile;
        if (product.images?.length) {
            product.images = product.images.map(img => CONFIG.GITHUB_BASE_URL + img);
        }
        if (product.colors?.length) {
            for (const color of product.colors) {
                if (color.name === 'Стандарт') {
                    color.image = product.image;
                    continue;
                }
                if (color.image && !color.image.startsWith('http')) {
                    color.image = CONFIG.GITHUB_BASE_URL + color.image;
                }
            }
        }
    }

    await CatalogUI.loadCategoryIcons();
    CatalogUI.renderCategories();
    CatalogUI.renderSubcategories();
    CatalogUI.renderCatalog();
}

async function init() {
    cacheDOM();

    // загрузка данных
    Cart.load();
    await Api.loadProducts();
    await loadAllImages();

    // глобальные UI-модули
    Theme.init();
    Fire.init();
    Announcement.init();
    Scroll.init();
    Menu.init();
    Glossary.init();
    InfoModals.init();
    Partners.init();
    Settings.init();
    Contacts.init();

    // каталог и корзина
    DropdownCatalog.init();
    DesktopDropdowns.init();
    CartUI.bindEvents();
    Checkout.init();
    Modal.bindGlobalEvents();
    Autocomplete.init();

    // категории
    Categories.updateVisibility();
    Categories.addFade();
    Categories.observe();
    DOM.toggleCategoriesBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        State.showCategories = !State.showCategories;
        localStorage.setItem(CONFIG.CATEGORIES_VISIBLE_KEY, State.showCategories);
        Categories.updateVisibility();
    });
    window.addEventListener('resize', () => Categories.updateVisibility());

    // партнёры (после загрузки логотипов)
    await Api.loadPartnerLogos();

    // города
    await Api.loadCities();

    // сортировка
    DOM.sortSelect?.addEventListener('change', (e) => {
        State.sortOrder = e.target.value;
        CatalogUI.renderCatalog();
    });
}

// старт (ПОЕХАЛИ! 😊 )
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}