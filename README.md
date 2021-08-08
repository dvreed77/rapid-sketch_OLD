# Run a Sketch

Updating README

```
npm start
cd example_sketches/sketches
node ../../packages/rapid-sketch-cli/dist/index.js kitchen.ts
```

# Developing

1. [feature-branch] Stage modified files using:
   git add .
2. [feature-branch] Commit the files using git-cz package:
   npm run commit
   Choose the type of the commits (feat, refactor, fix, etc.).
   Provides a short description of the commits.
   (Optional) Provides a longer description.
   Determine whether the commit is a BREAKING CHANGES or not (by answering ‘y’ and fill up BREAKING CHANGES descriptions in the CLI).
   (Optional) Mentions the JIRA issue in (by answering ‘y’ and fill up the issue descriptions in the CLI).
3. [feature-branch] Now that all files have been committed, they are ready to be pushed to the remote:
   git push origin <feature-branch>
4. [Github] Create a Pull Request to master branch.
5. [master] After it is merged, the following steps are done within the master branch:
   Run the command npm run release (which will bump versions based on commit types, add commit descriptions to CHANGELOG.md, and create git tags according to the current version).
   Push changes and git tags to master branch using :
   git push --follow-tags origin master
6. Relax and enjoy 🍕
