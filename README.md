# Placeholder README

CVWO 23/24 Project
Lu Bolin

## Setup Instructions

Remember to setup the backend too. It can be found at [LuBolin/CVWO_AY23-24_Backend (github.com)](https://github.com/LuBolin/CVWO_AY23-24_Backend).

Clone the cvwo-frontend repo.

**Rewrite rule**: On the hosting server, set a **rewrite** rule from /* to /index.html. This helps static webpages to work with React's routing.

If necessary, set *Publish directory* to /dist.

**Environment Variables**:

These can be set in the .env file.
When hosting online, for example in the case of render.com, you can set them from the hosting dashboard.

- VITE_APP_API_URL: address of the backend hosting server.
  For the onrender.com example, this is https://cvwo-backend-hew4.onrender.com.

**Build & Run command**: 

```bash
npm install; npm run build
```