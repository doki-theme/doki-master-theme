// @ts-ignore
import {DokiThemeTemplateDefinition, MasterDokiThemeDefinition} from './TypesTemplate';

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..');

const fs = require('fs');

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
  return hyperTemplate(dokiThemeDefinition);
}

/**
 * You also want to change this as well
 *  jetbrains | vsCode | hyper | chrome | vim | github | eclipse
 */
const appName = 'hyper';

/**************************************************************************/


const masterThemeDefinitionDirectoryPath =
  path.resolve(repoDirectory, 'definitions');

function walkDir(dir: string): Promise<string[]> {
  const values: Promise<string[]>[] = fs.readdirSync(dir)
    .map((file: string) => {
      const dirPath: string = path.join(dir, file);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        return walkDir(dirPath);
      } else {
        return Promise.resolve([path.join(dir, file)]);
      }
    });
  return Promise.all(values)
    .then((scannedDirectories) => scannedDirectories
      .reduce((accum, files) => accum.concat(files), []));
}

const readJson = <T>(jsonPath: string): T =>
  JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

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
        dokiThemeDefinition: readJson<DokiThemeTemplateDefinition>(dokiFileDefinitionPath),
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
