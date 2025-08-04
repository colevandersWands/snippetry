// Python fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🐍'] = {
	'🪡': function (snippet) {
		// Process Python snippet
		var processed = Object.assign({}, snippet);

		// Extract imports
		processed.forelinks = processed.text['🪡'](/(?:import|from)\s+(\w+)/g);

		// Extract function definitions
		processed.functions = processed.text['🪡'](/def\s+(\w+)/g);

		// Extract class definitions
		processed.classes = processed.text['🪡'](/class\s+(\w+)/g);

		// Check for recursion
		if (
			processed.functions.some(function (fn) {
				return processed.text.includes(fn + '(');
			})
		) {
			processed.tags = (processed.tags || []).concat(['recursive']);
		}

		return processed;
	},

	'🔍': function (code) {
		// Analyze Python structure
		return {
			hasClasses: /class\s+\w+/.test(code),
			hasDecorators: /@\w+/.test(code),
			hasComprehensions: /\[.+for\s+.+in\s+.+\]/.test(code),
			style: code.match(/\t/) ? 'tabs' : 'spaces',
		};
	},
};
