function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    navLinks.classList.toggle('active');
    menuIcon.classList.toggle('active');
}

function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your interest! Our team will contact you shortly.');
    event.target.reset();
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle learn more buttons
    const learnMoreButtons = document.querySelectorAll('.learn-more');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({behavior: 'smooth'});
            }
        });
    });

    // Handle apply now buttons
    const applyButtons = document.querySelectorAll('.apply-now');
    applyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({behavior: 'smooth'});
            }
        });
    });

    // Close menu when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksMenu = document.querySelector('.nav-links');
            const menuIcon = document.querySelector('.menu-icon');
            navLinksMenu.classList.remove('active');
            menuIcon.classList.remove('active');
        });
    });
});