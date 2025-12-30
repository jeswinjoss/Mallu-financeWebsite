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
    const initialLoader = document.getElementById('initial-loader');

    // -- Snowfall Logic --
    function createSnowflakes() {
        const container = document.getElementById('snow-container');
        if (!container) return;
        
        const snowflakeCount = 40;
        
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.textContent = '❄️';
            snowflake.classList.add('snowflake');
            
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = Math.random() * 5 + 8 + 's';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            snowflake.style.opacity = Math.random() * 0.4 + 0.1;
            snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
            
            container.appendChild(snowflake);
        }
    }
    createSnowflakes();

    // -- Initial Loader Animation --
    if (initialLoader) {
        setTimeout(() => {
            initialLoader.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                initialLoader.style.display = 'none';
            }, 700);
        }, 2000);
    }

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

        if (amountDisplay) amountDisplay.innerText = formatCurrency(P);
        if (rateDisplay) rateDisplay.innerText = rateInput.value;
        if (tenureDisplay) tenureDisplay.innerText = tenureInput.value;

        let emi = 0;
        if (r === 0) {
             emi = P / n;
        } else {
             emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        }

        const totalPayment = emi * n;
        const totalInterest = totalPayment - P;

        if (emiOutput) emiOutput.innerText = formatCurrency(Math.round(emi));
        if (interestOutput) interestOutput.innerText = formatCurrency(Math.round(totalInterest));
        if (totalOutput) totalOutput.innerText = formatCurrency(Math.round(totalPayment));
        
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
});