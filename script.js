document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    const serviceItemsContainer = document.querySelector('.available-services');
    const cartItemsBody = document.getElementById('cart-items-body');
    const totalAmountValue = document.getElementById('total-amount-value');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTable = document.querySelector('.cart-table');
    const bookNowButton = document.querySelector('.btn-book-now');
    const bookNowInfo = document.getElementById('book-now-info');
    const successMessage = document.getElementById('success-message'); 
    const bookingForm = document.querySelector('.booking-form form'); 
    const heroBookButton = document.getElementById('hero-book-btn');
    const servicesSection = document.getElementById('services');

    let cart = [];
    let serialNumber = 1;

    function resetServiceButtons() {
        const allRemoveButtons = document.querySelectorAll('.available-services .btn-remove-item');
        allRemoveButtons.forEach(button => {
            button.innerHTML = `Add Item <span class="icon-circle add-icon">+</span>`;
            button.classList.remove('btn-remove-item');
            button.classList.add('btn-add-item');
        });
    }

    function updateCart() {
        cartItemsBody.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartTable.classList.add('hidden');
            bookNowButton.classList.add('is-disabled');
            bookNowInfo.classList.add('hidden');
        } else {
            emptyCartMessage.classList.add('hidden');
            cartTable.classList.remove('hidden');
            bookNowButton.classList.remove('is-disabled');
            bookNowInfo.classList.add('hidden');
            cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${item.sno}</td><td>${item.name}</td><td>₹${item.price.toFixed(2)}</td>`;
                cartItemsBody.appendChild(row);
                total += item.price;
            });
        }
        totalAmountValue.textContent = `₹${total.toFixed(2)}`;
    }

    serviceItemsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('btn-add-item')) {
            successMessage.classList.add('hidden');

            const serviceItem = button.closest('.service-item');
            const id = serviceItem.dataset.id;
            const isInCart = cart.some(item => item.id === id);

            if (!isInCart) {
                const name = serviceItem.dataset.name;
                const price = parseFloat(serviceItem.dataset.price);
                cart.push({ id, name, price, sno: serialNumber++ });
                button.innerHTML = `Remove Item <span class="icon-circle remove-icon">-</span>`;
                button.classList.remove('btn-add-item');
                button.classList.add('btn-remove-item');
                updateCart();
            }
        } else if (button.classList.contains('btn-remove-item')) {
            const serviceItem = button.closest('.service-item');
            const id = serviceItem.dataset.id;
            cart = cart.filter(item => item.id !== id);
            button.innerHTML = `Add Item <span class="icon-circle add-icon">+</span>`;
            button.classList.remove('btn-remove-item');
            button.classList.add('btn-add-item');
            serialNumber = 1;
            cart.forEach(item => { item.sno = serialNumber++; });
            updateCart();
        }
    });

    // --- MODIFIED Event Listener for the "Book now" button ---
    bookNowButton.addEventListener('click', (e) => {
        e.preventDefault(); 

        if (bookNowButton.classList.contains('is-disabled')) {
            bookNowInfo.classList.remove('hidden');
            successMessage.classList.add('hidden');
        } else {
            // Show success message and reset everything immediately
            successMessage.classList.remove('hidden');
            bookNowInfo.classList.add('hidden');
            cart = [];                             
            bookingForm.reset();                   
            resetServiceButtons();                 
            updateCart();     
            
            // Set a timer to hide the success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    });

    const allAddButtons = document.querySelectorAll('.available-services .btn-add-item');
    allAddButtons.forEach(button => {
        button.innerHTML = `Add Item <span class="icon-circle add-icon">+</span>`;
    });

    if (heroBookButton && servicesSection) {
        heroBookButton.addEventListener('click', () => {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    updateCart();
});