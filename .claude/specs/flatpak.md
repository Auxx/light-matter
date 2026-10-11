# Add FlatPak to build process

This is an NX workspace which builds a desktop application using Electron.
`apps/desktop` contains main process project, `apps/web` contains renderer/UI
process project. Update workspace configuration to add FlatPak build support.

## Requirements

- Add a new options file inside `apps/desktop/src/app/options` containing
  FlatPak related build options.
- Add a new NPM script called `make:prod-flatpak` to build a FlatPak following
  the existing approach to other packaging formats.
- Update GitHub Actions inside `.github/workflows/release.yml` to add automatic
  FlatPak build and release.
