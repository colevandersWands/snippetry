// Dyes for coloring and tagging

import { $nippetry } from './💭.js';

$nippetry['🎨'] = {
	'🏷️': [], // Master tag collection

	'🌈': function (snippet) {
		// Apply rainbow of tags based on content
		var tags = snippet.tags || [];

		// Add tags from patterns
		var patterns = $nippetry['📐']['📏'](snippet.text);
		if (patterns.tags.length) {
			patterns.tags.forEach(function (tagList) {
				tagList.split(',').forEach(function (tag) {
					tags.push(tag.trim());
				});
			});
		}

		// Add special tags
		var special = $nippetry['📐']['🌟']([snippet]);
		if (special.turtles.length) tags.push('turtle');
		if (special.dweets.length) tags.push('dweet');
		if (special.drafts.length) tags.push('draft');

		// Add metappet tag for docs
		if (snippet.title.includes('.docs.')) {
			tags.push('metappet');
		}

		snippet.tags = tags['🪢'](); // Unique only
		return snippet;
	},

	'🎯': function (snippets) {
		// Apply targeted coloring to all snippets
		snippets.forEach(function (snippet) {
			$nippetry['🎨']['🌈'](snippet);
		});

		// Collect all unique tags
		var allTags = [];
		snippets.forEach(function (snippet) {
			if (snippet.tags) {
				allTags = allTags.concat(snippet.tags);
			}
		});

		$nippetry['🎨']['🏷️'] = allTags['🪢']().sort();
		return snippets;
	},

	'🖌️': function (snippet, color) {
		// Apply specific color (tag)
		snippet.tags = snippet.tags || [];
		snippet.tags.push(color);
		snippet.tags = snippet.tags['🪢']();
		return snippet;
	},

	'🖋️': function (snippets) {
		// Apply thematic coloring
		var themes = identifyThemes(snippets);

		snippets.forEach(function (snippet) {
			themes.forEach(function (theme) {
				if (theme.matches(snippet)) {
					snippet.tags = (snippet.tags || []).concat(theme.tags);
				}
			});

			snippet.tags = snippet.tags ? snippet.tags['🪢']() : [];
		});

		return snippets;
	},

	'💅': function (snippet) {
		// Polish and clean tags
		if (!snippet.tags) return snippet;

		snippet.tags = snippet.tags
			.map(function (tag) {
				return tag.toLowerCase().trim();
			})
			.filter(function (tag) {
				return tag && tag.length > 0;
			})
			['🪢']()
			.sort();

		return snippet;
	},
};

// Hoisted theming utilities
function identifyThemes(snippets) {
	// Identify common themes across snippets
	var themes = [
		{
			name: 'recursive',
			tags: ['recursive', 'wuzzle'],
			matches: function (s) {
				return s.text.match(/function\s+\w+\s*\([^)]*\)\s*{\s*\w+\(/);
			},
		},
		{
			name: 'variation',
			tags: ['variation'],
			matches: function (s) {
				var base = s.title.split('.')[0].toLowerCase();
				return (
					snippets.filter(function (other) {
						return other.title.split('.')[0].toLowerCase() === base;
					}).length > 1
				);
			},
		},
		{
			name: 'artistic',
			tags: ['art', 'creative'],
			matches: function (s) {
				return s.text.match(/🎨|🌈|✨|🖋️/) || s.title.match(/art|draw|paint/i);
			},
		},
		{
			name: 'meta',
			tags: ['metappet'],
			matches: function (s) {
				return s.title.includes('.docs.') || s.text.match(/tags:\s*\[.*metappet.*\]/);
			},
		},
	];

	return themes;
}

function normalizeTag(tag) {
	// Normalize tag format
	return tag
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

$nippetry['🎨']['🧹'] = normalizeTag;
