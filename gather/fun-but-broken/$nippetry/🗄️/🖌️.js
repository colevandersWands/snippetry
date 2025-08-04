// CSS fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🖌️'] = {
	'🪡': function (snippet) {
		// Process CSS snippet
		var processed = Object.assign({}, snippet);

		// Extract selectors
		processed.selectors = processed.text['🪡'](/([^{]+)\s*{/g).map(function (s) {
			return s.trim();
		});

		// Check for animations
		if (processed.text.match(/@keyframes|animation:/)) {
			processed.tags = (processed.tags || []).concat(['animated']);
		}

		// Check for responsive design
		if (processed.text.match(/@media/)) {
			processed.tags = (processed.tags || []).concat(['responsive']);
		}

		return processed;
	},
};
