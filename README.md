# CVWO 23/24 Project React Frontend
Lu Bolin


## Hosted demo:
The entire experience is accessible at [LocaleLookout](https://localelookout.onrender.com/).



## Setup Instructions

Remember to setup the backend too. It can be found at [LuBolin/CVWO_AY23-24_Backend (github.com)](https://github.com/LuBolin/CVWO_AY23-24_Backend).

#### Prerequisites:
- Postgresql 15
- Golang 1.21.4

Forward compatability is expected as there were no major changes around these versions.
However, they have not been tested.




**Clone this repository**
```bash
git clone https://github.com/LuBolin/CVWO_AY23-24_Frontend.git
```

#### Rewrite rule:
On the hosting server, set a **rewrite** rule from /* to /index.html. This helps static webpages to work with React's routing.

If necessary, set **Publish directory** to /dist.


#### Environment Variables:
These can be set in the .env file.
When hosting online, for example in the case of render.com, you can set them from the hosting dashboard.

- VITE_APP_API_URL: address of the backend hosting server.
  For the onrender.com example, this is https://cvwo-backend-hew4.onrender.com.


#### Build & Run command:
```bash
npm install
npm run dev
```
Note that if you were to deploy, use npm run build to build it.
Dev is used here for a quick local service for testing.