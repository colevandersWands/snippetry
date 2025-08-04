// Storage and writing operations

import { $nippetry } from './💭.js';
import { writeFile } from 'fs/promises';

$nippetry['💾'] = {
	'📝': async function (data, path) {
		// Write as JSON
		var json = JSON.stringify(
			data,
			function (key, value) {
				// Remove empty arrays and nulls
				if (value === null || (Array.isArray(value) && value.length === 0)) {
					return undefined;
				}
				return value;
			},
			2,
		);

		await writeFile(path, json);
		return path;
	},

	'💿': async function (data, path) {
		// Write minified JSON
		var json = JSON.stringify(data, function (key, value) {
			if (value === null || (Array.isArray(value) && value.length === 0)) {
				return undefined;
			}
			return value;
		});

		await writeFile(path, json);
		return path;
	},

	'📄': async function (text, path) {
		// Write plain text
		await writeFile(path, text);
		return path;
	},

	'🗃️': async function (wardrobe) {
		// Write multiple files from wardrobe
		var writes = [];

		for (var drawer in wardrobe) {
			if (wardrobe.hasOwnProperty(drawer)) {
				var path = wardrobe[drawer].path;
				var data = wardrobe[drawer].data;
				writes.push($nippetry['💾']['📝'](data, path));
			}
		}

		return Promise.all(writes);
	},

	'📦': function (snippets) {
		// Package for storage
		return {
			snippets: snippets['👘'] || snippets,
			tags: $nippetry['🎨']['🏷️'] || [],
			links: $nippetry['🧵']['🔗'] || [],
			langs: $nippetry['🗄️']['📊'] || [],
		};
	},
};
