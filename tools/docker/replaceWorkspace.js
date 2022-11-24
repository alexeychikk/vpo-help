const fs = require('fs');
const path = require('path');

const serviceName = process.argv[2];
const filename = path.join(__dirname, '../../workspace.json');
const workspaceJson = require(filename);

workspaceJson.projects = Object.keys(workspaceJson.projects).reduce(
  (acc, key) => {
    if (
      key === serviceName ||
      workspaceJson.projects[key].startsWith('libs/')
    ) {
      acc[key] = workspaceJson.projects[key];
    }
    return acc;
  },
  {},
);

fs.writeFileSync(filename, JSON.stringify(workspaceJson));
