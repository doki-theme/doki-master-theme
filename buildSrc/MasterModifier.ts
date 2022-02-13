import fs from "fs";
import { walkAndBuildTemplates } from "./BuildFunctions";
import { MasterDokiThemeDefinition } from "doki-build-source";
import { v4 as uuid } from 'uuid'

console.log("Preparing to modify theme definitions.");

function doSomethingToThemeDefinition(dokiTheme: { dokiThemeDefinition: MasterDokiThemeDefinition; dokiFileDefinitionPath: string }) {
  // dokiTheme.dokiThemeDefinition.characterId = uuid()
}

walkAndBuildTemplates()
  .then((dokiThemes) => {
    return dokiThemes
      .reduce(
        (accum, dokiTheme) =>
          accum.then(() => {
            doSomethingToThemeDefinition(dokiTheme);
            fs.writeFileSync(dokiTheme.dokiFileDefinitionPath,
              JSON.stringify(dokiTheme.dokiThemeDefinition, null, 2)
            );

            return Promise.resolve("dun");
          }),
        Promise.resolve("")
      );
  })
  .then(() => {
    console.log("Color Creation Complete!");
  });
