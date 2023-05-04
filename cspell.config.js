const DICTIONARIES_BASE_PATH = "./support/dictionaries";

module.exports = {
  // Version of the setting file.  Always 0.2
  version: "0.2",
  // Paths to be ignored
  ignorePaths: [
    "node_modules/**",
    ".husky/**",
    "*.json",
    "*.js",
    "support/dictionaries/**",
    "*.json",
    "**/*.config.js",
    "pnpm-lock.yaml",
    ".gitignore",
    "dist/**",
    "coverage/**",
    "**/*.excalidraw",
  ],
  // language - current active spelling language
  language: "en",
  // Dictionaries to be used
  dictionaries: ["softwareTerms", "companyTerms", "techTerms", "missingTerms"],
  dictionaryDefinitions: [
    { name: "companyTerms", path: `${DICTIONARIES_BASE_PATH}/company-terms.txt` },
    { name: "techTerms", path: `${DICTIONARIES_BASE_PATH}/tech-terms.txt` },
    { name: "missingTerms", path: `${DICTIONARIES_BASE_PATH}/missing-terms.txt` },
  ],
  // the minimum length of a word before it is checked.
  minWordLength: 3,
  // flagWords - list of words to be always considered incorrect
  // This is useful for offensive words and common spelling errors.
  // For example "hte" should be "the"
  flagWords: ["hte"],
};
