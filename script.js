document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // -- Elements --
    const mobileToggle = document.getElementById('mobile-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.getElementById('main-header');
    const form = document.getElementById('application-form');
    const loadingOverlay = document.getElementById('loading-overlay');
    const errorPopup = document.getElementById('error-popup');
    const closeErrorBtn = document.getElementById('close-error');
    const applyLinks = document.querySelectorAll('.apply-link');

    // -- Mobile Menu Logic --
    function toggleMenu(show) {
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

    // -- Header Scroll Effect --
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.remove('py-4');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-2');
            header.classList.add('py-4');
        }
    });

    // -- Link Handling (Loader + Broken Link Check) --
    applyLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const targetUrl = link.href;
            const isNewTab = link.target === '_blank';

            // Show Loading
            loadingOverlay.classList.remove('hidden');

            // 2 Second Wait Animation
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                // Attempt to reach the URL. 
                // mode: 'no-cors' avoids CORS errors but catches network errors (DNS, Server Down)
                await fetch(targetUrl, { mode: 'no-cors', method: 'HEAD' });
                
                // If fetch didn't throw, we assume network is reachable.
                loadingOverlay.classList.add('hidden');
                
                if (isNewTab) {
                    window.open(targetUrl, '_blank');
                } else {
                    window.location.href = targetUrl;
                }
            } catch (err) {
                // Network error occurred (Broken link / Blocked)
                console.error("Link check failed:", err);
                loadingOverlay.classList.add('hidden');
                errorPopup.classList.remove('hidden');
            }
        });
    });

    // Close Error Popup
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener('click', () => {
            errorPopup.classList.add('hidden');
        });
    }

    // Close Popup on Outside Click
    if (errorPopup) {
        errorPopup.addEventListener('click', (e) => {
            if (e.target === errorPopup) {
                errorPopup.classList.add('hidden');
            }
        });
    }

    // -- Form Handling --
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const originalText = submitBtn.innerText;

            // Visual Feedback
            submitBtn.innerText = "Processing...";
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');

            // Simulate API Call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Success State
            submitBtn.innerText = "Application Sent!";
            submitBtn.classList.replace('bg-brand-primary', 'bg-green-600');
            submitBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');

            // Reset after delay
            setTimeout(() => {
                form.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75');
                submitBtn.classList.replace('bg-green-600', 'bg-brand-primary');
                submitBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
                alert('Thank you! Our financial advisors will contact you shortly.');
            }, 1000);
        });
    }
});