console.log("scripts.js loaded"); // Add this line

// Function to load the menu and set the active link
async function loadMenu() {
    console.log("loadMenu function called"); // Add this line
    const placeholder = document.getElementById('main-navigation-placeholder');
    if (!placeholder) {
        console.error('Menu placeholder not found!');
        return;
    }

    try {
        const response = await fetch('_menu.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuHtml = await response.text();
        placeholder.innerHTML = menuHtml;

        // Re-attach mobile menu toggle after loading menu
        const loadedMobileMenuButton = placeholder.querySelector('#mobile-menu-button');
        const loadedNavMenu = placeholder.querySelector('#nav-menu');
        if (loadedMobileMenuButton && loadedNavMenu) {
            loadedMobileMenuButton.addEventListener('click', () => {
                loadedNavMenu.classList.toggle('hidden');
            });
             // Add listener to close mobile menu on link click inside mobile view
            loadedNavMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 1024 && !loadedNavMenu.classList.contains('hidden')) { // lg breakpoint
                        loadedNavMenu.classList.add('hidden');
                    }
                });
            });
        } else {
             console.error("Mobile menu button or nav menu not found in loaded content.");
        }


        setActiveNavLink(); // Highlight the correct link
        initializeScrollHighlighting(); // Initialize scrollspy after menu is loaded

    } catch (error) {
        console.error('Error loading menu:', error);
        let errorMessage = 'Error loading navigation menu.';
        if (error instanceof TypeError) {
            errorMessage += ' Network error or incorrect path.';
        } else if (error instanceof Error) {
            errorMessage += ' ' + error.message;
        }
        placeholder.innerHTML = `<p class="text-red-500 text-center">${errorMessage}</p>`;
    }
}

// Function to set the active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default to index.html if path is empty
    let activeHref = 'index.html'; // Default active link

    // --- Define mapping for active link ---
    if (currentPage.startsWith('journey-')) {
        activeHref = 'journey-overview.html';
    } else if (currentPage.startsWith('principles-')) {
        activeHref = '#principles'; // Link to section on index.html
    } else if (currentPage.startsWith('holydays-')) {
         activeHref = '#holy-days'; // Link to section on index.html
    } else if (currentPage.startsWith('village-')) {
         activeHref = '#village'; // Link to section on index.html
    } else if (currentPage.startsWith('testimony-') || currentPage === 'testimonies.html') {
        activeHref = 'testimonies.html';
    } else if (currentPage === 'books.html' || currentPage === 'author-profile.html') {
        activeHref = 'books.html';
    } else if (['connect.html', 'resources.html', 'blog.html', 'faq.html', 'store.html'].includes(currentPage)) {
        activeHref = 'connect.html';
    }
    // --- End mapping ---

    // Find links within the loaded menu
    const menuContainer = document.getElementById('main-navigation-placeholder');
    if (!menuContainer) return;

    const navLinks = menuContainer.querySelectorAll('#nav-menu > ul > li > a.nav-link'); // Target only top-level links

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        // Check if the link's href matches the determined active href
        // For section links (#...), check if the current page is index.html AND the href matches
        const linkHref = link.getAttribute('href');
        if (linkHref === activeHref) {
             // Special handling for homepage section links
             if (linkHref.startsWith('#') && currentPage !== 'index.html') {
                 // Don't activate section links if not on index.html
             } else {
                link.classList.add('active-nav');
             }
        } else if (linkHref === 'index.html' && activeHref === 'index.html') {
             link.classList.add('active-nav'); // Explicitly activate Home on index
        }
    });
}

// Function to initialize scrollspy (needs to run AFTER menu is loaded)
function initializeScrollHighlighting() {
    const menuContainer = document.getElementById('main-navigation-placeholder');
    if (!menuContainer) return;

    const sections = document.querySelectorAll('section[id]');
    // Select links *within the loaded menu*
    const navLinks = menuContainer.querySelectorAll('#nav-menu > ul > li > a.nav-link');

    function highlightNavOnScroll() {
        // Only run scrollspy logic if on the homepage where sections exist
        if (window.location.pathname.split('/').pop() !== 'index.html' && window.location.pathname !== '/') {
            // If not on homepage, active link is handled by setActiveNavLink, so remove scrollspy highlights
             navLinks.forEach(link => {
                 // Keep the statically set active class, remove others potentially added by scroll
                 const staticActiveHref = getActiveHrefForCurrentPage(); // Helper function needed
                 if (link.getAttribute('href') !== staticActiveHref) {
                    // link.classList.remove('active-nav'); // Be careful not to remove the statically set one
                 }
             });
            return;
        }

        const scrollY = window.pageYOffset;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // Adjust offset
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            const linkHref = link.getAttribute('href');

            // Highlight section link if it matches current section
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active-nav');
            }
            // Highlight Home link if at top or no section matched
             else if ((scrollY < 150 || currentSectionId === '') && linkHref === 'index.html') {
                 link.classList.add('active-nav');
             }
        });
         // Ensure Home is active if scrolled right to the top
        if (scrollY < 100 && currentSectionId === '') {
             navLinks.forEach(link => {
                 if (link.getAttribute('href') === 'index.html') {
                     link.classList.add('active-nav');
                 }
             });
        }
    }

     // Helper function to get the statically determined active link href
     function getActiveHrefForCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage.startsWith('journey-')) return 'journey-overview.html';
        if (currentPage.startsWith('principles-')) return '#principles';
        if (currentPage.startsWith('holydays-')) return '#holy-days';
        if (currentPage.startsWith('village-')) return '#village';
        if (currentPage.startsWith('testimony-') || currentPage === 'testimonies.html') return 'testimonies.html';
        if (currentPage === 'books.html' || currentPage === 'author-profile.html') return 'books.html';
        if (['connect.html', 'resources.html', 'blog.html', 'faq.html', 'store.html'].includes(currentPage)) return 'connect.html';
        return 'index.html';
     }


    // Add scroll listener only if there are sections and nav links to monitor
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', highlightNavOnScroll);
        // Initial call to highlight based on initial position
        highlightNavOnScroll();
    }
}


// --- Original Smooth Scrolling (Keep as is) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const hrefAttribute = this.getAttribute('href');
        if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
            const target = document.querySelector(hrefAttribute);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Mobile menu closing logic might need adjustment after menu load
                const loadedNavMenu = document.querySelector('#main-navigation-placeholder #nav-menu');
                 if (loadedNavMenu && !loadedNavMenu.classList.contains('hidden') && window.innerWidth < 1024) { // Use lg breakpoint
                    loadedNavMenu.classList.add('hidden');
                }
            }
        }
    });
});

// --- Combined DOMContentLoaded Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // Load the menu first
    loadMenu(); // This now also calls setActiveNavLink and initializeScrollHighlighting

    // Accordion functionality (keep as is)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');

            if (content && content.classList.contains('faq-answer')) {
                const isActive = content.classList.toggle('active'); // Toggle and check state

                 // Toggle icon class based on new state
                if (icon) {
                    if (isActive) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }


                // Close other accordions
                document.querySelectorAll('.faq-answer.active').forEach(openContent => {
                    if (openContent !== content) {
                        openContent.classList.remove('active');
                        const otherIcon = openContent.previousElementSibling.querySelector('i');
                        if (otherIcon) {
                             otherIcon.classList.remove('fa-minus');
                             otherIcon.classList.add('fa-plus');
                        }
                    }
                });
            }
        });
    });

    // Tab functionality (keep as is, if used later)
    function activateTab(tabGroup, tabButton) {
        const group = document.getElementById(tabGroup);
        if (!group) return;
        group.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        group.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        tabButton.classList.add('active');
        const contentId = tabButton.getAttribute('data-target');
        const targetContent = document.getElementById(contentId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
    // const tabButtons = document.querySelectorAll('.tab-button');
    // tabButtons.forEach(button => {
    //     button.addEventListener('click', () => {
    //         const tabGroup = button.closest('[data-tab-group]').getAttribute('data-tab-group');
    //         activateTab(tabGroup, button);
    //     });
    // });

}); // End DOMContentLoaded listener
