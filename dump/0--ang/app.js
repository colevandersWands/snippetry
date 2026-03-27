/**
 * ANG Explorer Application
 * Main orchestrator for the Abstract Narrative Graph visualization
 */

import { ANGEngine } from './graph-engine.js';
import { NarrativeComponents } from './narrative-components.js';
import { StoryPaths } from './story-paths.js';

class ANGExplorer {
  constructor() {
    this.angEngine = null;
    this.narrativeComponents = null;
    this.storyPaths = null;
    this.currentFilter = 'all';
    this.dataLoaded = false;
    
    this.init();
  }

  async init() {
    try {
      // Show loading indicator
      this.showLoading();
      
      // Initialize core components
      this.setupGraphEngine();
      this.setupNarrativeComponents();
      this.setupStoryPaths();
      
      // Load data
      await this.loadData();
      
      // Setup UI interactions
      this.setupUIControls();
      
      // Initialize visualization
      this.render();
      
      // Hide loading indicator
      this.hideLoading();
      
      console.log('🧭 ANG Explorer initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize ANG Explorer:', error);
      this.showError('Failed to load visualization. Please check console for details.');
    }
  }

  setupGraphEngine() {
    const container = document.getElementById('graph-canvas');
    if (!container) {
      throw new Error('Graph canvas container not found');
    }
    
    this.angEngine = new ANGEngine(container);
    
    // Listen for graph events
    document.addEventListener('ang:node-clicked', (event) => {
      this.handleNodeClick(event.detail);
    });
    
    document.addEventListener('ang:narrative-selected', (event) => {
      this.handleNarrativeSelection(event.detail);
    });
  }

  setupNarrativeComponents() {
    this.narrativeComponents = new NarrativeComponents(this.angEngine);
  }

  setupStoryPaths() {
    this.storyPaths = new StoryPaths(this.angEngine, this.narrativeComponents);
    
    // Listen for path navigation events
    document.addEventListener('ang:path-navigated', (event) => {
      this.handlePathNavigation(event.detail);
    });
  }

  async loadData() {
    try {
      // Load snippets and links data
      const [snippetsData, linksData] = await Promise.all([
        this.loadSnippetsData(),
        this.loadLinksData()
      ]);
      
      // Load data into graph engine
      this.angEngine.loadData(snippetsData, linksData);
      
      // Discover story paths
      this.storyPaths.discoverAllPaths();
      
      // Update statistics
      this.updateStatistics();
      
      this.dataLoaded = true;
      
    } catch (error) {
      console.error('Failed to load data:', error);
      throw new Error('Data loading failed');
    }
  }

  async loadSnippetsData() {
    try {
      const response = await fetch('../../../public/data/snippets.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.snippets || data;
    } catch (error) {
      console.warn('Failed to load snippets from server, using demo data');
      return this.getDemoSnippets();
    }
  }

  async loadLinksData() {
    try {
      const response = await fetch('../../../public/data/links.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.links || data;
    } catch (error) {
      console.warn('Failed to load links from server, using demo data');
      return this.getDemoLinks();
    }
  }

  getDemoSnippets() {
    // Demo data for testing when server data is unavailable
    return [
      {
        title: '10-print.1.js',
        text: `// ANG: exploration.recursion.pattern -> 10-print.2.js
// Basic 10 PRINT pattern
for (let i = 0; i < 100; i++) {
  console.log(Math.random() > 0.5 ? '/' : '\\\\');
}`,
        tags: ['pattern', 'recursive', 'beginner']
      },
      {
        title: '10-print.2.js',
        text: `// ANG: variation.implementation.visual -> 10-print.canvas.js
// ANG: learning.progression.next -> 10-print.3.js
// Visual 10 PRINT with canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
for (let x = 0; x < 400; x += 10) {
  for (let y = 0; y < 400; y += 10) {
    ctx.strokeText(Math.random() > 0.5 ? '/' : '\\\\', x, y);
  }
}`,
        tags: ['pattern', 'canvas', 'visual']
      },
      {
        title: 'fibonacci.recursive.js',
        text: `// ANG: exploration.recursion.classic -> fibonacci.iterative.js
// ANG: constraint.elegance.mathematical -> fibonacci.golf.js
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
        tags: ['recursion', 'mathematical', 'classic']
      },
      {
        title: 'fibonacci.iterative.js',
        text: `// ANG: variation.implementation.efficient -> fibonacci.recursive.js
// ANG: learning.optimization.performance -> fibonacci.memoized.js
function fib(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}`,
        tags: ['iteration', 'optimization', 'efficient']
      },
      {
        title: 'turtle.infinite.js',
        text: `// ANG: exploration.recursion.infinite -> turtle.controlled.js
// ANG: constraint.philosophical.paradox -> zeno.paradox.js
(function turtle() {
  console.log('🐢 all the way down');
  turtle();
})();`,
        tags: ['recursion', 'infinite', 'philosophical']
      }
    ];
  }

  getDemoLinks() {
    return [
      { from: '10-print.1.js', to: '10-print.2.js', type: 'forelink' },
      { from: '10-print.2.js', to: '10-print.canvas.js', type: 'variation' },
      { from: 'fibonacci.recursive.js', to: 'fibonacci.iterative.js', type: 'variation' },
      { from: 'fibonacci.iterative.js', to: 'fibonacci.memoized.js', type: 'aftlink' },
      { from: 'turtle.infinite.js', to: 'turtle.controlled.js', type: 'variation' }
    ];
  }

  setupUIControls() {
    // Narrative filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const narrativeType = e.target.dataset.narrative;
        this.setNarrativeFilter(narrativeType);
      });
    });

    // View control buttons
    const resetZoomBtn = document.getElementById('reset-zoom');
    if (resetZoomBtn) {
      resetZoomBtn.addEventListener('click', () => {
        this.angEngine.resetZoom();
      });
    }

    const toggleLabelsBtn = document.getElementById('toggle-labels');
    if (toggleLabelsBtn) {
      toggleLabelsBtn.addEventListener('click', () => {
        this.toggleLabels();
      });
    }

    const togglePathsBtn = document.getElementById('toggle-paths');
    if (togglePathsBtn) {
      togglePathsBtn.addEventListener('click', () => {
        this.togglePaths();
      });
    }

    // Graph control sliders
    const forceStrengthSlider = document.getElementById('force-strength');
    if (forceStrengthSlider) {
      forceStrengthSlider.addEventListener('input', (e) => {
        this.angEngine.setForceStrength(parseFloat(e.target.value));
      });
    }

    const linkDistanceSlider = document.getElementById('link-distance');
    if (linkDistanceSlider) {
      linkDistanceSlider.addEventListener('input', (e) => {
        this.angEngine.setLinkDistance(parseInt(e.target.value));
      });
    }

    const nodeRepulsionSlider = document.getElementById('node-repulsion');
    if (nodeRepulsionSlider) {
      nodeRepulsionSlider.addEventListener('input', (e) => {
        this.angEngine.setNodeRepulsion(parseInt(e.target.value));
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcut(e);
    });

    // Window resize handling
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  setNarrativeFilter(narrativeType) {
    this.currentFilter = narrativeType;
    
    // Update button states
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.narrative === narrativeType);
    });
    
    // Apply filter to graph
    this.angEngine.filterByNarrative(narrativeType);
    
    // Update narrative explorer
    if (narrativeType !== 'all') {
      document.dispatchEvent(new CustomEvent('ang:narrative-selected', {
        detail: narrativeType
      }));
    }
  }

  toggleLabels() {
    const labelsVisible = this.angEngine.toggleLabels();
    const btn = document.getElementById('toggle-labels');
    if (btn) {
      btn.textContent = labelsVisible ? 'Hide Labels' : 'Show Labels';
    }
  }

  togglePaths() {
    const pathsVisible = this.angEngine.togglePaths();
    const btn = document.getElementById('toggle-paths');
    if (btn) {
      btn.textContent = pathsVisible ? 'Hide Paths' : 'Show Paths';
    }
  }

  handleKeyboardShortcut(event) {
    // Don't handle shortcuts if user is typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case 'r':
        this.angEngine.resetZoom();
        break;
      case 'l':
        this.toggleLabels();
        break;
      case 'p':
        this.togglePaths();
        break;
      case 'f':
        this.setNarrativeFilter('all');
        break;
      case '1':
        this.setNarrativeFilter('exploration');
        break;
      case '2':
        this.setNarrativeFilter('variation');
        break;
      case '3':
        this.setNarrativeFilter('learning');
        break;
      case '4':
        this.setNarrativeFilter('constraint');
        break;
      case '5':
        this.setNarrativeFilter('translation');
        break;
      case 'Escape':
        this.clearSelections();
        break;
    }
  }

  handleResize() {
    if (this.angEngine) {
      this.angEngine.resize();
    }
  }

  handleNodeClick(node) {
    console.log('Node clicked:', node.title);
    
    // Show detailed snippet view
    this.narrativeComponents.showSnippetDetail(node);
    
    // Update story paths if relevant
    if (node.narratives && node.narratives.length > 0) {
      this.storyPaths.followPath(node.id);
    }
  }

  handleNarrativeSelection(narrativeType) {
    console.log('Narrative selected:', narrativeType);
    
    // Show narrative explorer
    this.narrativeComponents.showNarrativeView(narrativeType);
    
    // Explore narrative paths
    this.storyPaths.exploreNarrativeType(narrativeType);
  }

  handlePathNavigation(pathData) {
    console.log('Path navigated:', pathData.path.concept);
    
    // Update UI to reflect current path
    this.updatePathIndicators(pathData.path);
  }

  updatePathIndicators(path) {
    // Update any UI indicators to show current path
    const pathIndicators = document.querySelectorAll('.path-indicator');
    pathIndicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // Add visual feedback for current path
    if (path && path.id) {
      const currentIndicator = document.querySelector(`[data-path-id="${path.id}"]`);
      if (currentIndicator) {
        currentIndicator.classList.add('active');
      }
    }
  }

  updateStatistics() {
    const nodeCount = this.angEngine.nodes.length;
    const linkCount = this.angEngine.links.length;
    const narrativeCount = this.angEngine.nodes.reduce((sum, node) => 
      sum + (node.narratives?.length || 0), 0
    );
    
    const nodeCountEl = document.getElementById('node-count');
    const linkCountEl = document.getElementById('link-count');
    const narrativeCountEl = document.getElementById('narrative-count');
    
    if (nodeCountEl) nodeCountEl.textContent = `${nodeCount} snippets`;
    if (linkCountEl) linkCountEl.textContent = `${linkCount} connections`;
    if (narrativeCountEl) narrativeCountEl.textContent = `${narrativeCount} narratives`;
  }

  clearSelections() {
    // Clear all selections and highlights
    this.angEngine.clearHighlight();
    this.storyPaths.clearCurrentPath();
    
    // Hide detail panels
    const snippetDetail = document.getElementById('snippet-detail');
    if (snippetDetail) {
      snippetDetail.classList.remove('visible');
    }
    
    // Reset filter to all
    this.setNarrativeFilter('all');
  }

  render() {
    if (!this.dataLoaded) {
      console.warn('Cannot render: data not loaded');
      return;
    }
    
    // The graph engine handles its own rendering
    // Components render themselves based on events
    console.log('🎨 ANG Explorer rendered');
  }

  showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('hidden');
    }
  }

  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }

  showError(message) {
    console.error('ANG Explorer Error:', message);
    
    // Show error in UI
    const container = document.getElementById('graph-canvas');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Error Loading ANG Explorer</h3>
          <p>${message}</p>
          <button onclick="location.reload()">Reload Page</button>
        </div>
      `;
    }
  }

  // Public API
  getEngine() {
    return this.angEngine;
  }

  getComponents() {
    return this.narrativeComponents;
  }

  getStoryPaths() {
    return this.storyPaths;
  }

  getCurrentFilter() {
    return this.currentFilter;
  }

  isDataLoaded() {
    return this.dataLoaded;
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.angExplorer = new ANGExplorer();
});

// Export for module usage
export { ANGExplorer };