function isMarkdown(paragraph) {
  if (!paragraph) return false;
  return paragraph.startsWith('|');
}

function findMDTableBoundaries(paragraphArray) {
  const indices = {
    beginningIndex: '',
    endingIndex: '',
  };

  paragraphArray.forEach((currentParagraph, i) => {
    const nextParagraph = paragraphArray[i + 1];
    if (!isMarkdown(currentParagraph) && isMarkdown(nextParagraph)) {
      indices.beginningIndex = i + 1;
    }
    if (!isMarkdown(nextParagraph) && isMarkdown(currentParagraph)) {
      indices.endingIndex = i;
    }
  });
  return indices;
}

function rebuildDescriptionArray(descArray) {
  const { beginningIndex, endingIndex } = findMDTableBoundaries(descArray);
  const resultArray = [];
  let markdownString = '';

  for (
    let paragraphIndex = 0;
    paragraphIndex < descArray.length;
    paragraphIndex += 1
  ) {
    const paragraph = descArray[paragraphIndex];
    if (paragraphIndex >= beginningIndex && paragraphIndex <= endingIndex) {
      markdownString = `${markdownString}
${paragraph}`;
    } else {
      resultArray.push(paragraph);
    }
  }

  resultArray.splice(beginningIndex, 0, markdownString);
  return resultArray;
}

module.exports = { rebuildDescriptionArray };
