/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  base_url: 'https://10.1.0.191:443/',
  // base_url: 'http://localhost:59203/',
  server_status_scheduling_time: 10000,//in mili seconds.
  log_scheduling_time: 10000,//in mili seconds.
  weather_data_scheduling_time: 10000,//in mili seconds.
  weather_status_scheduling_time:10000,
  broadcast_status_scheduling_time:10000,
};
