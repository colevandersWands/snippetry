// Reading from the pattern book

import { $nippetry } from './💭.js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

// Deep nested reading operations
$nippetry['📖'] = {
	'📂': async function (path) {
		// Read directory
		var entries = await readdir(path);
		return entries.filter(function (entry) {
			return !entry.startsWith('.');
		});
	},

	'📄': async function (path) {
		// Read single file
		var content = await readFile(path, 'utf-8');
		return {
			title: path.split('/').pop(),
			text: content,
			'🏷️': path['🏷️'](), // Get fabric type
		};
	},

	'📚': async function (path) {
		// Read multiple files from directory
		var files = await $nippetry['📖']['📂'](path);
		var contents = await Promise.all(
			files.map(function (file) {
				return $nippetry['📖']['📄'](join(path, file));
			}),
		);
		return contents;
	},

	'🔖': async function (path, pattern) {
		// Read files matching pattern
		var files = await $nippetry['📖']['📂'](path);
		var matching = files['🧵'](pattern);
		return Promise.all(
			matching.map(function (file) {
				return $nippetry['📖']['📄'](join(path, file));
			}),
		);
	},

	'📰': async function (path) {
		// Read and split by separator (for snips)
		var content = await readFile(path, 'utf-8');
		var pieces = content.split(/-snip-/gi);
		return pieces
			.map(function (piece) {
				return piece['🎀'](); // Trim each piece
			})
			.filter(Boolean);
	},
};

// Hoisted utility for fabric inspection
function inspectFabric(text) {
	var lines = text['🧵']();
	var measurements = $nippetry['📏'](text);

	return {
		'📏': measurements,
		'🧶': lines.length > 40, // Needs trimming?
		'🌈': detectColors(text), // Find tags/patterns
		'🕸️': findConnections(text), // Find links
	};
}

function detectColors(text) {
	// Extract tags from various formats
	var tags = [];

	// YAML frontmatter tags
	var yamlTags = text['🪡'](/tags:\s*\[([^\]]+)\]/);
	if (yamlTags.length) {
		tags = tags.concat(
			yamlTags[0].split(',').map(function (t) {
				return t.trim().replace(/['"]/g, '');
			}),
		);
	}

	// Inline tags
	var inlineTags = text['🪡'](/\(tags:\s*([^)]+)\)/gi);
	tags = tags.concat(inlineTags);

	return tags['🪢'](); // Unique only
}

function findConnections(text) {
	// Find various link patterns
	var links = {};

	// Import/require statements
	links['🟨'] = text['🪡'](/(?:import|require)\s*\(?['"]([^'"]+)['"]\)?/g);

	// See references
	links['👀'] = text['🪡'](/\(see:\s*([^)]+)\)/gi);

	// Markdown links
	links['🔗'] = text['🪡'](/\[([^\]]+)\]\(([^)]+)\)/g);

	return links;
}

// Attach inspection to reading
$nippetry['📖']['🔍'] = inspectFabric;
