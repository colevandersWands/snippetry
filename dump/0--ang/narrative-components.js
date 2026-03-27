/**
 * Narrative Components
 * Rich snippet rendering with ANG-aware interactions
 */

import { n } from '../../../public/src/utils/n.js';

export class NarrativeComponents {
  constructor(angEngine) {
    this.angEngine = angEngine;
    this.activeNarrative = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for narrative selections from the graph
    document.addEventListener('ang:narrative-selected', (event) => {
      this.showNarrativeView(event.detail);
    });

    document.addEventListener('ang:node-clicked', (event) => {
      this.showSnippetDetail(event.detail);
    });
  }

  renderSnippetCard(snippet, options = {}) {
    const { showNarratives = true, interactive = true, compact = false } = options;

    return n('div', { 
      className: `snippet-card ${compact ? 'compact' : 'full'}`,
      'data-snippet-id': snippet.id 
    }, [
      this.renderSnippetHeader(snippet, { showNarratives }),
      this.renderSnippetBody(snippet, { compact }),
      showNarratives ? this.renderNarrativeConnections(snippet) : null,
      interactive ? this.renderInteractionPanel(snippet) : null
    ].filter(Boolean));
  }

  renderSnippetHeader(snippet, { showNarratives = true }) {
    const narrativeIndicators = showNarratives ? 
      this.renderNarrativeIndicators(snippet.narratives) : null;

    return n('header', 'snippet-header', [
      n('h3', 'snippet-title', [
        n('span', 'title-text', snippet.title),
        narrativeIndicators
      ]),
      this.renderTagCloud(snippet.tags),
      this.renderMetadata(snippet)
    ]);
  }

  renderNarrativeIndicators(narratives) {
    if (!narratives || narratives.length === 0) return null;

    return n('div', 'narrative-indicators', 
      narratives.map(narrative => 
        n('span', {
          className: `narrative-badge narrative-${narrative.narrativeType}`,
          title: `${narrative.narrativeType}: ${narrative.concept}${narrative.context ? '.' + narrative.context : ''}`
        }, [
          this.getNarrativeIcon(narrative.narrativeType),
          n('span', 'narrative-label', narrative.concept || narrative.narrativeType)
        ])
      )
    );
  }

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

  renderTagCloud(tags) {
    if (!tags || tags.length === 0) return null;

    return n('div', 'tag-cloud',
      tags.map(tag => 
        n('span', {
          className: 'tag',
          'data-tag': tag,
          onclick: () => this.filterByTag(tag)
        }, tag)
      )
    );
  }

  renderMetadata(snippet) {
    const lineCount = snippet.text.split('\n').length;
    const charCount = snippet.text.length;
    const complexity = this.calculateComplexity(snippet);

    return n('div', 'snippet-metadata', [
      n('span', 'meta-item', `${lineCount} lines`),
      n('span', 'meta-item', `${charCount} chars`),
      complexity > 0 ? n('span', 'meta-item', `complexity: ${complexity}`) : null
    ].filter(Boolean));
  }

  calculateComplexity(snippet) {
    // Simple heuristic based on code patterns
    const text = snippet.text;
    let complexity = 0;
    
    // Control structures
    complexity += (text.match(/\b(if|for|while|switch)\b/g) || []).length;
    // Functions
    complexity += (text.match(/function\s|\=\>/g) || []).length;
    // Recursion
    complexity += (text.match(/\b(\w+)\s*\(\s*.*\1\s*\(/g) || []).length * 2;
    
    return complexity;
  }

  renderSnippetBody(snippet, { compact = false }) {
    if (compact) {
      // Show first few lines with expand option
      const lines = snippet.text.split('\n');
      const preview = lines.slice(0, 3).join('\n');
      const hasMore = lines.length > 3;

      return n('div', 'snippet-body compact', [
        n('pre', 'code-preview', [
          n('code', null, preview),
          hasMore ? n('div', 'expand-indicator', '...') : null
        ]),
        hasMore ? n('button', {
          className: 'expand-button',
          onclick: () => this.expandSnippet(snippet.id)
        }, 'Show full snippet') : null
      ].filter(Boolean));
    }

    return n('div', 'snippet-body full', [
      this.renderCodeEditor(snippet),
      this.renderExecutionPanel(snippet)
    ]);
  }

  renderCodeEditor(snippet) {
    // This would integrate with your existing editor system
    return n('div', 'code-editor', [
      n('pre', 'code-content', [
        n('code', {
          className: this.getLanguageClass(snippet.title)
        }, this.highlightANGAnnotations(snippet.text))
      ])
    ]);
  }

  highlightANGAnnotations(text) {
    // Highlight ANG annotations within code
    return text.replace(
      /\/\/\s*ANG:\s*([^->~!<]+)(->|<->|~>|!>|<-)\s*([^\n\r]+)/g,
      '<span class="ang-annotation">' +
      '<span class="ang-comment">// ANG:</span> ' +
      '<span class="ang-narrative">$1</span>' +
      '<span class="ang-relationship">$2</span> ' +
      '<span class="ang-target">$3</span>' +
      '</span>'
    );
  }

  getLanguageClass(filename) {
    const extension = filename.split('.').pop();
    const langMap = {
      'js': 'language-javascript',
      'mjs': 'language-javascript', 
      'py': 'language-python',
      'html': 'language-html',
      'css': 'language-css',
      'md': 'language-markdown',
      'coem': 'language-coem'
    };
    return langMap[extension] || 'language-javascript';
  }

  renderExecutionPanel(snippet) {
    const canRun = this.canExecuteSnippet(snippet);
    
    if (!canRun) return null;

    return n('div', 'execution-panel', [
      n('button', {
        className: 'run-button',
        onclick: () => this.executeSnippet(snippet)
      }, '▶ Run'),
      n('div', 'execution-output', { id: `output-${snippet.id}` })
    ]);
  }

  canExecuteSnippet(snippet) {
    const executable = ['.js', '.mjs', '.py'];
    return executable.some(ext => snippet.title.endsWith(ext));
  }

  renderNarrativeConnections(snippet) {
    if (!snippet.narratives || snippet.narratives.length === 0) return null;

    return n('div', 'narrative-connections', [
      n('h4', null, 'Narrative Connections'),
      ...snippet.narratives.map(narrative => 
        this.renderNarrativeConnection(narrative, snippet)
      )
    ]);
  }

  renderNarrativeConnection(narrative, snippet) {
    return n('div', {
      className: `narrative-connection narrative-${narrative.narrativeType}`,
      onclick: () => this.navigateToTarget(narrative.target)
    }, [
      n('span', 'narrative-type', this.getNarrativeIcon(narrative.narrativeType)),
      n('span', 'narrative-description', [
        `${narrative.narrativeType}`,
        narrative.concept ? `.${narrative.concept}` : '',
        narrative.context ? `.${narrative.context}` : ''
      ].join('')),
      n('span', 'relationship-arrow', narrative.relationship),
      n('span', 'target-snippet', narrative.target)
    ]);
  }

  renderInteractionPanel(snippet) {
    return n('div', 'interaction-panel', [
      n('button', {
        className: 'focus-button',
        onclick: () => this.focusInGraph(snippet.id)
      }, '🎯 Focus in Graph'),
      n('button', {
        className: 'explore-button', 
        onclick: () => this.exploreNarratives(snippet)
      }, '🧭 Explore Narratives'),
      n('button', {
        className: 'edit-button',
        onclick: () => this.editSnippet(snippet)
      }, '✏️ Edit')
    ]);
  }

  // Narrative-specific layouts
  renderNarrativeExplorer(narrativeType) {
    const nodes = this.angEngine.narrativeGroups.get(narrativeType) || [];
    
    return n('div', `narrative-explorer narrative-${narrativeType}`, [
      n('header', 'explorer-header', [
        n('h2', null, [
          this.getNarrativeIcon(narrativeType),
          ` ${narrativeType} Narratives`
        ]),
        this.renderNarrativeStats(nodes)
      ]),
      this.renderNarrativeLayout(narrativeType, nodes)
    ]);
  }

  renderNarrativeStats(nodes) {
    const totalConnections = nodes.reduce((sum, node) => 
      sum + (node.narratives?.length || 0), 0
    );

    return n('div', 'narrative-stats', [
      n('span', 'stat', `${nodes.length} snippets`),
      n('span', 'stat', `${totalConnections} connections`)
    ]);
  }

  renderNarrativeLayout(narrativeType, nodes) {
    switch (narrativeType) {
      case 'learning':
        return this.renderLearningProgression(nodes);
      case 'variation':
        return this.renderVariationClusters(nodes);
      case 'exploration':
        return this.renderExplorationMap(nodes);
      case 'constraint':
        return this.renderConstraintGallery(nodes);
      case 'translation':
        return this.renderTranslationBridge(nodes);
      default:
        return this.renderGenericGrid(nodes);
    }
  }

  renderLearningProgression(nodes) {
    // Arrange by difficulty/progression
    const sorted = nodes.sort((a, b) => {
      const getLevel = (node) => {
        if (node.title.includes('🥚')) return 1;
        if (node.title.includes('🐣')) return 2;
        if (node.title.includes('🐥')) return 3;
        if (node.title.includes('🐔')) return 4;
        return 2.5; // Default middle
      };
      return getLevel(a) - getLevel(b);
    });

    return n('div', 'learning-progression', [
      n('div', 'progression-track',
        sorted.map((node, index) => 
          n('div', {
            className: 'progression-step',
            style: `--step: ${index}`
          }, [
            this.renderSnippetCard(node, { compact: true }),
            index < sorted.length - 1 ? 
              n('div', 'progression-arrow', '→') : null
          ])
        )
      )
    ]);
  }

  renderVariationClusters(nodes) {
    // Group by concept/base name
    const clusters = d3.group(nodes, d => {
      const baseName = d.title.split('.')[0];
      return baseName;
    });

    return n('div', 'variation-clusters',
      Array.from(clusters.entries()).map(([concept, variations]) =>
        n('div', 'variation-cluster', [
          n('h3', 'cluster-title', concept),
          n('div', 'cluster-variations',
            variations.map(variation => 
              this.renderSnippetCard(variation, { compact: true })
            )
          )
        ])
      )
    );
  }

  renderExplorationMap(nodes) {
    // Organic, branching layout for discoveries
    return n('div', 'exploration-map', [
      n('div', 'exploration-grid',
        nodes.map(node => 
          n('div', {
            className: 'exploration-item',
            style: this.getRandomPosition()
          }, this.renderSnippetCard(node, { compact: true }))
        )
      )
    ]);
  }

  renderConstraintGallery(nodes) {
    // Tight, grid layout emphasizing constraints
    return n('div', 'constraint-gallery',
      nodes.map(node => {
        const constraint = this.identifyConstraint(node);
        return n('div', 'constraint-item', [
          n('div', 'constraint-label', constraint),
          this.renderSnippetCard(node, { compact: true })
        ]);
      })
    );
  }

  renderTranslationBridge(nodes) {
    // Side-by-side comparison layout
    const translations = this.groupTranslations(nodes);
    
    return n('div', 'translation-bridge',
      Array.from(translations.entries()).map(([concept, langs]) =>
        n('div', 'translation-group', [
          n('h3', 'concept-title', concept),
          n('div', 'translation-comparison',
            langs.map(node => 
              n('div', 'translation-variant', [
                n('div', 'language-label', this.getLanguageFromTitle(node.title)),
                this.renderSnippetCard(node, { compact: true })
              ])
            )
          )
        ])
      )
    );
  }

  renderGenericGrid(nodes) {
    return n('div', 'generic-grid',
      nodes.map(node => 
        this.renderSnippetCard(node, { compact: true })
      )
    );
  }

  // Utility methods
  getRandomPosition() {
    return `transform: translate(${Math.random() * 100}px, ${Math.random() * 100}px)`;
  }

  identifyConstraint(node) {
    if (node.title.includes('golf')) return 'Golf';
    if (node.title.includes('dweet')) return 'Dweet';
    if (node.text.split('\n').length <= 40) return '≤40 lines';
    if (node.text.length <= 280) return '≤280 chars';
    return 'Other';
  }

  groupTranslations(nodes) {
    return d3.group(nodes, d => d.title.split('.')[0]);
  }

  getLanguageFromTitle(title) {
    const extension = title.split('.').pop();
    const langNames = {
      'js': 'JavaScript',
      'mjs': 'ES Module',
      'py': 'Python', 
      'html': 'HTML',
      'css': 'CSS',
      'md': 'Markdown',
      'coem': 'Coem'
    };
    return langNames[extension] || extension.toUpperCase();
  }

  // Event handlers
  filterByTag(tag) {
    this.angEngine.highlightByTag(tag);
  }

  expandSnippet(snippetId) {
    const element = document.querySelector(`[data-snippet-id="${snippetId}"]`);
    if (element) {
      element.classList.add('expanded');
      // Re-render with full view
      const snippet = this.angEngine.nodes.find(n => n.id === snippetId);
      if (snippet) {
        element.innerHTML = '';
        element.appendChild(this.renderSnippetCard(snippet, { compact: false }));
      }
    }
  }

  navigateToTarget(target) {
    this.angEngine.focusNode(target);
    document.dispatchEvent(new CustomEvent('ang:navigate-to', { 
      detail: { target } 
    }));
  }

  focusInGraph(snippetId) {
    this.angEngine.focusNode(snippetId);
  }

  exploreNarratives(snippet) {
    if (snippet.narratives && snippet.narratives.length > 0) {
      const primaryNarrative = snippet.narratives[0].narrativeType;
      this.showNarrativeView(primaryNarrative);
    }
  }

  executeSnippet(snippet) {
    const outputElement = document.getElementById(`output-${snippet.id}`);
    if (!outputElement) return;

    try {
      // Capture console output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => logs.push(args.join(' '));

      // Execute the code
      if (snippet.title.endsWith('.js') || snippet.title.endsWith('.mjs')) {
        eval(snippet.text);
      }
      
      // Restore console
      console.log = originalLog;
      
      // Display output
      outputElement.innerHTML = logs.length > 0 ? 
        logs.map(log => `<div class="log-line">${log}</div>`).join('') :
        '<div class="no-output">No output</div>';
        
    } catch (error) {
      outputElement.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  }

  editSnippet(snippet) {
    // This would integrate with your editing system
    console.log('Edit snippet:', snippet.title);
  }

  showNarrativeView(narrativeType) {
    this.activeNarrative = narrativeType;
    const explorer = this.renderNarrativeExplorer(narrativeType);
    
    // Replace or update the main content area
    const container = document.getElementById('narrative-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(explorer);
    }
  }

  showSnippetDetail(snippet) {
    const detail = this.renderSnippetCard(snippet, { 
      showNarratives: true, 
      interactive: true, 
      compact: false 
    });
    
    // Show in modal or side panel
    const container = document.getElementById('snippet-detail');
    if (container) {
      container.innerHTML = '';
      container.appendChild(detail);
      container.classList.add('visible');
    }
  }
}