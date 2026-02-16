import { SecurityConfig } from "./src/features/securityConfig";

export default {
  features: ["FEATURE_A","FEATURE_B","Another_Feature"],
  roles: [
    {
      "role": "MANSUPERVI",
      "defaultPath": "/a",
      "allowedPaths": [".*"],
      "features": ["^F.*"]
    },
    {
      "role": "ROSPTA",
      "defaultPath": "/b",
      "allowedPaths": ["^b.*"],
      "features": ["Another_Feature"]
    }
  ]
} satisfies SecurityConfig