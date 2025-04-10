// Mobile Navigation Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const navMenu = document.getElementById('nav-menu'); // Make sure your nav container has id="nav-menu"

if (mobileMenuButton && navMenu) {
    mobileMenuButton.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const hrefAttribute = this.getAttribute('href');
        // Check if it's a valid ID selector and not just "#"
        if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
            const target = document.querySelector(hrefAttribute);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust offset for sticky header height (approx 80px)
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && !navMenu.classList.contains('hidden') && window.innerWidth < 768) { // 768px is Tailwind's 'md' breakpoint
                    navMenu.classList.add('hidden');
                }
            }
        }
    });
});

// Wait for the DOM to be fully loaded before running accordion/tab scripts
document.addEventListener('DOMContentLoaded', () => {
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i'); // Assuming Font Awesome icons

            // Toggle active class on content
            if (content && content.classList.contains('faq-answer')) { // Check if next sibling is the answer
                content.classList.toggle('active');

                // Toggle icon class
                if (icon) {
                    if (content.classList.contains('active')) {
                        icon.classList.replace('fa-plus', 'fa-minus');
                    } else {
                        icon.classList.replace('fa-minus', 'fa-plus');
                    }
                }

                // Optional: Close other accordions when one is opened
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) {
                        const otherContent = otherHeader.nextElementSibling;
                        if (otherContent && otherContent.classList.contains('faq-answer') && otherContent.classList.contains('active')) {
                            otherContent.classList.remove('active');
                            const otherIcon = otherHeader.querySelector('i');
                            if (otherIcon) {
                                otherIcon.classList.replace('fa-minus', 'fa-plus');
                            }
                        }
                    }
                });
            } // End check for valid content element
        });
    });

    // Tab functionality (if needed later)
    function activateTab(tabGroup, tabButton) {
        const group = document.getElementById(tabGroup);
        if (!group) return;

        // Deactivate all buttons and content in this group
        group.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        group.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Activate the clicked button and corresponding content
        tabButton.classList.add('active');
        const contentId = tabButton.getAttribute('data-target');
        const targetContent = document.getElementById(contentId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    // Example usage for tabs (add relevant IDs and data-target attributes in HTML)
    // const tabButtons = document.querySelectorAll('.tab-button');
    // tabButtons.forEach(button => {
    //     button.addEventListener('click', () => {
    //         const tabGroup = button.closest('[data-tab-group]').getAttribute('data-tab-group');
    //         activateTab(tabGroup, button);
    //     });
    // });

}); // End DOMContentLoaded listener


// Active navigation highlight on scroll (if sections have corresponding IDs)
// This can run outside DOMContentLoaded as it relies on scroll events
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link'); // Ensure nav links have this class

function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    let currentSectionId = '';
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100; // Adjust offset slightly more than header height
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active-nav');
        }
    });

    // Handle edge case for top of page (highlight Home)
    if (scrollY < 100 && currentSectionId === '') {
         navLinks.forEach(link => {
            if (link.getAttribute('href') === '#home' || link.getAttribute('href') === 'index.html') {
                 link.classList.add('active-nav');
            }
         });
    }
}

// Add scroll listener only if there are sections and nav links to monitor
if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', highlightNavOnScroll);
    // Initial call to highlight based on initial position (e.g., if page loads scrolled down)
    highlightNavOnScroll();
}

// Tab functionality (if needed later)
function activateTab(tabGroup, tabButton) {
    const group = document.getElementById(tabGroup);
    if (!group) return;

    // Deactivate all buttons and content in this group
    group.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    group.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Activate the clicked button and corresponding content
    tabButton.classList.add('active');
    const contentId = tabButton.getAttribute('data-target');
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Example usage for tabs (add relevant IDs and data-target attributes in HTML)
// const tabButtons = document.querySelectorAll('.tab-button');
// tabButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const tabGroup = button.closest('[data-tab-group]').getAttribute('data-tab-group');
//         activateTab(tabGroup, button);
//     });
// });
