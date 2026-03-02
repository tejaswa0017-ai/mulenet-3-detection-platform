import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { Theme, NODE_STYLE, EDGE_STYLE, riskColor } from '../utils/theme';
import { motion, AnimatePresence } from 'motion/react';

interface GraphSVGProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
}

export const GraphSVG: React.FC<GraphSVGProps> = ({ nodes, edges, onNodeClick }) => {
  const svgWidth = 850;
  const svgHeight = 480;

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, node: null as GraphNode | null });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Filtering State
  const allTypes = useMemo(() => Array.from(new Set(nodes.map(n => n.node_type))), [nodes]);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(new Set(allTypes));
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Reset visible types when nodes change (e.g., new dataset)
  useEffect(() => {
    setVisibleTypes(new Set(nodes.map(n => n.node_type)));
  }, [nodes]);

  // Handle click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Derived filtered data
  const filteredNodes = useMemo(() => nodes.filter(n => visibleTypes.has(n.node_type)), [nodes, visibleTypes]);
  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);
  const filteredEdges = useMemo(() => edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)), [edges, filteredNodeIds]);
  const nodeMap = useMemo(() => new Map(filteredNodes.map(n => [n.id, n])), [filteredNodes]);

  const triggerTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredNodeId(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleZoomIn = () => {
    triggerTransition();
    setScale(s => {
      const newScale = Math.min(s * 1.3, 5);
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setPosition(prevPos => ({
          x: centerX - (centerX - prevPos.x) * (newScale / s),
          y: centerY - (centerY - prevPos.y) * (newScale / s)
        }));
      }
      return newScale;
    });
  };

  const handleZoomOut = () => {
    triggerTransition();
    setScale(s => {
      const newScale = Math.max(s / 1.3, 0.1);
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setPosition(prevPos => ({
          x: centerX - (centerX - prevPos.x) * (newScale / s),
          y: centerY - (centerY - prevPos.y) * (newScale / s)
        }));
      }
      return newScale;
    });
  };

  const handleFitGraph = () => {
    if (filteredNodes.length === 0 || !svgRef.current) return;
    triggerTransition();
    
    const padding = 60;
    const minX = Math.min(...filteredNodes.map(n => n.x));
    const maxX = Math.max(...filteredNodes.map(n => n.x));
    const minY = Math.min(...filteredNodes.map(n => n.y));
    const maxY = Math.max(...filteredNodes.map(n => n.y));
    
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = (rect.width - padding * 2) / (graphWidth || 1);
    const scaleY = (rect.height - padding * 2) / (graphHeight || 1);
    const newScale = Math.min(scaleX, scaleY, 2); 
    
    const centerX = minX + graphWidth / 2;
    const centerY = minY + graphHeight / 2;
    
    setScale(newScale);
    setPosition({
      x: rect.width / 2 - centerX * newScale,
      y: rect.height / 2 - centerY * newScale
    });
  };

  const handleReset = () => {
    triggerTransition();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Calculate connected nodes and edges for hover effect
  const connectedNodes = new Set<string>();
  const connectedEdges = new Set<string>();
  if (hoveredNodeId) {
    connectedNodes.add(hoveredNodeId);
    filteredEdges.forEach((edge, i) => {
      if (edge.source === hoveredNodeId || edge.target === hoveredNodeId) {
        connectedEdges.add(`${edge.source}-${edge.target}-${i}`);
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      }
    });
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-[18px] border border-border-subtle bg-bg-card p-0 transition-colors duration-300 hover:border-border ${isFullscreen ? 'h-screen w-screen rounded-none border-none' : 'min-h-[520px]'}`}
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-2 text-[0.82rem] font-semibold text-text-primary">
          <span className="animate-nav-pulse h-2 w-2 rounded-full bg-flow"></span>
          Live Knowledge Graph
        </div>
        <div className="flex gap-1.5 relative z-20">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className={`rounded-lg border px-3 py-1.5 text-[0.68rem] transition-all duration-200 ${isFilterOpen ? 'bg-bg-card-hover border-primary text-text-primary' : 'bg-transparent border-border text-text-secondary hover:border-primary hover:bg-bg-card-hover hover:text-text-primary'}`}
            >
              👁️ Filter
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-bg-panel/95 backdrop-blur-md border border-border rounded-xl shadow-2xl z-50 p-3"
                >
                  <div className="text-[0.65rem] font-bold tracking-wider text-text-muted mb-2 uppercase">Node Types</div>
                  <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                    {allTypes.map(type => (
                      <label key={type} className="flex items-center gap-2.5 p-1.5 hover:bg-bg-card-hover rounded-lg cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={visibleTypes.has(type)}
                          onChange={(e) => {
                            const newSet = new Set(visibleTypes);
                            if (e.target.checked) newSet.add(type);
                            else newSet.delete(type);
                            setVisibleTypes(newSet);
                          }}
                          className="h-3.5 w-3.5 accent-primary cursor-pointer"
                        />
                        <span className="text-xs text-text-secondary capitalize">{type.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={handleZoomIn} className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-[0.68rem] text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-card-hover hover:text-text-primary">
            ➕ Zoom In
          </button>
          <button onClick={handleZoomOut} className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-[0.68rem] text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-card-hover hover:text-text-primary">
            ➖ Zoom Out
          </button>
          <button onClick={handleFitGraph} className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-[0.68rem] text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-card-hover hover:text-text-primary">
            ⛶ Fit Graph
          </button>
          <button onClick={handleReset} className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-[0.68rem] text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-card-hover hover:text-text-primary">
            🎯 Reset
          </button>
          <button onClick={toggleFullscreen} className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-[0.68rem] text-text-secondary transition-all duration-200 hover:border-primary hover:bg-bg-card-hover hover:text-text-primary">
            {isFullscreen ? '↙️ Exit Fullscreen' : '↗️ Fullscreen'}
          </button>
        </div>
      </div>
      
      <div className={`relative w-full overflow-hidden ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[480px]'}`}>
        {/* Tooltip Overlay */}
        <AnimatePresence>
          {tooltip.visible && tooltip.node && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 pointer-events-none bg-bg-panel/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-2xl min-w-[160px]"
              style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{NODE_STYLE[tooltip.node.node_type]?.icon || "🏦"}</span>
                <div className="text-sm font-bold text-text-primary truncate">{tooltip.node.label}</div>
              </div>
              <div className="text-[0.65rem] uppercase tracking-wider text-text-muted mb-2 pb-2 border-b border-border-subtle">
                {tooltip.node.node_type.replace('_', ' ')}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[0.7rem] text-text-secondary">Risk Score:</div>
                <div className="text-[0.75rem] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${riskColor(tooltip.node.risk_score)}20`, color: riskColor(tooltip.node.risk_score) }}>
                  {(tooltip.node.risk_score * 100).toFixed(0)}%
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Grid - Stays fixed */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
          <defs>
            <radialGradient id="bgGrad">
              <stop offset="0%" style={{ stopColor: '#1E293B', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#020617', stopOpacity: 0 }} />
            </radialGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(${position.x % 40}, ${position.y % 40}) scale(${scale})`}>
              <circle cx="20" cy="20" r={0.5 / scale} fill={Theme.BORDER_SUBTLE} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="var(--color-bg-card)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Interactive Graph */}
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className={`absolute inset-0 h-full w-full z-10 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <g 
            transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
            className={isTransitioning ? "transition-transform duration-300 ease-out" : ""}
          >
            <AnimatePresence>
              {/* Edges */}
              {filteredEdges.map((edge, i) => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src || !tgt) return null;

                const style = EDGE_STYLE[edge.edge_type] || EDGE_STYLE["transaction"];
                const dash = style.dashed ? "6,4" : undefined;
                
                const edgeId = `${edge.source}-${edge.target}-${i}`;
                const isDimmed = hoveredNodeId && !connectedEdges.has(edgeId);
                const baseOpacity = isDimmed ? 0.05 : (hoveredNodeId ? 0.8 : 0.5);

                const mx = (src.x + tgt.x) / 2;
                const my = (src.y + tgt.y) / 2 - 20;
                const path = `M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`;

                const isSuspicious = ["suspicious_transaction", "rapid_transfer", "layering"].includes(edge.edge_type);

                return (
                  <motion.g 
                    key={edgeId}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <motion.path 
                      d={path} 
                      stroke={style.color} 
                      strokeWidth={style.width / scale}
                      fill="none" 
                      strokeDasharray={dash} 
                      className="stroke-linecap-round transition-all duration-300"
                      animate={{ strokeOpacity: baseOpacity }}
                    />
                    {edge.amount && edge.amount > 0 && (
                      <motion.text 
                        x={mx} 
                        y={my - 8} 
                        fontSize={8 / scale} 
                        fill={Theme.TEXT_MUTED} 
                        textAnchor="middle" 
                        fontFamily="Inter, sans-serif"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDimmed ? 0.1 : 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        ₹{edge.amount.toLocaleString()}
                      </motion.text>
                    )}
                    {isSuspicious && !isDimmed && (
                      <circle r={3 / scale} fill={style.color} opacity="0.8">
                        <animateMotion dur={`${(Math.random() * 2 + 2).toFixed(1)}s`} repeatCount="indefinite" path={path} />
                      </circle>
                    )}
                  </motion.g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map(node => {
                const style = NODE_STYLE[node.node_type] || NODE_STYLE["account"];
                const r = style.size / 2 + 4;
                const color = style.color;
                const borderColor = style.border || color;
                const labelShort = node.label.length > 18 ? node.label.substring(0, 18) + "…" : node.label;

                const isDimmed = hoveredNodeId && !connectedNodes.has(node.id);
                const nodeOpacity = isDimmed ? 0.15 : 1;

                return (
                  <motion.g 
                    key={`node-${node.id}`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      onNodeClick?.(node);
                    }}
                    onMouseEnter={(e: any) => {
                      if (isDragging) return;
                      setHoveredNodeId(node.id);
                      const rect = svgRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltip({
                          visible: true,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                          node
                        });
                      }
                    }}
                    onMouseMove={(e: any) => {
                      if (isDragging) return;
                      const rect = svgRef.current?.getBoundingClientRect();
                      if (rect) {
                        setTooltip(prev => ({
                          ...prev,
                          x: e.clientX - rect.left,
                          y: e.clientY - rect.top,
                        }));
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoveredNodeId === node.id) {
                        setHoveredNodeId(null);
                        setTooltip(prev => ({ ...prev, visible: false }));
                      }
                    }}
                    className="cursor-pointer"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: nodeOpacity, scale: isDimmed ? 0.95 : 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
                  >
                    {(node.flagged || node.risk_score > 0.7) && !isDimmed && (
                      <circle cx={node.x} cy={node.y} stroke={riskColor(node.risk_score)} r={r + 4} fill="none" strokeWidth={2 / scale} opacity="0.3" className="animate-ring-expand" />
                    )}
                    <circle cx={node.x} cy={node.y} r={r} fill={color} opacity="0.2" stroke={borderColor} strokeWidth={1.5 / scale} className="transition-all duration-300 hover:brightness-125" />
                    <circle cx={node.x} cy={node.y} r={r * 0.55} fill={color} opacity="0.9" />
                    <text x={node.x} y={node.y + r + 14 / scale} fontSize={9 / scale} fill={Theme.TEXT_SECONDARY} textAnchor="middle" pointerEvents="none" fontFamily="Inter, sans-serif">
                      {labelShort}
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </g>
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-border-subtle px-5 py-3">
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#3B82F6]"></div> Account</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#F97316]"></div> Mule Account</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#EF4444]"></div> Phishing Domain</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#F43F5E]"></div> Shell Company</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#06B6D4]"></div> Investigator Focus</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-2 w-2 rounded-full bg-[#94A3B8]"></div> Device / IP</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-0.5 w-4 rounded-sm bg-[#06B6D4]"></div> Transaction</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-0.5 w-4 rounded-sm bg-[#F97316]"></div> Suspicious</div>
        <div className="flex items-center gap-1.5 text-[0.65rem] text-text-muted"><div className="h-0 w-4 border-t-2 border-dashed border-[#EF4444]"></div> Attack Link</div>
      </div>
    </div>
  );
};
