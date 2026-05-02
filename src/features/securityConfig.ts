import type { IAppSecurity } from "./userContextSlice"

export type SecurityConfig = {
  features?: string[],
  roles?: {
    role: string,
    defaultPath?: string,
    allowedPaths?: string[]
    features?: string[]
  }[]

}

export const load = (config: SecurityConfig, userRoles: string[]): IAppSecurity => {

  let userDefaultPath: string = ''
  const userAllowedPaths: Set<string> = new Set<string>()
  const userFeatures: Set<string> = new Set<string>()


  if (config.roles) {
    for (const userRole of userRoles) {
      for (const securityRole of config.roles) {
        if (userRole === securityRole.role) {
          
          if (securityRole.defaultPath && !userDefaultPath) {
            userDefaultPath = securityRole.defaultPath
          }
          
          if (securityRole.allowedPaths?.length) {
            for (const allowedPath of securityRole.allowedPaths) {
              userAllowedPaths.add(allowedPath)
            }
          }

          if (config.features?.length && securityRole.features?.length) {
            for (const feature of config.features) {
              for(const roleFeature of securityRole.features) {
                const match = feature.match(new RegExp(roleFeature))
                if (match) {
                  userFeatures.add(feature)
                }
              }
            }
          }

        }

      }
    }
  }

const appSecurity: IAppSecurity = {
    defaultPath: userDefaultPath,
    allowedPaths: Array.from(userAllowedPaths),
    features: Array.from(userFeatures)
  }
  return appSecurity
}
