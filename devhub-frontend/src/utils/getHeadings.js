// src/utils/getHeadings.js
export const getHeadings = (htmlContent) => {
  if (!htmlContent) return [];

  // 1. String ko DOM elements mein badalne ke liye Parser use karein
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // 2. H2 aur H3 tags ko dhoondein
  const headingElements = doc.querySelectorAll("h2, h3");

  // 3. Array mein convert karein aur IDs/Text extract karein
  return Array.from(headingElements).map((heading) => ({
    id: heading.innerText.toLowerCase().replace(/\s+/g, "-"),
    text: heading.innerText,
  }));
};
