// Text and Markdown fabric interpreter

import { $nippetry } from '../💭.js';

$nippetry['🗄️']['📝'] = {
	'🪡': function (snippet) {
		// Process text/markdown snippet
		var processed = Object.assign({}, snippet);

		// Extract tags from parentheses
		var tags = processed.text['🪡'](/\(tags:\s*([^)]+)\)/gi);
		tags.forEach(function (tagList) {
			processed.tags = (processed.tags || []).concat(
				tagList.split(',').map(function (t) {
					return t.trim();
				}),
			);
		});

		// Extract see references
		processed.forelinks = processed.text['🪡'](/\(see:\s*([^)]+)\)/gi);

		// Check for YAML frontmatter
		var yamlMatch = processed.text.match(/^---\n([\s\S]+?)\n---/);
		if (yamlMatch) {
			processed.frontmatter = parseSimpleYaml(yamlMatch[1]);
			if (processed.frontmatter.tags) {
				processed.tags = (processed.tags || []).concat(processed.frontmatter.tags);
			}
		}

		// Special handling for .txt.svg pattern
		if (processed.title.endsWith('.txt') || processed.title.endsWith('.txt.svg')) {
			// Check if there's a corresponding SVG
			var baseName = processed.title.replace(/\.txt(\.svg)?$/, '');
			processed.metappet = baseName + '.svg';
		}

		// Extract markdown structure
		if (processed.text.match(/^#+ /m)) {
			processed.structure = extractMarkdownStructure(processed.text);
		}

		// Clean up tags
		if (processed.tags) {
			processed.tags = processed.tags['🪢']();
		}

		return processed;
	},

	'🔍': function (text) {
		// Analyze text structure
		return {
			isMarkdown: /^#+ /m.test(text),
			hasFrontmatter: /^---\n/.test(text),
			hasLists: /^\s*[-*+]\s+/m.test(text),
			hasCode: /```|`[^`]+`/.test(text),
			lineCount: text.split('\n').length,
			wordCount: text.split(/\s+/).length,
		};
	},

	'🏷️': function (text) {
		// Extract all possible tags from text
		var tags = [];

		// Parenthetical tags
		var parenTags = text['🪡'](/\(tags:\s*([^)]+)\)/gi);
		parenTags.forEach(function (tagList) {
			tags = tags.concat(
				tagList.split(',').map(function (t) {
					return t.trim();
				}),
			);
		});

		// Hashtags
		var hashTags = text['🪡'](/#(\w+)/g);
		tags = tags.concat(hashTags);

		// Special markers
		if (text.match(/\btribute\b/i)) tags.push('tribute');
		if (text.match(/\bAIthored\b/)) tags.push('AIthored');
		if (text.match(/\bmetappet\b/)) tags.push('metappet');

		return tags['🪢']();
	},
};

// Hoisted text utilities
function parseSimpleYaml(yaml) {
	// Very simple YAML parser for frontmatter
	var obj = {};
	var lines = yaml.split('\n');

	lines.forEach(function (line) {
		var match = line.match(/^(\w+):\s*(.+)$/);
		if (match) {
			var key = match[1];
			var value = match[2].trim();

			// Handle arrays
			if (value.startsWith('[') && value.endsWith(']')) {
				value = value
					.slice(1, -1)
					.split(',')
					.map(function (v) {
						return v.trim().replace(/['"]/g, '');
					});
			}
			// Handle quoted strings
			else if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			obj[key] = value;
		}
	});

	return obj;
}

function extractMarkdownStructure(text) {
	// Extract heading structure
	var headings = [];
	var lines = text.split('\n');

	lines.forEach(function (line) {
		var match = line.match(/^(#+)\s+(.+)$/);
		if (match) {
			headings.push({
				level: match[1].length,
				text: match[2],
			});
		}
	});

	return headings;
}

// Special tribute detection
$nippetry['🗄️']['📝']['🖋️'] = function (text) {
	// Detect tribute patterns
	var tributes = text['🪡'](/\(tribute:\s*([^)]+)\)/gi);
	return tributes.length > 0 ? tributes : null;
};
