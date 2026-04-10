/**
 * State Management for LLM Roadmap
 * Handles progress persistence with LocalStorage
 */

const StateManager = {
    STORAGE_KEY: 'llm-roadmap-progress',
    
    /**
     * Initialize state from LocalStorage or create default
     */
    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.state = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved state:', e);
                this.state = this.getDefaultState();
            }
        } else {
            this.state = this.getDefaultState();
        }
        return this.state;
    },
    
    /**
     * Get default empty state
     */
    getDefaultState() {
        return {
            version: '1.0.0',
            progress: {},  // resourceId -> status (0-4)
            lastUpdated: null,
            settings: {
                language: 'en'
            }
        };
    },
    
    /**
     * Save current state to LocalStorage
     */
    save() {
        this.state.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    },
    
    /**
     * Get progress status for a resource
     * @param {string} resourceId 
     * @returns {number} 0-4 status level
     */
    getProgress(resourceId) {
        return this.state.progress[resourceId] || 0;
    },
    
    /**
     * Set progress status for a resource
     * @param {string} resourceId 
     * @param {number} status 0-4
     */
    setProgress(resourceId, status) {
        this.state.progress[resourceId] = status;
        this.save();
    },
    
    /**
     * Get all progress data
     */
    getAllProgress() {
        return { ...this.state.progress };
    },
    
    /**
     * Calculate completion stats for a list of resources
     * @param {Array} resources 
     * @returns {Object} stats
     */
    calculateStats(resources) {
        let completed = 0;
        let inProgress = 0;
        let totalMinutes = 0;
        let completedMinutes = 0;
        let masteryPoints = 0;
        const maxMasteryPoints = resources.length * 4;
        
        resources.forEach(resource => {
            const status = this.getProgress(resource.id);
            if (status >= 2) {
                completed++;
                completedMinutes += resource.estimatedMinutes || 0;
            } else if (status === 1) {
                inProgress++;
            }
            
            if (status === 0) {
                totalMinutes += resource.estimatedMinutes || 0;
            }
            
            masteryPoints += status;
        });
        
        const total = resources.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const masteryPercent = maxMasteryPoints > 0 ? Math.round((masteryPoints / maxMasteryPoints) * 100) : 0;
        
        return {
            completed,
            inProgress,
            total,
            percent,
            remainingMinutes: totalMinutes,
            masteryPercent
        };
    },
    
    /**
     * Export progress data
     */
    exportData() {
        return JSON.stringify(this.state, null, 2);
    },
    
    /**
     * Import progress data
     * @param {string} jsonData 
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.state = data;
            this.save();
            return true;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    },
    
    /**
     * Reset all progress
     */
    reset() {
        this.state = this.getDefaultState();
        this.save();
    }
};

// Status icons mapping
const STATUS_ICONS = {
    0: '⚪',
    1: '🟡',
    2: '🟢',
    3: '🔵',
    4: '⭐'
};

const STATUS_LABELS = {
    0: 'Not Started',
    1: 'In Progress',
    2: 'Basic',
    3: 'Intermediate',
    4: 'Mastered'
};

// Resource type icons
const TYPE_ICONS = {
    video: '🎥',
    paper: '📄',
    blog: '📝',
    book: '📖',
    tutorial: '📚',
    docs: '📚',
    tool: '🛠️',
    web: '🌐',
    newsletter: '📰'
};
