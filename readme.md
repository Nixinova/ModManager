[![Latest version](https://img.shields.io/github/v/release/Nixinova/ModManager?label=latest%20version&style=flat-square)](https://github.com/Nixinova/ModManager/releases)
[![Last updated](https://img.shields.io/github/release-date/Nixinova/ModManager?label=updated&style=flat-square)](https://github.com/Nixinova/ModManager/releases)
[![npm downloads](https://img.shields.io/npm/dt/mcmodmanager?logo=npm)](https://www.npmjs.com/package/mcmodmanager)

# ModManager

Keep your CurseForge Minecraft mods up to date with **ModManager**, the easy-to-use CLI command.

## Install

ModManager is available [on npm](https://npmjs.com/package/mcmodmanager):

Install it globally using `npm install -g mcmodmanager`.

## Usage

### CLI

ModManager must be initialised inside your mods folder.

Do this by first by opening the command line and entering your mods directory (which is usually under `%appdata%\.minecraft` on Windows) using `cd`:

```cmd
cd %appdata%\.minecraft\.mods
```

The above command (or your equivalent) must always be done before you use any ModManager commands.

After you have `cd`'d into your mods folder, set up a ModManager configuration file (`mods.json`) with the Minecraft version you will be using (1.16 in this example):

```cmd
modmanager setup 1.16
```

Now you can install whatever mods you want from CurseForge.
To do so, simply go to the CurseForge page of your mod and copy its Project ID found on the right-hand side of the page.
Then enter this project ID (`238222` in this example) into the `modcrafter install` command:

```cmd
modcrafter install curse 238222
```

This will install the version of mod `238222` that corresponds to your configured Minecraft version in `mods.json` (in this case, 1.16), given that there is a 1.16 version of the mod available.

If successful, your `mods.json` file should look something like this:

```json
{
  "version": {
    "minecraft": "1.16"
  },
  "mods": {
    "238222": {
      "name": "Just Enough Items (JEI)",
      "host": "curseforge",
      "url": "https://www.curseforge.com/minecraft/mc-mods/jei",
      "version": "jei-1.16.4-7.6.0.56"
    }
  }
}
```

To automatically update all mods in `mods.json` to their latest versions, use `modmanager update`:

```cmd
modmanager update
```

To uninstall a certain mod and remove it from `mods.json`, use `modmanager remove <modID>`; in this case, mod `238222`:

```cmd
modmanager remove 238222
```

### Node

ModManager has Node exports of all above CLI commands:

- `setup(mcVersion)`
  - Initialise a directory with a `mods.json` file and configure it to use mods for a given Minecraft version (e.g., `1.16`).
- `install(host, modID)`
  - Install a mod from a given host (such as `curseforge`) from a given mod ID (e.g., `123456`).
- `remove(modID)`
  - Remove a mod given an existing mod ID (e.g., `123456`).
- `update()`
  - Install the latest version of all mods.
