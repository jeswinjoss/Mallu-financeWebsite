document.addEventListener('DOMContentLoaded', () => {
    // -- Icons --
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // -- DOM Elements --
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.getElementById('main-header');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorBtn = document.getElementById('close-error');
    const applyLinks = document.querySelectorAll('.apply-link');

    // -- Scroll Reveal Animation --
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // -- Mobile Menu --
    function toggleMenu(show) {
        if (!mobileMenu) return;
        if (show) {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMenu(true));
    if (closeMenu) closeMenu.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // -- Header Glass Effect --
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 10) {
            header.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.remove('py-4', 'bg-transparent');
        } else {
            header.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.add('py-4', 'bg-transparent');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // -- EMI Calculator Logic --
    const amountInput = document.getElementById('loan-amount');
    const rateInput = document.getElementById('interest-rate');
    const tenureInput = document.getElementById('loan-tenure');
    
    const amountDisplay = document.getElementById('amount-display');
    const rateDisplay = document.getElementById('rate-display');
    const tenureDisplay = document.getElementById('tenure-display');
    
    const emiOutput = document.getElementById('emi-output');
    const interestOutput = document.getElementById('interest-output');
    const totalOutput = document.getElementById('total-output');

    function formatCurrency(num) {
        return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
    }

    function calculateEMI() {
        if (!amountInput) return;

        const P = parseFloat(amountInput.value);
        const r = parseFloat(rateInput.value) / 12 / 100;
        const n = parseFloat(tenureInput.value) * 12;

        // Update UI Text
        if (amountDisplay) amountDisplay.innerText = formatCurrency(P);
        if (rateDisplay) rateDisplay.innerText = rateInput.value;
        if (tenureDisplay) tenureDisplay.innerText = tenureInput.value;

        // Calculation
        let emi = 0;
        if (r === 0) {
             emi = P / n;
        } else {
             emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        // Update Results
        if (emiOutput) emiOutput.innerText = formatCurrency(Math.round(emi));
        if (interestOutput) interestOutput.innerText = formatCurrency(Math.round(totalInterest));
        if (totalOutput) totalOutput.innerText = formatCurrency(Math.round(totalPayment));
        
        // Update slider background gradient for visual feedback
        updateSliderTrack(amountInput);
        updateSliderTrack(rateInput);
        updateSliderTrack(tenureInput);
    }

    function updateSliderTrack(input) {
        if(!input) return;
        const min = input.min ? parseFloat(input.min) : 0;
        const max = input.max ? parseFloat(input.max) : 100;
        const val = parseFloat(input.value);
        const percentage = ((val - min) / (max - min)) * 100;
        
        input.style.background = `linear-gradient(to right, #2563eb ${percentage}%, #e2e8f0 ${percentage}%)`;
    }

    if (amountInput && rateInput && tenureInput) {
        [amountInput, rateInput, tenureInput].forEach(input => {
            input.addEventListener('input', calculateEMI);
        });
        calculateEMI();
    }

    // -- Link Handling --
    applyLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            const targetUrl = link.getAttribute('href');
            if (targetUrl.startsWith('#')) return;
            
            e.preventDefault();
            if (loadingOverlay) {
                loadingOverlay.classList.remove('hidden');
                loadingOverlay.classList.remove('opacity-0');
            }
            
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1200));

            try {
                if (!navigator.onLine) throw new Error("Offline");
                
                const isNewTab = link.target === '_blank';
                if (isNewTab) {
                    window.open(targetUrl, '_blank');
                    if (loadingOverlay) {
                        loadingOverlay.classList.add('opacity-0');
                        setTimeout(() => loadingOverlay.classList.add('hidden'), 300);
                    }
                } else {
                    window.location.href = targetUrl;
                }
            } catch (err) {
                 if (loadingOverlay) {
                     loadingOverlay.classList.add('opacity-0');
                     setTimeout(() => loadingOverlay.classList.add('hidden'), 300);
                 }
                 if (errorPopup) errorPopup.classList.remove('hidden');
            }
        });
    });

    if (closeErrorBtn && errorPopup) {
        closeErrorBtn.addEventListener('click', () => {
            errorPopup.classList.add('hidden');
        });
    }
});