export interface IAppConfig {
  env: {
    name: string;
  };
  apiServer: {
    baseUrl: string;
    socketURL: string;
  };
}
