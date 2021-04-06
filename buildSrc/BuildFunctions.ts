import {
  MasterDokiThemeDefinition,
  readJson,
  walkDir,
} from "doki-build-source";
import path from "path";

export const masterThemesDirectory = path.resolve(__dirname, "..");

export const masterThemeDefinitionDirectoryPath = path.resolve(
  masterThemesDirectory,
  "definitions"
);


export function walkAndBuildTemplates() {
  return walkDir(masterThemeDefinitionDirectoryPath)
    .then((files) => files.filter((file) => file.endsWith("master.definition.json"))
    )
    .then((dokiFileDefinitionPaths) => {
      return {
        dokiFileDefinitionPaths,
      };
    })
    .then((templatesAndDefinitions) => {
      const { dokiFileDefinitionPaths } = templatesAndDefinitions;
      return dokiFileDefinitionPaths.map((dokiFileDefinitionPath) => ({
        dokiFileDefinitionPath,
        dokiThemeDefinition: readJson<MasterDokiThemeDefinition>(
          dokiFileDefinitionPath
        ),
      }));
    });
}
