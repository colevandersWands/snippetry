// COEM fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['🖋️'] = {
	'🪡': function (snippet) {
		// Process COEM snippet (poetry/code language)
		var processed = Object.assign({}, snippet);

		// COEM-specific patterns
		processed.tags = (processed.tags || []).concat(['coem', 'poetry']);

		// Extract COEM commands
		var commands = processed.text['🪡'](/(\w+)—/g);
		if (commands.length) {
			processed.commands = commands;
		}

		return processed;
	},
};
