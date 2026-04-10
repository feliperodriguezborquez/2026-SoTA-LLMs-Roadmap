/**
 * Main Application for Deep Understanding
 */

// Unlock threshold: percentage needed to unlock next chapter
const UNLOCK_THRESHOLD = 70;

// Settings defaults
const DEFAULT_SETTINGS = {
    unlockAllChapters: true,  // Default to true for easier access
    showEstimatedTime: true
};

class RoadmapApp {
    constructor() {
        this.roadmapData = null;
        this.currentChapter = null;
        this.allResources = [];
        this.currentView = 'path'; // 'path' or 'explore'
        this.settings = this.loadSettings();

        this.init();
    }

    loadSettings() {
        const saved = localStorage.getItem('deepunderstanding_settings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    }

    saveSettings() {
        localStorage.setItem('deepunderstanding_settings', JSON.stringify(this.settings));
    }

    async init() {
        // Initialize state
        StateManager.init();

        // Load roadmap data
        await this.loadRoadmapData();

        // Setup UI
        this.cacheElements();
        this.bindEvents();
        this.setupAuthUI();
        this.renderSidebar();

        // Default to Learning Path view
        this.showLearningPath();
        this.updateStats();
    }

    async loadRoadmapData() {
        try {
            const response = await fetch('data/roadmap.json');
            if (!response.ok) throw new Error('Fetch failed');
            this.roadmapData = await response.json();
            this.allResources = this.getAllResources();
        } catch (error) {
            console.warn('Fetch failed, using embedded data:', error);
            // Fallback to embedded data for file:// protocol
            if (typeof ROADMAP_DATA !== 'undefined') {
                this.roadmapData = ROADMAP_DATA;
                this.allResources = this.getAllResources();
            } else {
                console.error('Failed to load roadmap data:', error);
                this.showError('Failed to load roadmap data. Please use a local server or open via HTTP.');
            }
        }
    }

    getAllResources() {
        const resources = [];

        this.roadmapData.chapters.forEach(chapter => {
            if (chapter.resources) {
                resources.push(...chapter.resources);
            }
            if (chapter.subsections) {
                chapter.subsections.forEach(sub => {
                    resources.push(...sub.resources);
                });
            }
        });

        return resources;
    }

    getChapterResources(chapter) {
        const resources = [];

        if (chapter.resources) {
            resources.push(...chapter.resources);
        }
        if (chapter.subsections) {
            chapter.subsections.forEach(sub => {
                resources.push(...sub.resources);
            });
        }

        return resources;
    }

    cacheElements() {
        this.elements = {
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            chapterNav: document.getElementById('chapterNav'),
            pageTitle: document.getElementById('pageTitle'),

            // Stats
            overallProgress: document.getElementById('overallProgress'),
            overallPercent: document.getElementById('overallPercent'),
            completedCount: document.getElementById('completedCount'),
            inProgressCount: document.getElementById('inProgressCount'),
            totalHours: document.getElementById('totalHours'),

            // Dashboard
            dashboardView: document.getElementById('dashboardView'),
            chaptersGrid: document.getElementById('chaptersGrid'),
            totalResources: document.getElementById('totalResources'),
            totalChapters: document.getElementById('totalChapters'),
            masteryLevel: document.getElementById('masteryLevel'),

            // Chapter View
            chapterView: document.getElementById('chapterView'),
            backBtn: document.getElementById('backBtn'),
            chapterIcon: document.getElementById('chapterIcon'),
            chapterTitle: document.getElementById('chapterTitle'),
            chapterDescription: document.getElementById('chapterDescription'),
            chapterProgressRing: document.getElementById('chapterProgressRing'),
            chapterProgressText: document.getElementById('chapterProgressText'),
            resourcesContainer: document.getElementById('resourcesContainer'),

            // Modal
            statusModal: document.getElementById('statusModal'),
            resourceName: document.getElementById('resourceName'),
            modalClose: document.getElementById('modalClose'),

            // User Menu
            userAvatar: document.getElementById('userAvatar'),
            userInitial: document.getElementById('userInitial'),
            userDropdown: document.getElementById('userDropdown'),
            userEmail: document.getElementById('userEmail'),
            authLink: document.getElementById('authLink'),
            signOutBtn: document.getElementById('signOutBtn'),

            // View Toggle
            viewToggle: document.getElementById('viewToggle'),
            contentArea: document.getElementById('contentArea'),

            // Settings
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            settingsClose: document.getElementById('settingsClose'),
            unlockAllChapters: document.getElementById('unlockAllChapters'),
            showEstimatedTime: document.getElementById('showEstimatedTime'),
            exportProgressBtn: document.getElementById('exportProgressBtn'),
            importProgressBtn: document.getElementById('importProgressBtn'),
            resetProgressBtn: document.getElementById('resetProgressBtn'),
            importFileInput: document.getElementById('importFileInput')
        };
    }

    bindEvents() {
        // Mobile menu
        this.elements.mobileMenuBtn?.addEventListener('click', () => {
            this.elements.sidebar.classList.toggle('open');
        });

        // Back button
        this.elements.backBtn?.addEventListener('click', () => {
            if (this.currentView === 'path') {
                this.showLearningPath();
            } else {
                this.showDashboard();
            }
        });

        // Modal close
        this.elements.modalClose?.addEventListener('click', () => {
            this.hideModal();
        });

        // Modal overlay click
        this.elements.statusModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.statusModal) {
                this.hideModal();
            }
        });

        // Status buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = parseInt(btn.dataset.status);
                this.updateResourceStatus(this.currentResourceId, status);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
                this.elements.sidebar.classList.remove('open');
                this.elements.userDropdown?.classList.add('hidden');
            }
        });

        // View toggle buttons
        this.elements.viewToggle?.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });

        // User avatar click (toggle dropdown)
        this.elements.userAvatar?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.elements.userDropdown?.classList.toggle('hidden');
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            this.elements.userDropdown?.classList.add('hidden');
        });

        // Sign out button
        this.elements.signOutBtn?.addEventListener('click', async () => {
            if (typeof Auth !== 'undefined' && Auth.isConfigured) {
                await Auth.signOut();
                this.updateAuthUI();
            }
        });

        // Auth state change listener
        window.addEventListener('auth_state_change', (e) => {
            this.updateAuthUI();
            if (e.detail.type === 'signed_in') {
                // Refresh the view to sync data
                this.showLearningPath();
            }
        });

        // Settings Modal
        this.elements.settingsBtn?.addEventListener('click', () => {
            this.openSettings();
        });

        this.elements.settingsClose?.addEventListener('click', () => {
            this.closeSettings();
        });

        this.elements.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });

        // Settings toggles
        this.elements.unlockAllChapters?.addEventListener('change', (e) => {
            this.settings.unlockAllChapters = e.target.checked;
            this.saveSettings();
            this.renderLearningPath(); // Re-render to unlock/lock chapters
        });

        this.elements.showEstimatedTime?.addEventListener('change', (e) => {
            this.settings.showEstimatedTime = e.target.checked;
            this.saveSettings();
        });

        // Data management buttons
        this.elements.exportProgressBtn?.addEventListener('click', () => {
            this.exportProgress();
        });

        this.elements.importProgressBtn?.addEventListener('click', () => {
            this.elements.importFileInput?.click();
        });

        this.elements.importFileInput?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) this.importProgress(file);
        });

        this.elements.resetProgressBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
                StateManager.resetProgress();
                this.showLearningPath();
                this.updateStats();
                this.renderSidebar();
                this.closeSettings();
            }
        });
    }

    // =============================================
    // Auth UI Management
    // =============================================

    setupAuthUI() {
        this.updateAuthUI();
    }

    updateAuthUI() {
        const isAuth = typeof Auth !== 'undefined' && Auth.isAuthenticated();

        if (isAuth) {
            const email = Auth.getUserEmail();
            const initial = Auth.getUserInitials();

            this.elements.userInitial.textContent = initial;
            this.elements.userEmail.textContent = email;
            this.elements.authLink?.classList.add('hidden');
            this.elements.signOutBtn?.classList.remove('hidden');
        } else {
            this.elements.userInitial.textContent = '?';
            this.elements.userEmail.textContent = 'Not signed in';
            this.elements.authLink?.classList.remove('hidden');
            this.elements.signOutBtn?.classList.add('hidden');
        }
    }

    // =============================================
    // Settings Management
    // =============================================

    openSettings() {
        // Sync checkbox states with current settings
        if (this.elements.unlockAllChapters) {
            this.elements.unlockAllChapters.checked = this.settings.unlockAllChapters;
        }
        if (this.elements.showEstimatedTime) {
            this.elements.showEstimatedTime.checked = this.settings.showEstimatedTime;
        }
        this.elements.settingsModal?.classList.remove('hidden');
    }

    closeSettings() {
        this.elements.settingsModal?.classList.add('hidden');
    }

    exportProgress() {
        const data = StateManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deep-understanding-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showAchievement('📤', 'Progress exported!');
    }

    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                StateManager.importData(e.target.result);
                this.showLearningPath();
                this.updateStats();
                this.renderSidebar();
                this.closeSettings();
                this.showAchievement('📥', 'Progress imported!');
            } catch (error) {
                alert('Failed to import progress: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // =============================================
    // View Switching
    // =============================================

    switchView(view) {
        this.currentView = view;

        // Update toggle buttons
        this.elements.viewToggle?.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'path') {
            this.showLearningPath();
        } else {
            this.showDashboard();
        }
    }

    // =============================================
    // Learning Path View
    // =============================================

    showLearningPath() {
        this.currentView = 'path';
        this.elements.pageTitle.textContent = 'Learning Path';

        // Hide other views
        this.elements.dashboardView?.classList.add('hidden');
        this.elements.chapterView?.classList.add('hidden');

        // Create or show learning path view
        let pathView = document.getElementById('learningPathView');
        if (!pathView) {
            pathView = document.createElement('section');
            pathView.id = 'learningPathView';
            pathView.className = 'learning-path-view';
            this.elements.contentArea.appendChild(pathView);
        }
        pathView.classList.remove('hidden');

        this.renderLearningPath(pathView);
        this.updateNavActive('dashboard');
    }

    renderLearningPath(container) {
        const chapters = this.roadmapData.chapters;
        const stats = StateManager.calculateStats(this.allResources);

        // Find current chapter (first non-completed or first locked)
        let currentChapterIndex = 0;
        for (let i = 0; i < chapters.length; i++) {
            const chapterResources = this.getChapterResources(chapters[i]);
            const chapterStats = StateManager.calculateStats(chapterResources);
            if (chapterStats.percent < 100) {
                currentChapterIndex = i;
                break;
            }
        }

        container.innerHTML = `
            <div class="path-progress-header">
                <h2>📍 Your Progress: Chapter ${currentChapterIndex + 1} of ${chapters.length}</h2>
                <div class="path-progress-bar">
                    <div class="path-progress-fill" style="width: ${stats.percent}%"></div>
                </div>
                <p class="path-progress-text">
                    <strong>${stats.completed}</strong> of <strong>${this.allResources.length}</strong> resources completed 
                    (${stats.percent}% overall)
                </p>
            </div>
            
            <div class="path-chapters">
                ${chapters.map((chapter, index) => this.renderPathChapter(chapter, index, currentChapterIndex)).join('')}
            </div>
        `;

        // Bind chapter events
        container.querySelectorAll('.path-chapter-header').forEach(header => {
            header.addEventListener('click', () => {
                const chapterEl = header.closest('.path-chapter');
                if (!chapterEl.classList.contains('locked')) {
                    chapterEl.classList.toggle('expanded');
                }
            });
        });

        // Bind view all resources links
        container.querySelectorAll('.view-all-resources').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const chapterId = link.dataset.chapterId;
                this.showChapter(chapterId);
            });
        });

        // Bind next resource buttons
        container.querySelectorAll('.next-resource-btn.primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = btn.dataset.url;
                window.open(url, '_blank');
            });
        });

        container.querySelectorAll('.next-resource-btn.secondary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const resourceId = btn.dataset.resourceId;
                const resource = this.allResources.find(r => r.id === resourceId);
                if (resource) {
                    this.showStatusModal(resource);
                }
            });
        });
    }

    renderPathChapter(chapter, index, currentIndex) {
        const resources = this.getChapterResources(chapter);
        const stats = StateManager.calculateStats(resources);

        // Determine chapter state
        let state = 'upcoming';
        if (stats.percent === 100) {
            state = 'completed';
        } else if (index === currentIndex) {
            state = 'current';
        } else if (index > currentIndex) {
            // Check if unlock all chapters is enabled
            if (this.settings.unlockAllChapters) {
                state = 'upcoming';
            } else {
                // Check if previous chapter meets unlock threshold
                const prevChapter = this.roadmapData.chapters[index - 1];
                const prevResources = this.getChapterResources(prevChapter);
                const prevStats = StateManager.calculateStats(prevResources);
                state = prevStats.percent >= UNLOCK_THRESHOLD ? 'upcoming' : 'locked';
            }
        }

        // Find next incomplete resource
        const nextResource = resources.find(r => StateManager.getProgress(r.id) < 2);

        return `
            <div class="path-chapter ${state}" data-chapter-id="${chapter.id}">
                <div class="path-chapter-marker">
                    ${state === 'completed' ? '✓' : state === 'locked' ? '🔒' : index + 1}
                </div>
                <div class="path-chapter-card">
                    <div class="path-chapter-header">
                        <span class="path-chapter-icon">${chapter.icon}</span>
                        <div class="path-chapter-info">
                            <div class="path-chapter-title">${chapter.title}</div>
                            <div class="path-chapter-meta">${resources.length} resources</div>
                        </div>
                        <div class="path-chapter-progress">
                            <div class="path-chapter-percent">${stats.percent}%</div>
                            <div class="path-chapter-status">${stats.completed}/${resources.length}</div>
                        </div>
                    </div>
                    
                    ${state === 'current' || state === 'completed' ? `
                        <div class="path-chapter-content">
                            ${nextResource ? `
                                <div class="next-resource-label">📌 Next up:</div>
                                <div class="next-resource-card">
                                    <div class="next-resource-title">${nextResource.title}</div>
                                    <div class="next-resource-meta">
                                        <span>${TYPE_ICONS[nextResource.type] || '📄'} ${nextResource.type}</span>
                                        <span>${nextResource.author || 'Unknown'}</span>
                                        ${nextResource.estimatedMinutes ? `<span>${this.formatTime(nextResource.estimatedMinutes)}</span>` : ''}
                                    </div>
                                    <div class="next-resource-actions">
                                        <button class="next-resource-btn primary" data-url="${nextResource.url}">
                                            Open Resource →
                                        </button>
                                        <button class="next-resource-btn secondary" data-resource-id="${nextResource.id}">
                                            Mark Progress
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <div class="next-resource-label">🎉 Chapter Complete!</div>
                            `}
                            <button class="view-all-resources" data-chapter-id="${chapter.id}">
                                View all ${resources.length} resources →
                            </button>
                        </div>
                    ` : ''}
                    
                    ${state === 'locked' ? `
                        <div class="path-locked-message">
                            🔒 Complete ${UNLOCK_THRESHOLD}% of the previous chapter to unlock
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderSidebar() {
        const nav = this.elements.chapterNav;
        nav.innerHTML = '';

        // Dashboard link
        const dashItem = document.createElement('div');
        dashItem.className = 'nav-item active';
        dashItem.dataset.view = 'dashboard';
        dashItem.innerHTML = `
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Dashboard</span>
        `;
        dashItem.addEventListener('click', () => this.showDashboard());
        nav.appendChild(dashItem);

        // Chapter links
        this.roadmapData.chapters.forEach(chapter => {
            const resources = this.getChapterResources(chapter);
            const stats = StateManager.calculateStats(resources);

            const item = document.createElement('div');
            item.className = 'nav-item';
            item.dataset.chapter = chapter.id;
            item.innerHTML = `
                <span class="nav-icon">${chapter.icon}</span>
                <span class="nav-text">${chapter.title}</span>
                <div class="nav-progress">
                    <div class="nav-progress-fill" style="width: ${stats.percent}%"></div>
                </div>
            `;
            item.addEventListener('click', () => this.showChapter(chapter.id));
            nav.appendChild(item);
        });
    }

    renderDashboard() {
        // Update welcome stats
        this.elements.totalResources.textContent = this.allResources.length;
        this.elements.totalChapters.textContent = this.roadmapData.chapters.length;

        const overallStats = StateManager.calculateStats(this.allResources);
        this.elements.masteryLevel.textContent = `${overallStats.masteryPercent}%`;

        // Render chapter cards
        const grid = this.elements.chaptersGrid;
        grid.innerHTML = '';

        this.roadmapData.chapters.forEach(chapter => {
            const resources = this.getChapterResources(chapter);
            const stats = StateManager.calculateStats(resources);

            const card = document.createElement('div');
            card.className = 'chapter-card';
            card.dataset.chapter = chapter.id;
            card.innerHTML = `
                <div class="chapter-card-header">
                    <span class="chapter-card-icon">${chapter.icon}</span>
                    <h3 class="chapter-card-title">${chapter.title}</h3>
                </div>
                <p class="chapter-card-desc">${chapter.description}</p>
                <div class="chapter-card-footer">
                    <div class="chapter-card-stats">
                        <span>${resources.length} resources</span>
                        <span>${stats.completed} completed</span>
                    </div>
                    <div class="chapter-card-progress">
                        <div class="chapter-card-progress-bar">
                            <div class="chapter-card-progress-fill" style="width: ${stats.percent}%"></div>
                        </div>
                        <span class="chapter-card-progress-text">${stats.percent}%</span>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => this.showChapter(chapter.id));
            grid.appendChild(card);
        });
    }

    showDashboard() {
        this.currentChapter = null;
        this.currentView = 'explore';

        // Update view toggle
        this.elements.viewToggle?.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === 'explore');
        });

        // Update navigation
        this.updateNavActive('dashboard');

        // Update title
        this.elements.pageTitle.textContent = 'Dashboard';

        // Toggle views
        this.elements.dashboardView.classList.remove('hidden');
        this.elements.chapterView.classList.add('hidden');
        document.getElementById('learningPathView')?.classList.add('hidden');

        // Close mobile sidebar
        this.elements.sidebar.classList.remove('open');

        // Re-render to update stats
        this.renderDashboard();
        this.renderSidebar();
        this.updateStats();
    }

    updateNavActive(activeId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            const isActive = item.dataset.view === activeId || item.dataset.chapter === activeId;
            item.classList.toggle('active', isActive);
        });
    }

    showChapter(chapterId) {
        const chapter = this.roadmapData.chapters.find(c => c.id === chapterId);
        if (!chapter) return;

        this.currentChapter = chapter;

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.chapter === chapterId);
        });

        // Update header
        this.elements.pageTitle.textContent = chapter.title;
        this.elements.chapterIcon.textContent = chapter.icon;
        this.elements.chapterTitle.textContent = chapter.title;
        this.elements.chapterDescription.textContent = chapter.description;

        // Update progress ring
        const resources = this.getChapterResources(chapter);
        const stats = StateManager.calculateStats(resources);
        this.updateProgressRing(stats.percent);

        // Render resources
        this.renderResources(chapter);

        // Toggle views
        this.elements.dashboardView.classList.add('hidden');
        this.elements.chapterView.classList.remove('hidden');
        document.getElementById('learningPathView')?.classList.add('hidden');

        // Close mobile sidebar
        this.elements.sidebar.classList.remove('open');
    }

    renderResources(chapter) {
        const container = this.elements.resourcesContainer;
        container.innerHTML = '';

        // If chapter has subsections
        if (chapter.subsections) {
            chapter.subsections.forEach(sub => {
                const subTitle = document.createElement('h3');
                subTitle.className = 'subsection-title';
                subTitle.textContent = sub.title;
                container.appendChild(subTitle);

                sub.resources.forEach(resource => {
                    container.appendChild(this.createResourceCard(resource));
                });
            });
        }

        // Direct resources
        if (chapter.resources) {
            chapter.resources.forEach(resource => {
                container.appendChild(this.createResourceCard(resource));
            });
        }
    }

    createResourceCard(resource) {
        const status = StateManager.getProgress(resource.id);
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.dataset.resourceId = resource.id;

        const difficultyStars = this.renderDifficulty(resource.difficulty || 1);
        const typeIcon = TYPE_ICONS[resource.type] || '📄';

        card.innerHTML = `
            <div class="resource-status" data-status="${status}" data-resource-id="${resource.id}">
                ${STATUS_ICONS[status]}
            </div>
            <div class="resource-content">
                <div class="resource-title">
                    ${resource.title}
                    <span class="difficulty-badge">${difficultyStars}</span>
                </div>
                <div class="resource-meta">
                    <span class="resource-type" data-type="${resource.type}">${typeIcon} ${resource.type}</span>
                    <span>${resource.author || 'Unknown'}</span>
                    ${resource.estimatedMinutes ? `<span>${this.formatTime(resource.estimatedMinutes)}</span>` : ''}
                </div>
            </div>
            <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link" title="Open resource">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
            </a>
        `;

        // Status click handler
        const statusBtn = card.querySelector('.resource-status');
        statusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showStatusModal(resource);
        });

        return card;
    }

    renderDifficulty(level) {
        let stars = '';
        for (let i = 1; i <= 3; i++) {
            stars += `<span class="difficulty-star ${i <= level ? '' : 'empty'}">★</span>`;
        }
        return stars;
    }

    formatTime(minutes) {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }

    showStatusModal(resource) {
        this.currentResourceId = resource.id;
        this.elements.resourceName.textContent = resource.title;

        const currentStatus = StateManager.getProgress(resource.id);

        // Update active state
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.status) === currentStatus);
        });

        this.elements.statusModal.classList.remove('hidden');
    }

    hideModal() {
        this.elements.statusModal.classList.add('hidden');
        this.currentResourceId = null;
    }

    updateResourceStatus(resourceId, status) {
        StateManager.setProgress(resourceId, status);

        // Update the UI
        const statusEl = document.querySelector(`.resource-status[data-resource-id="${resourceId}"]`);
        if (statusEl) {
            statusEl.dataset.status = status;
            statusEl.textContent = STATUS_ICONS[status];
        }

        // Update progress displays
        if (this.currentChapter) {
            const resources = this.getChapterResources(this.currentChapter);
            const stats = StateManager.calculateStats(resources);
            this.updateProgressRing(stats.percent);

            // Check for chapter completion celebration
            if (stats.percent === 100 && status >= 2) {
                this.celebrateCompletion(this.currentChapter.title);
            }
        }

        this.updateStats();
        this.renderSidebar(); // Update nav progress bars

        // Show achievement for first mastery
        if (status === 4) {
            this.showAchievement('⭐', 'Topic Mastered!');
        }

        this.hideModal();
    }

    updateProgressRing(percent) {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percent / 100) * circumference;

        this.elements.chapterProgressRing.style.strokeDashoffset = offset;
        this.elements.chapterProgressText.textContent = `${percent}%`;
    }

    updateStats() {
        const stats = StateManager.calculateStats(this.allResources);

        // Overall progress
        this.elements.overallProgress.style.width = `${stats.percent}%`;
        this.elements.overallPercent.textContent = `${stats.percent}%`;

        // Quick stats
        this.elements.completedCount.textContent = stats.completed;
        this.elements.inProgressCount.textContent = stats.inProgress;

        // Time remaining
        const hours = Math.round(stats.remainingMinutes / 60);
        this.elements.totalHours.textContent = `${hours}h`;

        // Mastery level
        if (this.elements.masteryLevel) {
            this.elements.masteryLevel.textContent = `${stats.masteryPercent}%`;
        }
    }

    // =============================================
    // Enhanced Features
    // =============================================

    /**
     * Celebrate chapter completion with confetti
     */
    celebrateCompletion(chapterTitle) {
        this.createConfetti();
        this.showAchievement('🎉', `${chapterTitle} Complete!`);
    }

    /**
     * Create confetti animation
     */
    createConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
        const shapes = ['square', 'circle'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

            if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
                confetti.style.borderRadius = '50%';
            }

            container.appendChild(confetti);
        }

        // Remove after animation
        setTimeout(() => container.remove(), 4000);
    }

    /**
     * Show achievement notification
     */
    showAchievement(icon, message) {
        // Remove any existing achievement
        document.querySelectorAll('.achievement-badge').forEach(el => el.remove());

        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <span class="icon">${icon}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(badge);

        // Remove after 4 seconds
        setTimeout(() => {
            badge.style.animation = 'achievementSlide 0.5s ease reverse';
            setTimeout(() => badge.remove(), 500);
        }, 4000);
    }

    /**
     * Quick cycle through status levels (for quick marking)
     */
    cycleResourceStatus(resourceId) {
        const currentStatus = StateManager.getProgress(resourceId);
        const nextStatus = (currentStatus + 1) % 5;
        this.updateResourceStatus(resourceId, nextStatus);
    }

    showError(message) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 4rem;">
                <h2 style="color: var(--status-in-progress);">⚠️ Error</h2>
                <p style="color: var(--text-secondary);">${message}</p>
            </div>
        `;
    }
}

// =============================================
// Keyboard Shortcuts
// =============================================
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const app = window.app;
    if (!app) return;

    switch (e.key) {
        case 'Escape':
            app.hideModal();
            app.elements?.sidebar?.classList.remove('open');
            break;
        case 'h':
        case 'H':
            // Go home
            app.showDashboard();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            // Quick navigate to chapter
            const chapterIndex = parseInt(e.key) - 1;
            if (app.roadmapData?.chapters?.[chapterIndex]) {
                app.showChapter(app.roadmapData.chapters[chapterIndex].id);
            }
            break;
        case '0':
            // Navigate to chapter 10
            if (app.roadmapData?.chapters?.[9]) {
                app.showChapter(app.roadmapData.chapters[9].id);
            }
            break;
        case '?':
            // Show keyboard shortcuts help
            alert(`
⌨️ Keyboard Shortcuts:

H - Go to Dashboard (Home)
1-9, 0 - Navigate to Chapter 1-10
Esc - Close modal/sidebar

In Chapter View:
Click status icon - Update progress
            `);
            break;
    }
});

// =============================================
// Export/Import Progress
// =============================================
window.exportProgress = () => {
    const data = StateManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llm-roadmap-progress.json';
    a.click();
    URL.revokeObjectURL(url);
};

window.importProgress = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        if (StateManager.importData(e.target.result)) {
            window.app?.init();
            alert('Progress imported successfully!');
        } else {
            alert('Failed to import progress. Invalid file format.');
        }
    };
    reader.readAsText(file);
};

window.resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        StateManager.reset();
        window.app?.init();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new RoadmapApp();

    // Log helpful info
    console.log('%c🚀 2026 SoTA LLMs Roadmap', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%cPress ? for keyboard shortcuts', 'color: #94a3b8;');
    console.log('%cFunctions: exportProgress(), importProgress(file), resetProgress()', 'color: #64748b;');
});

