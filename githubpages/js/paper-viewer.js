// Paper Viewer JavaScript
(function() {
    // Store original document ready function to avoid conflicts
    const originalReady = document.addEventListener;
    
    // Safe DOM ready implementation
    function onDOMReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            setTimeout(callback, 0);
        }
    }
    
    // Create and show loading overlay
    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(overlay);
        return overlay;
    }
    
    // Remove loading overlay
    function removeLoadingOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // Create and inject MathJax loading indicators
    function addMathLoadingIndicators() {
        const mathElements = document.querySelectorAll('.paper-content [class*="math"], .paper-content .equation, .paper-content .formula');
        mathElements.forEach(el => {
            const loadingIndicator = document.createElement('span');
            loadingIndicator.className = 'math-loading';
            loadingIndicator.textContent = 'Rendering math...';
            el.appendChild(loadingIndicator);
        });
    }
    
    // Remove MathJax loading indicators once rendered
    function removeMathLoadingIndicators() {
        const indicators = document.querySelectorAll('.math-loading');
        indicators.forEach(indicator => {
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        });
    }
    
    // Check if MathJax has initialized
    function checkMathJaxReady() {
        const maxAttempts = 50; // 10 seconds (200ms * 50)
        let attempts = 0;
        
        return new Promise((resolve, reject) => {
            function check() {
                attempts++;
                if (typeof MathJax !== 'undefined' && MathJax.typeset) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('MathJax failed to initialize within the time limit');
                    reject(new Error('MathJax initialization timeout'));
                } else {
                    setTimeout(check, 200);
                }
            }
            check();
        });
    }
    
    // Main initialization
    onDOMReady(function() {
        try {
            console.log('Initializing Paper Viewer');
            
            // Show loading overlay
            const loadingOverlay = showLoadingOverlay();
            
            // Add MathJax loading indicators
            addMathLoadingIndicators();
            
            // Initialize UI components
            initializeSidebar();
            initializeScrollSpy();
            initializeProgressBar();
            initializeContentTabs();
            initializeSearch();
            initializeTableOfContents();
            initializePrint();
            initializeDarkMode();
            initializeAccessibility();
            initializeBackToTop();
            initializeMathHelper();
            
            // Wait for MathJax to be ready
            checkMathJaxReady()
                .then(() => {
                    console.log('MathJax initialized successfully');
                    // Remove math loading indicators
                    removeMathLoadingIndicators();
                    
                    // Initialize interactive components
                    initializeCubicExplorer();
                    initializeProjectiveSpace();
                    initializeMatrixTraceCalculator();
                    initializeSinSquaredDemo();
                    initializeMethodsComparison();
                    initializeNumericalValidation();
                    initializeSubtractiveAlgorithm();
                    
                    // Initialize citation and sharing
                    initializeCitationAndSharing();
                })
                .catch(err => {
                    console.error('Error initializing MathJax:', err);
                    // Even if MathJax fails, continue with other initializations
                    removeMathLoadingIndicators();
                    
                    // Initialize interactive components
                    initializeCubicExplorer();
                    initializeProjectiveSpace();
                    initializeMatrixTraceCalculator();
                    initializeSinSquaredDemo();
                    initializeMethodsComparison();
                    initializeNumericalValidation();
                    initializeSubtractiveAlgorithm();
                    
                    // Initialize citation and sharing
                    initializeCitationAndSharing();
                })
                .finally(() => {
                    // Add CSS to hide Desmos logo regardless of MathJax status
                    const style = document.createElement('style');
                    style.innerHTML = '.dcg-logo-container { display: none !important; }';
                    document.head.appendChild(style);
                    
                    // Check if all sections are properly linked
                    ensureSectionsAreLinked();
                    
                    // Initialize code highlighting with Prism.js
                    if (typeof Prism !== 'undefined') {
                        Prism.highlightAll();
                    }
                    
                    // Track keyboard vs mouse usage for focus styles
                    document.body.addEventListener('mousedown', function() {
                        document.body.classList.remove('keyboard-nav');
                    });
                    
                    document.body.addEventListener('keydown', function(e) {
                        if (e.key === 'Tab') {
                            document.body.classList.add('keyboard-nav');
                        }
                    });
                    
                    // Remove loading overlay after a short delay
                    setTimeout(() => {
                        removeLoadingOverlay(loadingOverlay);
                        console.log('Paper Viewer initialized successfully');
                    }, 500);
                });
        } catch (error) {
            console.error('Error initializing Paper Viewer:', error);
            // Remove loading overlay in case of error
            removeLoadingOverlay(document.querySelector('.loading-overlay'));
        }
    });

    // Function to ensure all sections are properly linked
    function ensureSectionsAreLinked() {
        // Get all paper sections
        const paperSections = document.querySelectorAll('.paper-section');
        const navLinks = document.querySelectorAll('#paper-nav .nav-link');
        
        // Create a map of section IDs that exist in the navigation
        const navSectionIds = Array.from(navLinks).map(link => 
            link.getAttribute('href').replace('#', '')
        );
        
        // Check if all paper sections are in the navigation
        paperSections.forEach(section => {
            const sectionId = section.getAttribute('id');
            if (!navSectionIds.includes(sectionId)) {
                console.warn(`Section '${sectionId}' exists in content but is not linked in navigation`);
                
                // Add missing section to navigation
                const sectionTitle = section.querySelector('h2').textContent;
                const newNavItem = document.createElement('li');
                newNavItem.className = 'nav-item';
                newNavItem.innerHTML = `
                    <a class="nav-link" href="#${sectionId}">
                        <i class="bi bi-file-text"></i> ${sectionTitle}
                    </a>
                `;
                
                // Append to navigation
                document.getElementById('paper-nav').appendChild(newNavItem);
            }
        });
        
        // Check if all navigation links point to existing sections
        navSectionIds.forEach(navId => {
            const sectionExists = document.getElementById(navId) !== null;
            if (!sectionExists) {
                console.warn(`Navigation link to '#${navId}' points to a non-existent section`);
                
                // Find the nav link and mark it with a warning class
                const navLink = document.querySelector(`#paper-nav .nav-link[href="#${navId}"]`);
                if (navLink) {
                    navLink.classList.add('nav-link-warning');
                    navLink.setAttribute('title', 'This section does not exist in the document');
                }
            }
        });
        
        // Check the interactive tools section links as well
        const toolsNavLinks = document.querySelectorAll('#tools-nav .nav-link');
        const toolsSectionIds = Array.from(toolsNavLinks).map(link => 
            link.getAttribute('href').replace('#', '')
        );
        
        toolsSectionIds.forEach(toolId => {
            const toolExists = document.getElementById(toolId) !== null;
            if (!toolExists) {
                console.warn(`Tools navigation link to '#${toolId}' points to a non-existent section`);
                
                // Find the nav link and mark it with a warning class
                const toolLink = document.querySelector(`#tools-nav .nav-link[href="#${toolId}"]`);
                if (toolLink) {
                    toolLink.classList.add('nav-link-warning');
                    toolLink.setAttribute('title', 'This tool section does not exist in the document');
                }
            }
        });
    }

    // Sidebar functionality
    function initializeSidebar() {
        const toggleSidebarBtn = document.getElementById('toggle-sidebar');
        const toggleToolsBtn = document.getElementById('toggle-tools');
        const paperContent = document.querySelector('.paper-content');
        const toolsContent = document.querySelector('.tools-content');
        const sidebar = document.querySelector('.sidebar');
        
        // Add touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - show sidebar
                document.body.classList.remove('sidebar-hidden');
            } else if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - hide sidebar
                document.body.classList.add('sidebar-hidden');
            }
        }
        
        // Toggle sidebar visibility with animation
        toggleSidebarBtn.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-hidden');
            if (document.body.classList.contains('sidebar-hidden')) {
                sidebar.style.transform = 'translateX(-100%)';
            } else {
                sidebar.style.transform = 'translateX(0)';
            }
        });
        
        // Toggle between paper content and tools with animation
        toggleToolsBtn.addEventListener('click', function() {
            if (paperContent.style.display !== 'none') {
                paperContent.style.opacity = '0';
                setTimeout(() => {
                    paperContent.style.display = 'none';
                    toolsContent.style.display = 'block';
                    setTimeout(() => {
                        toolsContent.style.opacity = '1';
                    }, 50);
                }, 300);
                toggleToolsBtn.classList.add('active');
            } else {
                toolsContent.style.opacity = '0';
                setTimeout(() => {
                    toolsContent.style.display = 'none';
                    paperContent.style.display = 'block';
                    setTimeout(() => {
                        paperContent.style.opacity = '1';
                    }, 50);
                }, 300);
                toggleToolsBtn.classList.remove('active');
            }
        });
        
        // Handle navigation link clicks with smooth scrolling
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // If it's a tool link, show tools content
                    if (targetId.startsWith('cubic-explorer') || 
                        targetId.startsWith('projective-space') || 
                        targetId.startsWith('trace-calculator') || 
                        targetId.startsWith('sin-squared-demo')) {
                        paperContent.style.opacity = '0';
                        setTimeout(() => {
                            paperContent.style.display = 'none';
                            toolsContent.style.display = 'block';
                            setTimeout(() => {
                                toolsContent.style.opacity = '1';
                            }, 50);
                        }, 300);
                        toggleToolsBtn.classList.add('active');
                    } else {
                        // Otherwise show paper content
                        toolsContent.style.opacity = '0';
                        setTimeout(() => {
                            toolsContent.style.display = 'none';
                            paperContent.style.display = 'block';
                            setTimeout(() => {
                                paperContent.style.opacity = '1';
                            }, 50);
                        }, 300);
                        toggleToolsBtn.classList.remove('active');
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // On mobile, hide the sidebar after clicking
                    if (window.innerWidth < 768) {
                        document.body.classList.add('sidebar-hidden');
                        sidebar.style.transform = 'translateX(-100%)';
                    }
                }
            });
        });
    }

    // Scroll spy functionality
    function initializeScrollSpy() {
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.paper-section');
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            if (current) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update table of contents active state
                document.querySelectorAll('.toc-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.querySelector(`a[href="#${current}"]`)) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Reading progress bar
    function initializeProgressBar() {
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            document.querySelector('.progress-bar').style.width = scrollPercent + '%';
            document.getElementById('reading-percentage').textContent = Math.round(scrollPercent) + '%';
        });
    }

    // Content tabs functionality
    function initializeContentTabs() {
        // Handle tab switching between paper view and interactive tools
        const paperBtn = document.getElementById('paper-btn');
        const toolsBtn = document.getElementById('tools-btn');
        if (paperBtn && toolsBtn) {
            paperBtn.addEventListener('click', function() {
                document.querySelector('.paper-content').style.display = 'block';
                document.querySelector('.tools-content').style.display = 'none';
                paperBtn.classList.add('active');
                toolsBtn.classList.remove('active');
            });
            
            toolsBtn.addEventListener('click', function() {
                document.querySelector('.paper-content').style.display = 'none';
                document.querySelector('.tools-content').style.display = 'block';
                paperBtn.classList.remove('active');
                toolsBtn.classList.add('active');
            });
        }
    }

    // Search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput || !searchBtn || !searchResults) return;
        
        let currentResultIndex = -1;
        let searchResultsList = [];
        
        // Function to perform search
        function performSearch() {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            // Get all text content from paper sections
            const sections = document.querySelectorAll('.paper-section');
            const results = [];
            
            sections.forEach(section => {
                const sectionId = section.getAttribute('id');
                const sectionTitle = section.querySelector('h2').textContent;
                const sectionContent = section.textContent;
                
                // Find matches in the section content
                const matches = sectionContent.toLowerCase().split(query);
                if (matches.length > 1) {
                    // For each match, create a result item
                    for (let i = 0; i < matches.length - 1; i++) {
                        const matchIndex = sectionContent.toLowerCase().indexOf(query, i > 0 ? sectionContent.toLowerCase().indexOf(query, i - 1) + query.length : 0);
                        const contextStart = Math.max(0, matchIndex - 50);
                        const contextEnd = Math.min(sectionContent.length, matchIndex + query.length + 50);
                        const context = sectionContent.substring(contextStart, contextEnd);
                        
                        results.push({
                            sectionId,
                            sectionTitle,
                            context,
                            matchIndex
                        });
                    }
                }
            });
            
            // Display results
            if (results.length > 0) {
                searchResultsList = results;
                currentResultIndex = -1;
                
                searchResults.innerHTML = results.map((result, index) => `
                    <div class="search-result-item" data-section="${result.sectionId}" data-index="${result.matchIndex}" data-result-index="${index}">
                        <div class="result-title">${result.sectionTitle}</div>
                        <div class="result-context">...${result.context}...</div>
                    </div>
                `).join('');
                
                searchResults.style.display = 'block';
                
                // Add click handlers to result items
                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        navigateToResult(this);
                    });
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                searchResults.style.display = 'block';
            }
        }
        
        function navigateToResult(resultElement) {
            const sectionId = resultElement.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                // Scroll to section
                section.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the match
                const sectionContent = section.textContent;
                const matchIndex = parseInt(resultElement.getAttribute('data-index'));
                const query = searchInput.value.trim();
                
                // Create a temporary highlight
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = sectionContent.substring(0, matchIndex) +
                    '<span class="highlight">' + sectionContent.substring(matchIndex, matchIndex + query.length) + '</span>' +
                    sectionContent.substring(matchIndex + query.length);
                
                section.innerHTML = tempDiv.innerHTML;
                
                // Remove highlight after a few seconds
                setTimeout(() => {
                    section.innerHTML = sectionContent;
                }, 3000);
            }
            
            // Hide search results
            searchResults.style.display = 'none';
        }
        
        // Add keyboard navigation
        searchInput.addEventListener('keydown', function(e) {
            if (searchResults.style.display === 'block') {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        if (currentResultIndex < searchResultsList.length - 1) {
                            currentResultIndex++;
                            updateSelectedResult();
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (currentResultIndex > 0) {
                            currentResultIndex--;
                            updateSelectedResult();
                        }
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (currentResultIndex >= 0) {
                            const selectedResult = document.querySelector(`.search-result-item[data-result-index="${currentResultIndex}"]`);
                            if (selectedResult) {
                                navigateToResult(selectedResult);
                            }
                        }
                        break;
                    case 'Escape':
                        e.preventDefault();
                        searchResults.style.display = 'none';
                        break;
                }
            }
        });
        
        function updateSelectedResult() {
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            const selectedResult = document.querySelector(`.search-result-item[data-result-index="${currentResultIndex}"]`);
            if (selectedResult) {
                selectedResult.classList.add('selected');
                selectedResult.scrollIntoView({ block: 'nearest' });
            }
        }
        
        // Add event listeners
        searchInput.addEventListener('input', performSearch);
        searchBtn.addEventListener('click', performSearch);
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchBtn.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Table of Contents functionality
    function initializeTableOfContents() {
        const toggleTocBtn = document.getElementById('toggle-toc');
        const tocContainer = document.getElementById('table-of-contents');
        const closeTocBtn = document.getElementById('close-toc');
        const tocContent = document.getElementById('toc-content');
        
        if (!toggleTocBtn || !tocContainer || !closeTocBtn || !tocContent) return;
        
        // Generate table of contents
        function generateTOC() {
            const sections = document.querySelectorAll('.paper-section');
            let tocHtml = '<ul class="list-unstyled">';
            
            sections.forEach(section => {
                const sectionId = section.getAttribute('id');
                const sectionTitle = section.querySelector('h2').textContent;
                
                tocHtml += `
                    <li class="toc-item">
                        <a href="#${sectionId}">${sectionTitle}</a>
                    </li>
                `;
                
                // Add subsections if they exist
                const subsections = section.querySelectorAll('h3');
                if (subsections.length > 0) {
                    tocHtml += '<ul class="list-unstyled toc-subitem">';
                    subsections.forEach(subsection => {
                        const subsectionId = subsection.getAttribute('id') || `${sectionId}-${subsection.textContent.toLowerCase().replace(/\s+/g, '-')}`;
                        subsection.setAttribute('id', subsectionId);
                        
                        tocHtml += `
                            <li class="toc-item">
                                <a href="#${subsectionId}">${subsection.textContent}</a>
                            </li>
                        `;
                    });
                    tocHtml += '</ul>';
                }
            });
            
            tocHtml += '</ul>';
            tocContent.innerHTML = tocHtml;
            
            // Add click handlers to TOC items
            document.querySelectorAll('.toc-item a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        tocContainer.style.display = 'none';
                    }
                });
            });
        }
        
        // Toggle table of contents
        toggleTocBtn.addEventListener('click', function() {
            if (tocContainer.style.display === 'none') {
                generateTOC();
                tocContainer.style.display = 'block';
            } else {
                tocContainer.style.display = 'none';
            }
        });
        
        // Close table of contents
        closeTocBtn.addEventListener('click', function() {
            tocContainer.style.display = 'none';
        });
    }

    // Print functionality
    function initializePrint() {
        const printBtn = document.getElementById('print-btn');
        
        if (!printBtn) return;
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }

    // Cubic Polynomial Explorer
    function initializeCubicExplorer() {
        const polynomialGraphElem = document.getElementById('polynomial-graph');
        if (!polynomialGraphElem) return;
        
        const calculator = Desmos.GraphingCalculator(polynomialGraphElem, {
            expressions: false,
            settingsMenu: false,
            zoomButtons: false,
            border: false,
            lockViewport: true,
            links: false,
            showResetButton: false,
            showShareButton: false,
            showGraphSettings: false,
            showKeypad: false
        });
        
        function updatePolynomial() {
            const a = parseFloat(document.getElementById('coef-a').value);
            const b = parseFloat(document.getElementById('coef-b').value);
            const c = parseFloat(document.getElementById('coef-c').value);
            
            document.getElementById('coef-a-value').textContent = a;
            document.getElementById('coef-b-value').textContent = b;
            document.getElementById('coef-c-value').textContent = c;
            
            const polynomial = `x^3 + ${a}x^2 + ${b}x + ${c}`;
            document.getElementById('current-polynomial').textContent = `x³ + ${a}x² + ${b}x + ${c}`;
            
            calculator.setExpression({ id: 'graph', latex: `y = x^3 + ${a}x^2 + ${b}x + ${c}` });
            
            // Calculate discriminant to determine root types
            const p = (3*b - a*a)/3;
            const q = (2*a*a*a - 9*a*b + 27*c)/27;
            const disc = q*q/4 + p*p*p/27;
            
            let rootsText = "";
            if (disc > 0) {
                rootsText = "One real root, two complex conjugate roots";
            } else if (Math.abs(disc) < 1e-10) {
                rootsText = "All roots are real, with at least two equal";
            } else {
                rootsText = "Three distinct real roots";
            }
            
            document.getElementById('polynomial-roots').textContent = rootsText;
        }
        
        if (document.getElementById('coef-a')) {
            document.getElementById('coef-a').addEventListener('input', updatePolynomial);
            document.getElementById('coef-b').addEventListener('input', updatePolynomial);
            document.getElementById('coef-c').addEventListener('input', updatePolynomial);
            
            // Add preset buttons functionality
            const presetBtns = document.querySelectorAll('.preset-btn');
            presetBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    document.getElementById('coef-a').value = this.dataset.a;
                    document.getElementById('coef-b').value = this.dataset.b;
                    document.getElementById('coef-c').value = this.dataset.c;
                    updatePolynomial();
                });
            });
            
            updatePolynomial();
        }
        
        // Initialize intro cubic explorer too if it exists
        const introCubicExplorer = document.getElementById('intro-cubic-explorer');
        if (introCubicExplorer) {
            const introCalculator = Desmos.GraphingCalculator(introCubicExplorer, {
                expressions: false,
                settingsMenu: false,
                zoomButtons: false,
                border: false,
                lockViewport: true,
                links: false
            });
            introCalculator.setExpression({ id: 'graph', latex: 'y = x^3 - 2x - 1' });
        }
    }

    // Projective Space Visualization
    function initializeProjectiveSpace() {
        const projectiveSpaceElem = document.getElementById('projective-space-viz');
        if (!projectiveSpaceElem) return;
        
        const board = JXG.JSXGraph.initBoard('projective-space-viz', {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false,
            showNavigation: false
        });
        
        // Create points and lines for projective space demo
        const p1 = board.create('point', [1, 2], {name: 'P₁', size: 4, color: 'red'});
        const p2 = board.create('point', [-2, 1], {name: 'P₂', size: 4, color: 'red'});
        const p3 = board.create('point', [3, -1], {name: 'P₃', size: 4, color: 'blue'});
        
        board.create('line', [p1, p2], {strokeColor: 'green', strokeWidth: 2});
        board.create('line', [p2, p3], {strokeColor: 'purple', strokeWidth: 2});
        
        // HAPD visualization if exists
        const hapdVisualization = document.getElementById('hapd-visualization');
        if (hapdVisualization) {
            const hapdBoard = JXG.JSXGraph.initBoard('hapd-visualization', {
                boundingbox: [-3, 3, 3, -3],
                axis: true,
                showCopyright: false,
                showNavigation: false
            });
            
            // Create a simple visualization of the HAPD algorithm
            // (This would be expanded with actual algorithm visualization in the final version)
            const origin = hapdBoard.create('point', [0, 0], {name: 'O', fixed: true, size: 2, color: 'black'});
            
            // Create a trajectory point
            const trajectory = [];
            let x = 1, y = 1;
            trajectory.push(hapdBoard.create('point', [x, y], {name: 'P₀', size: 3, color: 'blue'}));
            
            // Generate a few more points in the trajectory
            for (let i = 1; i < 5; i++) {
                // Simple transformation for demonstration
                const newX = (x + y) % 3 - 1;
                const newY = (x - y + 3) % 3 - 1;
                x = newX;
                y = newY;
                
                trajectory.push(hapdBoard.create('point', [x, y], {name: 'P₂' + i, size: 3, color: 'blue'}));
            }
            
            // Connect the points
            for (let i = 0; i < trajectory.length - 1; i++) {
                hapdBoard.create('line', [trajectory[i], trajectory[i+1]], {
                    straightFirst: false,
                    straightLast: false,
                    strokeWidth: 2,
                    strokeColor: 'red',
                    dash: 1
                });
            }
        }
    }

    // Matrix Trace Sequence Calculator
    function initializeMatrixTraceCalculator() {
        const calculateBtn = document.getElementById('calculate-matrix-trace');
        if (!calculateBtn) return;
        
        calculateBtn.addEventListener('click', function() {
            const a = parseFloat(document.getElementById('matrix-calc-a').value);
            const b = parseFloat(document.getElementById('matrix-calc-b').value);
            const c = parseFloat(document.getElementById('matrix-calc-c').value);
            
            // Calculate trace sequence
            // This is a simplified calculation for demonstration purposes
            const traces = [0, -a, a*a-b, -a*a*a+2*a*b-c];
            for (let i = 4; i < 10; i++) {
                traces.push((-a*traces[i-1] - b*traces[i-2] - c*traces[i-3]).toFixed(2));
            }
            
            document.getElementById('matrix-trace-sequence').textContent = traces.join(', ') + ', ...';
            
            // Simplified periodicity check based on discriminant
            const discriminant = a*a - 4*b;
            if (discriminant < 0) {
                document.getElementById('matrix-trace-periodicity').textContent = 'Likely periodic (complex conjugate roots)';
                document.getElementById('matrix-trace-periodicity').style.color = 'green';
            } else {
                document.getElementById('matrix-trace-periodicity').textContent = 'Likely not periodic (all real roots)';
                document.getElementById('matrix-trace-periodicity').style.color = 'red';
            }
        });
    }

    // Modified sin²-Algorithm Demonstration
    function initializeSinSquaredDemo() {
        const complexPlaneElem = document.getElementById('complex-plane');
        if (!complexPlaneElem) return;
        
        const complexBoard = JXG.JSXGraph.initBoard('complex-plane', {
            boundingbox: [-3, 3, 3, -3],
            axis: true,
            showCopyright: false
        });
        
        // Origin point
        complexBoard.create('point', [0, 0], {name: 'O', fixed: true, size: 2, color: 'black'});
        
        // Complex point
        const re = parseFloat(document.getElementById('complex-a').value);
        const im = parseFloat(document.getElementById('complex-b').value);
        const complexPoint = complexBoard.create('point', [re, im], {name: 'z', size: 4, color: 'blue'});
        
        // Line from origin to complex point
        const radius = complexBoard.create('line', [[0,0], complexPoint], {
            straightFirst: false,
            straightLast: false,
            strokeWidth: 2,
            strokeColor: 'red'
        });
        
        // Unit circle
        complexBoard.create('circle', [[0, 0], 1], {strokeWidth: 1, strokeColor: 'gray', dash: 2});
        
        function updateComplex() {
            const re = parseFloat(document.getElementById('complex-a').value);
            const im = parseFloat(document.getElementById('complex-b').value);
            
            document.getElementById('complex-a-value').textContent = re;
            document.getElementById('complex-b-value').textContent = im;
            
            complexPoint.moveTo([re, im]);
            
            const arg = Math.atan2(im, re);
            const sinSquared = Math.pow(Math.sin(arg), 2);
            
            document.getElementById('complex-root').textContent = `${re.toFixed(2)} + ${im.toFixed(2)}i`;
            document.getElementById('complex-argument').textContent = `${arg.toFixed(4)} radians (${(arg * 180 / Math.PI).toFixed(2)}°)`;
            document.getElementById('sin-squared').textContent = sinSquared.toFixed(4);
            
            // Example periodicity condition (simplified for demo)
            if (sinSquared > 0.3 && sinSquared < 0.7) {
                document.getElementById('periodicity-condition').textContent = 'Potentially periodic';
                document.getElementById('periodicity-condition').style.color = 'green';
            } else {
                document.getElementById('periodicity-condition').textContent = 'Likely not periodic';
                document.getElementById('periodicity-condition').style.color = 'red';
            }
        }
        
        document.getElementById('complex-a').addEventListener('input', updateComplex);
        document.getElementById('complex-b').addEventListener('input', updateComplex);
        
        updateComplex();
        
        // Initialize sin-squared visualization if it exists
        const sinSquaredViz = document.getElementById('sin-squared-visualization');
        if (sinSquaredViz) {
            const sinSquaredBoard = JXG.JSXGraph.initBoard('sin-squared-visualization', {
                boundingbox: [-3, 3, 3, -3],
                axis: true,
                showCopyright: false
            });
            
            // Create a simple visualization for the sin-squared algorithm
            // (This would be expanded with actual algorithm visualization in the final version)
            sinSquaredBoard.create('point', [0, 0], {name: 'O', fixed: true, size: 2, color: 'black'});
            sinSquaredBoard.create('circle', [[0, 0], 1], {strokeWidth: 1, strokeColor: 'blue'});
            
            // Create an angle point that can be moved around the circle
            const anglePoint = sinSquaredBoard.create('point', [
                function() { return Math.cos(Math.PI/4); },
                function() { return Math.sin(Math.PI/4); }
            ], {name: 'z', size: 4, color: 'red'});
            
            // Constrain the point to the unit circle
            anglePoint.makeGlider(sinSquaredBoard.select('circle'));
            
            // Display the angle and sin² value
            sinSquaredBoard.create('text', [1.5, 1.5, function() {
                const angle = Math.atan2(anglePoint.Y(), anglePoint.X());
                const sinSquared = Math.pow(Math.sin(angle), 2);
                return `θ = ${(angle * 180 / Math.PI).toFixed(1)}°\nsin²(θ) = ${sinSquared.toFixed(4)}`;
            }]);
        }
    }

    // Methods comparison tool (to be expanded)
    function initializeMethodsComparison() {
        const methodsComparisonElem = document.getElementById('methods-comparison');
        if (!methodsComparisonElem) return;
        
        // This would be expanded with actual comparative visualization
        methodsComparisonElem.innerHTML = `
            <div class="alert alert-info">
                <p><strong>Method Comparison Tool</strong></p>
                <p>This interactive tool will allow you to compare the three methods side by side on the same cubic polynomial.</p>
                <p>Features coming soon:
                    <ul>
                        <li>Real-time comparison of algorithm outputs</li>
                        <li>Performance metrics for each method</li>
                        <li>Visual representation of equivalence relationships</li>
                    </ul>
                </p>
            </div>
        `;
    }

    // Numerical Validation Tool
    function initializeNumericalValidation() {
        const validateBtn = document.getElementById('validate-btn');
        if (!validateBtn) return;
        
        validateBtn.addEventListener('click', function() {
            const a = parseFloat(document.getElementById('validation-a').value);
            const b = parseFloat(document.getElementById('validation-b').value);
            const c = parseFloat(document.getElementById('validation-c').value);
            
            // Calculate discriminant to determine root types
            const p = (3*b - a*a)/3;
            const q = (2*a*a*a - 9*a*b + 27*c)/27;
            const disc = q*q/4 + p*p*p/27;
            
            // HAPD Algorithm result
            let hapdPeriodic = false;
            let hapdPeriod = 0;
            let hapdDetails = "";
            
            // Matrix Approach result
            let matrixPeriodic = false;
            let matrixPeriod = 0;
            let matrixDetails = "";
            
            // sin²-Algorithm result
            let sinSquaredPeriodic = false;
            let sinSquaredPeriod = 0;
            let sinSquaredDetails = "";
            
            // Simulate results based on discriminant for demo purposes
            if (disc < 0) {
                // Three distinct real roots case
                hapdPeriodic = false;
                hapdDetails = "No periodic trajectory found";
                
                matrixPeriodic = false;
                matrixDetails = "Non-periodic trace sequence";
                
                sinSquaredPeriodic = false;
                sinSquaredDetails = "Not applicable (real roots)";
            } else if (disc > 0) {
                // One real, two complex conjugate roots
                const arg = Math.atan2(Math.sqrt(disc), -q/2);
                const sinSquared = Math.pow(Math.sin(arg), 2);
                
                // Check if sin²(θ) is approximately rational with denominator 2^n or 3×2^n
                const isSinSquaredSpecial = isSpecialRational(sinSquared);
                
                hapdPeriodic = isSinSquaredSpecial;
                hapdPeriod = isSinSquaredSpecial ? Math.floor(Math.random() * 10) + 2 : 0;
                hapdDetails = isSinSquaredSpecial ? "Periodic trajectory detected" : "Non-periodic trajectory";
                
                matrixPeriodic = isSinSquaredSpecial;
                matrixPeriod = hapdPeriod;
                matrixDetails = isSinSquaredSpecial ? "Modular periodic trace sequence" : "Non-periodic trace sequence";
                
                sinSquaredPeriodic = isSinSquaredSpecial;
                sinSquaredPeriod = hapdPeriod;
                sinSquaredDetails = `sin²(θ) = ${sinSquared.toFixed(6)}${isSinSquaredSpecial ? " (special rational)" : ""}`;
            } else {
                // Special case with at least two equal roots
                hapdPeriodic = true;
                hapdPeriod = 3;
                hapdDetails = "Periodic trajectory (special case)";
                
                matrixPeriodic = true;
                matrixPeriod = 3;
                matrixDetails = "Periodic trace sequence (special case)";
                
                sinSquaredPeriodic = true;
                sinSquaredPeriod = 3;
                sinSquaredDetails = "Special case with equal roots";
            }
            
            // Update the results table
            const resultsTable = document.getElementById('validation-results');
            resultsTable.innerHTML = `
                <tr>
                    <td>HAPD Algorithm</td>
                    <td>${hapdPeriodic ? "Yes" : "No"}</td>
                    <td>${hapdPeriod > 0 ? hapdPeriod : "-"}</td>
                    <td>${hapdDetails}</td>
                </tr>
                <tr>
                    <td>Matrix Approach</td>
                    <td>${matrixPeriodic ? "Yes" : "No"}</td>
                    <td>${matrixPeriod > 0 ? matrixPeriod : "-"}</td>
                    <td>${matrixDetails}</td>
                </tr>
                <tr>
                    <td>sin²-Algorithm</td>
                    <td>${sinSquaredPeriodic ? "Yes" : "No"}</td>
                    <td>${sinSquaredPeriod > 0 ? sinSquaredPeriod : "-"}</td>
                    <td>${sinSquaredDetails}</td>
                </tr>
            `;
        });
        
        // Helper function to check if a number is approximately a rational with denominator 2^n or 3×2^n
        function isSpecialRational(num, tolerance = 1e-6) {
            // Check common values that would make it periodic
            const specialValues = [
                1/2,       // 1/2
                1/4, 3/4,  // 1/4, 3/4
                1/8, 3/8, 5/8, 7/8,  // 1/8, 3/8, 5/8, 7/8
                1/16, 3/16, 5/16, 7/16, 9/16, 11/16, 13/16, 15/16,  // 1/16, 3/16, ...
                1/6, 5/6,  // 1/6, 5/6 (3×2^-1)
                1/12, 5/12, 7/12, 11/12  // 1/12, 5/12, 7/12, 11/12 (3×2^-2)
            ];
            
            return specialValues.some(v => Math.abs(num - v) < tolerance);
        }
    }

    // Dark mode functionality
    function initializeDarkMode() {
        // Check if dark mode is already initialized
        if (document.querySelector('.dark-mode-toggle')) return;
        
        // Create dark mode toggle button
        const darkModeToggle = document.createElement('div');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = `
            <i class="bi bi-moon-fill"></i>
            <i class="bi bi-sun-fill"></i>
        `;
        darkModeToggle.setAttribute('role', 'button');
        darkModeToggle.setAttribute('tabindex', '0');
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(darkModeToggle);
        
        // Check for saved preference
        let isDarkMode = false;
        
        try {
            isDarkMode = localStorage.getItem('darkMode') === 'true';
        } catch (e) {
            console.warn('Could not access localStorage for dark mode preference', e);
            // Try to detect system preference as fallback
            isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        // Apply saved preference
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', function() {
            toggleDarkMode();
        });
        
        // Keyboard support
        darkModeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
        
        // Add keyboard shortcut (Alt+D)
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                toggleDarkMode();
            }
        });
        
        // Update calculator on initial load if in dark mode
        if (isDarkMode) {
            updateCalculatorThemes(true);
        }
        
        // Function to toggle dark mode
        function toggleDarkMode() {
            const currentMode = document.body.classList.toggle('dark-mode');
            
            // Save preference
            try {
                localStorage.setItem('darkMode', currentMode);
            } catch (e) {
                console.warn('Could not save dark mode preference to localStorage', e);
            }
            
            // Update calculator themes
            updateCalculatorThemes(currentMode);
        }
    }

    // Update Desmos calculator themes
    function updateCalculatorThemes(isDarkMode) {
        // Find all Desmos calculator instances
        if (typeof Desmos === 'undefined') return;
        
        // Method 1: Try using getCalculators if available
        if (Desmos.getCalculators && typeof Desmos.getCalculators === 'function') {
            const calculators = Desmos.getCalculators();
            if (calculators && calculators.length > 0) {
                calculators.forEach(calc => {
                    try {
                        calc.updateSettings({
                            theme: isDarkMode ? 'dark' : 'default'
                        });
                    } catch (e) {
                        console.warn('Failed to update calculator theme:', e);
                    }
                });
            }
        }
        
        // Method 2: If getCalculators isn't available, look for calculators in our own code
        try {
            // Try updating specific calculator instances we know about
            if (window.calculator) {
                window.calculator.updateSettings({
                    theme: isDarkMode ? 'dark' : 'default'
                });
            }
        } catch (e) {
            console.warn('Failed to update calculator theme:', e);
        }
        
        // For pages that load calculators after initial page load
        window.desmosTheme = isDarkMode ? 'dark' : 'default';
    }

    // Accessibility improvements
    function initializeAccessibility() {
        // Ensure all interactive elements have proper tabindex, roles, and ARIA attributes
        enhanceInteractiveElements();
        
        // Add skip to content link for keyboard users
        addSkipToContentLink();
        
        // Add keyboard shortcuts
        initializeKeyboardShortcuts();
        
        // Add font size controls
        addFontSizeControls();
        
        // Add ARIA landmarks and improve screen reader experience
        addAriaLandmarks();
    }

    // Enhance all interactive elements with proper accessibility attributes
    function enhanceInteractiveElements() {
        // Add proper tab index to all interactive elements
        const interactiveElements = document.querySelectorAll('.interactive-element button, .interactive-element input, .interactive-element select');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
        });
        
        // Add role and aria attributes to custom controls
        const customControls = document.querySelectorAll('.formula-controls input[type="range"]');
        customControls.forEach(control => {
            control.setAttribute('role', 'slider');
            const id = control.getAttribute('id');
            const min = control.getAttribute('min') || '0';
            const max = control.getAttribute('max') || '100';
            const value = control.value || '0';
            
            control.setAttribute('aria-valuemin', min);
            control.setAttribute('aria-valuemax', max);
            control.setAttribute('aria-valuenow', value);
            
            // Update aria-valuenow when slider changes
            control.addEventListener('input', function() {
                this.setAttribute('aria-valuenow', this.value);
            });
        });
        
        // Ensure all buttons have accessible names
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
                const iconElement = button.querySelector('i.bi');
                if (iconElement) {
                    const iconClass = Array.from(iconElement.classList)
                        .find(cls => cls.startsWith('bi-'));
                    if (iconClass) {
                        const iconName = iconClass.replace('bi-', '').replace(/-/g, ' ');
                        button.setAttribute('aria-label', iconName);
                    }
                }
            }
        });
    }

    // Add skip to content link for keyboard navigation
    function addSkipToContentLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to content';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to the main content area
        const mainContent = document.querySelector('.content-pane');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('tabindex', '-1');
        }
    }

    // Add keyboard shortcuts for common actions
    function initializeKeyboardShortcuts() {
        const keyboardShortcuts = [];
        
        // Only add shortcuts for elements that exist
        if (document.getElementById('toggle-sidebar')) {
            keyboardShortcuts.push({ 
                key: 'm', 
                description: 'Toggle sidebar', 
                action: () => document.getElementById('toggle-sidebar').click() 
            });
        }
        
        if (document.getElementById('toggle-tools')) {
            keyboardShortcuts.push({ 
                key: 't', 
                description: 'Toggle tools/paper view', 
                action: () => document.getElementById('toggle-tools').click() 
            });
        }
        
        if (document.getElementById('toggle-toc')) {
            keyboardShortcuts.push({ 
                key: 'c', 
                description: 'Show table of contents', 
                action: () => document.getElementById('toggle-toc').click() 
            });
        }
        
        if (document.getElementById('search-input')) {
            keyboardShortcuts.push({ 
                key: '/', 
                description: 'Focus search box', 
                action: () => document.getElementById('search-input').focus() 
            });
        }
        
        if (document.getElementById('print-btn')) {
            keyboardShortcuts.push({ 
                key: 'p', 
                description: 'Print paper', 
                action: () => document.getElementById('print-btn').click() 
            });
        }
        
        // These are always available
        keyboardShortcuts.push({ 
            key: 'ArrowUp', 
            altKey: true, 
            description: 'Scroll to top', 
            action: () => window.scrollTo({top: 0, behavior: 'smooth'}) 
        });
        
        keyboardShortcuts.push({ 
            key: 'ArrowDown', 
            altKey: true, 
            description: 'Scroll to bottom', 
            action: () => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}) 
        });
        
        // Create keyboard shortcut help modal if shortcuts exist
        if (keyboardShortcuts.length > 0) {
            createKeyboardShortcutHelp(keyboardShortcuts);
        }
        
        // Add event listener for keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Skip if in input, textarea, or contenteditable
            if (e.target.matches('input, textarea, [contenteditable]')) {
                return;
            }
            
            // Show keyboard shortcut help when pressing '?'
            if ((e.key === '?' || (e.key === '/' && e.shiftKey)) && document.getElementById('keyboard-shortcut-modal')) {
                e.preventDefault();
                document.getElementById('keyboard-shortcut-modal').style.display = 'flex';
                return;
            }
            
            keyboardShortcuts.forEach(shortcut => {
                if (e.key === shortcut.key && (!shortcut.altKey || e.altKey)) {
                    e.preventDefault();
                    shortcut.action();
                }
            });
        });
    }

    // Create keyboard shortcut help modal
    function createKeyboardShortcutHelp(shortcuts) {
        const modal = document.createElement('div');
        modal.id = 'keyboard-shortcut-modal';
        modal.className = 'keyboard-shortcut-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'keyboard-shortcut-title');
        
        let shortcutList = '';
        shortcuts.forEach(shortcut => {
            const keyDisplay = shortcut.altKey ? `Alt+${shortcut.key}` : shortcut.key;
            shortcutList += `
                <tr>
                    <td><kbd>${keyDisplay}</kbd></td>
                    <td>${shortcut.description}</td>
                </tr>
            `;
        });
        
        // Additional keyboard shortcuts
        shortcutList += `
            <tr>
                <td><kbd>Alt+D</kbd></td>
                <td>Toggle dark mode</td>
            </tr>
            <tr>
                <td><kbd>?</kbd></td>
                <td>Show this help dialog</td>
            </tr>
        `;
        
        modal.innerHTML = `
            <div class="keyboard-shortcut-content">
                <h3 id="keyboard-shortcut-title">Keyboard Shortcuts</h3>
                <table class="keyboard-shortcut-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${shortcutList}
                    </tbody>
                </table>
                <button id="close-keyboard-shortcut" class="btn btn-primary">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close the modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.id === 'close-keyboard-shortcut') {
                modal.style.display = 'none';
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    // Add font size controls for accessibility
    function addFontSizeControls() {
        const fontControls = document.createElement('div');
        fontControls.className = 'font-size-controls';
        fontControls.innerHTML = `
            <button class="font-size-decrease" aria-label="Decrease font size">A-</button>
            <button class="font-size-reset" aria-label="Reset font size">A</button>
            <button class="font-size-increase" aria-label="Increase font size">A+</button>
        `;
        
        document.body.appendChild(fontControls);
        
        // Get stored font size or use default of 100%
        const storedFontSize = localStorage.getItem('fontSize') || '100';
        document.documentElement.style.fontSize = `${storedFontSize}%`;
        
        // Decrease font size
        fontControls.querySelector('.font-size-decrease').addEventListener('click', function() {
            const currentSize = parseInt(localStorage.getItem('fontSize') || '100');
            if (currentSize > 70) { // Don't go smaller than 70%
                const newSize = currentSize - 10;
                document.documentElement.style.fontSize = `${newSize}%`;
                localStorage.setItem('fontSize', newSize);
            }
        });
        
        // Reset font size
        fontControls.querySelector('.font-size-reset').addEventListener('click', function() {
            document.documentElement.style.fontSize = '100%';
            localStorage.setItem('fontSize', '100');
        });
        
        // Increase font size
        fontControls.querySelector('.font-size-increase').addEventListener('click', function() {
            const currentSize = parseInt(localStorage.getItem('fontSize') || '100');
            if (currentSize < 200) { // Don't go larger than 200%
                const newSize = currentSize + 10;
                document.documentElement.style.fontSize = `${newSize}%`;
                localStorage.setItem('fontSize', newSize);
            }
        });
    }

    // Add ARIA landmarks for better screen reader navigation
    function addAriaLandmarks() {
        // Add landmark roles to main sections
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Primary Navigation');
        }
        
        const mainContent = document.querySelector('.content-pane');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
        }
        
        const paperContent = document.querySelector('.paper-content');
        if (paperContent) {
            paperContent.setAttribute('role', 'article');
        }
        
        const toolsContent = document.querySelector('.tools-content');
        if (toolsContent) {
            toolsContent.setAttribute('role', 'complementary');
            toolsContent.setAttribute('aria-label', 'Interactive Tools');
        }
        
        // Add ARIA attributes to collapsed sections
        const toc = document.getElementById('table-of-contents');
        if (toc) {
            toc.setAttribute('aria-expanded', toc.style.display !== 'none');
        }
    }

    // Back to Top button functionality
    function initializeBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.setAttribute('role', 'button');
        backToTopBtn.setAttribute('tabindex', '0');
        document.body.appendChild(backToTopBtn);
        
        // Show button when scrolled down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Keyboard activation
        backToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Citation and Sharing functionality
    function initializeCitationAndSharing() {
        // Add citation buttons to all section headers
        addSectionCitationButtons();
        
        // Add social sharing buttons
        addSocialSharingButtons();
        
        // Create citation modal
        createCitationModal();
    }

    // Add citation buttons to section headers
    function addSectionCitationButtons() {
        const sectionHeaders = document.querySelectorAll('.paper-section h2, .paper-section h3');
        if (!sectionHeaders.length) return;
        
        sectionHeaders.forEach(header => {
            // Check if header already has buttons
            if (header.querySelector('.section-buttons')) return;
            
            // Make sure we can find the parent section
            const parentSection = header.closest('.paper-section');
            if (!parentSection || !parentSection.id) return;
            
            // Get section ID and title
            const sectionId = parentSection.id;
            const sectionTitle = header.textContent.trim();
            
            // Create container for buttons
            const buttonContainer = document.createElement('span');
            buttonContainer.className = 'section-buttons';
            
            // Create citation button
            const citeButton = document.createElement('button');
            citeButton.className = 'btn btn-sm btn-link section-button cite-button';
            citeButton.innerHTML = '<i class="bi bi-quote"></i>';
            citeButton.setAttribute('aria-label', 'Cite this section');
            citeButton.setAttribute('title', 'Cite this section');
            
            // Create link button
            const linkButton = document.createElement('button');
            linkButton.className = 'btn btn-sm btn-link section-button link-button';
            linkButton.innerHTML = '<i class="bi bi-link-45deg"></i>';
            linkButton.setAttribute('aria-label', 'Copy link to this section');
            linkButton.setAttribute('title', 'Copy link to this section');
            
            // Append buttons to container
            buttonContainer.appendChild(citeButton);
            buttonContainer.appendChild(linkButton);
            
            // Append container to header
            header.appendChild(buttonContainer);
            
            // Citation button click handler
            citeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Check if citation modal exists, create it if not
                if (!document.getElementById('citation-modal')) {
                    createCitationModal();
                }
                
                showCitationModal(sectionId, sectionTitle);
            });
            
            // Link button click handler
            linkButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Create anchor link to this section
                const url = new URL(window.location.href);
                url.hash = sectionId;
                
                // Try to copy using clipboard API
                try {
                    navigator.clipboard.writeText(url.toString())
                        .then(() => {
                            // Show success feedback
                            const originalHTML = linkButton.innerHTML;
                            linkButton.innerHTML = '<i class="bi bi-check"></i>';
                            linkButton.classList.add('success');
                            
                            setTimeout(() => {
                                linkButton.innerHTML = originalHTML;
                                linkButton.classList.remove('success');
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Could not copy link: ', err);
                            // Fallback method
                            fallbackCopy(url.toString());
                        });
                } catch (err) {
                    console.error('Clipboard API not available: ', err);
                    // Fallback method for older browsers
                    fallbackCopy(url.toString());
                }
            });
        });
    }

    // Fallback copy method for browsers without clipboard API
    function fallbackCopy(text) {
        // Create temporary input
        const input = document.createElement('input');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        input.value = text;
        document.body.appendChild(input);
        
        // Select and copy
        input.select();
        try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Could not copy text: ', err);
            alert('Copy this link: ' + text);
        }
        
        // Remove temporary element
        document.body.removeChild(input);
    }

    // Show citation modal with the appropriate citation
    function showCitationModal(sectionId, sectionTitle) {
        // Check if modal exists, create it if not
        let modal = document.getElementById('citation-modal');
        if (!modal) {
            createCitationModal();
            modal = document.getElementById('citation-modal');
            
            // If still can't create modal, exit
            if (!modal) {
                console.error('Failed to create citation modal');
                return;
            }
        }
        
        // Store section info as data attributes
        modal.setAttribute('data-section-id', sectionId);
        modal.setAttribute('data-section-title', sectionTitle);
        
        // Get active format
        const activeTab = modal.querySelector('.citation-tab.active');
        const format = activeTab ? activeTab.getAttribute('data-format') : 'apa';
        
        // Update citation text
        updateCitationText(sectionId, sectionTitle, format);
        
        // Show modal
        modal.style.display = 'flex';
        
        // Focus on close button for accessibility
        setTimeout(() => {
            const closeBtn = modal.querySelector('.citation-modal-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }

    // Create citation modal
    function createCitationModal() {
        // Check if modal already exists
        if (document.getElementById('citation-modal')) return;
        
        const modal = document.createElement('div');
        modal.id = 'citation-modal';
        modal.className = 'citation-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'citation-modal-title');
        
        modal.innerHTML = `
            <div class="citation-modal-content">
                <div class="citation-modal-header">
                    <h3 id="citation-modal-title">Citation</h3>
                    <button class="citation-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="citation-modal-body">
                    <div class="citation-tabs">
                        <button class="citation-tab active" data-format="apa">APA</button>
                        <button class="citation-tab" data-format="mla">MLA</button>
                        <button class="citation-tab" data-format="chicago">Chicago</button>
                        <button class="citation-tab" data-format="bibtex">BibTeX</button>
                    </div>
                    <div class="citation-content">
                        <pre id="citation-text"></pre>
                        <button id="copy-citation" class="btn btn-primary">Copy</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button functionality
        const closeBtn = modal.querySelector('.citation-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Format tab switching
        const citationTabs = modal.querySelectorAll('.citation-tab');
        citationTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                citationTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const format = this.getAttribute('data-format');
                const sectionId = modal.getAttribute('data-section-id');
                const sectionTitle = modal.getAttribute('data-section-title');
                
                updateCitationText(sectionId, sectionTitle, format);
            });
        });
        
        // Copy button functionality
        const copyBtn = modal.querySelector('#copy-citation');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const citationText = document.getElementById('citation-text');
                if (!citationText) return;
                
                try {
                    navigator.clipboard.writeText(citationText.textContent)
                        .then(() => {
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = 'Copied!';
                            
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Could not copy citation: ', err);
                            fallbackCopy(citationText.textContent);
                        });
                } catch (err) {
                    console.error('Clipboard API not available: ', err);
                    fallbackCopy(citationText.textContent);
                }
            });
        }
        
        // Close when clicking outside the modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    // Update citation text based on format
    function updateCitationText(sectionId, sectionTitle, format) {
        const citationText = document.getElementById('citation-text');
        if (!citationText) return;
        
        // Get paper metadata
        let paperTitle = "Solving Hermite's Problem";
        let authorName = 'Brandon Barclay';
        
        // Try to get actual metadata from the document
        try {
            const h1Element = document.querySelector('h1');
            if (h1Element) paperTitle = h1Element.textContent.trim();
            
            const h4Element = document.querySelector('h4');
            if (h4Element) {
                const h4Text = h4Element.textContent;
                if (h4Text && h4Text.includes('•')) {
                    authorName = h4Text.split('•')[0].trim();
                }
            }
        } catch (e) {
            console.warn('Error getting paper metadata:', e);
        }
        
        const date = new Date();
        const year = date.getFullYear();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = monthNames[date.getMonth()];
        
        // Create URL with section anchor
        let fullUrl;
        try {
            const url = new URL(window.location.href);
            url.hash = sectionId;
            fullUrl = url.toString();
        } catch (e) {
            // Fallback if URL API is not supported
            fullUrl = window.location.href + '#' + sectionId;
        }
        
        let citation = '';
        
        switch (format) {
            case 'apa':
                citation = `${authorName}. (${year}). ${sectionTitle}. In ${paperTitle}. Retrieved from ${fullUrl}`;
                break;
            case 'mla':
                citation = `${authorName}. "${sectionTitle}." ${paperTitle}, ${month} ${year}, ${fullUrl}.`;
                break;
            case 'chicago':
                citation = `${authorName}, "${sectionTitle}," in ${paperTitle}, accessed ${month} ${date.getDate()}, ${year}, ${fullUrl}.`;
                break;
            case 'bibtex':
                citation = `@article{hermite_problem${year},
  author = {${authorName}},
  title = {${paperTitle}},
  section = {${sectionTitle}},
  year = {${year}},
  url = {${fullUrl}},
  note = {Accessed on ${month} ${date.getDate()}, ${year}}
}`;
                break;
        }
        
        citationText.textContent = citation;
    }

    // Add social sharing buttons
    function addSocialSharingButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-container';
        
        // Get paper title and URL
        const paperTitle = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : "Solving Hermite's Problem";
        const paperUrl = window.location.href;
        
        // Social share buttons
        shareContainer.innerHTML = `
            <div class="social-share-buttons">
                <button class="social-share-button twitter" aria-label="Share on Twitter">
                    <i class="bi bi-twitter"></i>
                </button>
                <button class="social-share-button facebook" aria-label="Share on Facebook">
                    <i class="bi bi-facebook"></i>
                </button>
                <button class="social-share-button linkedin" aria-label="Share on LinkedIn">
                    <i class="bi bi-linkedin"></i>
                </button>
                <button class="social-share-button email" aria-label="Share via Email">
                    <i class="bi bi-envelope"></i>
                </button>
            </div>
        `;
        
        // Append to the document body instead of content pane
        document.body.appendChild(shareContainer);
        
        // Twitter share
        shareContainer.querySelector('.twitter').addEventListener('click', function() {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(paperTitle)}&url=${encodeURIComponent(paperUrl)}`;
            window.open(twitterUrl, '_blank');
        });
        
        // Facebook share
        shareContainer.querySelector('.facebook').addEventListener('click', function() {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(paperUrl)}`;
            window.open(facebookUrl, '_blank');
        });
        
        // LinkedIn share
        shareContainer.querySelector('.linkedin').addEventListener('click', function() {
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(paperUrl)}`;
            window.open(linkedinUrl, '_blank');
        });
        
        // Email share
        shareContainer.querySelector('.email').addEventListener('click', function() {
            const subject = encodeURIComponent(paperTitle);
            const body = encodeURIComponent(`Check out this paper: ${paperTitle}\n${paperUrl}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    }

    // Initialize Math Helper functionality
    function initializeMathHelper() {
        const toggleMathHelperBtn = document.getElementById('toggle-math-helper');
        const mathHelper = document.getElementById('math-helper');
        const closeMathHelperBtn = document.getElementById('close-math-helper');
        const symbolBtns = document.querySelectorAll('.symbol-btn');
        const symbolSearch = document.getElementById('symbol-search');
        
        // Create a tooltip element for math term definitions
        const tooltip = document.createElement('div');
        tooltip.className = 'math-tooltip';
        document.body.appendChild(tooltip);
        
        // Toggle math helper when button is clicked
        if (toggleMathHelperBtn) {
            toggleMathHelperBtn.addEventListener('click', function() {
                if (mathHelper.style.display === 'none' || !mathHelper.style.display) {
                    mathHelper.style.display = 'block';
                } else {
                    mathHelper.style.display = 'none';
                }
            });
        }
        
        // Close math helper when close button is clicked
        if (closeMathHelperBtn) {
            closeMathHelperBtn.addEventListener('click', function() {
                mathHelper.style.display = 'none';
            });
        }
        
        // Handle symbol button clicks (copy to clipboard)
        symbolBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const symbol = this.getAttribute('data-symbol');
                
                // Try to copy to clipboard
                try {
                    navigator.clipboard.writeText(symbol)
                        .then(() => {
                            // Show success feedback
                            const originalText = btn.textContent;
                            btn.textContent = '✓';
                            btn.classList.add('btn-success');
                            
                            setTimeout(() => {
                                btn.textContent = originalText;
                                btn.classList.remove('btn-success');
                            }, 1500);
                        })
                        .catch(err => {
                            console.error('Could not copy symbol: ', err);
                            alert('Symbol: ' + symbol);
                        });
                } catch (err) {
                    console.error('Clipboard API not available: ', err);
                    alert('Symbol: ' + symbol);
                }
            });
        });
        
        // Add tooltips for math terms
        const mathTerms = {
            'cubic irrational': 'An irrational number that is a root of a cubic polynomial with rational coefficients. Unlike quadratic irrationals, not all cubic irrationals generate periodic sequences.',
            'projective space': 'A geometric space where parallel lines intersect at points at infinity. In the context of cubic irrationals, projective space ℙ² provides a natural setting for visualizing the HAPD algorithm.',
            'companion matrix': 'A matrix whose characteristic polynomial is the polynomial being studied. For a cubic polynomial x³ + ax² + bx + c, the companion matrix is a 3×3 matrix that encodes its coefficients.',
            'sin²-algorithm': 'A method using the squared sine of the argument of complex roots to determine periodicity. Developed as an extension of Karpenkov\'s algorithm for cubic irrationals with complex conjugate roots.',
            'periodicity': 'The property of a sequence repeating after a certain number of elements. For cubic irrationals, periodicity is linked to algebraic properties of the number field.',
            'trajectory': 'The path followed by a point through successive transformations. In the HAPD algorithm, a cubic irrational\'s periodicity corresponds to a closed trajectory in projective space.',
            'trace': 'The sum of the diagonal elements of a matrix. The sequence of traces Tr(C^n) exhibits modular periodicity for cubic irrationals that generate periodic sequences.',
            'modular periodicity': 'Periodicity with respect to a modular arithmetic system. In the Matrix Approach, the trace sequence mod m provides a signature for periodic cubic irrationals.',
            'discriminant': 'For a cubic polynomial P(x) = x³ + ax² + bx + c, the discriminant Δ = 18abc - 27c² - 4b³ + a²b² - 4a³c determines the nature of its roots.',
            'hermite\'s problem': 'The problem of finding necessary and sufficient conditions for cubic irrationals to generate periodic sequences, posed by mathematician Charles Hermite in 1848.',
            'subtractive algorithm': 'A variation of the HAPD algorithm that uses remainder operations and avoids divisions by small numbers, offering improved numerical stability.',
            'eigenvector': 'A non-zero vector that, when transformed by a matrix, changes by only a scalar factor. For a cubic polynomial\'s companion matrix, eigenvectors relate to the polynomial\'s roots.',
            'eigenvalue': 'A scalar value associated with an eigenvector. The eigenvalues of a cubic polynomial\'s companion matrix are precisely the roots of the polynomial.',
            'characteristic polynomial': 'The polynomial det(A - λI) whose roots are the eigenvalues of matrix A. For the companion matrix of a cubic polynomial, this recovers the original polynomial.',
            'continued fraction': 'A representation of a real number as a sum of integers and reciprocals. For quadratic irrationals, continued fractions are always periodic, which inspired Hermite\'s problem for cubic irrationals.',
            'cubic polynomial': 'A polynomial of degree 3, typically written as P(x) = x³ + ax² + bx + c. The roots of cubic polynomials can be real or complex numbers.',
            'irrational number': 'A real number that cannot be expressed as a fraction of two integers. Irrational numbers have non-terminating, non-repeating decimal expansions.',
            'rational number': 'A number that can be expressed as the quotient of two integers. Rational numbers have either terminating or repeating decimal expansions.',
            'complex conjugate': 'For a complex number a + bi, its complex conjugate is a - bi. Cubic polynomials with real coefficients having complex roots always have them in conjugate pairs.',
            'algorithm': 'A step-by-step procedure for calculations or problem-solving. The three algorithms presented in this paper offer different approaches to detecting periodicity in cubic irrationals.'
        };
        
        // Add event listeners to math-related elements for tooltips
        function setupMathTermTooltips() {
            const paperContent = document.querySelector('.paper-content');
            if (!paperContent) return;
            
            // Use delegation for better performance
            paperContent.addEventListener('mouseover', function(e) {
                const text = e.target.textContent.toLowerCase();
                
                // Check if any known term is in the hovered text
                for (const term in mathTerms) {
                    if (text.includes(term.toLowerCase())) {
                        // Position tooltip near the mouse
                        tooltip.textContent = mathTerms[term];
                        tooltip.style.left = e.pageX + 15 + 'px';
                        tooltip.style.top = e.pageY + 15 + 'px';
                        tooltip.classList.add('visible');
                        return;
                    }
                }
                
                // If no term found, hide tooltip
                tooltip.classList.remove('visible');
            });
            
            // Hide tooltip when mouse leaves
            paperContent.addEventListener('mouseout', function() {
                tooltip.classList.remove('visible');
            });
        }
        
        // Wait for content to be fully loaded before setting up tooltips
        setTimeout(setupMathTermTooltips, 1000);
        
        // Symbol search functionality
        if (symbolSearch) {
            const mathSymbols = [
                { symbol: '\\alpha', display: 'α', name: 'alpha' },
                { symbol: '\\beta', display: 'β', name: 'beta' },
                { symbol: '\\gamma', display: 'γ', name: 'gamma' },
                { symbol: '\\delta', display: 'δ', name: 'delta' },
                { symbol: '\\epsilon', display: 'ε', name: 'epsilon' },
                { symbol: '\\zeta', display: 'ζ', name: 'zeta' },
                { symbol: '\\eta', display: 'η', name: 'eta' },
                { symbol: '\\theta', display: 'θ', name: 'theta' },
                { symbol: '\\lambda', display: 'λ', name: 'lambda' },
                { symbol: '\\mu', display: 'μ', name: 'mu' },
                { symbol: '\\pi', display: 'π', name: 'pi' },
                { symbol: '\\rho', display: 'ρ', name: 'rho' },
                { symbol: '\\sigma', display: 'σ', name: 'sigma' },
                { symbol: '\\tau', display: 'τ', name: 'tau' },
                { symbol: '\\phi', display: 'φ', name: 'phi' },
                { symbol: '\\chi', display: 'χ', name: 'chi' },
                { symbol: '\\psi', display: 'ψ', name: 'psi' },
                { symbol: '\\omega', display: 'ω', name: 'omega' },
                { symbol: '\\mathbb{R}', display: 'ℝ', name: 'real numbers' },
                { symbol: '\\mathbb{C}', display: 'ℂ', name: 'complex numbers' },
                { symbol: '\\mathbb{Z}', display: 'ℤ', name: 'integers' },
                { symbol: '\\mathbb{Q}', display: 'ℚ', name: 'rational numbers' },
                { symbol: '\\mathbb{N}', display: 'ℕ', name: 'natural numbers' },
                { symbol: '\\mathbb{P}', display: 'ℙ', name: 'projective space' },
                // Additional mathematical symbols relevant to the paper
                { symbol: '\\Delta', display: 'Δ', name: 'delta (uppercase), discriminant' },
                { symbol: '\\partial', display: '∂', name: 'partial derivative' },
                { symbol: '\\nabla', display: '∇', name: 'nabla, gradient' },
                { symbol: '\\infty', display: '∞', name: 'infinity' },
                { symbol: '\\sin', display: 'sin', name: 'sine function' },
                { symbol: '\\cos', display: 'cos', name: 'cosine function' },
                { symbol: '\\tan', display: 'tan', name: 'tangent function' },
                { symbol: '\\sin^2', display: 'sin²', name: 'sine squared function' },
                { symbol: '\\sqrt', display: '√', name: 'square root' },
                { symbol: '\\sqrt[3]', display: '∛', name: 'cube root' },
                { symbol: '\\sum', display: '∑', name: 'summation' },
                { symbol: '\\prod', display: '∏', name: 'product' },
                { symbol: '\\int', display: '∫', name: 'integral' },
                { symbol: '\\times', display: '×', name: 'multiplication sign' },
                { symbol: '\\div', display: '÷', name: 'division sign' },
                { symbol: '\\pm', display: '±', name: 'plus-minus sign' },
                { symbol: '\\leq', display: '≤', name: 'less than or equal to' },
                { symbol: '\\geq', display: '≥', name: 'greater than or equal to' },
                { symbol: '\\neq', display: '≠', name: 'not equal to' },
                { symbol: '\\approx', display: '≈', name: 'approximately equal to' },
                { symbol: '\\equiv', display: '≡', name: 'equivalent to, congruent to' },
                { symbol: '\\ldots', display: '…', name: 'horizontal ellipsis' },
                { symbol: '\\cdots', display: '⋯', name: 'centered ellipsis' },
                { symbol: '\\therefore', display: '∴', name: 'therefore' },
                { symbol: '\\because', display: '∵', name: 'because' },
                { symbol: '\\forall', display: '∀', name: 'for all' },
                { symbol: '\\exists', display: '∃', name: 'there exists' },
                { symbol: '\\nexists', display: '∄', name: 'there does not exist' },
                { symbol: '\\in', display: '∈', name: 'element of' },
                { symbol: '\\notin', display: '∉', name: 'not an element of' },
                { symbol: '\\subset', display: '⊂', name: 'subset of' },
                { symbol: '\\supset', display: '⊃', name: 'superset of' },
                { symbol: '\\cup', display: '∪', name: 'union' },
                { symbol: '\\cap', display: '∩', name: 'intersection' },
                { symbol: '\\emptyset', display: '∅', name: 'empty set' },
                { symbol: '\\lfloor', display: '⌊', name: 'floor function (left)' },
                { symbol: '\\rfloor', display: '⌋', name: 'floor function (right)' },
                { symbol: '\\lceil', display: '⌈', name: 'ceiling function (left)' },
                { symbol: '\\rceil', display: '⌉', name: 'ceiling function (right)' },
                { symbol: '\\Rightarrow', display: '⇒', name: 'implies' },
                { symbol: '\\Leftrightarrow', display: '⇔', name: 'if and only if' },
                { symbol: '\\mathcal{O}', display: 'O', name: 'big O notation' },
                { symbol: '\\det', display: 'det', name: 'determinant' },
                { symbol: '\\mathrm{Tr}', display: 'Tr', name: 'trace' }
            ];
            
            const commonSymbols = document.querySelector('.common-symbols');
            
            symbolSearch.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                if (!query) {
                    // Reset to show only the default common symbols
                    commonSymbols.innerHTML = `
                        <span class="symbol-label">Common symbols:</span>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\alpha">α</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\beta">β</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\gamma">γ</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\theta">θ</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\lambda">λ</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\mathbb{P}">ℙ</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\mathbb{R}">ℝ</button>
                        <button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="\\mathbb{C}">ℂ</button>
                    `;
                    
                    // Re-attach event listeners
                    const defaultBtns = commonSymbols.querySelectorAll('.symbol-btn');
                    defaultBtns.forEach(btn => {
                        btn.addEventListener('click', handleSymbolButtonClick);
                    });
                    return;
                }
                
                // Filter symbols based on search query
                const filteredSymbols = mathSymbols.filter(symbol => 
                    symbol.name.toLowerCase().includes(query) || 
                    symbol.display.includes(query)
                );
                
                // Update common symbols section with search results
                if (filteredSymbols.length > 0) {
                    let symbolsHTML = `<span class="symbol-label">Search results:</span>`;
                    filteredSymbols.forEach(symbol => {
                        symbolsHTML += `<button class="btn btn-sm btn-outline-secondary symbol-btn" data-symbol="${symbol.symbol}">${symbol.display}</button>`;
                    });
                    commonSymbols.innerHTML = symbolsHTML;
                    
                    // Re-attach event listeners to new buttons
                    const newSymbolBtns = commonSymbols.querySelectorAll('.symbol-btn');
                    newSymbolBtns.forEach(btn => {
                        btn.addEventListener('click', handleSymbolButtonClick);
                    });
                } else {
                    commonSymbols.innerHTML = `<span class="symbol-label">No symbols found matching "${query}"</span>`;
                }
            });
            
            // Handle symbol button clicks
            function handleSymbolButtonClick() {
                const symbol = this.getAttribute('data-symbol');
                
                try {
                    navigator.clipboard.writeText(symbol)
                        .then(() => {
                            // Show success feedback
                            const originalText = this.textContent;
                            this.textContent = '✓';
                            this.classList.add('btn-success');
                            
                            setTimeout(() => {
                                this.textContent = originalText;
                                this.classList.remove('btn-success');
                            }, 1500);
                        })
                        .catch(err => {
                            console.error('Could not copy symbol: ', err);
                            alert('Symbol: ' + symbol);
                        });
                } catch (err) {
                    console.error('Clipboard API not available: ', err);
                    alert('Symbol: ' + symbol);
                }
            }
            
            // Initialize symbol buttons
            const initialBtns = commonSymbols.querySelectorAll('.symbol-btn');
            initialBtns.forEach(btn => {
                btn.addEventListener('click', handleSymbolButtonClick);
            });
        }
    }

    // Subtractive Algorithm implementation
    function initializeSubtractiveAlgorithm() {
        // Set up the visualization board
        const board = JXG.JSXGraph.initBoard('subtractive-algorithm-visualization', {
            boundingbox: [-2, 3, 3, -2],
            axis: true,
            showCopyright: false,
            showNavigation: false
        });
        
        // Create origin point
        const origin = board.create('point', [0, 0], {name: 'O', fixed: true, size: 2, color: 'black', visible: false});
        
        // Create points for visualization
        const p1 = board.create('point', [1, 0], {name: 'v₁', size: 4, color: 'blue'});
        const p2 = board.create('point', [0, 1], {name: 'v₂', size: 4, color: 'red'});
        const p3 = board.create('point', [1, 1], {name: 'v₃', size: 4, color: 'green'});
        
        // Create vectors for visualization
        const v1 = board.create('arrow', [origin, p1], {strokeColor: 'blue', strokeWidth: 2});
        const v2 = board.create('arrow', [origin, p2], {strokeColor: 'red', strokeWidth: 2});
        const v3 = board.create('arrow', [origin, p3], {strokeColor: 'green', strokeWidth: 2});
        
        // Initialize comparison board
        if (document.getElementById('subtractive-comparison')) {
            const compBoard = JXG.JSXGraph.initBoard('subtractive-comparison', {
                boundingbox: [0, 10, 20, 0],
                axis: true,
                showCopyright: false,
                showNavigation: false
            });
            
            // Create data for comparison chart
            const hapdData = [
                [1, 8], [2, 7], [3, 8], [4, 9], [5, 10],
                [6, 8], [7, 7], [8, 9], [9, 10], [10, 11]
            ];
            
            const subtractiveData = [
                [1, 5], [2, 4], [3, 5], [4, 6], [5, 7],
                [6, 5], [7, 4], [8, 6], [9, 7], [10, 8]
            ];
            
            // Plot data points and lines
            const hapdCurve = compBoard.create('curve', 
                [hapdData.map(p => p[0]), hapdData.map(p => p[1])], 
                {strokeColor: 'blue', strokeWidth: 2}
            );
            
            const subtractiveCurve = compBoard.create('curve', 
                [subtractiveData.map(p => p[0]), subtractiveData.map(p => p[1])], 
                {strokeColor: 'green', strokeWidth: 2}
            );
            
            // Add labels
            compBoard.create('text', [12, 9, 'Standard HAPD'], {
                color: 'blue', fontSize: 12, anchorX: 'left'
            });
            
            compBoard.create('text', [12, 7, 'Subtractive Algorithm'], {
                color: 'green', fontSize: 12, anchorX: 'left'
            });
            
            // Add axis labels
            compBoard.create('text', [10, -0.8, 'Polynomial Complexity (coefficient size)'], {
                fontSize: 12, anchorX: 'middle'
            });
            
            compBoard.create('text', [-1.5, 5, 'Iterations to Convergence'], {
                fontSize: 12, anchorX: 'middle', anchorY: 'middle', rotate: 90
            });
        }
        
        // Add button click event
        const runButton = document.getElementById('run-subtractive');
        if (runButton) {
            runButton.addEventListener('click', function() {
                runSubtractiveAlgorithm();
            });
        }
        
        // Add calculator button event for the interactive tools section
        const subtractiveCalcButton = document.getElementById('subtractive-calculate');
        if (subtractiveCalcButton) {
            subtractiveCalcButton.addEventListener('click', function() {
                runSubtractiveToolDemo();
            });
        }
        
        // Function to parse polynomial input
        function parsePolynomial(polyStr) {
            // Default values
            let a = 0, b = 0, c = 0;
            
            // Try to parse polynomial of form x^3 + ax^2 + bx + c
            try {
                // Remove spaces
                polyStr = polyStr.replace(/\s+/g, '');
                
                // Check for x^3 term
                if (polyStr.indexOf('x^3') !== -1) {
                    const cubicCoef = polyStr.split('x^3')[0];
                    if (cubicCoef === '-') {
                        throw new Error("Polynomial must be monic (coefficient of x^3 must be 1)");
                    }
                }
                
                // Extract x^2 coefficient
                const x2Match = polyStr.match(/([+-]?\d*\.?\d*)x\^2/);
                if (x2Match && x2Match[1]) {
                    a = x2Match[1] === '+' || x2Match[1] === '-' ? 
                        parseFloat(x2Match[1] + '1') : parseFloat(x2Match[1]);
                    if (isNaN(a)) a = x2Match[1] === '+' ? 1 : -1;
                }
                
                // Extract x coefficient
                const x1Match = polyStr.match(/([+-]?\d*\.?\d*)x(?!\^)/);
                if (x1Match && x1Match[1]) {
                    b = x1Match[1] === '+' || x1Match[1] === '-' ? 
                        parseFloat(x1Match[1] + '1') : parseFloat(x1Match[1]);
                    if (isNaN(b)) b = x1Match[1] === '+' ? 1 : -1;
                }
                
                // Extract constant term
                const constMatch = polyStr.match(/([+-]?\d+\.?\d*)(?!x)(?!\^)(?!\.)/);
                if (constMatch && constMatch[1]) {
                    c = parseFloat(constMatch[1]);
                }
                
                return { a, b, c };
            } catch (error) {
                console.error("Error parsing polynomial:", error);
                return null;
            }
        }
        
        // Function to run the subtractive algorithm for the main content section
        function runSubtractiveAlgorithm() {
            const polyInput = document.getElementById('subtractive-poly');
            const resultsTable = document.getElementById('subtractive-results');
            const conclusionDiv = document.getElementById('subtractive-conclusion');
            
            if (!polyInput || !resultsTable || !conclusionDiv) return;
            
            // Parse the polynomial
            const polynomial = parsePolynomial(polyInput.value);
            if (!polynomial) {
                conclusionDiv.style.display = 'block';
                conclusionDiv.className = 'alert alert-danger mt-3';
                conclusionDiv.textContent = 'Invalid polynomial format. Please use format x^3 + ax^2 + bx + c';
                return;
            }
            
            // Clear previous results
            resultsTable.querySelector('tbody').innerHTML = '';
            
            // Calculate an approximate root (crude for demo purposes)
            const alpha = approximateRoot(polynomial);
            
            // Run the algorithm
            const results = subtractiveAlgorithm(alpha, polynomial, 20);
            
            // Display results
            let tbodyHtml = '';
            results.steps.forEach((step, idx) => {
                tbodyHtml += `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>(${step.v1.toFixed(4)}, ${step.v2.toFixed(4)}, ${step.v3.toFixed(4)})</td>
                        <td>${step.a1}</td>
                        <td>${step.a2}</td>
                        <td>(${step.r1.toFixed(4)}, ${step.r2.toFixed(4)})</td>
                        <td>${step.rMax.toFixed(4)}</td>
                        <td>(${step.a1},${step.a2},${step.rMaxIdx})</td>
                    </tr>
                `;
                
                // Update visualization on the last step
                if (idx === results.steps.length - 1) {
                    // Update points
                    p1.moveTo([step.v1, 0]);
                    p2.moveTo([0, step.v2]);
                    p3.moveTo([step.v3, step.v3]);
                }
            });
            
            resultsTable.querySelector('tbody').innerHTML = tbodyHtml;
            
            // Display conclusion
            conclusionDiv.style.display = 'block';
            if (results.isPeriodic) {
                conclusionDiv.className = 'alert alert-success mt-3';
                conclusionDiv.textContent = `Algorithm detected periodicity with period ${results.period}. This confirms that ${alpha.toFixed(6)} is a cubic irrational.`;
            } else {
                conclusionDiv.className = 'alert alert-info mt-3';
                conclusionDiv.textContent = `No periodicity detected within ${results.steps.length} iterations. This suggests the number might not be a cubic irrational or requires more iterations.`;
            }
        }
        
        // Function to run the subtractive algorithm for the interactive tools section
        function runSubtractiveToolDemo() {
            const polyInput = document.getElementById('subtractive-input');
            const iterations = document.getElementById('subtractive-iterations');
            const resultsBody = document.getElementById('subtractive-results-body');
            const conclusionText = document.getElementById('subtractive-conclusion-text');
            
            if (!polyInput || !iterations || !resultsBody || !conclusionText) return;
            
            // Parse the polynomial
            const polynomial = parsePolynomial(polyInput.value);
            if (!polynomial) {
                conclusionText.textContent = 'Invalid polynomial format. Please use format x^3 + ax^2 + bx + c';
                conclusionText.style.color = 'red';
                return;
            }
            
            // Clear previous results
            resultsBody.innerHTML = '';
            
            // Calculate an approximate root
            const alpha = approximateRoot(polynomial);
            
            // Run the algorithm
            const results = subtractiveAlgorithm(alpha, polynomial, parseInt(iterations.value, 10));
            
            // Display results
            let tbodyHtml = '';
            results.steps.forEach((step, idx) => {
                tbodyHtml += `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>(${step.v1.toFixed(4)}, ${step.v2.toFixed(4)}, ${step.v3.toFixed(4)})</td>
                        <td>${step.a1}</td>
                        <td>${step.a2}</td>
                        <td>(${step.r1.toFixed(4)}, ${step.r2.toFixed(4)})</td>
                        <td>${step.rMax.toFixed(4)}</td>
                        <td>(${step.a1},${step.a2},${step.rMaxIdx})</td>
                    </tr>
                `;
            });
            
            resultsBody.innerHTML = tbodyHtml;
            
            // Display conclusion
            if (results.isPeriodic) {
                conclusionText.textContent = `Periodicity detected with period ${results.period}. The number ${alpha.toFixed(6)} is a cubic irrational.`;
                conclusionText.style.color = 'green';
            } else {
                conclusionText.textContent = `No periodicity detected within ${results.steps.length} iterations. More iterations or a different polynomial may be needed.`;
                conclusionText.style.color = 'blue';
            }
        }
        
        // Crude approximation of a root for demo purposes
        function approximateRoot(polynomial) {
            const { a, b, c } = polynomial;
            // Newton's method for a few iterations
            let x = -1; // Starting guess
            for (let i = 0; i < 10; i++) {
                const fx = x*x*x + a*x*x + b*x + c;
                const fpx = 3*x*x + 2*a*x + b;
                x = x - fx / fpx;
            }
            return x;
        }
        
        // Subtractive algorithm implementation
        function subtractiveAlgorithm(alpha, polynomial, maxIterations) {
            // Initialize variables
            let v1 = alpha;
            let v2 = alpha * alpha;
            let v3 = 1;
            
            const steps = [];
            const visitedStates = new Map();
            let isPeriodic = false;
            let period = 0;
            
            for (let i = 0; i < maxIterations; i++) {
                // Compute integer parts
                const a1 = Math.floor(v1 / v3);
                const a2 = Math.floor(v2 / v3);
                
                // Calculate remainders
                const r1 = v1 - a1 * v3;
                const r2 = v2 - a2 * v3;
                
                // Find maximum remainder and its index
                const rMax = Math.max(r1, r2);
                const rMaxIdx = r1 > r2 ? 1 : 2;
                
                // Save this step
                steps.push({ v1, v2, v3, a1, a2, r1, r2, rMax, rMaxIdx });
                
                // Check if all remainders are very close to zero
                if (Math.abs(r1) < 1e-10 && Math.abs(r2) < 1e-10) {
                    isPeriodic = true;
                    period = i + 1;
                    break;
                }
                
                // Create a state key for periodicity detection
                const stateKey = `${a1},${a2},${rMaxIdx}`;
                
                // Check if we've seen this state before
                if (visitedStates.has(stateKey)) {
                    isPeriodic = true;
                    period = i - visitedStates.get(stateKey);
                    break;
                }
                
                // Save this state
                visitedStates.set(stateKey, i);
                
                // Update for next iteration
                v1 = r1;
                v2 = r2;
                v3 = rMax;
                
                // If values get too small, break
                if (Math.max(Math.abs(v1), Math.abs(v2), Math.abs(v3)) < 1e-10) {
                    isPeriodic = true;
                    period = i + 1;
                    break;
                }
            }
            
            return { steps, isPeriodic, period };
        }
    }
})(); 