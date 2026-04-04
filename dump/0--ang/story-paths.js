/**
 * Story Paths - Interactive Narrative Navigation
 * Traces and visualizes connected narrative sequences
 */

export class StoryPaths {
  constructor(angEngine, narrativeComponents) {
    this.angEngine = angEngine;
    this.narrativeComponents = narrativeComponents;
    this.activePaths = new Map();
    this.pathHistory = [];
    this.currentPath = null;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for narrative navigation events
    document.addEventListener('ang:navigate-to', (event) => {
      this.followPath(event.detail.target);
    });

    document.addEventListener('ang:narrative-selected', (event) => {
      this.exploreNarrativeType(event.detail);
    });

    document.addEventListener('ang:path-discovered', (event) => {
      this.addDiscoveredPath(event.detail);
    });
  }

  // Path Discovery and Analysis
  discoverAllPaths() {
    this.activePaths.clear();
    
    // Find all narrative sequences
    const narrativeSequences = this.findNarrativeSequences();
    
    // Group by narrative type and concept
    const pathsByType = this.groupPathsByNarrative(narrativeSequences);
    
    // Analyze path characteristics
    pathsByType.forEach((paths, narrativeType) => {
      this.activePaths.set(narrativeType, {
        type: narrativeType,
        paths: paths,
        totalNodes: paths.reduce((sum, path) => sum + path.nodes.length, 0),
        complexity: this.calculatePathComplexity(paths),
        entry_points: this.findEntryPoints(paths),
        exit_points: this.findExitPoints(paths)
      });
    });

    this.renderPathExplorer();
    return this.activePaths;
  }

  findNarrativeSequences() {
    const sequences = [];
    const visited = new Set();

    this.angEngine.nodes.forEach(node => {
      if (visited.has(node.id)) return;

      const sequence = this.traceSequence(node, visited);
      if (sequence.length > 1) {
        sequences.push({
          id: `seq-${sequences.length}`,
          nodes: sequence,
          narrativeType: sequence[0].primaryNarrative,
          concept: sequence[0].primaryConcept,
          length: sequence.length,
          complexity: this.calculateSequenceComplexity(sequence)
        });
      }
    });

    return sequences;
  }

  traceSequence(startNode, visited, sequence = []) {
    if (visited.has(startNode.id)) return sequence;

    visited.add(startNode.id);
    
    // Add narrative metadata to node
    const nodeWithMeta = {
      ...startNode,
      primaryNarrative: startNode.narratives?.[0]?.narrativeType || 'ungrouped',
      primaryConcept: startNode.narratives?.[0]?.concept || 'default',
      sequenceIndex: sequence.length
    };
    
    sequence.push(nodeWithMeta);

    // Find outgoing narrative connections
    const outgoingLinks = this.angEngine.links.filter(link => 
      link.source.id === startNode.id && link.type === 'ang'
    );

    // Follow the strongest narrative connection
    const strongestLink = outgoingLinks.reduce((strongest, link) => {
      if (!strongest) return link;
      return this.getLinkStrength(link) > this.getLinkStrength(strongest) ? link : strongest;
    }, null);

    if (strongestLink) {
      const targetNode = this.angEngine.nodes.find(n => n.id === strongestLink.target);
      if (targetNode && !visited.has(targetNode.id)) {
        this.traceSequence(targetNode, visited, sequence);
      }
    }

    return sequence;
  }

  getLinkStrength(link) {
    const strengthMap = {
      '->': 1.0,
      '<->': 0.8,
      '~>': 0.6,
      '!>': 0.4
    };
    return strengthMap[link.relationship] || 0.5;
  }

  groupPathsByNarrative(sequences) {
    const grouped = new Map();
    
    sequences.forEach(sequence => {
      const type = sequence.narrativeType;
      if (!grouped.has(type)) {
        grouped.set(type, []);
      }
      grouped.get(type).push(sequence);
    });

    return grouped;
  }

  calculatePathComplexity(paths) {
    const totalNodes = paths.reduce((sum, path) => sum + path.nodes.length, 0);
    const totalConnections = paths.reduce((sum, path) => sum + (path.nodes.length - 1), 0);
    const branchingFactor = totalConnections > 0 ? totalNodes / totalConnections : 1;
    
    return {
      totalNodes,
      totalConnections,
      branchingFactor,
      averagePathLength: totalNodes / paths.length,
      maxPathLength: Math.max(...paths.map(p => p.nodes.length))
    };
  }

  calculateSequenceComplexity(sequence) {
    // Based on code complexity, narrative density, and connection types
    let complexity = 0;
    
    sequence.forEach(node => {
      // Base complexity from code
      complexity += node.text.split('\n').length * 0.1;
      
      // Narrative density bonus
      complexity += (node.narratives?.length || 0) * 0.5;
      
      // Cross-language bonus
      if (node.title.includes('.py') || node.title.includes('.coem')) {
        complexity += 0.3;
      }
    });
    
    return complexity;
  }

  findEntryPoints(paths) {
    // Nodes that start narrative sequences
    const entryPoints = new Set();
    
    paths.forEach(path => {
      if (path.nodes.length > 0) {
        entryPoints.add(path.nodes[0]);
      }
    });
    
    return Array.from(entryPoints);
  }

  findExitPoints(paths) {
    // Nodes that end narrative sequences
    const exitPoints = new Set();
    
    paths.forEach(path => {
      if (path.nodes.length > 0) {
        exitPoints.add(path.nodes[path.nodes.length - 1]);
      }
    });
    
    return Array.from(exitPoints);
  }

  // Interactive Navigation
  followPath(targetId) {
    const targetNode = this.angEngine.nodes.find(n => n.id === targetId);
    if (!targetNode) return;

    // Find all paths that include this target
    const relevantPaths = this.findPathsContaining(targetId);
    
    if (relevantPaths.length === 0) {
      console.log('No narrative paths found for target:', targetId);
      return;
    }

    // Select the most relevant path
    const selectedPath = this.selectBestPath(relevantPaths, targetId);
    this.navigateToPath(selectedPath);
  }

  findPathsContaining(nodeId) {
    const containingPaths = [];
    
    this.activePaths.forEach((pathGroup, narrativeType) => {
      pathGroup.paths.forEach(path => {
        if (path.nodes.some(node => node.id === nodeId)) {
          containingPaths.push({
            ...path,
            narrativeType,
            nodeIndex: path.nodes.findIndex(node => node.id === nodeId)
          });
        }
      });
    });
    
    return containingPaths;
  }

  selectBestPath(paths, targetId) {
    // Prefer paths where target is not at the end (more to explore)
    return paths.reduce((best, path) => {
      if (!best) return path;
      
      const targetIndex = path.nodes.findIndex(n => n.id === targetId);
      const bestTargetIndex = best.nodes.findIndex(n => n.id === targetId);
      
      // Prefer paths with more nodes after the target
      const remainingNodes = path.nodes.length - targetIndex;
      const bestRemainingNodes = best.nodes.length - bestTargetIndex;
      
      return remainingNodes > bestRemainingNodes ? path : best;
    });
  }

  navigateToPath(path) {
    this.currentPath = path;
    this.pathHistory.push(path);
    
    // Update UI
    this.renderCurrentPath();
    this.highlightPathInGraph();
    
    // Emit navigation event
    document.dispatchEvent(new CustomEvent('ang:path-navigated', {
      detail: { path }
    }));
  }

  exploreNarrativeType(narrativeType) {
    const pathGroup = this.activePaths.get(narrativeType);
    if (!pathGroup) return;

    // Find the most interesting path to start with
    const startingPath = pathGroup.paths.reduce((best, path) => {
      if (!best) return path;
      return path.complexity > best.complexity ? path : best;
    });

    this.navigateToPath(startingPath);
  }

  // Rendering
  renderPathExplorer() {
    const container = document.getElementById('story-paths');
    if (!container) return;

    const pathList = container.querySelector('.path-list');
    if (!pathList) return;

    pathList.innerHTML = '';

    this.activePaths.forEach((pathGroup, narrativeType) => {
      const section = this.createPathSection(narrativeType, pathGroup);
      pathList.appendChild(section);
    });
  }

  createPathSection(narrativeType, pathGroup) {
    const section = document.createElement('div');
    section.className = `path-section narrative-${narrativeType}`;
    
    const header = document.createElement('div');
    header.className = 'path-section-header';
    header.innerHTML = `
      <h5>${this.getNarrativeIcon(narrativeType)} ${narrativeType}</h5>
      <span class="path-count">${pathGroup.paths.length} paths</span>
    `;
    
    const pathsList = document.createElement('div');
    pathsList.className = 'paths-list';
    
    pathGroup.paths.forEach((path, index) => {
      const pathItem = this.createPathItem(path, index);
      pathsList.appendChild(pathItem);
    });
    
    section.appendChild(header);
    section.appendChild(pathsList);
    
    return section;
  }

  createPathItem(path, index) {
    const item = document.createElement('div');
    item.className = 'path-item';
    item.innerHTML = `
      <div class="path-header">
        <span class="path-title">${path.concept || 'Untitled'}</span>
        <span class="path-length">${path.nodes.length} nodes</span>
      </div>
      <div class="path-preview">
        ${path.nodes.slice(0, 3).map(node => 
          `<span class="node-preview">${node.title}</span>`
        ).join(' → ')}
        ${path.nodes.length > 3 ? '...' : ''}
      </div>
    `;
    
    item.addEventListener('click', () => {
      this.navigateToPath(path);
    });
    
    return item;
  }

  renderCurrentPath() {
    if (!this.currentPath) return;
    
    const container = document.getElementById('story-paths');
    if (!container) return;

    // Create or update current path display
    let currentPathDisplay = container.querySelector('.current-path');
    if (!currentPathDisplay) {
      currentPathDisplay = document.createElement('div');
      currentPathDisplay.className = 'current-path';
      container.insertBefore(currentPathDisplay, container.firstChild);
    }

    currentPathDisplay.innerHTML = `
      <div class="current-path-header">
        <h4>Current Path</h4>
        <button class="close-path" onclick="this.closest('.current-path').remove()">×</button>
      </div>
      <div class="path-navigation">
        ${this.currentPath.nodes.map((node, index) => `
          <div class="path-node ${index === 0 ? 'current' : ''}" 
               data-node-id="${node.id}">
            <span class="node-title">${node.title}</span>
            <span class="node-index">${index + 1}</span>
          </div>
        `).join('')}
      </div>
      <div class="path-controls">
        <button class="prev-node" ${this.currentPath.nodes.length <= 1 ? 'disabled' : ''}>
          ← Previous
        </button>
        <button class="next-node" ${this.currentPath.nodes.length <= 1 ? 'disabled' : ''}>
          Next →
        </button>
      </div>
    `;

    // Add navigation event listeners
    this.addPathNavigationListeners(currentPathDisplay);
  }

  addPathNavigationListeners(container) {
    const prevBtn = container.querySelector('.prev-node');
    const nextBtn = container.querySelector('.next-node');
    const pathNodes = container.querySelectorAll('.path-node');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateToPreviousNode());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateToNextNode());
    }

    pathNodes.forEach(nodeElement => {
      nodeElement.addEventListener('click', (e) => {
        const nodeId = e.target.closest('.path-node').dataset.nodeId;
        this.navigateToNode(nodeId);
      });
    });
  }

  navigateToPreviousNode() {
    if (!this.currentPath) return;
    
    const currentIndex = this.getCurrentNodeIndex();
    if (currentIndex > 0) {
      this.navigateToNodeAtIndex(currentIndex - 1);
    }
  }

  navigateToNextNode() {
    if (!this.currentPath) return;
    
    const currentIndex = this.getCurrentNodeIndex();
    if (currentIndex < this.currentPath.nodes.length - 1) {
      this.navigateToNodeAtIndex(currentIndex + 1);
    }
  }

  navigateToNode(nodeId) {
    if (!this.currentPath) return;
    
    const nodeIndex = this.currentPath.nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex !== -1) {
      this.navigateToNodeAtIndex(nodeIndex);
    }
  }

  navigateToNodeAtIndex(index) {
    if (!this.currentPath || index < 0 || index >= this.currentPath.nodes.length) return;
    
    const node = this.currentPath.nodes[index];
    
    // Update current node indicator
    const pathNodes = document.querySelectorAll('.path-node');
    pathNodes.forEach((el, i) => {
      el.classList.toggle('current', i === index);
    });

    // Focus node in graph
    this.angEngine.focusNode(node.id);
    
    // Show node details
    document.dispatchEvent(new CustomEvent('ang:node-clicked', {
      detail: node
    }));
  }

  getCurrentNodeIndex() {
    const currentNode = document.querySelector('.path-node.current');
    if (!currentNode) return 0;
    
    const allNodes = document.querySelectorAll('.path-node');
    return Array.from(allNodes).indexOf(currentNode);
  }

  highlightPathInGraph() {
    if (!this.currentPath) return;
    
    // Get all node IDs in the current path
    const pathNodeIds = this.currentPath.nodes.map(n => n.id);
    
    // Highlight nodes and connections in the graph
    this.angEngine.nodeElements?.style('opacity', d => 
      pathNodeIds.includes(d.id) ? 1 : 0.3
    );
    
    this.angEngine.linkElements?.style('opacity', d => 
      pathNodeIds.includes(d.source.id) && pathNodeIds.includes(d.target.id) ? 1 : 0.1
    );
  }

  // Utility methods
  getNarrativeIcon(narrativeType) {
    const icons = {
      exploration: '🧭',
      variation: '🔄',
      learning: '📚',
      constraint: '🎯',
      translation: '🌉'
    };
    return icons[narrativeType] || '📖';
  }

  addDiscoveredPath(pathData) {
    // Add newly discovered paths during exploration
    const narrativeType = pathData.narrativeType;
    
    if (!this.activePaths.has(narrativeType)) {
      this.activePaths.set(narrativeType, {
        type: narrativeType,
        paths: [],
        totalNodes: 0,
        complexity: { totalNodes: 0, totalConnections: 0 },
        entry_points: [],
        exit_points: []
      });
    }
    
    this.activePaths.get(narrativeType).paths.push(pathData);
    this.renderPathExplorer();
  }

  // Public API
  getActivePaths() {
    return this.activePaths;
  }

  getCurrentPath() {
    return this.currentPath;
  }

  getPathHistory() {
    return this.pathHistory;
  }

  clearCurrentPath() {
    this.currentPath = null;
    const currentPathDisplay = document.querySelector('.current-path');
    if (currentPathDisplay) {
      currentPathDisplay.remove();
    }
    
    // Reset graph highlighting
    this.angEngine.clearHighlight();
  }
}