export const formatContent = (rawContent) => {
  if (!rawContent) return "";

  // 1. Headings ko fix karein (## se h3 banayein)
  let formatted = rawContent.replace(
    /## (.*)/g,
    '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>',
  );

  // 2. Bullets ko fix karein (- ya * se list banayein)
  formatted = formatted.replace(/- (.*)/g, '<li class="ml-4 mb-2">$1</li>');

  // 3. Paragraphs ko fix karein (double enter se p tags)
  formatted = formatted
    .split("\n\n")
    .map((para) => {
      if (para.startsWith("<h3") || para.startsWith("<li")) return para;
      return `<p class="mb-6 leading-relaxed text-neutral-300">${para}</p>`;
    })
    .join("");

  return formatted;
};
