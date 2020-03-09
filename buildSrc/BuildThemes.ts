// @ts-ignore
import {DokiThemeDefinitions, DokiThemeTemplateDefinition, StringDictonary} from './types';

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..');

const fs = require('fs');

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

const omit = require('lodash/omit');

console.log('Preparing to generate themes.');
walkDir(masterThemeDefinitionDirectoryPath)
    .then(files => files.filter(file => file.endsWith('doki.json')))
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
    console.log(dokiThemes)
    const dokiThemeDefinitions = dokiThemes.forEach(dokiTheme => {

    })
})
    .then(() => {
        console.log('Theme Generation Complete!');
    });
