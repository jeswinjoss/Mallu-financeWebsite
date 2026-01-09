document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') { feather.replace(); }

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.getElementById('main-header');
    const initialLoader = document.getElementById('initial-loader');

    // Loader Logic
    window.addEventListener('load', () => {
        if (initialLoader) {
            setTimeout(() => {
                initialLoader.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => { initialLoader.style.display = 'none'; }, 700);
            }, 400);
        }
    });

    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    // Mobile Menu Logic
    function toggleMenu() {
        if (!mobileMenu) return;
        const isOpen = !mobileMenu.classList.contains('translate-x-full');
        if (isOpen) {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = '';
            if(mobileToggle) mobileToggle.innerHTML = '<i data-feather="menu"></i>';
        } else {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
            if(mobileToggle) mobileToggle.innerHTML = '<i data-feather="x"></i>';
        }
        if (typeof feather !== 'undefined') feather.replace();
    }

    if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
        if(mobileToggle) mobileToggle.innerHTML = '<i data-feather="menu"></i>';
        if (typeof feather !== 'undefined') feather.replace();
    }));

    // Header Scroll Logic (Optimized)
    let scrollTimeout;
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 20) {
            header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.remove('py-4', 'bg-transparent');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.add('py-4', 'bg-transparent');
        }
    }
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(handleScroll);
    });
    handleScroll();

    // Calculator Logic
    const amountInput = document.getElementById('loan-amount');
    const rateInput = document.getElementById('interest-rate');
    const tenureInput = document.getElementById('loan-tenure');
    
    if (amountInput && rateInput && tenureInput) {
        const amountDisplay = document.getElementById('amount-display');
        const rateDisplay = document.getElementById('rate-display');
        const tenureDisplay = document.getElementById('tenure-display');
        const emiOutput = document.getElementById('emi-output');
        const interestOutput = document.getElementById('interest-output');
        const totalOutput = document.getElementById('total-output');
        
        const formatCurrency = (num) => new Intl.NumberFormat('en-IN').format(num);
        
        const updateBackground = (input) => {
            const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
            input.style.background = `linear-gradient(to right, #2563eb ${pct}%, #e2e8f0 ${pct}%)`;
        };

        const calculateEMI = () => {
            const P = parseFloat(amountInput.value);
            const r = parseFloat(rateInput.value) / 12 / 100;
            const n = parseFloat(tenureInput.value) * 12;
            
            if (amountDisplay) amountDisplay.innerText = formatCurrency(P);
            if (rateDisplay) rateDisplay.innerText = rateInput.value;
            if (tenureDisplay) tenureDisplay.innerText = tenureInput.value;
            
            let emi = 0;
            if (P > 0 && r > 0 && n > 0) {
                 emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            }
            
            const totalPayment = emi * n;
            const totalInterest = totalPayment - P;
            
            if (emiOutput) emiOutput.innerText = formatCurrency(Math.round(emi));
            if (interestOutput) interestOutput.innerText = formatCurrency(Math.round(totalInterest));
            if (totalOutput) totalOutput.innerText = formatCurrency(Math.round(totalPayment));
            
            updateBackground(amountInput);
            updateBackground(rateInput);
            updateBackground(tenureInput);
        };
        
        [amountInput, rateInput, tenureInput].forEach(i => {
            i.addEventListener('input', calculateEMI);
            updateBackground(i);
        });
        calculateEMI();
    }
});