/**
 * Supabase Authentication & Data Module
 * Handles user authentication and cloud data sync
 */

class SupabaseManager {
    constructor() {
        this.client = null;
        this.user = null;
        this.isConfigured = false;
        this.init();
    }

    init() {
        // Check if Supabase is configured
        if (typeof SUPABASE_URL === 'undefined' ||
            SUPABASE_URL === 'YOUR_SUPABASE_URL' ||
            typeof SUPABASE_ANON_KEY === 'undefined' ||
            SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            console.log('📴 Supabase not configured - running in offline mode');
            this.isConfigured = false;
            return;
        }

        // Initialize Supabase client
        if (typeof supabase !== 'undefined') {
            this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            this.isConfigured = true;
            this.setupAuthListener();
            console.log('✅ Supabase initialized');
        } else {
            console.warn('⚠️ Supabase SDK not loaded');
            this.isConfigured = false;
        }
    }

    setupAuthListener() {
        if (!this.client) return;

        this.client.auth.onAuthStateChange((event, session) => {
            this.user = session?.user || null;

            if (event === 'SIGNED_IN') {
                console.log('👤 User signed in:', this.user.email);
                this.syncFromCloud();
                this.dispatchAuthEvent('signed_in', this.user);
            } else if (event === 'SIGNED_OUT') {
                console.log('👤 User signed out');
                this.user = null;
                this.dispatchAuthEvent('signed_out', null);
            }
        });

        // Check current session
        this.checkSession();
    }

    async checkSession() {
        if (!this.client) return null;

        const { data: { session } } = await this.client.auth.getSession();
        this.user = session?.user || null;
        return this.user;
    }

    dispatchAuthEvent(type, user) {
        window.dispatchEvent(new CustomEvent('auth_state_change', {
            detail: { type, user }
        }));
    }

    // =============================================
    // Authentication Methods
    // =============================================

    async signUp(email, password) {
        if (!this.client) {
            return { error: { message: 'Supabase not configured' } };
        }

        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (!error && data.user) {
            // Migrate local progress to cloud
            await this.migrateLocalToCloud();
        }

        return { data, error };
    }

    async signIn(email, password) {
        if (!this.client) {
            return { error: { message: 'Supabase not configured' } };
        }

        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password
        });

        return { data, error };
    }

    async signInWithOAuth(provider) {
        if (!this.client) {
            return { error: { message: 'Supabase not configured' } };
        }

        const { data, error } = await this.client.auth.signInWithOAuth({
            provider, // 'google', 'github', etc.
            options: {
                redirectTo: window.location.origin
            }
        });

        return { data, error };
    }

    async signOut() {
        if (!this.client) return;

        const { error } = await this.client.auth.signOut();
        if (!error) {
            this.user = null;
        }
        return { error };
    }

    async resetPassword(email) {
        if (!this.client) {
            return { error: { message: 'Supabase not configured' } };
        }

        const { data, error } = await this.client.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password'
        });

        return { data, error };
    }

    // =============================================
    // Data Sync Methods
    // =============================================

    async syncToCloud() {
        if (!this.client || !this.user) return;

        const localProgress = StateManager.getAllProgress();
        const updates = [];

        for (const [resourceId, status] of Object.entries(localProgress)) {
            updates.push({
                user_id: this.user.id,
                resource_id: resourceId,
                status: status,
                completed_at: status >= 2 ? new Date().toISOString() : null
            });
        }

        if (updates.length === 0) return;

        const { error } = await this.client
            .from('user_progress')
            .upsert(updates, { onConflict: 'user_id,resource_id' });

        if (error) {
            console.error('❌ Sync to cloud failed:', error);
        } else {
            console.log('☁️ Progress synced to cloud');
        }
    }

    async syncFromCloud() {
        if (!this.client || !this.user) return;

        const { data, error } = await this.client
            .from('user_progress')
            .select('resource_id, status')
            .eq('user_id', this.user.id);

        if (error) {
            console.error('❌ Sync from cloud failed:', error);
            return;
        }

        if (data && data.length > 0) {
            // Merge cloud data with local (cloud takes priority)
            data.forEach(row => {
                StateManager.setProgress(row.resource_id, row.status, false);
            });
            StateManager.save();
            console.log('☁️ Progress loaded from cloud:', data.length, 'items');
        }
    }

    async migrateLocalToCloud() {
        if (!this.client || !this.user) return;

        console.log('🔄 Migrating local progress to cloud...');
        await this.syncToCloud();
    }

    // =============================================
    // Utility Methods
    // =============================================

    isAuthenticated() {
        return this.user !== null;
    }

    getUser() {
        return this.user;
    }

    getUserEmail() {
        return this.user?.email || null;
    }

    getUserInitials() {
        const email = this.getUserEmail();
        if (!email) return '?';
        return email.charAt(0).toUpperCase();
    }
}

// Create global instance
const Auth = new SupabaseManager();
