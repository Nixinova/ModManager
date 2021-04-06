#!/usr/bin/env node

const fs = require('fs');
const download = require('download');
const curseforge = require('mc-curseforge-api');

const VERSION = '1.0.3';
const MODS_FILE = 'mods.json';

function getConfig() { return JSON.parse(fs.readFileSync(MODS_FILE, { encoding: 'utf8' }, data => data)); }
function getUrlFileName(url) { return url.match(/[^/]+$/)?.[0]; }

async function getMod(host, modID) {
    switch (host.toLowerCase()) {
        case 'curseforge': return await curseforge.getMod(+modID);
    }
}

async function getModFiles(host, modID) {
    switch (host.toLowerCase()) {
        case 'curseforge': return await curseforge.getModFiles(+modID);
    }
}

function getValidVersions(versions, mcver) {
    const validVers = versions.filter(obj => {
        const getMajor = ver => ver.replace(/^(\d+\.\d+).*$/, '$1');
        return obj.minecraft_versions.map(ver => getMajor(ver)).includes(getMajor(mcver));
    });
    return validVers;
}

async function setup(mcver) {
    const data = { version: { config: 1, minecraft: mcver }, mods: {} };
    fs.writeFile(MODS_FILE, JSON.stringify(data, {}, 4), { encoding: 'utf8' }, data => data);
}

async function install(srcArg, modID) {
    if (!modID) throw new Error(`Mod host argument is missing. Try 'modmanager install curse ${srcArg}'.`);
    const source = /^-*c/.test(srcArg) ? 'curseforge' : srcArg;
    const modsJson = getConfig();
    const mcver = modsJson.version.minecraft;
    const modinfo = await getMod(source, modID);
    const files = getValidVersions(await getModFiles(source, modID), mcver);
    if (!files.length) throw new Error(`No valid ${mcver} versions for mod ${modID} ${modinfo.name}`);
    modsJson.mods[modID] = {
        name: modinfo.name,
        host: source,
        url: modinfo.url,
        version: getUrlFileName(files[0].download_url),
    }
    download(files[0].download_url, '.');
    fs.writeFile(MODS_FILE, JSON.stringify(modsJson, {}, 4), { encoding: 'utf8' }, data => data);
}

async function remove(a, b) {
    const modID = b || a;
    const modsJson = getConfig();
    if (!modsJson.mods[modID]) return;
    fs.unlink('./' + modsJson.mods[modID].version, err => err && console.log(err))
    delete modsJson.mods[modID];
    fs.writeFile(MODS_FILE, JSON.stringify(modsJson, {}, 4), { encoding: 'utf8' }, data => data);
}

async function update() {
    const modsJson = getConfig();
    const mcver = modsJson.version.minecraft;
    for (let [modID, obj] of Object.entries(modsJson.mods)) {
        const files = getValidVersions(await curseforge.getModFiles(modID), mcver);
        const dlUrl = files[0]?.download_url;
        if (!dlUrl || getUrlFileName(dlUrl) !== obj.version) {
            install(modID).catch(e => { console.error(e) });
        }
    }
}

module.exports = { setup, install, remove, update };

const args = process.argv.slice(2);
if (args[0]) {
    const cmd = args[0];
    if (/^-*h/.test(cmd)) console.log(`
    ModManager commands:

        modmanager help
            Display this help message.
        modmanager setup <mcVersion>
            Initialise a 'mods.json' configuration file with a given Minecraft version.
        modmanager install curse <modID>
            Install a mod from CurgeForge, saving its metadata to 'mods.json'.
        modmanager remove [curse] <modID>
            Uninstall a mod and remove its metadata from 'mods.json'.
        modmanager update
            Update all mods specified in the 'mods.json' file.
        modmanager version
            Display the current version of ModManager.
    `);
    else if (/^-*s/.test(cmd)) setup(args[1]).catch(e => console.error(e));
    else if (/^-*i/.test(cmd)) install(args[1], args[2]).catch(e => console.error(e));
    else if (/^-*r/.test(cmd)) remove(args[1]).catch(e => console.error(e));
    else if (/^-*u/.test(cmd)) update().catch(e => console.error(e));
    else if (/^-*v/.test(cmd)) console.log(`The current version of ModManager is ${VERSION}`)
}
