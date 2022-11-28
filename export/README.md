## Exporting Application
In order to export the application, you need to first make sure that all your entities:
* Devices
* Analysis
* Actions
* Access Management Rules

Has the tag **export_id** with a unique value on it.
Only entities with the export_id tag will be exported to the new profile. This is not applicable for Dictionaries and Run Buttons, as all of them will be exported.

## Warning
* Be careful with clean.ts ```bash $ npm run clean  ``` will clean up the configured import token profile.
* Email templates are not exported.


### config.ts file
Edit the config.ts file to setup the export rules.

You will get the token from https://admin.tago.io/account for each profile. 
* Make sure the token used is set with **Expire In** to never.
* Make sure the token from the exported application is the same as the ones from the Analysis, as it will be replaced by the token for the import profile.


### how to run?
```bash
$ npm run export
```

