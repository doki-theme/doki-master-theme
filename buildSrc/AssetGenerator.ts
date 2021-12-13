import path from "path";
import fs from "fs";
import jimp from "jimp";
import { masterThemeDefinitionDirectoryPath, masterThemesDirectory, walkAndBuildTemplates, } from "./BuildFunctions";

function buildBlankAsset(backgroundDirectory: string): Promise<void> {
  const highlightColor = jimp.cssColorToHex("#00000000");
  return new Promise<void>((resolve, reject) => {
    // @ts-ignore
    new jimp(300, 120, (err, image) => {
      for (let i = 0; i < 33; i++) {
        for (let j = 0; j < 300; j++) {
          image.setPixelColor(highlightColor, j, i);
        }
      }

      image.rgba(true);
      image.write(backgroundDirectory, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

console.log("Preparing asset generation.");

function createAsset(assetPath: string): Promise<void> {
  fs.mkdirSync(path.resolve(assetPath, ".."), {
    recursive: true,
  });

  if (!fs.existsSync(assetPath)) {
    console.log("creating ", assetPath);
    return buildBlankAsset(assetPath);
  } else {
    return Promise.resolve();
  }
}

const createSmolAsset = (
  stickerPath: string,
  smolStickerPath: string
): Promise<void> => {
  console.log(`Smolifying sticker ${stickerPath}`);
  
  fs.mkdirSync(path.resolve(smolStickerPath, ".."), {
    recursive: true,
  });
  return new Promise((resolve, reject) => {
    jimp.read(stickerPath, function (err, img) {
      console.log(`Read sticker ${stickerPath}`);
      if (err) {
        reject(err)
      } else {
        const width = img.getWidth();
        const height = img.getHeight();
        const newHeight = width > height ? (height / width) * 150 : 150;
        const newWidth = height > width ? (width / height) * 150 : 150;
        img.resize(newWidth, newHeight)
          .write(smolStickerPath, (err) => {
            if (err) {
              reject(err)
            } else {
              console.log(`Successfully smolified ${stickerPath}`);
              resolve()
            }
          })
      }
    })
  });
};

const createSmolWallpaper = (
  transparentWallpaperPath: string,
  smolWallpaperPath: string
): Promise<void> => {
  console.log(`Smolifying wallpaper ${transparentWallpaperPath}`);
  
  fs.mkdirSync(path.resolve(smolWallpaperPath, ".."), {
    recursive: true,
  });
  return new Promise((resolve, reject) => {
    jimp.read(transparentWallpaperPath, function (err, img) {
      console.log(`Read wallpaper ${transparentWallpaperPath}`);
      if (err) {
        reject(err)
      } else {
        const width = img.getWidth();
        const height = img.getHeight();
        if(width <= 1920) {
          console.log(`Didn't need to do anything for ${transparentWallpaperPath}`);
          resolve()
        } else {
          const newWidth = 1920;
          const newHeight = 1920 * (height / width);
          img.resize(newWidth, newHeight)
          .write(smolWallpaperPath, (err) => {
            if (err) {
              reject(err)
            } else {
              console.log(`Successfully smolified ${transparentWallpaperPath}`);
              resolve()
            }
          })
        }
      }
    })
  });
};

walkAndBuildTemplates()
  .then((dokiThemes) => {
    const dokiThemeAssetsDirectory = path.resolve(
      masterThemesDirectory,
      "..",
      "..",
      "doki-theme-assets"
    );

    return dokiThemes
      .map(({ dokiFileDefinitionPath, dokiThemeDefinition }) =>
        Object.entries(dokiThemeDefinition.stickers).map(([, stickerName]) => ({
          dokiFileDefinitionPath,
          stickerName,
        }))
      )
      .reduce((accum, next) => [...accum, ...next], [])
      .reduce(
        (accum, dokiTheme) =>
          accum.then(() => {
            const { dokiFileDefinitionPath, stickerName } = dokiTheme;
            const destinationPath = dokiFileDefinitionPath.substr(
              masterThemeDefinitionDirectoryPath.length
            );
            const stickerPath =
              destinationPath.substr(0, destinationPath.lastIndexOf(path.sep) + 1) +
              stickerName;

            // create all of the necessary sticker assets
            return Promise.all(
              [["jetbrains", "v2"], ["vscode"]].map((directories) => {
                const fullStickerPath = path.join(
                  dokiThemeAssetsDirectory,
                  "stickers",
                  ...directories,
                  stickerPath
                );
                return createAsset(fullStickerPath);
              })
            )
              .then(() => {
                // create all background image templates
                return Promise.all(
                  [
                    ["backgrounds"],
                    ["backgrounds", "wallpapers"],
                    ["backgrounds", "wallpapers", "transparent"],
                  ].map((directories) => {
                    const wallpaperPath = path.join(
                      dokiThemeAssetsDirectory,
                      ...directories,
                      stickerName
                    );
                    return createAsset(wallpaperPath);
                  })
                );
              })
              .then(() => {
                // create all smol image assets for doki-home
                const chonkyStickerPath = path.join(
                  dokiThemeAssetsDirectory,
                  "stickers", "jetbrains", "v2",
                  stickerPath
                );
                const smolStickerPath = path.join(
                  dokiThemeAssetsDirectory,
                  "stickers", "smol",
                  stickerPath
                );
                const chonkyWallpaperPath = path.join(
                  dokiThemeAssetsDirectory,
                  "backgrounds", "wallpapers", "transparent",
                  stickerName
                );
                const smolWallpaperPath = path.join(
                  dokiThemeAssetsDirectory,
                  "backgrounds", "wallpapers", "transparent", "smol",
                  stickerName
                );
                return createSmolAsset(
                  chonkyStickerPath,
                  smolStickerPath,
                ).then(() =>
                  createSmolWallpaper(
                    chonkyWallpaperPath,
                    smolWallpaperPath,
                  )
                );
              })
              .then(() => "");
          }),
        Promise.resolve("")
      );
  })
  .then(() => {
    console.log("Asset Generation Complete!");
  });
