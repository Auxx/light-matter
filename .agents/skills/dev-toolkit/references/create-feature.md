# create-feature

Create a new feature inside an Angular application project.

## Key Principles

1. **Always use `--no-interactive`** - Prevents prompts that would hang execution
2. Feature generator is invoked using `nx g @lmgm/dev-toolkit:feature` followed by required arguments
3. **Match existing repo patterns** - Study similar artifacts in the repo and follow their conventions
4. **Verify with lint/test/build/typecheck etc.** - Generated code must pass verification. The listed targets are just an example, use what's appropriate for this workspace.

## Steps

### 1. Verify user input

A user must specify the following:

- Project name: must be a non-empty string (convert to camel case and pass to generator as `--project` argument)
- Feature name: must be a non-empty string (convert to camel case and pass to generator as `--name` argument)

### 2. Dry-Run to Verify File Placement

**Always run with `--dry-run` first** to verify files will be created in the correct location:

```bash
nx g @lmgm/dev-toolkit:feature --project=<project-name> --name=<feature-name> --no-interactive --dry-run
```

Review the output carefully. If files are created in the wrong location, adjust your options.

### 3. Run the Generator

Execute the generator:

```bash
nx g @lmgm/dev-toolkit:feature --project=<project-name> --name=<feature-name> --no-interactive
```

### 4. Format and Verify

Format all generated/modified files:

```bash
npm run format
```
