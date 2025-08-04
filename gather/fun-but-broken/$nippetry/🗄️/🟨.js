// JavaScript fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🟨'] = {
	'🪡': function (snippet) {
		// Process JavaScript snippet
		var processed = Object.assign({}, snippet);

		// Extract imports/requires
		processed.forelinks = processed.text['🪡'](
			/(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g,
		);

		// Extract function names
		var functions = processed.text['🪡'](/function\s+(\w+)/g);
		var arrowFns = processed.text['🪡'](
			/(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>/g,
		);
		processed.functions = functions.concat(arrowFns)['🪢']();

		// Extract classes
		processed.classes = processed.text['🪡'](/class\s+(\w+)/g);

		// Check for special patterns
		if (processed.text.match(/function\s+\w+\s*\([^)]*\)\s*{\s*\1\(/)) {
			processed.tags = (processed.tags || []).concat(['recursive']);
		}

		// Check for dweet pattern
		if (processed.title.includes('dweet') || processed.text.length < 140) {
			if (processed.text.match(/\bt\b/) && processed.text.match(/Math\.(sin|cos)/)) {
				processed.tags = (processed.tags || []).concat(['dweet']);
			}
		}

		return processed;
	},

	'🔍': function (code) {
		// Analyze JavaScript code structure
		return {
			hasClasses: /class\s+\w+/.test(code),
			hasArrows: /=>/.test(code),
			hasAsync: /async|await/.test(code),
			hasModules: /import|export/.test(code),
			style: detectJsStyle(code),
		};
	},

	'🏷️': function (code) {
		// Extract tags from JS comments
		var tags = [];

		// Single-line comment tags
		var singleLine = code['🪡'](/\/\/\s*tags:\s*(.+)$/gm);
		singleLine.forEach(function (tagList) {
			tags = tags.concat(
				tagList.split(',').map(function (t) {
					return t.trim();
				}),
			);
		});

		// Multi-line comment tags
		var multiLine = code['🪡'](/\/\*[\s\S]*?tags:\s*([^*]+)\*\//g);
		multiLine.forEach(function (tagList) {
			tags = tags.concat(
				tagList.split(',').map(function (t) {
					return t.trim();
				}),
			);
		});

		return tags['🪢']();
	},
};

// Hoisted JavaScript utilities
function detectJsStyle(code) {
	// Detect coding style
	if (code.match(/\bvar\b/) && !code.match(/\b(let|const)\b/)) return 'es5';
	if (code.match(/\b(let|const)\b/) && !code.match(/\bclass\b/)) return 'es6';
	if (code.match(/\bclass\b/)) return 'es6+';
	if (code.match(/^\s*import/m)) return 'esm';
	return 'unknown';
}

// Add AST-like analysis
$nippetry['🗄️']['🟨']['🌳'] = function (code) {
	// Simple AST-like structure detection
	var structure = {
		imports: [],
		exports: [],
		functions: [],
		variables: [],
	};

	// Find imports
	code.replace(
		/import\s+(?:(\w+)|{([^}]+)}|\*\s+as\s+(\w+))\s+from\s+['"]([^'"]+)['"]/g,
		function (match, def, named, star, from) {
			structure.imports.push({
				type: def ? 'default' : star ? 'namespace' : 'named',
				name: def || star || named,
				from: from,
			});
		},
	);

	// Find exports
	code.replace(
		/export\s+(?:(default)\s+)?(?:(function|class|const|let|var)\s+)?(\w+)?/g,
		function (match, def, type, name) {
			if (name) {
				structure.exports.push({
					default: !!def,
					type: type || 'value',
					name: name,
				});
			}
		},
	);

	return structure;
};
