// Carrito de compras mejorado
const cart = {
    items: [],
    deliveryFee: 5.00,
    minFreeDelivery: 50.00,
    
    addItem: function(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...item,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedNotification(item.name);
    },
    
    removeItem: function(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    },
    
    updateQuantity: function(itemId, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(itemId);
            return;
        }
        
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    },
    
    clearCart: function() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    },
    
    getSubtotal: function() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    },
    
    getTotal: function() {
        const subtotal = this.getSubtotal();
        const delivery = subtotal >= this.minFreeDelivery ? 0 : this.deliveryFee;
        return subtotal + delivery;
    },
    
    saveCart: function() {
        localStorage.setItem('wasiCart', JSON.stringify(this.items));
    },
    
    loadCart: function() {
        const savedCart = localStorage.getItem('wasiCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    },
    
    updateCartDisplay: function() {
        const cartCount = this.items.reduce((total, item) => total + item.quantity, 0);
        
        // Actualizar contadores
        document.querySelectorAll('.cart-count, .cart-float-count').forEach(el => {
            el.textContent = cartCount;
        });
        
        // Mostrar/ocultar carrito flotante
        const cartFloat = document.getElementById('cart-float');
        if (cartFloat) {
            cartFloat.style.display = cartCount > 0 ? 'flex' : 'none';
        }
        
        // Actualizar items del carrito
        this.renderCartItems();
        
        // Actualizar totales
        this.updateCartTotals();
    },
    
    renderCartItems: function() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const cartEmpty = document.getElementById('cart-empty');
        
        if (this.items.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = '';
                if (cartEmpty) cartItemsContainer.appendChild(cartEmpty);
            }
            return;
        }
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';
        
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        // Mapeo de imágenes para cada plato
        const itemImages = {
            '1': 'imagenes/platos/lomo-saltado.jpg',
            '2': 'imagenes/platos/aji-gallina.jpg',
            '3': 'imagenes/platos/ceviche.jpg',
            '4': 'imagenes/platos/seco-res.jpg',
            '5': 'imagenes/platos/causa.jpg',
            '6': 'imagenes/platos/papa-huancaina.jpg',
            '7': 'imagenes/bebidas/chicha-morada.jpg',
            '8': 'imagenes/bebidas/inca-kola.jpg',
            'combo1': 'imagenes/combos/combo-familiar.jpg',
            'combo2': 'imagenes/combos/combo-parejas.jpg',
            'combo3': 'imagenes/combos/combo-criollo.jpg'
        };
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const imageUrl = itemImages[item.id] || 'imagenes/platos/default.jpg';
            const totalPrice = parseFloat(item.price) * item.quantity;
            
            itemElement.innerHTML = `
                <div class="cart-item-img" style="background-image: url('${imageUrl}')"></div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">S/ ${totalPrice.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-decrement" data-id="${item.id}">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="cart-item-increment" data-id="${item.id}">+</button>
                    <button class="cart-item-remove" data-id="${item.id}" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    },
    
    updateCartTotals: function() {
        const subtotal = this.getSubtotal();
        const delivery = subtotal >= this.minFreeDelivery ? 0 : this.deliveryFee;
        const total = this.getTotal();
        
        const subtotalElement = document.getElementById('cart-subtotal');
        const deliveryElement = document.getElementById('cart-delivery');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement) subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
        if (deliveryElement) {
            deliveryElement.textContent = delivery === 0 ? 'GRATIS' : `S/ ${delivery.toFixed(2)}`;
            deliveryElement.style.color = delivery === 0 ? '#2A9D8F' : '';
            deliveryElement.style.fontWeight = delivery === 0 ? '600' : '';
        }
        if (totalElement) totalElement.textContent = `S/ ${total.toFixed(2)}`;
    },
    
    showAddedNotification: function(itemName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${itemName} agregado al carrito</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            z-index: 3000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },
    
    generateWhatsAppMessage: function() {
        let message = '¡Hola WASI! 👋\n\n';
        message += 'Me gustaría hacer el siguiente pedido:\n\n';
        
        this.items.forEach(item => {
            const total = parseFloat(item.price) * item.quantity;
            message += `• ${item.quantity}x ${item.name} - S/ ${total.toFixed(2)}\n`;
        });
        
        const subtotal = this.getSubtotal();
        const delivery = subtotal >= this.minFreeDelivery ? 0 : this.deliveryFee;
        const total = this.getTotal();
        
        message += `\nSubtotal: S/ ${subtotal.toFixed(2)}`;
        message += `\nDelivery: ${delivery === 0 ? 'GRATIS' : 'S/ 5.00'}`;
        message += `\n*TOTAL: S/ ${total.toFixed(2)}*`;
        message += '\n\n--- DATOS DEL CLIENTE ---';
        message += '\nNombre: ________________';
        message += '\nDirección: ________________';
        message += '\nReferencia: ________________';
        message += '\nTeléfono: ________________';
        message += '\n\n¿Podrían confirmar disponibilidad y tiempo de entrega? ¡Gracias!';
        
        return encodeURIComponent(message);
    }
};

// Inicializar carrito
cart.loadCart();
cart.updateCartDisplay();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Año actual en footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Filtro de categorías del menú
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const selectedCategory = this.dataset.category;
            
            // Filtrar items del menú
            menuItems.forEach(item => {
                if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Agregar platos individuales al carrito
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const item = {
                id: menuItem.dataset.id,
                name: menuItem.dataset.name,
                price: menuItem.dataset.price
            };
            
            cart.addItem(item);
            
            // Efecto visual en el botón
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Agregado';
            this.classList.add('added');
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.classList.remove('added');
            }, 2000);
        });
    });
    
    // Agregar combos al carrito
    document.querySelectorAll('.btn-add-combo').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: this.dataset.price
            };
            
            cart.addItem(item);
            
            // Efecto visual en el botón
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Agregado';
            this.style.background = 'linear-gradient(135deg, #2A9D8F, #21867A)';
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
            }, 2000);
        });
    });
    
    // Carrito sidebar - Abrir/cerrar
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartFloat = document.getElementById('cart-float');
    
    function openCart() {
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            // Crear overlay
            const overlay = document.createElement('div');
            overlay.className = 'cart-overlay active';
            overlay.id = 'cart-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', closeCart);
        }
    }
    
    function closeCart() {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            const overlay = document.getElementById('cart-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        }
    }
    
    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartFloat) cartFloat.addEventListener('click', openCart);
    
    // Delegación de eventos para controles del carrito
    document.addEventListener('click', function(e) {
        // Incrementar cantidad
        if (e.target.classList.contains('cart-item-increment')) {
            const itemId = e.target.dataset.id;
            const item = cart.items.find(i => i.id === itemId);
            if (item) {
                cart.updateQuantity(itemId, item.quantity + 1);
            }
        }
        
        // Decrementar cantidad
        if (e.target.classList.contains('cart-item-decrement')) {
            const itemId = e.target.dataset.id;
            const item = cart.items.find(i => i.id === itemId);
            if (item) {
                cart.updateQuantity(itemId, item.quantity - 1);
            }
        }
        
        // Eliminar item
        if (e.target.classList.contains('cart-item-remove') || 
            e.target.closest('.cart-item-remove')) {
            const removeBtn = e.target.classList.contains('cart-item-remove') ? 
                             e.target : e.target.closest('.cart-item-remove');
            const itemId = removeBtn.dataset.id;
            cart.removeItem(itemId);
        }
    });
    
    // Vaciar carrito
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cart.clearCart();
            }
        });
    }
    
    // Botón de checkout (WhatsApp)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.items.length === 0) {
                alert('Tu carrito está vacío. Agrega algunos platos o combos primero.');
                return;
            }
            
            const phone = '51931686244';
            const message = cart.generateWhatsAppMessage();
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        });
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Placeholder para imágenes faltantes
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
    
    // Placeholder para redes sociales
    document.querySelectorAll('a[href="#"]').forEach(link => {
        if (link.querySelector('.fa-facebook-f, .fa-instagram, .fa-tiktok')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.querySelector('i').classList.contains('fa-facebook-f') ? 'Facebook' :
                                this.querySelector('i').classList.contains('fa-instagram') ? 'Instagram' : 'TikTok';
                
                alert(`🔗 ${platform}\n\nPróximamente estaremos en ${platform}.\nPor ahora contáctanos por WhatsApp: 931 686 244`);
            });
        }
    });
    
    // Animaciones para items del menú
    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        menuObserver.observe(item);
    });
});

// Animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        font-weight: 500;
    }
`;
document.head.appendChild(style);