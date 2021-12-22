import path from "path";
import fs from "fs";
import {masterThemesDirectory, walkAndBuildTemplates} from "./BuildFunctions";
import {MasterDokiThemeDefinition} from "doki-build-source";

console.log("Preparing to create color.");

type RGBArray = [number, number, number, number];

function hex_to_rgba(a: string): RGBArray {
  '#' == a[0] && (a = a.substring(1));
  6 > a.length && (a += '000000'.substr(0, 6 - a.length));
  return [parseInt(a.substring(0, 2), 16),
    parseInt(a.substring(2, 4), 16),
    parseInt(a.substring(4, 6), 16),
    a.length > 6 ? parseInt(a.substring(6, 8), 16) : 0xFF
  ];
}

function rgb_to_hex(a: RGBArray) {
  const b = (a[2] | a[1] << 8 | a[0] << 16).toString(16);
  return '000000'.substr(0, 6 - b.length) + b;
}

function blendColors(
  base: RGBArray,
  added: RGBArray,
): RGBArray {
  const mix = [];
  const overlayAlpha = added[3] / 0xFF;
  const baseAlpha = base[3] / 0xFF;
  mix[3] = 1 - (1 - overlayAlpha) * (1 - baseAlpha); // alpha
  mix[0] = Math.round((added[0] * overlayAlpha / mix[3]) + (base[0] * baseAlpha * (1 - overlayAlpha) / mix[3])); // red
  mix[1] = Math.round((added[1] * overlayAlpha / mix[3]) + (base[1] * baseAlpha * (1 - overlayAlpha) / mix[3])); // green
  mix[2] = Math.round((added[2] * overlayAlpha / mix[3]) + (base[2] * baseAlpha * (1 - overlayAlpha) / mix[3])); // blue
  return mix as RGBArray;
}

function addNewColor(dokiTheme: { dokiThemeDefinition: MasterDokiThemeDefinition; dokiFileDefinitionPath: string }) {
  const baseColor = hex_to_rgba(
    dokiTheme.dokiThemeDefinition.colors.textEditorBackground
  );
  const overlayColor = hex_to_rgba(
    dokiTheme.dokiThemeDefinition.colors.caretRow + "99"
  )
  const blendedColor = blendColors(baseColor, overlayColor);
  const newColor = rgb_to_hex(blendedColor);

  dokiTheme.dokiThemeDefinition.colors["lightEditorColor"] = '#' + newColor
}

walkAndBuildTemplates()
  .then((dokiThemes) => {
    return dokiThemes
      .reduce(
        (accum, dokiTheme) =>
          accum.then(() => {
            addNewColor(dokiTheme);
            fs.writeFileSync(dokiTheme.dokiFileDefinitionPath,
              JSON.stringify(dokiTheme.dokiThemeDefinition, null, 2)
            );

            return Promise.resolve("dun")
          }),
        Promise.resolve("")
      );
  })
  .then(() => {
    console.log("Color Creation Complete!");
  });
