module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix --max-warnings=0',
    'git add',
  ],
  '*.{json,md,mdx,css,html,yml,yaml}': ['prettier --write', 'git add'],
  '*.{scss,sass,less}': ['prettier --write', 'git add'],
};
