// HTML fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🌐'] = {
	'🪡': function (snippet) {
		// Process HTML snippet
		var processed = Object.assign({}, snippet);

		// Extract linked resources
		var links = processed.text['🪡'](/(?:src|href)=['"]([^'"]+)['"]/g);
		processed.forelinks = links;

		// Extract script tags
		var scripts = processed.text['🪡'](/<script[^>]*src=['"]([^'"]+)['"]/g);
		if (scripts.length) {
			processed.forelinks = (processed.forelinks || []).concat(scripts);
		}

		// Check for interactive content
		if (processed.text.match(/<(?:canvas|svg|video|audio)/)) {
			processed.tags = (processed.tags || []).concat(['interactive']);
		}

		return processed;
	},

	'🔍': function (html) {
		// Analyze HTML structure
		return {
			hasCanvas: /<canvas/.test(html),
			hasSvg: /<svg/.test(html),
			hasScript: /<script/.test(html),
			hasStyle: /<style/.test(html),
		};
	},
};
