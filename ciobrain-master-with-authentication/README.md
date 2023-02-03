# CIOBrain

CIOBrain is the visualization of the mind of a CIO.

## Setup

[Node.JS](https://nodejs.org/) is required for setting up. Moreover, the [ciobrain-api](https://github.com/CIOBrain/ciobrain-api) project is required to be set up prior to this one.

1. Ensure the CIOBrain API is running.
2. Run the `npm install` command on this project. This can be done by navigating a terminal window to have its current directory be the root folder of this project, then running the command.
3. Run the `npm start` command on this project.

## Deployment

While there are many ways to approach deployment, this guide will use [VSCode](https://code.visualstudio.com/) and [Microsoft Azure](https://azure.microsoft.com/).

### Installing the Azure Deployment Tool

1. Open VsCode
2. Select the Extensions from the left menu bar (fifth icon)
	- Or [Ctrl]-[Shift]-[X]
3. Search “Azure App Service” and “Install”

### Deploying to the Cloud
1. Open the CIOBrain project in VsCode
2. Select Azure from the left menu bar 
	- Or [Shift]-[alt]-[A]
3. Expand the “App Service” Tab
	- ![App service](https://i.imgur.com/wSQK4BG.png)
4. Select the second icon to “Deploy to Web App”
5. Select “Create new Web App (Advanced)”
	- ![Create new web app](https://i.imgur.com/FHPOTDo.png)
6. For the name of the web app, enter “CIOBrain”
	- The name of the web app can be anything. Only the API name has to be constant and to stay consistent with the api url configured in src/common/Asset.js in CIOBrain.   
7. Select “Create new resource group”
8. Enter a name for the new resource group (ie. “CIOBrain-resource”)
9. For the runtime stack, select “Node 14 LTS”
10. For the OS, select “Windows”
11. For the location for new resources, select “Central US”.
	- “Central US” resources are the closest to Texas and therefore, will give us the fastest response times. This can change if the location of the website user/tester is closer to the west or east coast.  
12. For the Windows App Service Plan, select “Create new App Service plan”
13. Enter a name for the new service plan (ie. “CIOBrain-plan”)
14. For the pricing tier, select “Free (F1)”.
	- This can change if the website scales or if other Azure features are needed.
15. For the Application Insights resource, select “Skip for now”. 

### Re-deployment
1. Open the CIOBrain API project in VsCode
2. Select Azure from the left menu bar 
	- Or [Shift]-[alt]-[A]
3. Expand the “App Service” Tab
4. Right click “CIOBrain API” or “CIOBrain”  and select “Deploy to Web App” to redeploy. 
5. When the warning message pops up, select “Deploy” to confirm.
