import {
  MasterDokiThemeDefinition,
  readJson,
  walkDir,
} from 'doki-build-source';

const path = require('path');
const fs = require('fs');

const repoDirectory = path.resolve(__dirname, '..');

const jetbrainsTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "editorScheme": {
    "type": "template",
    "name": dokiThemeDefinition.dark ? "Doki Dark" : "Doki Light"
  },
  "overrides": {},
  "ui": {}
});

const vsCodeTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});

const chromeTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});

const vimTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});

const hyperTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "backgrounds": {}
});

const githubTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});

const eclipseTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});

const jupyterTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  "id": dokiThemeDefinition.id,
  "overrides": {},
  "laf": {},
  "syntax": {},
  "colors": {}
});


/*********************************************************************************************/

/**
 * This Function creates each application specific template and puts it in the "temp directory"
 *
 * This is most handy when creating the doki theme for a new application as it preserves the
 * folder structure, which is not important, but it is nice.
 *
 * @param dokiThemeDefinition
 */
function buildApplicationTemplate(dokiThemeDefinition: MasterDokiThemeDefinition) {
  return jupyterTemplate(dokiThemeDefinition);
}

/**
 * You also want to change this as well
 *  jetbrains | vsCode | hyper | chrome | vim | github | eclipse | jupyter
 */
const appName = 'jupyter';

/**************************************************************************/


const masterThemeDefinitionDirectoryPath =
  path.resolve(repoDirectory, 'definitions');

console.log('Preparing to generate theme templates.');

walkDir(masterThemeDefinitionDirectoryPath)
  .then(files => files.filter(file => file.endsWith('master.definition.json')))
  .then(dokiFileDefinitionPaths => {
    return {
      dokiFileDefinitionPaths
    };
  })
  .then(templatesAndDefinitions => {
    const {
      dokiFileDefinitionPaths
    } = templatesAndDefinitions;
    return dokiFileDefinitionPaths
      .map(dokiFileDefinitionPath => ({
        dokiFileDefinitionPath,
        dokiThemeDefinition: readJson<MasterDokiThemeDefinition>(dokiFileDefinitionPath),
      }))
  }).then(dokiThemes => {
  const themeDirectory = path.resolve(repoDirectory, 'temp', appName);
  if (fs.existsSync(themeDirectory)) {
    fs.rmdirSync(themeDirectory, {recursive: true});
  }

  dokiThemes.forEach(dokiTheme => {
    const {
      dokiFileDefinitionPath,
      dokiThemeDefinition
    } = dokiTheme;

    const destinationPath = dokiFileDefinitionPath.substr(masterThemeDefinitionDirectoryPath.length);
    const essentials = buildApplicationTemplate(dokiThemeDefinition);

    const fullFilePath = path.join(themeDirectory, destinationPath);

    fs.mkdirSync(
      path.resolve(fullFilePath, '..'),
      {
        recursive: true
      }
    );

    const definitionAsString = JSON.stringify(
      essentials, null, 2
    );

    fs.writeFileSync(
      fullFilePath.replace('master.definition', `${appName}.definition`),
      definitionAsString
    );
  })
})
  .then(() => {
    console.log('Theme Template Generation Complete!');
  });
