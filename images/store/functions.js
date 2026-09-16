const JSON_CACHE_KEY = 'firemag_json_info';
const LOGO_FILE = 'images/store/icons/logo.png';
const ANNOUNCEMENT_TEXT = 'ВНИМАНИЕ! НОВЫЕ ПОСТУПЛЕНИЯ НА СКЛАД: Булавы от производителя Henrys - Delphin Long, Delphin Short, Loop, Loop Grip, кольца Standard, а также мячи, бинбеги и чехлы от отечественного производителя!';
const PARTNERS = [{
    name: 'Партнёр 1',
    file: 'images/store/icons/rosgos.png',
    url: 'https://www.circus.ru'
}, {
    name: 'Партнёр 2',
    file: 'images/store/icons/great-circus.png',
    url: 'https://www.greatcircus.ru'
}, {
    name: 'Партнёр 3',
    file: 'images/store/icons/gutsei.png',
    url: 'https://gutsei.ru'
}, ];

const glossary = {
    "Радиосинхронизация": "Радиосинхронизация позволяет синхронизировать несколько единиц реквизита по радиоканалу. Достаточно нажать кнопку на одном устройстве, и все остальные автоматически подстроятся под его режим, что упрощает управление шоу-программами.",
    "Стабилизация изображения": "Стабилизация изображения - это технология, которая автоматически подстраивает отображение картинки под скорость вращения. Рисунок не растягивается и не сжимается, оставаясь чётким при любой частоте вращения.",
    "Автоматизация": "Автоматизация позволяет легко создавать шоу-программы: достаточно поместить нужные картинки в папку, и устройство само составит программу с автоматическим переключением режимов через заданный интервал (по умолчанию 6 секунд).",
    "Энергосбережение": "Энергосберегающий режим продлевает время работы устройства в 3 раза при одном нажатии. Особенно полезно на длительных выездах, фото- и видеосъёмках, а также при выступлениях в тёмных помещениях, где высокая яркость не требуется.",
    "Базовый вариант": "Стафф конвертор + Пои, БЕЗ стабилизатора изображения, БЕЗ радиосинхронизации",
    "PRO комплект": "Стафф конвертор + Пои, стабилизатор изображения + радиосинхронизация",
    "Базовая комплектация": "БЕЗ стабилизатора изображения, БЕЗ радиосинхронизации",
    "Комплектация PRO": "Стабилизатор изображения + радиоинхронизация"
};

let products = [];
let defaultProducts = [];
let announcementHiddenByScroll = false;
let menuWasOpenBeforeModal = false;
let announcementHiddenByModal = false;
let pickupPoints = [];

async function loadProducts() {
    const saved = localStorage.getItem(JSON_CACHE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Date.now() - parsed.timestamp < 3600000) {
                products = parsed.products;
                console.log('Используется кеш, товаров:', products.length);
                return;
            }
        } catch (e) {
            console.warn('Ошибка парсинга кеша JSON', e);
        }
    }

    const url = 'catalog.json';
    try {
        console.log('Загрузка catalog.json с GitHub...');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length) {
            products = data;
            localStorage.setItem(JSON_CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                products: products
            }));
            console.log('Загружено с GitHub, товаров:', products.length);
            return;
        }
    } catch (error) {
        console.warn('Ошибка загрузки catalog.json с GitHub:', error);
    }

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            products = parsed.products;
            console.log('Используется старый кеш, товаров:', products.length);
            return;
        } catch (e) {}
    }

    products = JSON.parse(JSON.stringify(defaultProducts));
    console.log('Используется встроенный массив, товаров:', products.length);
}

async function loadPartnerLogos() {
    const partnersContainer = document.querySelector('.partners-logos');
    if (!partnersContainer)
        return;

    partnersContainer.innerHTML = '';

    const preloadImages = PARTNERS.map(partner => {
        const url = GITHUB_BASE_URL + partner.file;
        const img = new Image();
        img.src = url;
        return img.decode();
    });
    await Promise.all(preloadImages);

    for (const partner of PARTNERS) {
        const imageUrl = GITHUB_BASE_URL + partner.file;

        const link = document.createElement('a');
        link.href = partner.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = partner.name;
        img.loading = 'eager';
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/80x40/cccccc/666666?text=' + encodeURIComponent(partner.name);
        };

        link.appendChild(img);
        partnersContainer.appendChild(link);
    }
}

const categoryIconsMap = {
    'Реквизит для жонглирования': 'images/store/icons/juggling.png',
    'Реквизит для тренировок': 'images/store/icons/workout.png',
    'Светодиодный реквизит': 'images/store/icons/led.png',
    'Реквизит для фаершоу': 'images/store/icons/fire.png',
    'Реквизит для эквилибра': 'images/store/icons/equilibre.png',
    'Специальные предложения': 'images/store/icons/special_offer.png',
    'Сертификаты': 'images/store/icons/certificate.png'
};

const CATEGORY_ORDER = [
    'Реквизит для жонглирования',
    'Реквизит для тренировок',
    'Светодиодный реквизит',
    'Реквизит для фаершоу',
    'Реквизит для эквилибра',
    'Специальные предложения',
    'Сертификаты'
];

const categoryTextColors = {
    'Реквизит для жонглирования': '#ff00ff',
    'Реквизит для фаершоу': '#ff4500',
    'Светодиодный реквизит': '#00ffff',
    'Реквизит для тренировок': '#00cc66',
    'Реквизит для эквилибра': '#ffaa00',
    'Сертификаты': '#e84393',
    'Специальные предложения': '#00bfff'
};

let cities = [];
let cart = [];
let activeCategory = null;
let activeSubcategory = 'Все';
let sortOrder = 'default';
let isAnimEnabled = localStorage.getItem('firemag_anim') === 'on';
let currentModalProduct = null;
let currentCardImg = null;
let thumbnailElements = [];
let categoryIconCache = {};

const deliveryBtn = document.getElementById('deliveryBtn');
const pickupBtn = document.getElementById('pickupBtn');

const desktopDeliveryBtn = document.getElementById('desktopDeliveryBtn');
const desktopPickupBtn = document.getElementById('desktopPickupBtn');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalSpecList = document.getElementById('modalSpecList');
const modalColors = document.getElementById('modalColors');
const modalGallery = document.getElementById('modalGallery');
const closeBtns = [
    document.getElementById('modalCloseBtn'),
    document.getElementById('modalFooterClose')
];
const glossaryModal = document.getElementById('glossaryModal');
const glossaryCloseBtn = document.getElementById('glossaryCloseBtn');
const glossaryFooterClose = document.getElementById('glossaryFooterClose');

const countryInput = document.getElementById('cdekCountry');
const suggestions = document.getElementById('countrySuggestions');

const cityInput = document.getElementById('cdekCity');
const citySuggestions = document.getElementById('citySuggestions');

const toggleBtn = document.getElementById('toggleCategoriesBtn');
const categoriesIcon = document.getElementById('categoriesIcon');
const categoriesText = document.getElementById('categoriesText');

deliveryBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    pickupDropdown.classList.remove('show');
    deliveryDropdown.classList.toggle('show');
});

pickupBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    deliveryDropdown.classList.remove('show');
    pickupDropdown.classList.toggle('show');
});

document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target.closest('.desktop-delivery-btn') && !target.closest('#dropdownDelivery') &&
        !target.closest('.desktop-pickup-btn') && !target.closest('#dropdownPickup')) {}
});

let showCategories = localStorage.getItem('firemag_show_categories') === 'true';

function updateCategoriesVisibility() {
    const isMobile = window.innerWidth <= 600;
    if (isMobile) {
        if (showCategories) {
            document.body.classList.add('categories-visible');
            document.body.classList.remove('categories-hidden');
            categoriesIcon.textContent = '🚫';
            categoriesText.textContent = 'Скрыть иконки категорий';
        } else {
            document.body.classList.remove('categories-visible');
            document.body.classList.add('categories-hidden');
            categoriesIcon.textContent = '👁️';
            categoriesText.textContent = 'Показать иконки категорий';
        }
    } else {
        document.body.classList.remove('categories-hidden', 'categories-visible');
    }
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showCategories = !showCategories;
        localStorage.setItem('firemag_show_categories', showCategories);
        updateCategoriesVisibility();
    });
}

function selectCity(city) {
    cityInput.value = city;
    citySuggestions.style.display = 'none';
    loadPickupPoints(city);
}

cityInput.addEventListener('input', function() {
    const val = this.value.trim().toLowerCase();
    if (val.length < 2) {
        citySuggestions.style.display = 'none';
        return;
    }
    const matched = cities.filter(c => c.toLowerCase().includes(val));
    if (matched.length) {
        citySuggestions.innerHTML = matched.map(c =>
            `<div style="padding:6px 12px; cursor:pointer; border-bottom:1px solid var(--border-card);" onclick="selectCity('${c.replace(/'/g, "\\'")}')">${c}</div>`
        ).join('');
        citySuggestions.style.display = 'block';
    } else {
        citySuggestions.style.display = 'none';
    }
});

cityInput.addEventListener('blur', function() {
    setTimeout(() => {
        citySuggestions.style.display = 'none';
    }, 200);
});

const countryList = [
    'Адыгея (Республика Адыгея)',
    'Алтай (Республика Алтай)',
    'Армения',
    'Башкортостан',
    'Беларусь',
    'Бурятия',
    'Дагестан',
    'Ингушетия',
    'Кабардино-Балкария',
    'Казахстан',
    'Калмыкия',
    'Карачаево-Черкесия',
    'Карелия',
    'Коми',
    'Кыргызстан',
    'Марий Эл',
    'Мордовия',
    'Россия',
    'Северная Осетия - Алания',
    'Татарстан',
    'Тыва',
    'Удмуртия',
    'Хакасия',
    'Чечня',
    'Чувашия',
    'Якутия (Республика Саха)'
];

countryInput.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    if (val.length < 2) {
        suggestions.style.display = 'none';
        return;
    }
    const matched = countryList.filter(c => c.toLowerCase().includes(val));
    if (matched.length) {
        suggestions.innerHTML = matched.map(c =>
            `<div style="padding:6px 12px; cursor:pointer; border-bottom:1px solid var(--border-card);" onclick="selectCountry('${c.replace(/'/g, "\\'")}')">${c}</div>`
        ).join('');
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
});

countryInput.addEventListener('blur', function() {
    setTimeout(() => {
        suggestions.style.display = 'none';
    }, 200);
});

function selectCountry(country) {
    countryInput.value = country;
    suggestions.style.display = 'none';
}

function loadCart() {
    const saved = localStorage.getItem('firemag_cart');
    if (saved)
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('firemag_cart', JSON.stringify(cart));
    updateCartUI();
    renderCartModal();
}

function addToCart(product) {
    if (isProductOutOfStock(product)) {
        showToast('⚠️ Товар временно недоступен');
        return;
    }
    const key = product.id + '|';
    const existing = cart.find(item => item.uniqueKey === key);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            options: [],
            totalPrice: null,
            optionKey: '',
            uniqueKey: key,
            image: product.image,
        });
    }
    saveCart();
    showToast('Товар ' + product.name + ' добавлен в корзину!');
}

function removeFromCart(key) {
    cart = cart.filter(item => item.uniqueKey !== key);
    saveCart();
    renderCartModal();
}

function clearCart() {
    cart = [];
    saveCart();
    renderCartModal();
}

function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
}

function parseOptionsFromSpecs(specs) {
    const options = [];
    if (!specs)
        return options;
    const optionLine = specs.find(s => s.trim().toLowerCase().startsWith('дополнительно:'));
    if (!optionLine)
        return options;
    const parts = optionLine.replace(/^ДОПОЛНИТЕЛЬНО\s*:/i, '').trim();
    const items = parts.split(',').map(s => s.trim()).filter(s => s);
    for (const item of items) {
        const match = item.match(/^(.*?)\s*-\s*([\d\s]+)\s*₽$/);
        if (match) {
            options.push({
                name: match[1].trim(),
                price: parseInt(match[2].replace(/\s/g, ''), 10)
            });
        } else {
            const match2 = item.match(/^(.*?)\s*-\s*([\d\s]+)$/);
            if (match2) {
                options.push({
                    name: match2[1].trim(),
                    price: parseInt(match2[2].replace(/\s/g, ''), 10)
                });
            } else {
                options.push({
                    name: item.trim(),
                    price: 0
                });
            }
        }
    }
    return options;
}

function parseVariants(specs) {
    const variants = [];
    if (!specs)
        return variants;
    const variantLine = specs.find(s => {
        const lower = s.trim().toLowerCase();
        return lower.startsWith('выбрать другой вариант товара:') ||
            lower.startsWith('выбрать версию реквизита:');
    });
    if (!variantLine)
        return variants;

    const parts = variantLine.replace(/^ВЫБРАТЬ ДРУГОЙ ВАРИАНТ ТОВАРА\s*:|^ВЫБРАТЬ ВЕРСИЮ РЕКВИЗИТА\s*:/i, '').trim();
    const items = parts.split(',').map(s => s.trim()).filter(s => s);
    for (const item of items) {
        const match = item.match(/^(.*?)\s*-\s*([\d\s]+)\s*₽$/);
        if (match) {
            variants.push({
                name: match[1].trim(),
                price: parseInt(match[2].replace(/\s/g, ''), 10)
            });
        } else {
            const match2 = item.match(/^(.*?)\s*-\s*([\d\s]+)$/);
            if (match2) {
                variants.push({
                    name: match2[1].trim(),
                    price: parseInt(match2[2].replace(/\s/g, ''), 10)
                });
            }
        }
    }
    return variants;
}

function addToCartWithOptions(product, options, totalPrice, variant, color) {
    if (isProductOutOfStock(product)) {
        showToast('⚠️ Товар временно недоступен');
        return;
    }
    const optionKey = options.map(o => o.name).sort().join('|');
    const variantKey = variant ? variant.name : '';
    const colorKey = color ? color.name : '';
    const uniqueKey = product.id + '|' + optionKey + '|' + variantKey + '|' + colorKey;

    const existing = cart.find(item => item.uniqueKey === uniqueKey);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            totalPrice: totalPrice,
            options: options,
            optionKey: optionKey,
            variant: variant || null,
            variantKey: variantKey,
            color: color || null,
            colorKey: colorKey,
            uniqueKey: uniqueKey,
            quantity: 1,
            image: product.image,
        });
    }
    saveCart();
}

function addToCartWithColor(product, color) {
    if (isProductOutOfStock(product)) {
        showToast('⚠️ Товар временно недоступен');
        return;
    }
    const colorKey = color ? color.name : '';
    const uniqueKey = product.id + '|||' + colorKey;

    const existing = cart.find(item => item.uniqueKey === uniqueKey);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
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
            colorKey: colorKey,
            uniqueKey: uniqueKey,
        });
    }
    saveCart();
    showToast('Товар ' + product.name + (color ? ' (' + color.name + ')' : '') + ' добавлен в корзину!');
}

function getTotalPriceWithOptions() {
    return cart.reduce((sum, item) => {
        const unitPrice = item.totalPrice || parsePrice(item.price);
        return sum + unitPrice * item.quantity;
    }, 0);
}

function updateCheckoutTotal() {
    const totalItemsPrice = getTotalPriceWithOptions();
    const selected = document.querySelector('input[name="delivery"]:checked');
    let deliveryCost = 0;
    let deliveryText = '';

    if (selected) {
        switch (selected.value) {
            case 'pickup':
                deliveryCost = 0;
                deliveryText = 'Самовывоз (0 ₽)';
                break;
            case 'moscow':
                deliveryCost = 300;
                deliveryText = 'Доставка по Москве (300 ₽)';
                break;
            case 'cdek':
                deliveryCost = 0;
                deliveryText = 'СДЭК (рассчитывается отдельно)';
                break;
            default:
                deliveryCost = 0;
                deliveryText = '—';
        }
    }

    const totalWithDelivery = totalItemsPrice + deliveryCost;

    document.getElementById('checkoutTotalAmount').textContent = totalItemsPrice.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('checkoutDeliveryInfo').textContent = deliveryText;
    document.getElementById('checkoutGrandTotal').textContent = totalWithDelivery.toLocaleString('ru-RU') + ' ₽';
}

function updateModalPrice(product) {
    const variantRadio = document.querySelector('input[name="product-variant"]:checked');
    let basePrice = parsePrice(product.price);
    if (variantRadio) {
        basePrice = parseInt(variantRadio.dataset.price, 10);
    }

    const checkboxes = window._modalCheckboxes || [];
    let total = basePrice;
    checkboxes.forEach(cb => {
        if (cb.checked) total += parseInt(cb.dataset.price, 10);
    });

    const titleEl = document.getElementById('modalTitle');
    if (titleEl) {
        titleEl.innerHTML = product.name + ' • ' + total.toLocaleString('ru-RU') + ' ₽';
        titleEl.querySelectorAll('.modal-badge').forEach(el => el.remove());
        if (product.badge) {
            const badges = product.badge.split(',').map(s => s.trim()).filter(s => s);
            badges.forEach(b => {
                const badgeSpan = document.createElement('span');
                badgeSpan.className = 'modal-badge ' + getBadgeClass(b);
                badgeSpan.textContent = b;
                titleEl.appendChild(badgeSpan);
            });
        }
    }

    window._currentTotalPrice = total;
    window._selectedVariantPrice = basePrice;
}

function getBadgeClass(badge) {
    if (!badge)
        return '';
    const b = badge.toLowerCase();
    if (b.includes('новинк') || b.includes('новый'))
        return 'badge-new';
    if (b.includes('хит'))
        return 'badge-hit';
    if (b.includes('предзаказ'))
        return 'badge-preorder';
    if (b.includes('есть в наличии') || b.includes('в наличии'))
        return 'badge-instock';
    if (b.includes('новое поступление'))
        return 'badge-newstock';
    if (b.includes('закончился') || b.includes('нет в наличии'))
        return 'badge-outofstock';
    if (b.includes('скоро поступление') || b.includes('ожидается'))
        return 'badge-comingsoon';
    if (b.includes('спеццена') || b.includes('спец цена'))
        return 'badge-special-price';
    return '';
}

function isProductOutOfStock(product) {
    if (!product || !product.badge)
        return false;
    const b = product.badge.toLowerCase();
    return b.includes('закончился') || b.includes('нет в наличии');
}

function getTotalPrice() {
    return cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9]/g, ''));
        return sum + price * item.quantity;
    }, 0);
}

function updateCartUI() {
    const countEl = document.getElementById('cartCount');
    const hintEl = document.querySelector('.cart-empty-hint');
    const cartIcon = document.querySelector('.cart-icon');
    if (!countEl || !cartIcon) return;

    const totalItems = getTotalItems();
    const totalSum = getTotalPriceWithOptions();

    if (totalItems === 0) {
        countEl.style.display = 'none';
        cartIcon.classList.remove('has-items');
        if (hintEl) {
            hintEl.style.display = 'inline';
        }
    } else {
        countEl.style.display = 'inline-flex';
        countEl.textContent = totalSum.toLocaleString('ru-RU') + ' ₽';
        cartIcon.classList.add('has-items');
        if (hintEl) {
            hintEl.style.display = 'none';
        }
    }
}

function changeQuantity(key, delta) {
    const item = cart.find(i => i.uniqueKey === key);
    if (!item)
        return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
        removeFromCart(key);
    } else {
        item.quantity = newQty;
        saveCart();
    }
}

function updateLayout(barHeight) {
    const topBar = document.getElementById('topBar');
    const header = document.querySelector('.header-wrapper');
    const announcementBar = document.getElementById('announcementBar');

    let announcementHeight = 0;
    if (announcementBar && announcementBar.style.display !== 'none' && !announcementBar.classList.contains('hidden')) {
        announcementHeight = announcementBar.offsetHeight || 40;
    }

    const totalOffset = (barHeight || 0) + announcementHeight;

    if (topBar) {
        topBar.style.top = totalOffset + 'px';
    }
    if (header) {
        header.style.marginTop = (totalOffset + 80) + 'px';
    }
}

function showAnnouncement() {
    if (!ANNOUNCEMENT_TEXT) return;
    if (localStorage.getItem('announcement_closed') === 'true') return;
    const oldBar = document.getElementById('announcementBar');
    if (oldBar) oldBar.remove();

    const bar = document.createElement('div');
    bar.className = 'announcement-bar';
    bar.id = 'announcementBar';
    bar.innerHTML = `
        <div class="marquee-wrapper">
            <span class="marquee-text">${ANNOUNCEMENT_TEXT}</span>
        </div>
        <button class="announcement-close" id="announcementClose">✕</button>
    `;

    document.body.prepend(bar);

    setTimeout(() => {
        updateLayout(0);
    }, 50);

    const closeBtn = bar.querySelector('.announcement-close');
    closeBtn.addEventListener('click', function() {
        bar.style.display = 'none';
        localStorage.setItem('announcement_closed', 'true');
        setTimeout(() => updateLayout(0), 100);
    });
}

function initAnnouncement() {
    const bar = document.getElementById('announcementBar');
    if (!bar) {
        console.warn('Анонс не найден в DOM');
        return;
    }

    console.log('Анонс найден, инициализация...');

    if (localStorage.getItem('announcement_closed') === 'true') {
        bar.style.display = 'none';
        updateLayout(0);
        return;
    }

    const closeBtn = document.getElementById('announcementClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            bar.style.display = 'none';
            localStorage.setItem('announcement_closed', 'true');
            setTimeout(() => updateLayout(0), 100);
        });
    }

    bar.style.display = 'flex';
    bar.classList.remove('hidden');

    setTimeout(() => {
        updateLayout(0);
        console.log('Отступы обновлены, высота анонса:', bar.offsetHeight);
    }, 100);
}

function renderCartModal() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container)
        return;
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        totalEl.textContent = '';
        return;
    }
    let html = '';
    cart.forEach(item => {
        const basePrice = parsePrice(item.price);
        const unitPrice = item.totalPrice || basePrice;
        const itemTotal = unitPrice * item.quantity;
        const thumb = item.image || 'https://via.placeholder.com/50/cccccc/666666?text=No+img';

        let variantText = '';
        if (item.variant) {
            variantText = ' (вариант: ' + item.variant.name + ')';
        }
        let optionsText = '';
        if (item.options && item.options.length > 0) {
            optionsText = ' (+ ' + item.options.map(o => o.name).join(', ') + ')';
        }
        let colorText = '';
        if (item.color) {
            colorText = ' (цвет: ' + item.color.name + ')';
        }

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img class="cart-item-thumb" src="${thumb}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${item.price} ${variantText} ${colorText} ${optionsText} × ${item.quantity} = ${itemTotal.toLocaleString('ru-RU')} ₽</span>
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
            </div>
        `;
    });
    container.innerHTML = html;
    const total = getTotalPriceWithOptions();
    totalEl.innerHTML = '<span>Итого:</span><span>' + total.toLocaleString('ru-RU') + ' ₽</span>';

    container.querySelectorAll('.qty-plus, .qty-minus').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            changeQuantity(this.dataset.key, parseInt(this.dataset.delta));
        });
    });
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(this.dataset.key);
        });
    });
}

let isSubmitting = false;

function sendOrder() {
    if (isSubmitting)
        return;
    if (cart.length === 0) {
        document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Корзина пуста</span>';
        return;
    }

    const name = document.getElementById('customerName').value.trim() || 'Не указано';
    const phone = document.getElementById('customerPhone').value.trim() || 'Не указан';
    const email = document.getElementById('customerEmail').value.trim() || 'Не указан';
    const comment = document.getElementById('customerComment').value.trim() || 'Нет';

    const deliveryType = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
    let address = '';
    let deliveryInfo = '';

    if (deliveryType === 'moscow') {
        const country = document.getElementById('moscowCountry').value.trim();
        const city = document.getElementById('moscowCity').value.trim();
        const street = document.getElementById('moscowStreet').value.trim();
        const house = document.getElementById('moscowHouse').value.trim();
        const flat = document.getElementById('moscowFlat').value.trim();

        if (!street || !house) {
            document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Заполните улицу и номер дома</span>';
            return;
        }
        address = `${city}, ${street} ${house}${flat ? ', кв. ' + flat : ''}`;
        deliveryInfo = 'Доставка по Москве (курьером)';
    } else if (deliveryType === 'cdek') {
        const city = document.getElementById('cdekCity').value.trim();
        const pickup = document.getElementById('cdekPickup').value;
        const cityExists = cities.some(c => c.toLowerCase() === city.toLowerCase());

        if (!cities.length) {
            document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Список городов ещё не загружен, подождите...</span>';
            return;
        }

        if (!city) {
            document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Введите город</span>';
            return;
        }
        if (!cityExists) {
            document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Город не найден. Выберите из списка подсказок.</span>';
            return;
        }
        if (!pickup) {
            document.getElementById('orderStatus').innerHTML = '<span style="color:#ef4444;">⚠️ Выберите пункт выдачи</span>';
            return;
        }
        address = `г. ${city}, пункт выдачи: ${pickup}`;
        deliveryInfo = 'Доставка СДЭК';
    } else if (deliveryType === 'pickup') {
        address = 'Самовывоз (Москва, ул. Космонавтов, д. 14, корп. 2)';
        deliveryInfo = 'Самовывоз';
    }

    isSubmitting = true;
    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Оформление...';
    const statusEl = document.getElementById('orderStatus');
    statusEl.innerHTML = '<span class="spinner"></span> Оформление заказа...';

    const total = getTotalPriceWithOptions().toLocaleString('ru-RU');
    const now = new Date();
    const orderDate = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let itemsText = cart.map((item, index) => {
        const unitPrice = item.totalPrice || parsePrice(item.price);
        const totalPrice = (unitPrice * item.quantity).toLocaleString('ru-RU');
        let optionsText = '';
        if (item.options && item.options.length > 0) {
            optionsText = ' (опции: ' + item.options.map(o => o.name).join(', ') + ')';
        }
        let variantText = '';
        if (item.variant) {
            variantText = ' (вариант: ' + item.variant.name + ')';
        }
        let colorText = '';
        if (item.color) {
            colorText = ' (цвет: ' + item.color.name + ')';
        }
        return (index + 1) + '. ' + item.name + variantText + colorText + optionsText + ' — ' + item.price + ' × ' + item.quantity + ' = ' + totalPrice + ' ₽';
    }).join('\n');

    const fileContent = `🧾 ЗАКАЗ №${String(Date.now()).slice(-6)}\n\n📅 Дата: ${orderDate}\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}\n🏠 Адрес: ${address}\n🚚 Способ доставки: ${deliveryInfo}\n📝 Комментарий: ${comment}\n\nТовары:\n${itemsText}\n\nИТОГО: ${total} ₽\n`;

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, fileContent], {
        type: 'text/plain;charset=utf-8'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = String(now.getHours()).padStart(2, '0') + '-' + String(now.getMinutes()).padStart(2, '0') + '-' + String(now.getSeconds()).padStart(2, '0');
    link.download = 'заказ_' + dateStr + '_' + timeStr + '.txt';
    document.body.appendChild(link);
    link.click();

    const orders = JSON.parse(localStorage.getItem('firemag_orders') || '[]');
    const newOrder = {
        id: Date.now(),
        date: orderDate,
        name: name,
        phone: phone,
        email: email,
        address: address,
        delivery: deliveryInfo,
        comment: comment,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            options: item.options || [],
            totalPrice: (item.totalPrice || parsePrice(item.price)) * item.quantity
        })),
        total: total + ' ₽',
        status: 'new'
    };
    orders.push(newOrder);
    localStorage.setItem('firemag_orders', JSON.stringify(orders));

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    cart = [];
    saveCart();
    renderCartModal();
    updateCartUI();
    showSuccessNotification();

    document.getElementById('checkoutModal').classList.remove('active');
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заказ';
    statusEl.innerHTML = '';
}

function showSuccessNotification() {
    const overlay = document.getElementById('orderSuccessOverlay');
    overlay.classList.add('active');
    let seconds = 5;
    const interval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(interval);
            overlay.classList.remove('active');
        }
    }, 1000);
    overlay.onclick = function() {
        clearInterval(interval);
        overlay.classList.remove('active');
    };
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

function getCategories() {
    const cats = new Set(products.map(p => p.category));
    const available = Array.from(cats);

    const sorted = available.sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a);
        const indexB = CATEGORY_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1)
            return indexA - indexB;
        if (indexA !== -1)
            return -1;
        if (indexB !== -1)
            return 1;
        return 0;
    });

    return sorted;
}

function getSubcategories(category) {
    const targetCategory = category && category !== 'Все' ? category : null;
    let subs;
    if (!targetCategory) {
        subs = new Set(products.map(p => p.subcategory).filter(s => s && s.trim() !== ''));
    } else {
        subs = new Set(products.filter(p => p.category === targetCategory).map(p => p.subcategory).filter(s => s && s.trim() !== ''));
    }
    return ['Все', ...Array.from(subs).sort()];
}

function getFilteredProducts() {
    let filtered = products.filter(p => {
        const catMatch = !activeCategory || p.category === activeCategory;
        const subMatch = activeSubcategory === 'Все' || p.subcategory === activeSubcategory;
        return catMatch && subMatch;
    });

    if (sortOrder === 'price-asc') {
        filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9]/g, '')) - parseFloat(b.price.replace(/[^0-9]/g, '')));
    } else if (sortOrder === 'price-desc') {
        filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9]/g, '')) - parseFloat(a.price.replace(/[^0-9]/g, '')));
    } else if (sortOrder === 'hit-first') {
        filtered.sort((a, b) => {
            const aHit = a.badge && a.badge.toLowerCase().includes('хит');
            const bHit = b.badge && b.badge.toLowerCase().includes('хит');
            if (aHit && !bHit)
                return -1;
            if (!aHit && bHit)
                return 1;
            return 0;
        });
    } else if (sortOrder === 'new-first') {
        filtered.sort((a, b) => {
            const getPriority = (badge) => {
                if (!badge) return 0;
                const lower = badge.toLowerCase();
                if (lower.includes('новинк')) return 2;
                if (lower.includes('новое поступление')) return 1;
                return 0;
            };
            const prioA = getPriority(a.badge);
            const prioB = getPriority(b.badge);
            return prioB - prioA;
        });
    } else if (sortOrder === 'special-first') {
        filtered.sort((a, b) => {
            const aSpecial = a.badge && a.badge.toLowerCase().includes('спеццена');
            const bSpecial = b.badge && b.badge.toLowerCase().includes('спеццена');
            if (aSpecial && !bSpecial) return -1;
            if (!aSpecial && bSpecial) return 1;
            return 0;
        });
    }

    return filtered;
}

/*function createColorSwatches(product, imgElement) {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-swatches';
    if (product.customizable || product.parts) {
        return wrapper;
    }
    if (!product.colors || product.colors.length === 0)
        return wrapper;

    const label = document.createElement('span');
    label.className = 'color-swatches-label';
    label.textContent = '🎨';
    wrapper.appendChild(label);

    const colors = product.colors;
    const isHoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    colors.forEach((color, idx) => {
        const swatch = document.createElement('span');
        swatch.className = 'color-swatch' + (idx === 0 ? ' active-swatch' : '');
        if (color.name === 'Стандарт') {
            swatch.style.background = '#cccccc';
            swatch.style.border = '2px solid #888';
        } else {
            swatch.style.background = color.hex;
        }
        swatch.dataset.colorName = color.name;
        swatch.title = '';

        swatch.addEventListener('click', function(e) {
            e.stopPropagation();
            Utils.setActiveSwatch(this, product, imgElement);
        });

        if (isHoverSupported && !product.customizable) {
            const displayName = color.name === 'Стандарт' ? 'Все' : color.name;
            swatch.addEventListener('mouseenter', function(e) {
                const tooltip = document.getElementById('termTooltip');
                if (!tooltip)
                    return;
                tooltip.textContent = displayName;
                tooltip.classList.add('visible');

                const rect = this.getBoundingClientRect();
                let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
                let top = rect.top - tooltip.offsetHeight - 1;

                if (left < 10)
                    left = 10;
                if (left + tooltip.offsetWidth > window.innerWidth - 10) {
                    left = window.innerWidth - tooltip.offsetWidth - 10;
                }
                if (top < 10) {
                    top = rect.bottom + 10;
                }

                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
            });

            swatch.addEventListener('mouseleave', function() {
                const tooltip = document.getElementById('termTooltip');
                if (tooltip)
                    tooltip.classList.remove('visible');
            });
        }

        wrapper.appendChild(swatch);
    });

    return wrapper;
}*/
	
	function createColorSwatches(product, imgElement) {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-swatches';

    if (!product.colors || product.colors.length === 0) return wrapper;

    let colors = [...product.colors];
    const hasAll = colors.some(c => c.name === 'Все' || c.name === 'Стандарт');
    if (!hasAll) {
        colors.unshift({ name: 'Все', hex: '#ffffff', image: product.image });
    }

    colors.forEach((color, idx) => {
        const swatch = document.createElement('span');
        swatch.className = 'color-swatch' + (idx === 0 ? ' active-swatch' : '');

        if (color.name === 'Белый/Чёрный') {
            swatch.style.background = 'conic-gradient(#000000 0deg 180deg, #ffffff 180deg 360deg)';
            swatch.style.border = '1px solid #888';
        } else if (color.name === 'Все' || color.name === 'Стандарт') {
            swatch.style.background = 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)';
            swatch.style.border = '1px solid #888';
        } else {
            swatch.style.background = color.hex || '#cccccc';
        }
        swatch.dataset.colorName = color.name;
        swatch.title = color.name;

        swatch.addEventListener('click', (e) => {
            e.stopPropagation();
            Utils.setActiveSwatch(swatch, product, imgElement);
        });

        wrapper.appendChild(swatch);
    });

    const first = wrapper.querySelector('.color-swatch');
    if (first) Utils.setActiveSwatch(first, product, imgElement);

    return wrapper;
}

async function loadCategoryIcons() {
    const categories = getCategories();
    for (const cat of categories) {
        const fileName = categoryIconsMap[cat];
        if (!fileName)
            continue;
        categoryIconCache[cat] = GITHUB_BASE_URL + fileName;
    }
}

function renderCategories() {
    const row = document.getElementById('categoriesRow');
    const categories = getCategories();
    row.innerHTML = '';

    categories.forEach(cat => {
        const wrapper = document.createElement('div');
        wrapper.className = 'category-icon-wrapper' + (cat === activeCategory ? ' active' : '');
        wrapper.dataset.category = cat;

        const img = document.createElement('img');
        img.className = 'category-icon-img';
        img.alt = cat;
        img.loading = 'lazy';

        const setFallback = () => {
            img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23d1d5db'/%3E%3Ctext x='60' y='78' font-size='48' text-anchor='middle' fill='%2364748b' font-family='Arial' font-weight='bold'%3E${cat.charAt(0)}%3C/text%3E%3C/svg%3E`;
            img.style.background = 'var(--bg-photo)';
            img.style.padding = '12px';
        };

        const iconUrl = categoryIconCache[cat];
        if (iconUrl) {
            img.src = iconUrl;
            img.onerror = function() {
                console.warn('Не удалось загрузить иконку для "' + cat + '"');
                setFallback();
            };
        } else {
            setFallback();
            console.warn('Нет ссылки на иконку для категории "' + cat + '"');
        }
        img.style.background = 'var(--bg-photo)';

        const label = document.createElement('span');
        label.className = 'category-icon-label';
        const count = products.filter(p => p.category === cat).length;
        label.textContent = cat;

        wrapper.appendChild(img);
        wrapper.appendChild(label);

        wrapper.addEventListener('click', () => {
            activeCategory = cat;
            activeSubcategory = 'Все';
            renderCategories();
            renderSubcategories();
            renderCatalog();
        });

        row.appendChild(wrapper);
    });
    checkOverflow();
}

function renderSubcategories() {
    const row = document.getElementById('subcategoriesRow');
    const subcategories = getSubcategories(activeCategory);
    row.innerHTML = '';

    if (subcategories.length === 0 || (subcategories.length === 1 && subcategories[0] === 'Все' && activeCategory !== null && activeCategory !== 'Все')) {
        const empty = document.createElement('span');
        empty.className = 'subcategories-empty';
        empty.textContent = 'Нет подкатегорий';
        row.appendChild(empty);
        return;
    }

    subcategories.forEach(sub => {
        const btn = document.createElement('button');
        btn.className = 'subcategory-btn' + (sub === activeSubcategory ? ' active' : '');

        let count;
        if (sub === 'Все') {
            count = !activeCategory || activeCategory === 'Все' ? products.length : products.filter(p => p.category === activeCategory).length;
        } else {
            count = !activeCategory || activeCategory === 'Все' ? products.filter(p => p.subcategory === sub).length : products.filter(p => p.category === activeCategory && p.subcategory === sub).length;
        }

        btn.textContent = sub;
        btn.dataset.subcategory = sub;

        btn.addEventListener('click', () => {
            activeSubcategory = sub;
            renderSubcategories();
            renderCatalog();
        });

        row.appendChild(btn);
    });
}

function renderCatalog() {
    const catalog = document.getElementById('catalogContainer');
    const filtered = getFilteredProducts();
    catalog.innerHTML = '';
    if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.style.cssText = 'grid-column:1/-1; text-align:center; padding:3rem 0; color:var(--text-muted); font-size:1.1rem;';
        empty.textContent = '😕 Товаров в этой категории нет';
        catalog.appendChild(empty);
        return;
    }
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const photoWrap = document.createElement('div');
        photoWrap.className = 'photo-wrapper';
        photoWrap.dataset.id = product.id;

        if (product.badge) {
            const badges = product.badge.split(',').map(s => s.trim()).filter(s => s);
            const leftContainer = document.createElement('div');
            leftContainer.className = 'badge-left';
            const rightContainer = document.createElement('div');
            rightContainer.className = 'badge-right';

            badges.forEach(b => {
                const badgeEl = document.createElement('div');
                badgeEl.className = 'product-badge ' + getBadgeClass(b);
                badgeEl.textContent = b;
                const lower = b.toLowerCase();
                const isStatus = lower.includes('есть в наличии') || lower.includes('в наличии') ||
                    lower.includes('закончился') || lower.includes('нет в наличии');
                if (isStatus) {
                    rightContainer.appendChild(badgeEl);
                } else {
                    leftContainer.appendChild(badgeEl);
                }
            });

            if (leftContainer.children.length > 0)
                photoWrap.appendChild(leftContainer);
            if (rightContainer.children.length > 0)
                photoWrap.appendChild(rightContainer);
        }

        const img = document.createElement('img');
        let initialImage = product.image;
        if (product.colors && product.colors.length > 0) {
            const firstColor = product.colors[0];
            if (firstColor.name === 'Стандарт') {
                initialImage = product.image;
            } else {
                initialImage = Utils.getColorImageUrl(firstColor, product);
            }
        }
        img.src = initialImage || 'https://via.placeholder.com/400x400/cccccc/666666?text=Нет+фото';
        img.alt = product.name;
        img.loading = 'lazy';
        photoWrap.appendChild(img);

        const info = document.createElement('div');
        info.className = 'card-info';

        const name = document.createElement('div');
        name.className = 'product-name';
        name.textContent = product.name;

        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = product.price;

        const tag = document.createElement('div');
        tag.className = 'product-category-tag';

        const catSpan = document.createElement('span');
        catSpan.className = 'category-link';
        catSpan.textContent = product.category;
        catSpan.style.cursor = 'pointer';
        catSpan.style.textDecoration = 'underline dotted var(--text-hint)';
        catSpan.style.textUnderlineOffset = '2px';
        catSpan.style.pointerEvents = 'auto';

        catSpan.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Клик по категории:', product.category);
            activeCategory = product.category;
            activeSubcategory = 'Все';
            renderCategories();
            renderSubcategories();
            renderCatalog();
            document.querySelector('.catalog').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        tag.appendChild(catSpan);

        if (product.subcategory) {
            const sep = document.createTextNode(' › ');
            tag.appendChild(sep);

            const subSpan = document.createElement('span');
            subSpan.className = 'subcategory-link';
            subSpan.textContent = product.subcategory;
            subSpan.style.cursor = 'pointer';
            subSpan.style.textDecoration = 'underline dotted var(--text-hint)';
            subSpan.style.textUnderlineOffset = '2px';
            subSpan.style.pointerEvents = 'auto';

            subSpan.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Клик по подкатегории:', product.subcategory);
                activeCategory = product.category;
                activeSubcategory = product.subcategory;
                renderCategories();
                renderSubcategories();
                renderCatalog();
                document.querySelector('.catalog').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });

            tag.appendChild(subSpan);
        }

        const addIcon = document.createElement('button');
        addIcon.className = 'add-to-cart-icon';
        addIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
        addIcon.setAttribute('aria-label', 'Добавить в корзину');
        addIcon.title = 'Добавить в корзину';

        if (isProductOutOfStock(product)) {
            addIcon.disabled = true;
            addIcon.title = 'Товар отсутствует';
        } else {
            addIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.product-card');
                const activeSwatch = card.querySelector('.color-swatch.active-swatch');
                let selectedColor = null;
                if (activeSwatch) {
                    const colorName = activeSwatch.dataset.colorName;
                    if (colorName) {
                        const colorData = product.colors.find(c => c.name === colorName);
                        if (colorData) {
                            selectedColor = {
                                name: colorData.name,
                                hex: colorData.hex
                            };
                        }
                    }
                }
                addToCartWithColor(product, selectedColor);
            });
        }

        const colorSwatches = createColorSwatches(product, img);
        if (!product.customizable && colorSwatches.children.length > 1) {
            info.appendChild(colorSwatches);
        }

        const priceCartWrapper = document.createElement('div');
        priceCartWrapper.className = 'price-cart-wrapper';
        priceCartWrapper.style.display = 'flex';
        priceCartWrapper.style.justifyContent = 'space-between';
        priceCartWrapper.style.alignItems = 'center';
        priceCartWrapper.style.marginTop = 'auto';

        priceCartWrapper.appendChild(price);
        priceCartWrapper.appendChild(addIcon);

        info.appendChild(tag);
        info.appendChild(name);
        if (colorSwatches.children.length > 0)
            info.appendChild(colorSwatches);
        info.appendChild(priceCartWrapper);

        card.appendChild(photoWrap);
        card.appendChild(info);
        catalog.appendChild(card);

        photoWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id, 10);
            const prod = products.find(p => p.id === id);
            if (prod)
                openModal(prod, img);
        });
    });
}

function addScrollHelpers() {
    const wrapper = document.querySelector('.categories-wrapper');
    if (!wrapper) return;
    const oldFade = wrapper.querySelector('.categories-fade');
    if (oldFade) oldFade.remove();
    const fade = document.createElement('div');
    fade.className = 'categories-fade';
    wrapper.appendChild(fade);
}

function scheduleOverflowCheck() {
    requestAnimationFrame(() => {
        setTimeout(checkOverflow, 50);
    });
}

function observeCategories() {
    const row = document.getElementById('categoriesRow');
    if (!row) return;
    const observer = new MutationObserver(() => {
        scheduleOverflowCheck();
    });
    observer.observe(row, {
        childList: true,
        subtree: true
    });
    window.addEventListener('resize', scheduleOverflowCheck);
    scheduleOverflowCheck();
}

function checkOverflow() {
    const wrapper = document.querySelector('.categories-wrapper');
    if (!wrapper) return;
    const row = wrapper.querySelector('.categories-row');
    if (!row) return;
    const hasOverflow = row.scrollWidth > wrapper.clientWidth;
    wrapper.classList.toggle('has-overflow', hasOverflow);
}

function checkOverflow() {
    const wrapper = document.querySelector('.categories-wrapper');
    if (!wrapper) return;
    const row = wrapper.querySelector('.categories-row');
    if (!row) return;

    const hasOverflow = row.scrollWidth > wrapper.clientWidth;
    wrapper.classList.toggle('has-overflow', hasOverflow);
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addScrollHelpers();
        checkOverflow();
    }, 300);

    window.addEventListener('resize', checkOverflow);
});

function setupDragScroll() {
    const containers = document.querySelectorAll('.color-swatches');
    containers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

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
            if (!isDown)
                return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 0.8;
            container.scrollLeft = scrollLeft - walk;
        });

        container.style.cursor = 'grab';
    });
}

function closeGlossary() {
    glossaryModal.classList.remove('active');
    document.body.style.overflow = '';
}

glossaryCloseBtn.addEventListener('click', closeGlossary);
glossaryFooterClose.addEventListener('click', closeGlossary);
glossaryModal.addEventListener('click', function(e) {
    if (e.target === this)
        closeGlossary();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && glossaryModal.classList.contains('active')) {
        closeGlossary();
    }
});

function openModal(product, cardImgElement) {

    hideAnnouncementForModal();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.innerWidth > 768) {
        modalOverlay.classList.add('modal-fullscreen');
        const fullscreenBtn = document.getElementById('modalFullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.title = 'Свернуть';
        }
    }
    currentCardImg = cardImgElement;
    currentModalProduct = product;

    let titleText = product.name + ' • ' + product.price;
    modalTitle.innerHTML = titleText;
    if (product.badge) {
        const badges = product.badge.split(',').map(s => s.trim()).filter(s => s);
        badges.forEach(b => {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'modal-badge ' + getBadgeClass(b);
            badgeSpan.textContent = b;
            modalTitle.appendChild(badgeSpan);
        });
    }

    let defaultImage = product.image;
    if (cardImgElement && cardImgElement.src) {
        defaultImage = cardImgElement.src;
    }
    if (!defaultImage || defaultImage.includes('placeholder')) {
        defaultImage = product.image;
    }
    modalImage.src = defaultImage;
    modalImage.alt = product.name;
    modalDescription.innerHTML = product.description;

    const termsContainer = document.getElementById('modalTermsContainer');
    const termsList = document.getElementById('modalTermsList');
    const productTerms = product.terms || [];
    const isHoverSupported = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (productTerms.length > 0) {
        termsContainer.style.display = 'block';

        let hint = termsContainer.querySelector('.terms-hint');
        if (!hint) {
            hint = document.createElement('div');
            hint.className = 'terms-hint';
            hint.style.cssText = 'font-size:0.75rem; color:var(--text-muted); margin-bottom:0.4rem;';
            hint.textContent = '💡 Наведите курсор или коснитесь термина для пояснения';
            termsContainer.prepend(hint);
        }
        termsList.innerHTML = '';

        productTerms.forEach(termName => {
            const definition = glossary[termName];
            if (!definition)
                return;

            const termSpan = document.createElement('span');
            termSpan.className = 'term';
            termSpan.dataset.term = termName;
            termSpan.textContent = termName;

            termSpan.addEventListener('click', function(e) {
                e.stopPropagation();
                if (window.innerWidth >= 768)
                    return;

                const term = this.dataset.term;
                if (glossary[term]) {
                    document.getElementById('glossaryTitle').textContent = term;
                    document.getElementById('glossaryText').textContent = glossary[term];
                    document.getElementById('glossaryModal').classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            if (isHoverSupported) {
                termSpan.addEventListener('mouseenter', function(e) {
                    const tooltip = document.getElementById('glossaryTooltip');
                    const term = this.dataset.term;
                    if (glossary[term]) {
                        tooltip.textContent = glossary[term];
                        tooltip.classList.add('visible');

                        const rect = this.getBoundingClientRect();
                        let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
                        let top = rect.top - tooltip.offsetHeight - 10;

                        if (left < 10)
                            left = 10;
                        if (left + tooltip.offsetWidth > window.innerWidth - 10) {
                            left = window.innerWidth - tooltip.offsetWidth - 10;
                        }
                        if (top < 10) {
                            top = rect.bottom + 10;
                        }

                        tooltip.style.left = left + 'px';
                        tooltip.style.top = top + 'px';
                    }
                });

                termSpan.addEventListener('mouseleave', function() {
                    document.getElementById('glossaryTooltip').classList.remove('visible');
                });

                termSpan.addEventListener('mouseleave', function() {
                    document.getElementById('termTooltip').classList.remove('visible');
                });
            }

            termsList.appendChild(termSpan);
        });

        if (termsList.children.length === 0) {
            termsContainer.style.display = 'none';
        }
    } else {
        termsContainer.style.display = 'none';
    }

    modalDescription.querySelectorAll('.term').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            const term = this.dataset.term;
            if (glossary[term]) {
                document.getElementById('glossaryTitle').textContent = term;
                document.getElementById('glossaryText').textContent = glossary[term];
                document.getElementById('glossaryModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => {
            if (color.name === 'Стандарт') {
                color.imageIndex = -1;
                return;
            }
            if (color.imageIndex !== undefined && color.imageIndex !== null)
                return;
            let foundIndex = -1;
            if (product.image && color.image && product.image === color.image) {
                foundIndex = -1;
            } else if (product.images && product.images.length > 0) {
                const imgList = [product.image, ...product.images];
                for (let i = 0; i < imgList.length; i++) {
                    if (imgList[i] && color.image && imgList[i] === color.image) {
                        foundIndex = i - 1;
                        break;
                    }
                }

                if (foundIndex === -1 && color.image) {
                    const colorFileName = color.image.split('/').pop();
                    for (let i = 0; i < product.images.length; i++) {
                        const imgFileName = product.images[i].split('/').pop();
                        if (imgFileName === colorFileName) {
                            foundIndex = i;
                            break;
                        }
                    }
                }
            }
            color.imageIndex = foundIndex;
        });
    }

    modalGallery.innerHTML = '';
    thumbnailElements = [];

    const allImages = [];
    if (product.image) allImages.push(product.image);
    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            if (img) allImages.push(img);
        });
    }

    if (allImages.length === 0) {
        allImages.push('https://via.placeholder.com/400x400/cccccc/666666?text=Нет+фото');
    }

    if (allImages.length <= 1) {
        modalGallery.style.display = 'none';
    } else {
        modalGallery.style.display = 'flex';
        allImages.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.className = 'modal-gallery-thumb' + (index === 0 ? ' active' : '');
            thumb.src = imgSrc || 'https://via.placeholder.com/70/cccccc/666666?text=No+img';
            thumb.alt = 'Фото ' + (index + 1);
            thumb.loading = 'lazy';
            thumb.dataset.url = imgSrc;

            let colorIdx = -1;
            if (index === 0) {
                colorIdx = 0;
            } else {
                const imgIdx = index - 1;
                for (let c = 0; c < product.colors.length; c++) {
                    if (product.colors[c].imageIndex === imgIdx) {
                        colorIdx = c;
                        break;
                    }
                }
            }
            thumb.dataset.colorIndex = colorIdx;

            thumb.onerror = function() {
                this.src = 'https://via.placeholder.com/70/cccccc/666666?text=No+img';
            };

            modalGallery.appendChild(thumb);
            thumbnailElements.push(thumb);
        });
		initGalleryScrollArrow();

        modalGallery.addEventListener('click', function(e) {
            const thumb = e.target.closest('.modal-gallery-thumb');
            if (!thumb)
                return;

            const newSrc = thumb.dataset.url || thumb.src;
            modalImage.src = newSrc || 'https://via.placeholder.com/400x400/cccccc/666666?text=Фото+недоступно';
            document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            let colorIndex = -1;
            if (thumb.dataset.colorIndex !== undefined) {
                colorIndex = parseInt(thumb.dataset.colorIndex);
            }

            const colorRadios = document.querySelectorAll('#modalColors input[type="radio"]');
            colorRadios.forEach(radio => {
                const radioColorIndex = parseInt(radio.dataset.colorIndex);
                radio.checked = (radioColorIndex === colorIndex);
            });

            document.querySelectorAll('.modal-color-swatch').forEach((sw, idx) => {
                sw.classList.toggle('active-modal-color', idx === colorIndex);
            });
            if (currentCardImg) {
                const cardSwatches = currentCardImg.closest('.product-card').querySelectorAll('.color-swatch');
                cardSwatches.forEach((sw, idx) => {
                    sw.classList.toggle('active-swatch', idx === colorIndex);
                });
                currentCardImg.src = modalImage.src;
            }
        });
    }

    modalColors.innerHTML = '';
    const displayColors = product.colors ? product.colors.filter(c => c.name !== 'Стандарт' && c.name !== 'Все') : [];
    if (displayColors.length > 0) {
        modalColors.style.display = 'flex';
        const label = document.createElement('span');
        label.className = 'modal-colors-label';
        label.textContent = 'Цвет:';
        modalColors.appendChild(label);

        displayColors.forEach((color, idx) => {
            const option = document.createElement('label');
            option.className = 'modal-color-option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'modal-color-select';
            radio.value = idx;
            const originalIndex = product.colors.findIndex(c => c.name === color.name);
            radio.dataset.colorIndex = originalIndex;
            radio.dataset.colorName = color.name;
            radio.dataset.colorHex = color.hex;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = color.name;

            option.appendChild(radio);
            option.appendChild(nameSpan);
            modalColors.appendChild(option);

            radio.addEventListener('change', function() {
                const colorIndex = parseInt(this.dataset.colorIndex);
                const colorData = product.colors[colorIndex];
                const imageUrl = Utils.getColorImageUrl(colorData, product);
                modalImage.src = imageUrl || 'https://via.placeholder.com/400x400/cccccc/666666?text=Фото+недоступно';
                if (currentCardImg)
                    currentCardImg.src = imageUrl;

                thumbnailElements.forEach(thumb => {
                    if (thumb.dataset.colorIndex !== undefined && parseInt(thumb.dataset.colorIndex) === colorIndex) {
                        thumb.classList.add('active');
                    } else {
                        thumb.classList.remove('active');
                    }
                });

                if (currentCardImg) {
                    const cardSwatches = currentCardImg.closest('.product-card').querySelectorAll('.color-swatch');
                    cardSwatches.forEach((sw, i) => {
                        sw.classList.toggle('active-swatch', i === colorIndex);
                    });
                }
            });
        });
    } else {
        modalColors.style.display = 'none';
    }

    modalSpecList.innerHTML = '';
    if (product.specs && product.specs.length) {
        let specsHTML = '';
        product.specs.forEach(spec => {
            const lowerSpec = spec.trim().toLowerCase();
            if (lowerSpec.startsWith('дополнительно:') ||
                lowerSpec.startsWith('выбрать другой вариант товара:') ||
                lowerSpec.startsWith('выбрать версию реквизита:')) {
                return;
            }

            const sepIndex = spec.indexOf(':');
            let liHTML = '';
            if (sepIndex !== -1) {
                const label = spec.substring(0, sepIndex).trim();
                const value = spec.substring(sepIndex + 1).trim();

                let extraClass = '';
                if (value.length > 30) {
                    extraClass = ' spec-long-value';
                }

                liHTML = `<li class="spec-item${extraClass}">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${value}</span>
                      </li>`;
            } else {
                liHTML = `<li class="spec-item"><span class="spec-value">${spec}</span></li>`;
            }
            specsHTML += liHTML;
        });
        modalSpecList.innerHTML = specsHTML;
    }

    const specItems = modalSpecList.querySelectorAll('li');
    if (specItems.length > 15) {
        specItems.forEach((item, index) => {
            if (index >= 15) {
                item.style.display = 'none';
            }
        });
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Показать все (' + (specItems.length - 15) + ')';
        showMoreBtn.className = 'btn-show-more';
        showMoreBtn.addEventListener('click', function() {
            const hiddenItems = modalSpecList.querySelectorAll('li[style*="display: none"]');
            hiddenItems.forEach(item => item.style.display = 'flex');
            this.style.display = 'none';
        });
        modalSpecList.appendChild(showMoreBtn);
    }

    const optionsContainer = document.getElementById('modalOptionsContainer');
    const optionsList = document.getElementById('modalOptionsList');
    optionsList.innerHTML = '';
    const opts = parseOptionsFromSpecs(product.specs);
    if (opts.length > 0) {
        optionsContainer.style.display = 'block';
        window._modalCheckboxes = [];
        opts.forEach(opt => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:flex; align-items:center; margin-bottom:6px; cursor:pointer;';

            const input = document.createElement('input');
            if (opt.price > 0) {
                input.type = 'checkbox';
            } else {
                input.type = 'radio';
                input.name = 'free-option';
            }
            input.dataset.name = opt.name;
            input.dataset.price = opt.price;
            input.style.cssText = 'margin:0 8px 0 0; width:16px; height:16px; flex-shrink:0;';
            input.style.accentColor = 'var(--price-color)';

            const textSpan = document.createElement('span');
            textSpan.textContent = opt.name + (opt.price > 0 ? ' (+' + opt.price.toLocaleString('ru-RU') + ' ₽)' : '');
            textSpan.style.cssText = 'font-size:.95rem; color:var(--text-secondary); line-height:1;';

            wrapper.appendChild(input);
            wrapper.appendChild(textSpan);
            optionsList.appendChild(wrapper);
            window._modalCheckboxes.push(input);
            input.addEventListener('change', function() {
                updateModalPrice(product);
            });
        });
    } else {
        optionsContainer.style.display = 'none';
        window._modalCheckboxes = [];
    }

    const variantsContainer = document.getElementById('modalVariantsContainer');
    const variantsList = document.getElementById('modalVariantsList');
    variantsList.innerHTML = '';
    const variantOptions = parseVariants(product.specs);
    if (variantOptions.length > 0) {
        variantsContainer.style.display = 'block';
        variantOptions.forEach((v, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:flex; align-items:center; margin-bottom:8px; cursor:pointer;';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'product-variant';
            radio.value = v.name;
            radio.dataset.price = v.price;
            radio.dataset.name = v.name;
            if (index === 0)
                radio.checked = true;
            radio.style.cssText = 'margin:0 8px 0 0; width:16px; height:16px; flex-shrink:0;';
            radio.style.accentColor = '';

            const textSpan = document.createElement('span');
            textSpan.textContent = v.name + ' - ' + v.price.toLocaleString('ru-RU') + ' ₽';
            textSpan.style.cssText = 'font-size:.95rem; color:var(--text-secondary); line-height:1;';

            wrapper.appendChild(radio);
            wrapper.appendChild(textSpan);
            variantsList.appendChild(wrapper);

            radio.addEventListener('change', function() {
                updateModalPrice(product);
            });
        });
        window._selectedVariantPrice = variantOptions[0].price;
    } else {
        variantsContainer.style.display = 'none';
        window._selectedVariantPrice = parsePrice(product.price);
    }

    updateModalPrice(product);

    const customizerContainer = document.getElementById('customizerContainer');
    const customizerGrid = document.getElementById('customizerGrid');

    if (product.customizable && product.parts) {
        customizerContainer.style.display = 'block';
        customizerGrid.innerHTML = '';

        window._getCustomColors = function() {
            const colors = {};
            document.querySelectorAll('#customizerGrid select').forEach(sel => {
                colors[sel.dataset.part] = sel.value;
            });
            return colors;
        };

        function updateClubPreview(colors) {
            const modelFolder = product.model ? product.model + '/' : '';
            const baseUrl = GITHUB_BASE_URL + 'images/clubs/custom/' + modelFolder;
            Object.keys(colors).forEach(part => {
                const img = document.getElementById('preview-' + part);
                if (img) {
                    img.src = baseUrl + part + '_' + colors[part] + '.png';
                }
            });
        }

        const parts = product.parts;
        Object.keys(parts).forEach(partKey => {
            const part = parts[partKey];
            const wrapper = document.createElement('div');
            wrapper.className = 'customizer-item';

            const label = document.createElement('label');
            label.textContent = part.label + ': ';

            const select = document.createElement('select');
            select.dataset.part = partKey;
            part.colors.forEach(color => {
                const opt = document.createElement('option');
                opt.value = color;
                opt.textContent = color.charAt(0).toUpperCase() + color.slice(1);
                select.appendChild(opt);
            });
            select.value = part.colors[0];

            wrapper.appendChild(label);
            wrapper.appendChild(select);
            customizerGrid.appendChild(wrapper);

            select.addEventListener('change', function() {
                updateClubPreview(window._getCustomColors());
            });
        });

        const initialColors = window._getCustomColors();
        updateClubPreview(initialColors);

        window._currentCustomProduct = product;
    } else {
        customizerContainer.style.display = 'none';
        window._getCustomColors = null;
        window._currentCustomProduct = null;
    }

    const modalAddBtn = document.getElementById('modalAddToCartBtn');
    const modalAddText = document.getElementById('modalAddToCartText');
    if (isProductOutOfStock(product)) {
        modalAddText.textContent = 'Нет в наличии';
        modalAddBtn.disabled = true;
        modalAddBtn.style.opacity = '0.6';
        modalAddBtn.style.cursor = 'default';
        modalAddBtn.style.pointerEvents = 'none';
    } else {
        modalAddText.textContent = 'В корзину';
        modalAddBtn.disabled = false;
        modalAddBtn.style.opacity = '';
        modalAddBtn.style.cursor = '';
        modalAddBtn.style.pointerEvents = '';
    }
}

function restoreModalHandlers(product) {
    document.querySelectorAll('#modalTermsList .term').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            const term = this.dataset.term;
            if (glossary[term]) {
                document.getElementById('glossaryTitle').textContent = term;
                document.getElementById('glossaryText').textContent = glossary[term];
                document.getElementById('glossaryModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const gallery = document.getElementById('modalGallery');
    if (gallery) {
        const newGallery = gallery.cloneNode(true);
        gallery.parentNode.replaceChild(newGallery, gallery);
        document.getElementById('modalGallery').addEventListener('click', function(e) {
            const thumb = e.target.closest('.modal-gallery-thumb');
            if (!thumb)
                return;
            const modalImage = document.getElementById('modalImage');
            const newSrc = thumb.dataset.url || thumb.src;
            modalImage.src = newSrc || 'https://via.placeholder.com/400x400/cccccc/666666?text=Фото+недоступно';
            document.querySelectorAll('.modal-gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            if (currentCardImg) {
                currentCardImg.src = modalImage.src;
            }
        });
    }

    document.querySelectorAll('#modalColors input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const colorIndex = parseInt(this.dataset.colorIndex);
            const colorData = product.colors[colorIndex];
            const imageUrl = Utils.getColorImageUrl(colorData, product);
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageUrl || 'https://via.placeholder.com/400x400/cccccc/666666?text=Фото+недоступно';
            if (currentCardImg)
                currentCardImg.src = imageUrl;
            document.querySelectorAll('.modal-gallery-thumb').forEach(thumb => {
                if (thumb.dataset.colorIndex !== undefined && parseInt(thumb.dataset.colorIndex) === colorIndex) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
        });
    });

    document.querySelectorAll('#modalOptionsList input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            updateModalPrice(product);
        });
    });

    document.querySelectorAll('#modalVariantsList input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateModalPrice(product);
        });
    });
}

function closeModal() {
    if (currentCardImg && currentModalProduct) {
        const defaultImage = currentModalProduct.image || '';
        if (defaultImage) {
            currentCardImg.src = defaultImage;
        }
        const card = currentCardImg.closest('.product-card');
        if (card) {
            const swatches = card.querySelectorAll('.color-swatch');
            swatches.forEach(sw => sw.classList.remove('active-swatch'));
            if (swatches.length > 0) {
                swatches[0].classList.add('active-swatch');
            }
        }
    }

    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    handleScroll();

    currentModalProduct = null;
    currentCardImg = null;
    thumbnailElements = [];
	document.querySelectorAll('.gallery-scroll-arrow').forEach(el => el.remove());
    showAnnouncementAfterModal();
}

closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
modalOverlay.addEventListener('click', function(e) {
    if (e.target === this)
        closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active'))
        closeModal();
});

const fullscreenBtn = document.getElementById('modalFullscreenBtn');
const modalOverlayFull = document.getElementById('modalOverlay');

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (window.innerWidth <= 768)
            return;

        const isFullscreen = modalOverlayFull.classList.toggle('modal-fullscreen');
        this.textContent = isFullscreen ? '⛶' : '⛶';
        this.title = isFullscreen ? 'Свернуть' : 'Развернуть на весь экран';
    });
}

const originalCloseModal = closeModal;
closeModal = function() {
    if (modalOverlayFull) {
        modalOverlayFull.classList.remove('modal-fullscreen');
    }
    if (fullscreenBtn) {
        fullscreenBtn.textContent = '⛶';
        fullscreenBtn.title = 'Развернуть на весь экран';
    }
    originalCloseModal();
};

document.getElementById('modalAddToCartBtn').addEventListener('click', function() {
    const product = currentModalProduct;
    if (!product)
        return;

    const checkboxes = window._modalCheckboxes || [];
    const selectedOptions = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedOptions.push({
                name: cb.dataset.name,
                price: parseInt(cb.dataset.price, 10)
            });
        }
    });

    const colorRadios = document.querySelectorAll('#modalColors input[type="radio"]');
    let selectedColor = null;
    colorRadios.forEach(radio => {
        if (radio.checked) {
            selectedColor = {
                name: radio.dataset.colorName,
                hex: radio.dataset.colorHex
            };
        }
    });

    const variantRadios = document.querySelectorAll('input[name="product-variant"]');
    let selectedVariant = null;
    variantRadios.forEach(radio => {
        if (radio.checked) {
            selectedVariant = {
                name: radio.dataset.name,
                price: parseInt(radio.dataset.price, 10)
            };
        }
    });

    let customColors = null;
    if (product.customizable && window._getCustomColors) {
        customColors = window._getCustomColors();
        const colorOptions = [];
        if (customColors) {
            Object.keys(customColors).forEach(part => {
                const partLabel = product.parts[part].label;
                colorOptions.push({
                    name: partLabel + ': ' + customColors[part],
                    price: 0
                });
            });
        }
        selectedOptions.push(...colorOptions);
    }

    if (selectedVariant) {
        selectedOptions.push({
            name: 'Вариант: ' + selectedVariant.name,
            price: 0
        });
    }

    const basePrice = selectedVariant ? selectedVariant.price : parsePrice(product.price);
    let totalPrice = basePrice;
    selectedOptions.forEach(opt => totalPrice += opt.price);

    addToCartWithOptions(product, selectedOptions, totalPrice, selectedVariant, selectedColor);

    let colorName = selectedColor ? ' (' + selectedColor.name + ')' : '';
    showToast('Товар "' + product.name + '"' + colorName + ' добавлен в корзину!');
});

const GITHUB_BASE_URL = 'https://an-core.github.io/frmfr_image/';

const Utils = {
    getColorImageUrl(color, product) {
        if (!color) return product?.image || null;
        if (color.name === 'Все' || color.name === 'Стандарт') {
            return product?.image || null;
        }
        return color.image || product?.image || null;
    },

    setActiveSwatch(swatchElement, product, imgElement) {
        if (!swatchElement || !product) return;

        const parentSwatches = swatchElement.closest('.color-swatches');
        if (parentSwatches) {
            parentSwatches.querySelectorAll('.color-swatch')
                .forEach(s => s.classList.remove('active-swatch'));
            swatchElement.classList.add('active-swatch');
        }

        const colorName = swatchElement.dataset.colorName;
        if (!colorName) return;

        const color = (product.colors || []).find(c => c.name === colorName);
        if (!color) return;

        const imageUrl = Utils.getColorImageUrl(color, product);
        if (imgElement) {
            imgElement.src = imageUrl ||
                'https://via.placeholder.com/400x400/cccccc/666666?text=Нет+фото';
            const card = imgElement.closest('.product-card');
            if (card) Utils.scrollActiveSwatchIntoView(card);
        }
    },

    scrollActiveSwatchIntoView(card) {
        if (!card) return;
        const swatchesContainer = card.querySelector('.color-swatches');
        if (!swatchesContainer) return;
        const activeSwatch = swatchesContainer.querySelector('.color-swatch.active-swatch');
        if (!activeSwatch) return;

        const containerRect = swatchesContainer.getBoundingClientRect();
        const swatchRect = activeSwatch.getBoundingClientRect();
        const isVisible = swatchRect.left >= containerRect.left &&
                          swatchRect.right <= containerRect.right;
        if (!isVisible) {
            const scrollLeft = swatchRect.left - containerRect.left +
                swatchesContainer.scrollLeft -
                (containerRect.width - swatchRect.width) / 2;
            swatchesContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }
};

async function loadAllImages() {
    const catalog = document.getElementById('catalogContainer');
    catalog.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">⏳ Загрузка изображений...</div>';

    const logoImg = document.getElementById('logoImage');
    const menuLogo = document.getElementById('menuLogo');
    const mobileLogo = document.getElementById('mobileLogo');
    let logoUrl = null;

    if (LOGO_FILE) {
        logoUrl = GITHUB_BASE_URL + LOGO_FILE;
    }

    if (logoUrl) {
        logoImg.src = logoUrl;
        logoImg.style.display = 'block';
        if (menuLogo) {
            menuLogo.src = logoUrl;
            menuLogo.style.display = 'block';
        }
        if (mobileLogo) {
            mobileLogo.src = logoUrl;
            mobileLogo.style.display = 'block';
        }
    } else {
        logoImg.style.display = 'none';
        if (menuLogo) menuLogo.style.display = 'none';
        if (mobileLogo) mobileLogo.style.display = 'none';
    }

    for (const product of products) {
        if (product.imageFile) {
            product.image = GITHUB_BASE_URL + product.imageFile;
        }

        if (product.images && product.images.length > 0) {
            product.images = product.images.map(imgFile => {
                return GITHUB_BASE_URL + imgFile;
            });
        }

        if (product.colors && product.colors.length > 0) {
            for (const color of product.colors) {
                if (color.name === 'Стандарт') {
                    color.image = product.image;
                    continue;
                }
                if (color.image && !color.image.startsWith('http')) {
                    color.image = GITHUB_BASE_URL + color.image;
                }
            }
        }
    }

    await loadCategoryIcons();

    renderCategories();
    renderSubcategories();
    renderCatalog();
}

function populateCatalogDropdown() {
    const container = document.getElementById('catalogDropdown');
    if (!container) return;
    container.innerHTML = '';

    const categories = getCategories();

    const allItem = document.createElement('div');
    allItem.className = 'category-item';
    allItem.textContent = 'Все категории';
    allItem.dataset.category = '';
    allItem.style.color = 'var(--text-secondary)';
    if (activeCategory === null) {
        allItem.classList.add('active-drop');
    }
    allItem.addEventListener('click', function(e) {
        e.stopPropagation();
        activeCategory = null;
        activeSubcategory = 'Все';
        renderCategories();
        renderSubcategories();
        renderCatalog();

        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdownContent) {
            dropdownContent.classList.remove('show');
            dropdownContent.style.position = '';
            dropdownContent.style.top = '';
            dropdownContent.style.left = '';
            dropdownContent.style.width = '';
            dropdownContent.style.maxHeight = '';
            dropdownContent.style.overflowY = '';
        }
        const row = document.querySelector('.categories-row');
        if (row) row.classList.remove('shifted');
        document.body.classList.remove('dropdown-open');
        document.querySelector('.catalog').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
    container.appendChild(allItem);

    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.textContent = cat;
        item.dataset.category = cat;

        const color = categoryTextColors[cat] || 'var(--text-secondary)';
        item.style.color = color;

        if (cat === activeCategory) {
            item.classList.add('active-drop');
        }

        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const category = this.dataset.category;
            activeCategory = category;
            activeSubcategory = 'Все';
            renderCategories();
            renderSubcategories();
            renderCatalog();

            const dropdownContent = document.querySelector('.dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.remove('show');
                dropdownContent.style.position = '';
                dropdownContent.style.top = '';
                dropdownContent.style.left = '';
                dropdownContent.style.width = '';
                dropdownContent.style.maxHeight = '';
                dropdownContent.style.overflowY = '';
            }
            const row = document.querySelector('.categories-row');
            if (row) row.classList.remove('shifted');
            document.body.classList.remove('dropdown-open');
            document.querySelector('.catalog').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        container.appendChild(item);
    });
}

function initCatalogDropdown() {
    const desktopBtn = document.querySelector('.dropdown-btn');
    const mobileBtn = document.querySelector('.mobile-dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (!desktopBtn || !dropdownContent) return;

    const catalogContainer = desktopBtn.closest('.dropdown-catalog');
	let closeTimer = null;

     function toggleCatalog(show) {
        if (show) {
            clearTimeout(closeTimer);
            if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
            dropdownContent.classList.add('show');
            const row = document.querySelector('.categories-row');
            if (row) row.classList.add('shifted');
            document.body.classList.add('dropdown-open');
        } else {
            dropdownContent.classList.remove('show');
            const row = document.querySelector('.categories-row');
            if (row) row.classList.remove('shifted');
            document.body.classList.remove('dropdown-open');
        }
    }

    function handleMouseLeave(e) {
        const related = e.relatedTarget;
        if (related && catalogContainer.contains(related)) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            toggleCatalog(false);
        }, 300);
    }

    function initHover() {
        catalogContainer.removeEventListener('mouseenter', () => toggleCatalog(true));
        catalogContainer.removeEventListener('mouseleave', handleMouseLeave);
        if (window.innerWidth >= 768) {
            catalogContainer.addEventListener('mouseenter', function() {
                clearTimeout(closeTimer);
                toggleCatalog(true);
            });
            catalogContainer.addEventListener('mouseleave', handleMouseLeave);
        }
    }

    initHover();
    window.addEventListener('resize', initHover);

    desktopBtn.addEventListener('click', function(e) {
        if (window.innerWidth < 768) {
            e.stopPropagation();
            if (typeof closeAllDropdowns === 'function') {
                closeAllDropdowns();
            }
            const isOpen = dropdownContent.classList.toggle('show');
            const row = document.querySelector('.categories-row');
            if (row) row.classList.toggle('shifted', isOpen);
            if (isOpen) {
                document.body.classList.add('dropdown-open');
            } else {
                document.body.classList.remove('dropdown-open');
            }
        }
    });

    if (mobileBtn) {
        mobileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (typeof closeAllDropdowns === 'function') {
                closeAllDropdowns();
            }
            const isOpen = dropdownContent.classList.toggle('show');
            const row = document.querySelector('.categories-row');
            if (row) row.classList.toggle('shifted', isOpen);
            if (isOpen) {
                document.body.classList.add('dropdown-open');
            } else {
                document.body.classList.remove('dropdown-open');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.dropdown-btn')) return;
        if (e.target.closest('.mobile-dropdown-btn')) return;
        if (e.target.closest('.dropdown-content')) return;
        if (e.target.closest('.category-icon-wrapper')) return;
        if (e.target.closest('.category-link')) return;
        if (e.target.closest('.subcategory-link')) return;
        if (e.target.closest('.subcategory-btn')) return;

        if (dropdownContent && dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
            const row = document.querySelector('.categories-row');
            if (row) row.classList.remove('shifted');
            document.body.classList.remove('dropdown-open');
        }

        if (activeCategory !== null) {
            activeCategory = null;
            activeSubcategory = 'Все';
            renderCategories();
            renderSubcategories();
            renderCatalog();
        }
    });

    populateCatalogDropdown();

    const originalRenderCategories = renderCategories;
    renderCategories = function() {
        originalRenderCategories();
        const items = document.querySelectorAll('.dropdown-content .category-item');
        items.forEach(item => {
            const cat = item.dataset.category;
            if (cat === '') {
                item.classList.toggle('active-drop', activeCategory === null);
            } else {
                item.classList.toggle('active-drop', cat === activeCategory);
            }
        });
    };
}

function createFireParticles() {
    const container = document.getElementById('fireParticles');
    const count = 30;
    const colors = ['rgba(255,200,50,0.8)', 'rgba(255,150,50,0.9)', 'rgba(255,100,20,0.7)', 'rgba(255,220,80,0.8)', 'rgba(200,100,0,0.6)'];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        const size = 6 + Math.random() * 10;
        const startX = Math.random() * 100;
        const driftX = (Math.random() - 0.5) * 40;
        const duration = 6 + Math.random() * 10;
        const delay = Math.random() * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + '%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size*2}px ${size/2}px ${color}`;
        particle.style.setProperty('--duration', duration + 's');
        particle.style.setProperty('--delay', delay + 's');
        particle.style.setProperty('--drift', driftX + 'vw');
        if (!isDark) {
            particle.style.animation = 'none';
            particle.style.opacity = '0';
        }
        container.appendChild(particle);
    }
}

function updateAnimState(enabled) {
    isAnimEnabled = enabled;
    localStorage.setItem('firemag_anim', enabled ? 'on' : 'off');
    const particles = document.querySelectorAll('.fire-particle');
    const container = document.getElementById('fireParticles');
    if (enabled) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        animIcon.textContent = '⛔';
        animText.textContent = 'Выключить огоньки';
        animToggle.classList.remove('off');
        animToggle.classList.add('active');
        if (isDark) {
            container.style.opacity = '1';
            particles.forEach(p => {
                p.style.animation = '';
                p.style.opacity = '';
            });
        }
    } else {
        animIcon.textContent = '✨';
        animText.textContent = 'Включить огоньки';
        animToggle.classList.add('off');
        animToggle.classList.remove('active');
        container.style.opacity = '0';
        particles.forEach(p => {
            p.style.animation = 'none';
            p.style.opacity = '0';
        });
    }
}
const animToggle = document.getElementById('animToggle');
const animIcon = document.getElementById('animIcon');
const animText = document.getElementById('animText');

animToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    updateAnimState(!isAnimEnabled);
});
updateAnimState(isAnimEnabled);

function getStoredTheme() {
    return localStorage.getItem('theme') || 'dark';
}

function updateTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Включить светлую тему';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Включить тёмную тему';
    }
    const particles = document.querySelectorAll('.fire-particle');
    const container = document.getElementById('fireParticles');
    if (theme === 'dark' && isAnimEnabled) {
        container.style.opacity = '1';
        particles.forEach(p => {
            p.style.animation = '';
            p.style.opacity = '';
        });
    } else {
        container.style.opacity = '0';
        particles.forEach(p => {
            p.style.animation = 'none';
            p.style.opacity = '0';
        });
    }
}
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');
updateTheme(getStoredTheme());
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    updateTheme(current === 'dark' ? 'light' : 'dark');
});

const contactsToggle = document.querySelector('.contacts-toggle');
const contactsPhoneBlock = document.getElementById('contactsPhoneBlock');
const contactPhone = document.getElementById('contactPhone');
const contactsActions = document.getElementById('contactsActions');
contactsToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    contactsPhoneBlock.classList.toggle('visible');
    if (!contactsPhoneBlock.classList.contains('visible'))
        contactsActions.classList.remove('visible');
});
contactPhone.addEventListener('click', function(e) {
    e.stopPropagation();
    contactsActions.classList.toggle('visible');
});

const partnersHeader = document.getElementById('partnersHeader');
const partnersCollapsible = document.getElementById('partnersCollapsible');
const partnersArrow = document.querySelector('.partners-arrow');

if (partnersHeader && partnersCollapsible) {
    partnersHeader.addEventListener('click', function(e) {
        e.stopPropagation();

        const isOpen = partnersCollapsible.classList.toggle('open');
        partnersArrow.classList.toggle('open');

        if (isOpen) {
            partnersCollapsible.style.display = 'block';

            const images = partnersCollapsible.querySelectorAll('img');
            images.forEach(img => {
                if (!img.complete || img.naturalWidth === 0) {
                    const src = img.src;
                    img.src = '';
                    img.src = src;
                }
            });

            setTimeout(() => {
                partnersCollapsible.style.opacity = '1';
            }, 50);
        } else {
            partnersCollapsible.style.opacity = '0';
            setTimeout(() => {
                partnersCollapsible.style.display = 'none';
            }, 300);
        }
    });
}

function updatePartnersAfterImagesLoad() {
    const images = document.querySelectorAll('.partners-logos img');
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
        updatePartnersHeight();
        return;
    }

    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
            if (loadedCount === totalImages) {
                setTimeout(updatePartnersHeight, 100);
            }
        } else {
            img.addEventListener('load', function() {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setTimeout(updatePartnersHeight, 100);
                }
            });
            img.addEventListener('error', function() {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setTimeout(updatePartnersHeight, 100);
                }
            });
        }
    });
}

if (document.querySelector('.partners-logos')) {
    if (document.readyState === 'complete') {
        setTimeout(updatePartnersAfterImagesLoad, 200);
    } else {
        window.addEventListener('load', function() {
            setTimeout(updatePartnersAfterImagesLoad, 200);
        });
    }
}

const settingsToggle = document.querySelector('.settings-toggle');
const settingsBlock = document.getElementById('settingsBlock');
if (settingsToggle && settingsBlock) {
    settingsToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = settingsBlock.style.display === 'none' || settingsBlock.style.display === '';
        settingsBlock.style.display = isHidden ? 'block' : 'none';
    });
}

const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
const checkoutBackBtn = document.getElementById('checkoutBackBtn');
const submitOrderBtn = document.getElementById('submitOrderBtn');

function openCartModal() {
    hideAnnouncementForModal();
    renderCartModal();
    cartModal.classList.add('active');
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('⚠️ Корзина пуста');
        return;
    }
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('orderStatus').innerHTML = '';
    checkoutModal.classList.add('active');
    hideAnnouncementForModal();
    closeCartModal();
    updateCheckoutTotal();
}

function closeCartModal() {
    cartModal.classList.remove('active');
    if (!checkoutModal.classList.contains('active')) {
        showAnnouncementAfterModal();
    }
	handleScroll();
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    submitOrderBtn.disabled = false;
    submitOrderBtn.textContent = 'Отправить заказ';
    isSubmitting = false;
    showAnnouncementAfterModal();
	handleScroll();
}
cartIcon.addEventListener('click', openCartModal);
cartCloseBtn.addEventListener('click', closeCartModal);
cartModal.addEventListener('click', function(e) {
    if (e.target === this)
        closeCartModal();
});
checkoutBtn.addEventListener('click', openCheckoutModal);
clearCartBtn.addEventListener('click', function() {
    if (confirm('Очистить корзину?')) {
        clearCart();
        renderCartModal();
        showToast('Корзина очищена');
    }
});
checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
checkoutBackBtn.addEventListener('click', function() {
    closeCheckoutModal();
    openCartModal();
});
checkoutModal.addEventListener('click', function(e) {
    if (e.target === this)
        closeCheckoutModal();
});
submitOrderBtn.addEventListener('click', sendOrder);

const hamburger = document.getElementById('hamburger');
const slideMenu = document.getElementById('slideMenu');
const menuClose = document.getElementById('menuClose');
const overlay = document.createElement('div');

document.addEventListener('click', function(e) {
    const row = e.target.closest('.categories-row');
    const wrapper = e.target.closest('.category-icon-wrapper');

    if (row && !wrapper) {
        if (activeCategory !== null) {
            activeCategory = null;
            activeSubcategory = 'Все';
            renderCategories();
            renderSubcategories();
            renderCatalog();
        }
    }
});

overlay.className = 'menu-overlay';
overlay.id = 'menuOverlay';
document.body.prepend(overlay);

function toggleMenu() {
    const isOpen = slideMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    slideMenu.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}
hamburger.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && slideMenu.classList.contains('open'))
        closeMenu();
});

document.getElementById('sortSelect').addEventListener('change', function(e) {
    sortOrder = this.value;
    renderCatalog();
});

const topBar = document.getElementById('topBar');
const headerWrapper = document.querySelector('.header-wrapper');
let lastScrollY = window.scrollY;
let ticking = false;

function handleScroll() {
    const modalSelectors = [
        '#modalOverlay', '#cartModal', '#checkoutModal',
        '#howToBuyModal', '#deliveryModal', '#pickupModal',
        '#jugglingNewsModal', '#fireNewsModal', '#festivalsModal',
        '#glossaryModal'
    ];
    const anyModalOpen = modalSelectors.some(sel => {
        const el = document.querySelector(sel);
        return el && el.classList.contains('active');
    });

    if (anyModalOpen) {
        return;
    }
    const currentScrollY = window.scrollY;
    const announcementBar = document.getElementById('announcementBar');
    const topBar = document.getElementById('topBar');
    const headerWrapper = document.querySelector('.header-wrapper');

    if (!announcementBar || announcementBar.style.display === 'none') {
    if (topBar) {
        if (currentScrollY > lastScrollY && currentScrollY > 0) {
            topBar.classList.add('hidden');
            if (headerWrapper) headerWrapper.classList.add('hidden');
        } else if (currentScrollY === 0) {
            topBar.classList.remove('hidden');
            if (headerWrapper) headerWrapper.classList.remove('hidden');
        }
    }
    lastScrollY = currentScrollY;
    ticking = false;
    return;
}

    if (currentScrollY > lastScrollY && currentScrollY > 80) {
        if (topBar) topBar.classList.add('hidden');
        if (headerWrapper) headerWrapper.classList.add('hidden');
        announcementBar.classList.add('hidden');
        announcementHiddenByScroll = true;
    } else if (currentScrollY < lastScrollY || currentScrollY <= 80) {
        if (topBar) topBar.classList.remove('hidden');
        if (headerWrapper) headerWrapper.classList.remove('hidden');
        if (!announcementHiddenByModal) {
            announcementBar.classList.remove('hidden');
            announcementHiddenByScroll = false;
        }
    }

    lastScrollY = currentScrollY;
    ticking = false;

    if (currentScrollY <= 80) {
        if (topBar) topBar.classList.remove('hidden');
        if (headerWrapper) headerWrapper.classList.remove('hidden');
        if (announcementBar && !announcementHiddenByModal) {
            announcementBar.classList.remove('hidden');
        }
    }
}

function hideAnnouncementForModal() {
    const bar = document.getElementById('announcementBar');
    if (bar && !bar.classList.contains('hidden')) {
        bar.classList.add('hidden');
        announcementHiddenByModal = true;
    }
}

function showAnnouncementAfterModal() {
    const bar = document.getElementById('announcementBar');
    announcementHiddenByModal = false;
    if (bar && !announcementHiddenByScroll) {
        bar.classList.remove('hidden');
    }
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleScroll();
        });
        ticking = true;
    }
});

const howToBuyBtn = document.getElementById('howToBuyBtn');
const jugglingNewsBtn = document.getElementById('jugglingNewsBtn');
const fireNewsBtn = document.getElementById('fireNewsBtn');
const festivalsBtn = document.getElementById('festivalsBtn');

const howToBuyModal = document.getElementById('howToBuyModal');
const deliveryModal = document.getElementById('deliveryModal');
const pickupModal = document.getElementById('pickupModal');
const jugglingNewsModal = document.getElementById('jugglingNewsModal');
const fireNewsModal = document.getElementById('fireNewsModal');
const festivalsModal = document.getElementById('festivalsModal');

const howToBuyCloseBtn = document.getElementById('howToBuyCloseBtn');
const howToBuyFooterClose = document.getElementById('howToBuyFooterClose');
const deliveryCloseBtn = document.getElementById('deliveryCloseBtn');
const deliveryFooterClose = document.getElementById('deliveryFooterClose');
const pickupCloseBtn = document.getElementById('pickupCloseBtn');
const pickupFooterClose = document.getElementById('pickupFooterClose');
const jugglingNewsCloseBtn = document.getElementById('jugglingNewsCloseBtn');
const jugglingNewsFooterClose = document.getElementById('jugglingNewsFooterClose');
const fireNewsCloseBtn = document.getElementById('fireNewsCloseBtn');
const fireNewsFooterClose = document.getElementById('fireNewsFooterClose');
const festivalsCloseBtn = document.getElementById('festivalsCloseBtn');
const festivalsFooterClose = document.getElementById('festivalsFooterClose');

function initModalObserver() {
    const modalSelectors = [
        '#modalOverlay',
        '#cartModal',
        '#checkoutModal',
        '#howToBuyModal',
        '#deliveryModal',
        '#pickupModal',
        '#jugglingNewsModal',
        '#fireNewsModal',
        '#festivalsModal',
        '#glossaryModal'
    ];

    const modals = modalSelectors.map(sel => document.querySelector(sel)).filter(el => el);

    modals.forEach(modal => {
        const observer = new MutationObserver(() => {
            const isActive = modal.classList.contains('active');
            if (isActive) {
                hideTopBarOnMobile();
            } else {
                const anyActive = modals.some(m => m.classList.contains('active'));
                if (!anyActive) {
                    showTopBarOnMobile();
                }
            }
        });

        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

document.addEventListener('DOMContentLoaded', initModalObserver);

function hideTopBarOnMobile() {
    if (window.innerWidth <= 768) {
        const topBar = document.getElementById('topBar');
        const headerWrapper = document.querySelector('.header-wrapper');
        if (topBar) topBar.classList.add('hidden');
        if (headerWrapper) headerWrapper.classList.add('hidden');
    }
}

function showTopBarOnMobile() {
    if (window.innerWidth <= 768) {
        const topBar = document.getElementById('topBar');
        const headerWrapper = document.querySelector('.header-wrapper');
        if (topBar) topBar.classList.remove('hidden');
        if (headerWrapper) headerWrapper.classList.remove('hidden');
    }
}

function openHowToBuy() {
    if (window.innerWidth <= 768) {
        const topBar = document.getElementById('topBar');
        const headerWrapper = document.querySelector('.header-wrapper');
        if (topBar) topBar.classList.add('hidden');
        if (headerWrapper) headerWrapper.classList.add('hidden');
    }
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    howToBuyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeHowToBuy() {
    if (window.innerWidth <= 768) {
        const topBar = document.getElementById('topBar');
        const headerWrapper = document.querySelector('.header-wrapper');
        if (topBar) topBar.classList.remove('hidden');
        if (headerWrapper) headerWrapper.classList.remove('hidden');
    }
    howToBuyModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

function openDelivery() {
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    deliveryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openPickup() {
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    pickupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDelivery() {
    deliveryModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

function closePickup() {
    pickupModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

function openJugglingNews() {
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    jugglingNewsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeJugglingNews() {
    jugglingNewsModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

function openFireNews() {
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    fireNewsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFireNews() {
    fireNewsModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

function openFestivals() {
    menuWasOpenBeforeModal = slideMenu.classList.contains('open');
    if (menuWasOpenBeforeModal) closeMenu();
    hideAnnouncementForModal();
    festivalsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeFestivals() {
    festivalsModal.classList.remove('active');
    document.body.style.overflow = '';
    showAnnouncementAfterModal();
    if (menuWasOpenBeforeModal) {
        slideMenu.classList.add('open');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuWasOpenBeforeModal = false;
    }
	handleScroll();
}

if (howToBuyBtn) {
    howToBuyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openHowToBuy();
    });
}

if (deliveryBtn) {
    deliveryBtn.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        closeAllDropdowns();
        deliveryDropdown.classList.toggle('show');
    });

    pickupBtn.addEventListener('click', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        closeAllDropdowns();
        pickupDropdown.classList.toggle('show');
    });
}

if (pickupBtn) {
    pickupBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('Клик по Самовывозу в бургер-меню');
        if (slideMenu.classList.contains('open')) {
            closeMenu();
        }
        pickupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        hideAnnouncementForModal();
    });
}

if (jugglingNewsBtn) {
    jugglingNewsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openJugglingNews();
    });
}

if (fireNewsBtn) {
    fireNewsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openFireNews();
    });
}

if (festivalsBtn) {
    festivalsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openFestivals();
    });
}

if (howToBuyCloseBtn) howToBuyCloseBtn.addEventListener('click', closeHowToBuy);
if (howToBuyFooterClose) howToBuyFooterClose.addEventListener('click', closeHowToBuy);

if (deliveryCloseBtn) deliveryCloseBtn.addEventListener('click', closeDelivery);
if (deliveryFooterClose) deliveryFooterClose.addEventListener('click', closeDelivery);

if (pickupCloseBtn) pickupCloseBtn.addEventListener('click', closePickup);
if (pickupFooterClose) pickupFooterClose.addEventListener('click', closePickup);

if (jugglingNewsCloseBtn) jugglingNewsCloseBtn.addEventListener('click', closeJugglingNews);
if (jugglingNewsFooterClose) jugglingNewsFooterClose.addEventListener('click', closeJugglingNews);

if (fireNewsCloseBtn) fireNewsCloseBtn.addEventListener('click', closeFireNews);
if (fireNewsFooterClose) fireNewsFooterClose.addEventListener('click', closeFireNews);

if (festivalsCloseBtn) festivalsCloseBtn.addEventListener('click', closeFestivals);
if (festivalsFooterClose) festivalsFooterClose.addEventListener('click', closeFestivals);

if (howToBuyModal) {
    howToBuyModal.addEventListener('click', function(e) {
        if (e.target === this) closeHowToBuy();
    });
}
if (deliveryModal) {
    deliveryModal.addEventListener('click', function(e) {
        if (e.target === this) closeDelivery();
    });
}
if (pickupModal) {
    pickupModal.addEventListener('click', function(e) {
        if (e.target === this) closePickup();
    });
}
if (jugglingNewsModal) {
    jugglingNewsModal.addEventListener('click', function(e) {
        if (e.target === this) closeJugglingNews();
    });
}
if (fireNewsModal) {
    fireNewsModal.addEventListener('click', function(e) {
        if (e.target === this) closeFireNews();
    });
}
if (festivalsModal) {
    festivalsModal.addEventListener('click', function(e) {
        if (e.target === this) closeFestivals();
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (howToBuyModal && howToBuyModal.classList.contains('active')) closeHowToBuy();
        if (deliveryModal && deliveryModal.classList.contains('active')) closeDelivery();
        if (pickupModal && pickupModal.classList.contains('active')) closePickup();
        if (jugglingNewsModal && jugglingNewsModal.classList.contains('active')) closeJugglingNews();
        if (fireNewsModal && fireNewsModal.classList.contains('active')) closeFireNews();
        if (festivalsModal && festivalsModal.classList.contains('active')) closeFestivals();
    }
});

if (pickupCloseBtn) {
    pickupCloseBtn.addEventListener('click', function() {
        pickupModal.classList.remove('active');
        document.body.style.overflow = '';
        showAnnouncementAfterModal();
    });
}
if (pickupFooterClose) {
    pickupFooterClose.addEventListener('click', function() {
        pickupModal.classList.remove('active');
        document.body.style.overflow = '';
        showAnnouncementAfterModal();
    });
}
if (pickupModal) {
    pickupModal.addEventListener('click', function(e) {
        if (e.target === this) {
            pickupModal.classList.remove('active');
            document.body.style.overflow = '';
            showAnnouncementAfterModal();
        }
    });
}

function showPickupInfo() {
    const howToBuyModal = document.getElementById('howToBuyModal');
    if (howToBuyModal) {
        howToBuyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const pickupSection = document.querySelector('.how-to-buy-modal .pickup-section');
            if (pickupSection) {
                pickupSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
}

function addGalleryScrollArrow() {
    const gallery = document.querySelector('.modal-fullscreen .modal-gallery');
    if (!gallery) return;

    const wrapper = gallery.closest('.modal-gallery-wrapper');
    if (!wrapper) return;

    const oldArrow = wrapper.querySelector('.gallery-scroll-arrow');
    if (oldArrow) oldArrow.remove();

    const canScroll = gallery.scrollWidth > gallery.clientWidth;
    if (!canScroll) return;

    const arrow = document.createElement('div');
    arrow.className = 'gallery-scroll-arrow';
    arrow.innerHTML = '→';
    arrow.setAttribute('aria-label', 'Прокрутить галерею');

    wrapper.style.position = 'relative';
    wrapper.appendChild(arrow);

    function updateArrowVisibility() {
        const isAtEnd = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 5;
        if (!isAtEnd) {
            arrow.classList.add('visible');
        } else {
            arrow.classList.remove('visible');
        }
    }

    gallery.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);

    setTimeout(updateArrowVisibility, 50);

    arrow.addEventListener('click', function(e) {
        e.stopPropagation();
        const scrollAmount = Math.min(300, gallery.scrollWidth - gallery.scrollLeft - gallery.clientWidth);
        gallery.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

function updatePartnersHeight() {
    const partnersCollapsible = document.getElementById('partnersCollapsible');
    if (partnersCollapsible && partnersCollapsible.classList.contains('open')) {
        partnersCollapsible.style.maxHeight = 'none';
        const height = partnersCollapsible.scrollHeight;
        partnersCollapsible.style.maxHeight = height + 'px';
    }
}

function initAnnouncement() {
    const bar = document.getElementById('announcementBar');
    if (!bar)
        return;

    if (localStorage.getItem('announcement_closed') === 'true') {
        bar.style.display = 'none';
        updateLayout(0);
        return;
    }

    const closeBtn = document.getElementById('announcementClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            bar.style.display = 'none';
            localStorage.setItem('announcement_closed', 'true');
            setTimeout(() => updateLayout(0), 100);
        });
    }

    setTimeout(() => updateLayout(0), 50);
}

document.addEventListener('DOMContentLoaded', function() {
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const moscowBlock = document.getElementById('moscowDelivery');
    const cdekBlock = document.getElementById('cdekDelivery');
    const cdekCityInput = document.getElementById('cdekCity');
    const cdekPickupBlock = document.getElementById('cdekPickupBlock');
    const pickupInput = document.getElementById('cdekPickupInput');
    const pickupSuggestions = document.getElementById('pickupSuggestions');

    function selectPickup(address) {
        pickupInput.value = address;
        pickupSuggestions.style.display = 'none';
        const select = document.getElementById('cdekPickup');
        for (let opt of select.options) {
            if (opt.value === address) {
                select.value = address;
                break;
            }
        }
    }

    window.selectPickup = selectPickup;

    pickupInput.addEventListener('input', function() {
        const val = this.value.trim().toLowerCase();
        if (val.length < 2) {
            pickupSuggestions.style.display = 'none';
            return;
        }
        const matched = pickupPoints.filter(addr => addr.toLowerCase().includes(val));
        if (matched.length) {
            pickupSuggestions.innerHTML = matched.map(addr =>
                `<div style="padding:6px 12px; cursor:pointer; border-bottom:1px solid var(--border-card);" onclick="selectPickup('${addr.replace(/'/g, "\\'")}')">${addr}</div>`
            ).join('');
            pickupSuggestions.style.display = 'block';
        } else {
            pickupSuggestions.style.display = 'none';
        }
    });

    pickupInput.addEventListener('blur', function() {
        setTimeout(() => {
            pickupSuggestions.style.display = 'none';
        }, 200);
    });

    function toggleDelivery() {
        const selected = document.querySelector('input[name="delivery"]:checked');
        if (!selected) return;
        const moscowBlock = document.getElementById('moscowDelivery');
        const cdekBlock = document.getElementById('cdekDelivery');
        const cdekPickupBlock = document.getElementById('cdekPickupBlock');

        moscowBlock.style.display = 'none';
        cdekBlock.style.display = 'none';
        cdekPickupBlock.style.display = 'none';

        if (selected.value === 'moscow') {
            moscowBlock.style.display = 'block';
        } else if (selected.value === 'cdek') {
            cdekBlock.style.display = 'block';
            const city = document.getElementById('cdekCity').value.trim();
            if (city) {
                cdekPickupBlock.style.display = 'block';
            }
        }
    }

    deliveryRadios.forEach(radio => radio.addEventListener('change', toggleDelivery));
    toggleDelivery();

    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', updateCheckoutTotal);
    });

    async function loadPickupPoints(city) {
        if (!city) return;
        try {
            const response = await fetch('cdek-points.json');
            const data = await response.json();
            const points = data.pvz || [];
            const cityLower = city.trim().toLowerCase();
            const filtered = points.filter(p =>
                p.city && p.city.toLowerCase().includes(cityLower)
            );
            pickupPoints = filtered.map(p => p.fullAddress || p.address).filter(Boolean);

            const select = document.getElementById('cdekPickup');
            select.innerHTML = '<option value="">-- выберите пункт --</option>';
            if (pickupPoints.length > 0) {
                pickupPoints.forEach(addr => {
                    const opt = document.createElement('option');
                    opt.value = addr;
                    opt.textContent = addr;
                    select.appendChild(opt);
                });
            } else {
                select.innerHTML = '<option value="">Нет пунктов</option>';
            }
            document.getElementById('cdekPickupBlock').style.display = 'block';
        } catch (err) {
            alert('Не удалось загрузить список пунктов.');
            console.error(err);
        }
    }

    async function loadCitiesDatalist() {
        try {
            const response = await fetch('cdek-points.json');
            if (!response.ok) throw new Error('Не удалось загрузить список городов');
            const data = await response.json();
            const points = data.pvz || [];
            const citiesArray = points.map(p => p.city).filter(Boolean);
            const uniqueCities = [...new Set(citiesArray)].sort();
            cities = uniqueCities;
            console.log('Список городов загружен, всего:', uniqueCities.length);
        } catch (err) {
            console.warn('Ошибка загрузки городов для подсказок:', err);
        }
    }

    let debounceTimer;
    cdekCityInput.addEventListener('input', function() {
        const city = this.value.trim();
        clearTimeout(debounceTimer);
        if (city.length >= 2) {
            debounceTimer = setTimeout(() => {
                loadPickupPoints(city);
            }, 400);
        } else {
            cdekPickupBlock.style.display = 'none';
        }
    });

    window.loadPickupPoints = loadPickupPoints;

    loadCitiesDatalist();
});

function checkOverflow() {
    const wrapper = document.querySelector('.categories-wrapper');
    if (!wrapper) return;
    const row = wrapper.querySelector('.categories-row');
    if (!row) return;

    const hasOverflow = row.scrollWidth > wrapper.clientWidth;
    wrapper.classList.toggle('has-overflow', hasOverflow);
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        checkOverflow();
    }, 200);

    window.addEventListener('resize', checkOverflow);
});

function closeAllDropdowns() {
    const catalogDropdown = document.querySelector('.dropdown-content');
    if (catalogDropdown && catalogDropdown.classList.contains('show')) {
        catalogDropdown.classList.remove('show');
        document.querySelector('.categories-row')?.classList.remove('shifted');
        document.body.classList.remove('dropdown-open');
    }
    const deliveryDropdown = document.getElementById('dropdownDelivery');
    if (deliveryDropdown) deliveryDropdown.classList.remove('show');
    const pickupDropdown = document.getElementById('dropdownPickup');
    if (pickupDropdown) pickupDropdown.classList.remove('show');
}

(function ensureFade() {
    const wrapper = document.querySelector('.categories-wrapper');
    if (!wrapper) return;
    if (!wrapper.querySelector('.categories-fade')) {
        const fade = document.createElement('div');
        fade.className = 'categories-fade';
        wrapper.appendChild(fade);
    }
})();

function forceHideMenuItems() {
    const isDesktop = window.innerWidth >= 768;
    document.querySelectorAll('.slide-menu-body .delivery-item, .slide-menu-body .pickup-item')
        .forEach(el => {
            el.style.setProperty('display', isDesktop ? 'none' : '', 'important');
        });
}
forceHideMenuItems();
window.addEventListener('resize', forceHideMenuItems);

if (typeof addScrollButton === 'undefined') {
    window.addScrollButton = function() {};
}

(function fixMobileButtons() {
    if (deliveryBtn) {
        const newBtn = deliveryBtn.cloneNode(true);
        deliveryBtn.parentNode.replaceChild(newBtn, deliveryBtn);

        document.getElementById('deliveryBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Доставка открыта (бургер)');
            if (slideMenu.classList.contains('open')) closeMenu();
            document.getElementById('deliveryModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (pickupBtn) {
        const newBtn = pickupBtn.cloneNode(true);
        pickupBtn.parentNode.replaceChild(newBtn, pickupBtn);

        document.getElementById('pickupBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log('Самовывоз открыт (бургер)');
            if (slideMenu.classList.contains('open')) closeMenu();
            document.getElementById('pickupModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
})();

(function() {
    function initDropdowns() {
        const deliveryBtn = document.getElementById('desktopDeliveryBtn');
        const pickupBtn = document.getElementById('desktopPickupBtn');
        const deliveryDropdown = document.getElementById('dropdownDelivery');
        const pickupDropdown = document.getElementById('dropdownPickup');

        if (!deliveryBtn || !pickupBtn || !deliveryDropdown || !pickupDropdown) {
            console.warn('Элементы для выпадающих списков не найдены');
            return;
        }

        console.log('Выпадающие списки инициализированы');

        const newDeliveryBtn = deliveryBtn.cloneNode(true);
        deliveryBtn.parentNode.replaceChild(newDeliveryBtn, deliveryBtn);

        const newPickupBtn = pickupBtn.cloneNode(true);
        pickupBtn.parentNode.replaceChild(newPickupBtn, pickupBtn);

        const freshDeliveryBtn = document.getElementById('desktopDeliveryBtn');
        const freshPickupBtn = document.getElementById('desktopPickupBtn');

        freshDeliveryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
			
            const catalogDropdown = document.querySelector('.dropdown-content');
            if (catalogDropdown && catalogDropdown.classList.contains('show')) {
                catalogDropdown.classList.remove('show');
                document.querySelector('.categories-row')?.classList.remove('shifted');
                document.body.classList.remove('dropdown-open');
            }

            pickupDropdown.classList.remove('show');
            deliveryDropdown.classList.toggle('show');
            console.log('Доставка клик, show:', deliveryDropdown.classList.contains('show'));
        });

        freshPickupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const catalogDropdown = document.querySelector('.dropdown-content');
            if (catalogDropdown && catalogDropdown.classList.contains('show')) {
                catalogDropdown.classList.remove('show');
                document.querySelector('.categories-row')?.classList.remove('shifted');
                document.body.classList.remove('dropdown-open');
            }

            deliveryDropdown.classList.remove('show');
            pickupDropdown.classList.toggle('show');
            console.log('🏪 Самовывоз клик, show:', pickupDropdown.classList.contains('show'));
        });

        document.addEventListener('click', function(e) {
            const target = e.target;
            if (!target.closest('.dropdown-btn') &&
                !target.closest('.dropdown-content') &&
                !target.closest('.desktop-delivery-btn') &&
                !target.closest('#dropdownDelivery') &&
                !target.closest('.desktop-pickup-btn') &&
                !target.closest('#dropdownPickup')) {
                closeAllDropdowns();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                deliveryDropdown.classList.remove('show');
                pickupDropdown.classList.remove('show');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDropdowns);
    } else {
        initDropdowns();
    }
})();

function initGalleryScrollArrow() {
    const gallery = document.querySelector('.modal-fullscreen .modal-gallery');
    if (!gallery) return;

    const wrapper = gallery.closest('.modal-gallery-wrapper');
    if (!wrapper) return;

    const leftArrow = document.querySelector('.gallery-arrow-left');
    const rightArrow = document.querySelector('.gallery-arrow-right');
    if (!leftArrow || !rightArrow) return;

    function updateArrows() {
        const canScrollLeft = gallery.scrollLeft > 5;
        const canScrollRight = gallery.scrollLeft + gallery.clientWidth < gallery.scrollWidth - 5;

        leftArrow.classList.toggle('visible', canScrollLeft);
        leftArrow.classList.toggle('hidden-arrow', !canScrollLeft);
        rightArrow.classList.toggle('visible', canScrollRight);
        rightArrow.classList.toggle('hidden-arrow', !canScrollRight);
        wrapper.classList.toggle('fade-active', canScrollRight);
    }

    function scrollGallery(direction) {
        const step = gallery.clientWidth * 0.85;
        const target = direction === 'left'
            ? Math.max(0, gallery.scrollLeft - step)
            : Math.min(gallery.scrollWidth - gallery.clientWidth, gallery.scrollLeft + step);
        gallery.scrollTo({ left: target, behavior: 'smooth' });
    }

    leftArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        scrollGallery('left');
    });
    rightArrow.addEventListener('click', function(e) {
        e.stopPropagation();
        scrollGallery('right');
    });

    gallery.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 200);
}

(async function init() {
    loadCart();
    await loadProducts();
    await loadAllImages();
    initAnnouncement();
    createFireParticles();
    showAnnouncement();
    await loadPartnerLogos();
    initCatalogDropdown();
    updateCategoriesVisibility();
    addScrollHelpers();
    observeCategories();
    window.addEventListener('resize', updateCategoriesVisibility);
})();