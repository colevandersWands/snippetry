const isURL = new RegExp('^(?:[a-z+]+:)?//', 'i');
export const isRelative = (link = '') => !isURL.test(link);

export const lang = (title = '') => title.split('.').pop();
export const ext = (title = '') => '.' + lang(title);
export const name = (title = '') => title.slice(0, title.length - ext(title).length);

// from bing chat
// const fs = require('fs');
// const path = require('path');

// function isSameDirectory(dirPath, filePath) {
//     const absoluteDirPath = path.resolve(dirPath);
//     const absoluteFilePath = path.resolve(filePath);

//     return path.dirname(absoluteFilePath) === absoluteDirPath;
// }

export const staticLabels = ({
  text = '',
  label = 'tags',
  begin = new Regex(`/(\(|\/\/|<!\-\-|\/\*|\#)[\s]*${label}[\s]*:/`, 'gi'),
  end = /(|\-\-\>|\*\/|\)|)/gi,
}) =>
  Array.from(
    new Set(
      text
        .split('\n')
        .filter((line) => line.match(begin))
        .map((line) => line.replaceAll(begin, '').replaceAll(end, ''))
        .flatMap((line) => line.split(','))
        .map((tag) => tag.trim().toLowerCase())
        .sort(),
    ),
  );
