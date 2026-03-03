/**
 * React hooks for fetching data from the MuleNet ML backend.
 * Falls back to DataGenerator when backend is unavailable.
 */
import { useState, useEffect, useCallback } from 'react';
import {
    fetchTransactions,
    fetchRiskScores,
    fetchAlerts,
    fetchNetwork,
    fetchStats,
    fetchCases,
    fetchEntityMatches,
    fetchEdgeNodes,
    fetchFederatedRounds,
    fetchRedTeamResults,
    checkBackendHealth,
} from '../api';
import { DataGenerator } from '../data';
import type {
    Transaction, RiskScoreResult, TieredAlert,
    GraphNode, GraphEdge, CaseFile,
} from '../types';

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    isLive: boolean; // true = from API, false = fallback
}

/** Check if backend is available (cached for session) */
let _backendOnline: boolean | null = null;

async function isBackendOnline(): Promise<boolean> {
    if (_backendOnline !== null) return _backendOnline;
    _backendOnline = await checkBackendHealth();
    // Re-check after 30 seconds
    setTimeout(() => { _backendOnline = null; }, 30000);
    return _backendOnline;
}

/** Hook: Fetch transactions */
export function useTransactions() {
    const [state, setState] = useState<ApiState<Transaction[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    const load = useCallback(async () => {
        setState(s => ({ ...s, loading: true }));

        if (await isBackendOnline()) {
            const result = await fetchTransactions({ limit: 500 });
            if (result) {
                setState({ data: result.transactions, loading: false, error: null, isLive: true });
                return;
            }
        }

        // Fallback
        setState({
            data: DataGenerator.generateTransactions(),
            loading: false, error: null, isLive: false,
        });
    }, []);

    useEffect(() => { load(); }, [load]);
    return { ...state, reload: load };
}

/** Hook: Fetch risk scores */
export function useRiskScores() {
    const [state, setState] = useState<ApiState<RiskScoreResult[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));

            if (await isBackendOnline()) {
                const result = await fetchRiskScores();
                if (result) {
                    setState({ data: result.risk_scores, loading: false, error: null, isLive: true });
                    return;
                }
            }

            setState({
                data: DataGenerator.generateRiskScores(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch alerts */
export function useAlerts() {
    const [state, setState] = useState<ApiState<TieredAlert[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));

            if (await isBackendOnline()) {
                const result = await fetchAlerts();
                if (result) {
                    setState({ data: result.alerts, loading: false, error: null, isLive: true });
                    return;
                }
            }

            setState({
                data: DataGenerator.generateTieredAlerts(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch network graph */
export function useNetwork() {
    const [state, setState] = useState<ApiState<{ nodes: GraphNode[]; edges: GraphEdge[] }>>({
        data: null, loading: true, error: null, isLive: false,
    });

    const load = useCallback(async () => {
        setState(s => ({ ...s, loading: true }));

        if (await isBackendOnline()) {
            const result = await fetchNetwork();
            if (result) {
                setState({ data: result, loading: false, error: null, isLive: true });
                return;
            }
        }

        setState({
            data: DataGenerator.generateNetwork(),
            loading: false, error: null, isLive: false,
        });
    }, []);

    useEffect(() => { load(); }, [load]);
    return { ...state, reload: load };
}

/** Hook: Fetch dashboard stats */
export function useStats() {
    const [state, setState] = useState<ApiState<any>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));

            if (await isBackendOnline()) {
                const result = await fetchStats();
                if (result) {
                    setState({ data: result, loading: false, error: null, isLive: true });
                    return;
                }
            }

            // No direct fallback for stats, use nulls
            setState({ data: null, loading: false, error: null, isLive: false });
        })();
    }, []);

    return state;
}

/** Hook: Fetch cases */
export function useCases() {
    const [state, setState] = useState<ApiState<CaseFile[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));

            if (await isBackendOnline()) {
                const result = await fetchCases();
                if (result) {
                    setState({ data: result.cases, loading: false, error: null, isLive: true });
                    return;
                }
            }

            setState({
                data: DataGenerator.generateCases(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch entity resolution matches */
export function useEntityMatches() {
    const [state, setState] = useState<ApiState<any[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));
            if (await isBackendOnline()) {
                const result = await fetchEntityMatches();
                if (result) {
                    setState({ data: result.matches, loading: false, error: null, isLive: true });
                    return;
                }
            }
            setState({
                data: DataGenerator.generateEntityMatches(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch federated edge nodes */
export function useEdgeNodes() {
    const [state, setState] = useState<ApiState<any[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));
            if (await isBackendOnline()) {
                const result = await fetchEdgeNodes();
                if (result) {
                    setState({ data: result.edge_nodes, loading: false, error: null, isLive: true });
                    return;
                }
            }
            setState({
                data: DataGenerator.generateEdgeNodes(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch federated learning rounds */
export function useFederatedRounds() {
    const [state, setState] = useState<ApiState<any[]>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));
            if (await isBackendOnline()) {
                const result = await fetchFederatedRounds();
                if (result) {
                    setState({ data: result.rounds, loading: false, error: null, isLive: true });
                    return;
                }
            }
            setState({
                data: DataGenerator.generateFederatedRounds(),
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}

/** Hook: Fetch red team results */
export function useRedTeam() {
    const [state, setState] = useState<ApiState<{ ttp_library: any[]; scenarios: any[]; kpis: any[] }>>({
        data: null, loading: true, error: null, isLive: false,
    });

    useEffect(() => {
        (async () => {
            setState(s => ({ ...s, loading: true }));
            if (await isBackendOnline()) {
                const result = await fetchRedTeamResults();
                if (result) {
                    setState({
                        data: { ttp_library: result.ttp_library, scenarios: result.scenarios, kpis: result.kpis },
                        loading: false, error: null, isLive: true,
                    });
                    return;
                }
            }
            const fallback = DataGenerator.generateRedTeamResults();
            setState({
                data: { ttp_library: DataGenerator.generateTTPLibrary(), scenarios: fallback.scenarios, kpis: fallback.kpis },
                loading: false, error: null, isLive: false,
            });
        })();
    }, []);

    return state;
}
