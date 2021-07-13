import {
  MasterDokiThemeDefinition,
} from "doki-build-source";
import path from "path";
import fs from "fs";
import { masterThemeDefinitionDirectoryPath, masterThemesDirectory, walkAndBuildTemplates } from "./BuildFunctions";

const jetbrainsTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  editorScheme: {
    type: "template",
    name: dokiThemeDefinition.dark ? "Doki Dark" : "Doki Light",
  },
  overrides: {},
  ui: {},
});

const vsCodeTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const visualStudioTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const chromeTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const vimTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const hyperTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  backgrounds: {},
});

const githubTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const eclipseTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const jupyterTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  laf: {},
  syntax: {},
  colors: {},
});

const homeTemplate = (dokiThemeDefinition: MasterDokiThemeDefinition) => ({
  id: dokiThemeDefinition.id,
  overrides: {},
  content: {},
  "backgrounds": {},
});


/*********************************************************************************************/

/**
 * This Function creates each application specific template and puts it in the "buildSrc/assets/templates 
 * of the current app"
 *
 * This is most handy when creating the doki theme for a new application as it preserves the
 * folder structure, which is not important, but it is nice.
 *
 * @param dokiThemeDefinition
 */
function buildApplicationTemplate(
  dokiThemeDefinition: MasterDokiThemeDefinition
) {
  return visualStudioTemplate(dokiThemeDefinition);
}

/**
 * You also want to change this as well
 *  jetbrains | vsCode | hyper | chrome | vim | github | eclipse | jupyter | home | visualstudio
 */
const appName = 'visualstudio';

/**************************************************************************/


console.log("Preparing to generate theme templates.");

walkAndBuildTemplates()
  .then((dokiThemes) => {
    const themeDirectory = path.resolve(
      masterThemesDirectory,
      "..",
      "buildSrc",
      "assets",
      "themes"
    );

    dokiThemes.forEach((dokiTheme) => {
      const { dokiFileDefinitionPath, dokiThemeDefinition } = dokiTheme;

      const destinationPath = dokiFileDefinitionPath.substr(
        masterThemeDefinitionDirectoryPath.length
      );
      const essentials = buildApplicationTemplate(dokiThemeDefinition);

      const fullFilePath = path.join(themeDirectory, destinationPath);

      fs.mkdirSync(path.resolve(fullFilePath, ".."), {
        recursive: true,
      });

      const appTemplateDefinition = fullFilePath.replace(
        "master.definition",
        `${appName}.definition`
      );
      const previousAppTemplateDefinition = getExistingAppDefinition(
        appTemplateDefinition
      );

      const definitionAsString = JSON.stringify(
        {
          ...essentials,
          ...previousAppTemplateDefinition,
        },
        null,
        2
      );
      
      fs.writeFileSync(appTemplateDefinition, definitionAsString);
    });
  })
  .then(() => {
    console.log("Theme Template Generation Complete!");
  });

function getExistingAppDefinition(appTemplateDefinition: string) {
  if(fs.existsSync(appTemplateDefinition)) {
    return JSON.parse(fs.readFileSync(appTemplateDefinition, {encoding: 'utf-8'}));
  }

  return {}
}
