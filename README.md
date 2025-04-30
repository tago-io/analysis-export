# analysis-export

A script to import applications and their resources from one TagoIO profile to another.  
Primarily used within the TagoIO Profile (`documentation@tago.io`) and the analysis at [TagoIO Analysis](https://admin.tago.io/analysis/63e6980e8cba660009ceafbe).

## Features

- Copies devices, dashboards, analysis, access management, run buttons, actions, and dictionaries between TagoIO profiles.
- Supports selective entity import and data transfer.
- Handles audit logging and validation.
- Notifies users about the import process.

## Requirements

- Node.js (recommended: v18+)
- TagoIO Analysis Token (see below)
- Paid TagoIO plan on the target profile (import will not work on free plans)
- TagoRUN must be enabled on the target profile

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Usage

### Running the Script

To run the import script locally:

```bash
T_ANALYSIS_TOKEN="Copy-The-Token_of_The-Analysis-Here" npx ts-node-dev src/startAnalysis.ts
```

- Replace `Copy-The-Token_of_The-Analysis-Here` with your TagoIO Analysis token.

### Building for TagoIO Analysis

To build the script for use in TagoIO Analysis:

```bash
npm run build
```

- This will generate `build/analysis.tago.js`.
- Copy the contents of `build/analysis.tago.js` and paste it into your TagoIO Analysis.

## Environment Variables

- `T_ANALYSIS_TOKEN`: The token for the TagoIO Analysis where the script will run.

## Scripts

- `npm run linter` — Run ESLint.
- `npm run linter-fix` — Auto-fix lint issues.
- `npm run test` — Run tests with Jest.
- `npm run analysis` — Run the analysis script with ts-node-dev.
- `npm run start` — Run the start script with ts-node-dev.
- `npm run build` — Build the script for TagoIO Analysis.

## Notes

- The import process will fail if the target profile does not have TagoRUN enabled or is on a free plan.
- The script will notify the user in TagoIO about the import status and errors.
- For more details, see the code comments in `src/startAnalysis.ts`.
