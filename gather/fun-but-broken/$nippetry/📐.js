// Pattern recognition and matching

import { $nippetry } from './💭.js';

$nippetry['📐'] = {
	'🔍': function (text, patterns) {
		// Find all patterns in text
		var found = {};

		for (var name in patterns) {
			if (patterns.hasOwnProperty(name)) {
				found[name] = patterns[name]['🔍'](text);
			}
		}

		return found;
	},

	'📏': function (text) {
		// Standard patterns for snippets
		var patterns = {
			tags: /\(tags:\s*([^)]+)\)/gi,
			forelinks: /\(see:\s*([^)]+)\)/gi,
			imports: /(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g,
			functions: /function\s+(\w+)/g,
			classes: /class\s+(\w+)/g,
			urls: /https?:\/\/[^\s)]+/g,
			todos: /TODO:?\s*(.+)$/gm,
		};

		return $nippetry['📐']['🔍'](text, patterns);
	},

	'🎯': function (snippets) {
		// Pattern matching across snippets
		var patterns = {};

		// Find common patterns
		snippets.forEach(function (snippet) {
			var found = $nippetry['📐']['📏'](snippet.text);

			for (var pattern in found) {
				patterns[pattern] = patterns[pattern] || [];
				if (found[pattern].length) {
					patterns[pattern].push({
						snippet: snippet.title,
						matches: found[pattern],
					});
				}
			}
		});

		return patterns;
	},

	'🧩': function (snippet, patterns) {
		// Match snippet against pattern templates
		var matches = [];

		patterns.forEach(function (pattern) {
			if (matchesTemplate(snippet, pattern)) {
				matches.push(pattern.name);
			}
		});

		return matches;
	},

	'🌟': function (snippets) {
		// Find special patterns (turtles, dweets, etc)
		var special = {
			turtles: [],
			dweets: [],
			variations: [],
			drafts: [],
			sandboxes: [],
		};

		snippets.forEach(function (snippet) {
			var title = snippet.title.toLowerCase();

			if (title.includes('turtle')) {
				special.turtles.push(snippet.title);
			}
			if (title.includes('dweet')) {
				special.dweets.push(snippet.title);
			}
			if (title.includes('.draft')) {
				special.drafts.push(snippet.title);
			}
			if (title.includes('.sandbox')) {
				special.sandboxes.push(snippet.title);
			}
		});

		// Find variations
		var bases = {};
		snippets.forEach(function (snippet) {
			var base = snippet.title.split('.')[0].toLowerCase();
			bases[base] = bases[base] || [];
			bases[base].push(snippet.title);
		});

		for (var base in bases) {
			if (bases[base].length > 1) {
				special.variations.push(bases[base]);
			}
		}

		return special;
	},
};

// Hoisted pattern utilities
function matchesTemplate(snippet, template) {
	// Check if snippet matches a pattern template
	if (template.title && !snippet.title.match(template.title)) {
		return false;
	}

	if (template.content && !snippet.text.match(template.content)) {
		return false;
	}

	if (template.tags) {
		var hasAllTags = template.tags.every(function (tag) {
			return snippet.tags && snippet.tags.includes(tag);
		});
		if (!hasAllTags) return false;
	}

	return true;
}

function createPattern(name, regex, extractor) {
	// Pattern factory
	return {
		name: name,
		pattern: regex,
		extract:
			extractor ||
			function (matches) {
				return matches.map(function (m) {
					return m[1] || m[0];
				});
			},
	};
}

$nippetry['📐']['🏭'] = createPattern;
