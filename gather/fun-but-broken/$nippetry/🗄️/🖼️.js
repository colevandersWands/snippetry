// SVG fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🖼️'] = {
	'🪡': function (snippet) {
		// Process SVG snippet
		var processed = Object.assign({}, snippet);

		// Extract SVG elements
		var elements = processed.text['🪡'](/<(\w+)[^>]*>/g);
		processed.elements = elements['🪢']();

		// Check for animations
		if (processed.text.match(/<animate|<animateTransform/)) {
			processed.tags = (processed.tags || []).concat(['animated']);
		}

		// Add visual tag
		processed.tags = (processed.tags || []).concat(['visual']);

		return processed;
	},
};
