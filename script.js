document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    // This is critical for the menu icon to show up
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // -- Elements --
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.getElementById('main-header');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorBtn = document.getElementById('close-error');
    const applyLinks = document.querySelectorAll('.apply-link');

    // -- Mobile Menu Logic --
    function toggleMenu(show) {
        if (!mobileMenu) return;
        if (show) {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
            mobileMenu.setAttribute('aria-hidden', 'false');
        } else {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => toggleMenu(true));
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', () => toggleMenu(false));
    }

    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // -- Header Scroll Effect --
    function handleScroll() {
        if (!header) return;
        if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) return;

        if (window.scrollY > 20) {
            header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.remove('py-4', 'bg-transparent');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.add('py-4', 'bg-transparent');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

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

        // Update Labels
        if (amountDisplay) amountDisplay.innerText = formatCurrency(P);
        if (rateDisplay) rateDisplay.innerText = rateInput.value;
        if (tenureDisplay) tenureDisplay.innerText = tenureInput.value;

        // Calculation: EMI = [P x r x (1+r)^n]/[(1+r)^n-1]
        let emi = 0;
        if (r === 0) {
             emi = P / n;
        } else {
             emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        // Update Outputs
        if (emiOutput) emiOutput.innerText = formatCurrency(emi);
        if (interestOutput) interestOutput.innerText = formatCurrency(totalInterest);
        if (totalOutput) totalOutput.innerText = formatCurrency(totalPayment);
    }

    if (amountInput && rateInput && tenureInput) {
        [amountInput, rateInput, tenureInput].forEach(input => {
            input.addEventListener('input', calculateEMI);
        });
        // Initial Calculation
        calculateEMI();
    }

    // -- Link Handling (Loader + Broken Link Check) --
    applyLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            const targetUrl = link.getAttribute('href');
            
            // Allow internal links to work normally
            if (targetUrl.startsWith('#')) return;
            
            // Prevent default to show loader
            e.preventDefault();
            
            if (loadingOverlay) loadingOverlay.classList.remove('hidden');
            
            // Simulate loading time
            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                // Basic connectivity check simulation
                if (!navigator.onLine) {
                    throw new Error("No internet connection");
                }
                
                // Redirect manually after check
                const isNewTab = link.target === '_blank';
                if (isNewTab) {
                    window.open(targetUrl, '_blank');
                    if (loadingOverlay) loadingOverlay.classList.add('hidden');
                } else {
                    window.location.href = targetUrl;
                }

            } catch (err) {
                 console.error(err);
                 if (loadingOverlay) loadingOverlay.classList.add('hidden');
                 if (errorPopup) errorPopup.classList.remove('hidden');
            }
        });
    });

    // Close Error Popup
    if (closeErrorBtn && errorPopup) {
        closeErrorBtn.addEventListener('click', () => {
            errorPopup.classList.add('hidden');
        });
    }
});