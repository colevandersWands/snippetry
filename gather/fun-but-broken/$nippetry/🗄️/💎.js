// Ruby fabric interpreter - 💎 for the gem language!

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['💎'] = {
	'🪡': function (snippet) {
		// Process Ruby snippet
		var processed = Object.assign({}, snippet);

		// Extract requires (Ruby imports)
		var requires = processed.text['🪡'](/require(?:_relative)?\s+['"]([^'"]+)['"]/g);
		processed.forelinks = requires;

		// Extract class definitions
		var classes = processed.text['🪡'](/class\s+(\w+)(?:\s*<\s*(\w+))?/g);
		processed.classes = classes['🪢']();

		// Extract module definitions
		var modules = processed.text['🪡'](/module\s+(\w+)/g);
		processed.modules = modules['🪢']();

		// Extract method definitions
		var methods = processed.text['🪡'](/def\s+(\w+)/g);
		processed.methods = methods['🪢']();

		// Check for special Ruby patterns
		if (processed.text.match(/\bdo\b.*?\bend\b/s)) {
			processed.tags = (processed.tags || []).concat(['blocks']);
		}

		if (processed.text.match(/\|[^|]+\|/)) {
			processed.tags = (processed.tags || []).concat(['blocks']);
		}

		if (processed.text.match(/\bself\b|method_missing|define_method/)) {
			processed.tags = (processed.tags || []).concat(['metaprogramming']);
		}

		// Check for Ruby symbols
		if (processed.text.match(/:[a-zA-Z_]\w*/)) {
			processed.tags = (processed.tags || []).concat(['symbols']);
		}

		// Check for string interpolation
		if (processed.text.match(/#\{[^}]+\}/)) {
			processed.tags = (processed.tags || []).concat(['interpolation']);
		}

		// Check for Ruby DSL patterns
		if (processed.text.match(/\b(attr_reader|attr_writer|attr_accessor)\b/)) {
			processed.tags = (processed.tags || []).concat(['dsl']);
		}

		// Check for Ruby testing patterns
		if (processed.text.match(/\b(describe|it|expect|should)\b/)) {
			processed.tags = (processed.tags || []).concat(['testing']);
		}

		// Clean up tags
		if (processed.tags) {
			processed.tags = processed.tags['🪢']();
		}

		return processed;
	},

	'💍': function (snippet) {
		// Polish Ruby snippet - add Ruby-specific enhancements
		if (snippet.title.includes('.meta.rb')) {
			snippet.tags = (snippet.tags || []).concat(['metaprogramming']);
		}

		if (snippet.title.includes('.spec.rb') || snippet.title.includes('_spec.rb')) {
			snippet.tags = (snippet.tags || []).concat(['testing', 'rspec']);
		}

		if (snippet.title.includes('_test.rb')) {
			snippet.tags = (snippet.tags || []).concat(['testing', 'minitest']);
		}

		return snippet;
	},
};