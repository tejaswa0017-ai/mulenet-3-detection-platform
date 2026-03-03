/**
 * MuleNet API Client
 * Fetches data from the Python ML backend with fallback to DataGenerator.
 */

const API_BASE = 'http://localhost:8000/api';

interface FetchOptions {
    timeout?: number;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
    const { timeout = 5000 } = options;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${API_BASE}${endpoint}`, {
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`API ${endpoint} returned ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        // Backend not available — will fallback to DataGenerator
        console.warn(`API ${endpoint} unavailable, using fallback data`);
        return null;
    }
}

/** Check if the backend is reachable */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`http://localhost:8000/health`, { signal: AbortSignal.timeout(2000) });
        return response.ok;
    } catch {
        return false;
    }
}

/** Fetch transactions from API */
export async function fetchTransactions(params?: {
    limit?: number; offset?: number; risk?: string; pattern?: string;
}) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.risk && params.risk !== 'all') query.set('risk', params.risk);
    if (params?.pattern && params.pattern !== 'all') query.set('pattern', params.pattern);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{
        transactions: any[];
        total: number;
        limit: number;
        offset: number;
    }>(`/transactions${qs}`);
}

/** Fetch risk scores from API */
export async function fetchRiskScores() {
    return apiFetch<{ risk_scores: any[] }>('/risk-scores');
}

/** Fetch alerts from API */
export async function fetchAlerts(tier?: string) {
    const qs = tier && tier !== 'all' ? `?tier=${tier}` : '';
    return apiFetch<{ alerts: any[]; total: number }>(`/alerts${qs}`);
}

/** Fetch network graph from API */
export async function fetchNetwork() {
    return apiFetch<{ nodes: any[]; edges: any[] }>('/network');
}

/** Fetch dashboard stats from API */
export async function fetchStats() {
    return apiFetch<{
        dashboard_metrics: Record<string, any>;
        model_performance: Record<string, any>;
        system_health: Record<string, any>;
    }>('/stats');
}

/** Fetch cases from API */
export async function fetchCases(params?: { status?: string; severity?: string }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.severity && params.severity !== 'all') query.set('severity', params.severity);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ cases: any[]; total: number }>(`/cases${qs}`);
}

/** Fetch entity resolution matches from API */
export async function fetchEntityMatches() {
    return apiFetch<{ matches: any[]; total: number }>('/entity-matches');
}

/** Fetch federated edge nodes from API */
export async function fetchEdgeNodes() {
    return apiFetch<{ edge_nodes: any[] }>('/federated/edge-nodes');
}

/** Fetch federated learning rounds from API */
export async function fetchFederatedRounds() {
    return apiFetch<{ rounds: any[] }>('/federated/rounds');
}

/** Fetch red team results from API */
export async function fetchRedTeamResults() {
    return apiFetch<{
        ttp_library: any[];
        scenarios: any[];
        kpis: any[];
        model_robustness: Record<string, number>;
    }>('/red-team');
}
