/**
 * Abstract Narrative Graph Engine
 * D3-powered visualization with narrative-aware layouts
 */

export class ANGEngine {
  constructor(container, width = window.innerWidth, height = window.innerHeight) {
    this.container = container;
    this.width = width;
    this.height = height;
    
    this.setupSVG();
    this.setupForces();
    this.setupNarrativeStyles();
    
    this.nodes = [];
    this.links = [];
    this.narrativeGraph = new Map();
  }

  setupSVG() {
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'ang-canvas');

    // Add zoom and pan
    this.g = this.svg.append('g');
    this.svg.call(d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      }));

    // Create layers for different elements
    this.linkLayer = this.g.append('g').attr('class', 'links');
    this.nodeLayer = this.g.append('g').attr('class', 'nodes');
    this.labelLayer = this.g.append('g').attr('class', 'labels');
    this.narrativeLayer = this.g.append('g').attr('class', 'narratives');
  }

  setupForces() {
    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(30))
      .alphaDecay(0.01);
  }

  setupNarrativeStyles() {
    this.narrativeColors = {
      exploration: '#3498db',     // Blue for discovery
      variation: '#2ecc71',       // Green for alternatives  
      learning: '#f39c12',        // Orange for progression
      constraint: '#e74c3c',      // Red for limitations
      translation: '#9b59b6'      // Purple for bridges
    };

    this.relationshipStyles = {
      '->': { stroke: 'solid', marker: 'arrow' },
      '<->': { stroke: 'solid', marker: 'double-arrow' },
      '~>': { stroke: 'dashed', marker: 'suggestion' },
      '!>': { stroke: 'bold', marker: 'contrast' }
    };
  }

  loadData(snippetsData, linksData) {
    // Parse existing snippet data
    this.nodes = snippetsData.map(snippet => ({
      id: snippet.title,
      title: snippet.title,
      text: snippet.text,
      tags: snippet.tags || [],
      type: 'snippet',
      narratives: this.parseANGAnnotations(snippet.text),
      radius: this.calculateNodeRadius(snippet),
      color: this.calculateNodeColor(snippet)
    }));

    // Parse existing links + extract ANG relationships
    this.links = linksData.map(link => ({
      source: link.from,
      target: link.to,
      type: link.type,
      narrativeType: this.mapLinkToNarrative(link.type)
    }));

    // Add ANG-specific links from annotations
    this.extractANGLinks();
    
    this.buildNarrativeGraph();
    this.render();
  }

  parseANGAnnotations(text) {
    const angPattern = /\/\/\s*ANG:\s*([^->~!<]+)(->|<->|~>|!>|<-)\s*([^\n\r]+)/g;
    const annotations = [];
    let match;

    while ((match = angPattern.exec(text)) !== null) {
      const [, narrative, relationship, target] = match;
      const [narrativeType, concept, context] = narrative.trim().split('.');
      
      annotations.push({
        narrativeType,
        concept: concept || '',
        context: context || '',
        relationship: relationship.trim(),
        target: target.trim()
      });
    }

    return annotations;
  }

  calculateNodeRadius(snippet) {
    const baseRadius = 8;
    const tagBonus = (snippet.tags?.length || 0) * 2;
    const narrativeBonus = (snippet.narratives?.length || 0) * 3;
    const textComplexity = Math.min(snippet.text.length / 100, 10);
    
    return baseRadius + tagBonus + narrativeBonus + textComplexity;
  }

  calculateNodeColor(snippet) {
    const narratives = snippet.narratives || [];
    if (narratives.length === 0) return '#95a5a6'; // Gray for no narratives
    
    // Use the primary narrative type for color
    const primaryNarrative = narratives[0]?.narrativeType;
    return this.narrativeColors[primaryNarrative] || '#95a5a6';
  }

  mapLinkToNarrative(linkType) {
    const mapping = {
      'forelink': 'learning',
      'metalink': 'exploration', 
      'aftlink': 'learning',
      'tag': 'constraint',
      'variation': 'variation'
    };
    return mapping[linkType] || 'exploration';
  }

  extractANGLinks() {
    this.nodes.forEach(node => {
      node.narratives.forEach(annotation => {
        this.links.push({
          source: node.id,
          target: annotation.target,
          type: 'ang',
          narrativeType: annotation.narrativeType,
          relationship: annotation.relationship,
          concept: annotation.concept,
          context: annotation.context
        });
      });
    });
  }

  buildNarrativeGraph() {
    // Group nodes by narrative types for specialized layouts
    this.narrativeGroups = d3.group(this.nodes, d => {
      const narratives = d.narratives || [];
      return narratives[0]?.narrativeType || 'ungrouped';
    });

    // Create narrative-specific forces
    this.setupNarrativeForces();
  }

  setupNarrativeForces() {
    // Learning progression: hierarchical layout
    const learningNodes = this.narrativeGroups.get('learning') || [];
    if (learningNodes.length > 0) {
      this.simulation.force('learning-hierarchy', 
        d3.forceY().y(d => d.narratives?.some(n => n.concept === 'progression') ? 100 : 400)
          .strength(0.1)
      );
    }

    // Variation clustering: group similar concepts  
    const variationNodes = this.narrativeGroups.get('variation') || [];
    if (variationNodes.length > 0) {
      this.simulation.force('variation-cluster',
        d3.forceCluster()
          .centers(d => d.narratives?.find(n => n.concept)?.concept || 'default')
          .strength(0.2)
      );
    }

    // Constraint compression: tighter layouts
    const constraintNodes = this.narrativeGroups.get('constraint') || [];
    if (constraintNodes.length > 0) {
      this.simulation.force('constraint-compression',
        d3.forceManyBody()
          .strength(d => d.narratives?.some(n => n.narrativeType === 'constraint') ? -100 : -300)
      );
    }
  }

  render() {
    this.renderLinks();
    this.renderNodes();
    this.renderLabels();
    this.renderNarrativePaths();
    
    this.simulation
      .nodes(this.nodes)
      .force('link', d3.forceLink(this.links)
        .id(d => d.id)
        .distance(this.calculateLinkDistance.bind(this))
        .strength(this.calculateLinkStrength.bind(this))
      );

    this.simulation.on('tick', () => this.tick());
  }

  renderLinks() {
    this.linkElements = this.linkLayer
      .selectAll('.link')
      .data(this.links)
      .join('line')
      .attr('class', d => `link link-${d.type} narrative-${d.narrativeType}`)
      .attr('stroke-width', d => this.calculateLinkWidth(d))
      .attr('stroke', d => this.calculateLinkColor(d))
      .attr('stroke-dasharray', d => this.calculateLinkDash(d))
      .attr('marker-end', d => `url(#${d.relationship || 'arrow'})`);
  }

  renderNodes() {
    this.nodeElements = this.nodeLayer
      .selectAll('.node')
      .data(this.nodes)
      .join('circle')
      .attr('class', d => `node node-${d.type}`)
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(this.createDragBehavior());

    // Add hover interactions
    this.nodeElements
      .on('mouseover', (event, d) => this.highlightNarrative(d))
      .on('mouseout', () => this.clearHighlight())
      .on('click', (event, d) => this.showNarrativeDetails(d));
  }

  renderLabels() {
    this.labelElements = this.labelLayer
      .selectAll('.label')
      .data(this.nodes)
      .join('text')
      .attr('class', 'label')
      .text(d => d.title)
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', '#2c3e50');
  }

  renderNarrativePaths() {
    // Create visual paths for narrative connections
    const narrativePaths = this.extractNarrativePaths();
    
    this.pathElements = this.narrativeLayer
      .selectAll('.narrative-path')
      .data(narrativePaths)
      .join('path')
      .attr('class', d => `narrative-path narrative-${d.type}`)
      .attr('fill', 'none')
      .attr('stroke', d => this.narrativeColors[d.type])
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '5,5');
  }

  calculateLinkDistance(link) {
    const narrativeMultipliers = {
      learning: 80,     // Hierarchical spacing
      variation: 60,    // Close variations
      exploration: 100, // Spread out discoveries
      constraint: 40,   // Tight constraints
      translation: 70   // Bridge spacing
    };
    
    return narrativeMultipliers[link.narrativeType] || 80;
  }

  calculateLinkStrength(link) {
    const strengthMap = {
      'ang': 0.8,
      'forelink': 0.6,
      'metalink': 0.4,
      'aftlink': 0.6,
      'tag': 0.3
    };
    
    return strengthMap[link.type] || 0.5;
  }

  calculateLinkWidth(link) {
    const widthMap = {
      '->': 2,
      '<->': 3,
      '~>': 1.5,
      '!>': 4
    };
    
    return widthMap[link.relationship] || 2;
  }

  calculateLinkColor(link) {
    if (link.type === 'ang') {
      return this.narrativeColors[link.narrativeType] || '#95a5a6';
    }
    
    const colorMap = {
      'forelink': '#2ecc71',
      'metalink': '#9b59b6', 
      'aftlink': '#f39c12',
      'tag': '#3498db'
    };
    
    return colorMap[link.type] || '#95a5a6';
  }

  calculateLinkDash(link) {
    const dashMap = {
      '~>': '5,5',
      '!>': '10,2'
    };
    
    return dashMap[link.relationship] || 'none';
  }

  tick() {
    this.linkElements
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    this.labelElements
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.radius + 12);

    if (this.pathElements) {
      this.pathElements.attr('d', d => this.generateNarrativePath(d));
    }
  }

  highlightNarrative(node) {
    // Highlight all nodes and links in the same narrative
    const relatedNodes = new Set();
    const relatedLinks = new Set();
    
    node.narratives.forEach(narrative => {
      this.nodes.forEach(n => {
        if (n.narratives.some(na => 
          na.narrativeType === narrative.narrativeType && 
          na.concept === narrative.concept
        )) {
          relatedNodes.add(n.id);
        }
      });
    });

    this.links.forEach(link => {
      if (relatedNodes.has(link.source.id) || relatedNodes.has(link.target.id)) {
        relatedLinks.add(link);
      }
    });

    // Apply highlighting
    this.nodeElements.style('opacity', d => relatedNodes.has(d.id) ? 1 : 0.2);
    this.linkElements.style('opacity', d => relatedLinks.has(d) ? 1 : 0.1);
    this.labelElements.style('opacity', d => relatedNodes.has(d.id) ? 1 : 0.2);
  }

  clearHighlight() {
    this.nodeElements.style('opacity', 1);
    this.linkElements.style('opacity', 1);  
    this.labelElements.style('opacity', 1);
  }

  createDragBehavior() {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  extractNarrativePaths() {
    // Find connected sequences of narrative relationships
    const paths = [];
    const visited = new Set();

    this.nodes.forEach(startNode => {
      if (visited.has(startNode.id)) return;

      const path = this.traceNarrativePath(startNode, visited);
      if (path.length > 2) {
        paths.push({
          type: path[0].narrativeType,
          nodes: path,
          concept: path[0].concept
        });
      }
    });

    return paths;
  }

  traceNarrativePath(startNode, visited, path = [], currentNarrative = null) {
    if (visited.has(startNode.id)) return path;
    
    visited.add(startNode.id);
    path.push(startNode);

    // Find next nodes in the same narrative
    const nextNodes = this.links
      .filter(link => 
        link.source.id === startNode.id && 
        link.narrativeType === (currentNarrative || startNode.narratives[0]?.narrativeType)
      )
      .map(link => this.nodes.find(n => n.id === link.target));

    for (const nextNode of nextNodes) {
      if (nextNode && !visited.has(nextNode.id)) {
        this.traceNarrativePath(nextNode, visited, path, currentNarrative);
      }
    }

    return path;
  }

  generateNarrativePath(pathData) {
    const nodes = pathData.nodes;
    if (nodes.length < 2) return '';

    const line = d3.line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveCatmullRom.alpha(0.5));

    return line(nodes);
  }

  showNarrativeDetails(node) {
    // This would integrate with the component system
    // For now, just log the narrative information
    console.group(`📖 Narrative Details: ${node.title}`);
    
    if (node.narratives.length === 0) {
      console.log('No ANG annotations found');
    } else {
      node.narratives.forEach(narrative => {
        console.log(`🧭 ${narrative.narrativeType}.${narrative.concept}.${narrative.context}`);
        console.log(`   ${narrative.relationship} ${narrative.target}`);
      });
    }
    
    console.groupEnd();
  }

  // Additional methods for UI integration
  resetZoom() {
    this.svg.transition().duration(750).call(
      d3.zoom().transform,
      d3.zoomIdentity
    );
  }

  focusNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.svg.transition().duration(750).call(
      d3.zoom().transform,
      d3.zoomIdentity.translate(
        this.width / 2 - node.x,
        this.height / 2 - node.y
      ).scale(1.5)
    );
  }

  filterByNarrative(narrativeType) {
    if (narrativeType === 'all') {
      this.nodeElements.style('opacity', 1);
      this.linkElements.style('opacity', 1);
      this.labelElements.style('opacity', 1);
      return;
    }

    this.nodeElements.style('opacity', d => {
      const hasNarrative = d.narratives?.some(n => n.narrativeType === narrativeType);
      return hasNarrative ? 1 : 0.2;
    });

    this.linkElements.style('opacity', d => {
      return d.narrativeType === narrativeType ? 1 : 0.1;
    });

    this.labelElements.style('opacity', d => {
      const hasNarrative = d.narratives?.some(n => n.narrativeType === narrativeType);
      return hasNarrative ? 1 : 0.2;
    });
  }

  highlightByTag(tag) {
    this.nodeElements.style('opacity', d => {
      const hasTag = d.tags?.includes(tag);
      return hasTag ? 1 : 0.2;
    });

    this.linkElements.style('opacity', d => {
      const sourceHasTag = d.source.tags?.includes(tag);
      const targetHasTag = d.target.tags?.includes(tag);
      return sourceHasTag || targetHasTag ? 1 : 0.1;
    });
  }

  toggleLabels() {
    const currentOpacity = this.labelElements.style('opacity');
    const newOpacity = currentOpacity === '0' ? '1' : '0';
    this.labelElements.style('opacity', newOpacity);
    return newOpacity === '1';
  }

  togglePaths() {
    if (!this.pathElements) return false;
    
    const currentOpacity = this.pathElements.style('opacity');
    const newOpacity = currentOpacity === '0' ? '0.3' : '0';
    this.pathElements.style('opacity', newOpacity);
    return newOpacity !== '0';
  }

  setForceStrength(strength) {
    this.simulation.force('charge').strength(-300 * strength);
    this.simulation.alpha(0.3).restart();
  }

  setLinkDistance(distance) {
    this.simulation.force('link').distance(distance);
    this.simulation.alpha(0.3).restart();
  }

  setNodeRepulsion(repulsion) {
    this.simulation.force('charge').strength(-repulsion);
    this.simulation.alpha(0.3).restart();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height);
    
    this.simulation
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .alpha(0.3)
      .restart();
  }
}

// Custom force for clustering variations
d3.forceCluster = function() {
  let nodes,
      centers = [],
      strength = 0.1;

  function force(alpha) {
    nodes.forEach(node => {
      const center = centers[node.cluster] || { x: 0, y: 0 };
      node.vx += (center.x - node.x) * strength * alpha;
      node.vy += (center.y - node.y) * strength * alpha;
    });
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.centers = function(_) {
    return arguments.length ? (centers = _, force) : centers;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = _, force) : strength;
  };

  return force;
};