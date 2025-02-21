/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/intro1` | `/(auth)/intro2` | `/(auth)/intro3` | `/(auth)/signIn` | `/(auth)/signUp` | `/(auth)/welcome` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/library` | `/(tabs)/profile` | `/_sitemap` | `/home` | `/intro1` | `/intro2` | `/intro3` | `/library` | `/profile` | `/read` | `/scan/scanPage` | `/signIn` | `/signUp` | `/type/typing` | `/voices/selectVoice` | `/welcome`;
      DynamicRoutes: `/file/${Router.SingleRoutePart<T>}` | `/txt/${Router.SingleRoutePart<T>}` | `/url/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/file/[fileId]` | `/txt/[txtId]` | `/url/[urlId]`;
    }
  }
}
