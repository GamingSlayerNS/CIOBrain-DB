# CIOBrain

CIOBrain is the visualization of the mind of a CIO.

## Setup

[Node.JS](https://nodejs.org/) is required for setting up.

1. Run the `npm install` command on this project. This can be done by navigating a terminal window to have its current directory be the root folder of this project, then running the command.
2. Run the `npm start` command on this project.

## Testing API Calls

1. Navigate to [Postman](https://www.postman.com/downloads/)
2. Sign up for an account if you don’t already have one
3. Download Postman
4. Open Postman and Login
5. Navigate to “My Workspace” or Create a new workspace
6. Next to “My Workspace”, select “Import” > “File” > “Upload Files”
7. Navigate to the CIOBrainAPI project folder > “sample requests” > “CIOBrain API.postman_collection”  inside File Explorer
	- “CIOBrain API.postman_collection” is for local testing when the API is hosted on localhost
	- Import “CIOBrain API - Production.postman_collection” to also test the API when it’s running in Azure.
8. “Import”. 
9. Select a request from within a folder and “Send”
	- For POST requests, make sure the request body is filled out accordingly.
		- To fill one out, select “Body” > “raw” > “JSON” 
		- ![post requests](https://i.imgur.com/PmaW7wf.png)
	- For GET requests, no request body is needed. 
	- More information for how api endpoints can be called can be found in [index.js](./index.js).

## Changing Excel Files

1. Acquire the datasets for application, data and infrastructure.
2. Rename the excel files according to the corresponding file name:
	- Application.xlsx
	- Data.xlsx
	- Infrastructure.xlsx
4. Replace the respective files under the `./src/data/` folder

## Viewing the Server Log

The `log.txt` file can be found in the `./src/data/` folder. If this file is missing, no errors were found or recorded.

## Deployment

While there are many ways to approach deployment, this guide will use [VSCode](https://code.visualstudio.com/) and [Microsoft Azure](https://azure.microsoft.com/).

### Installing the Azure Deployment Tool

1. Open VsCode
2. Select the Extensions from the left menu bar (fifth icon)
	- Or [Ctrl]-[Shift]-[X]
3. Search “Azure App Service” and “Install”

### Deploying to the Cloud

1. Open the CIOBrain API project in VsCode
2. Select Azure from the left menu bar 
	- Or [Shift]-[alt]-[A]
3. Expand the “App Service” Tab
	- ![App Service Tab](https://i.imgur.com/sdiLptK.png)
4. Select the second icon to “Deploy to Web App”
5. Select “Create new Web App (Advanced)”
	- ![Create new Web App](https://i.imgur.com/aS3VhcO.png)
6. For the name of the web app, enter “CIOBrainAPI”
	- The name must be exactly written as above so that url of the api is generated as [https://ciobrainapi.azurewebsites.net/](https://ciobrainapi.azurewebsites.net/) and the front-end is configured to send requests to this url. 
7. Select “Create new resource group”
8. Enter a name for the new resource group (ie. “CIOBrainAPI-resource”)
9. For the runtime stack, select “Node 14 LTS”
10. For the OS, select “Windows”
11. For the location for new resources, select “Central US”.
	- “Central US” resources are the closest to Texas and therefore, will give us the fastest response times. This can change if the location of the website user/tester is closer to the west or east coast.  
12. For the Windows App Service Plan, select “Create new App Service plan”
13. Enter a name for the new service plan (ie. “CIOBrainAPI-plan”)
14. For the pricing tier, select “Free (F1)”.
	- This can change if the website scales or if other Azure features are needed.
15. For the Application Insights resource, select “Skip for now”. 
16. After the API has deployed, “CIOBrainAPI” should be listed under “App Service”. When the API has finished deploying, left click “Application Settings” under “CIOBrainAPI” > “Add new setting”.
	- ![Add new setting](https://i.imgur.com/7bsrncy.png)
17. For “new app setting name”, enter “SCM_DO_BUILD_DURING_DEPLOYMENT”
18. For “value”, enter “true”. This enables build automation identifying the start script and generating a web.config file.
19. Right click “CIOBrain API” and select “Deploy to Web App” to redeploy. 
20. When the warning message pops up, select “Deploy” to confirm.
	- ![Warning](https://i.imgur.com/hUfUbGn.png)
21. Navigate to [https://ciobrainapi.azurewebsites.net/](https://ciobrainapi.azurewebsites.net/) and you should see
	- ![Visual](https://i.imgur.com/IhBVaA6.png)
22. Navigate to [https://ciobrainapi.azurewebsites.net/asset/application/1](https://ciobrainapi.azurewebsites.net/asset/application/1) to see data responses from specific api endpoints
	- ![Data responses](https://i.imgur.com/kdkO61R.png)

#### Notes

- If after deployment, the app deploys successfully, but the Azure help page shows up instead of the CIOBrain application, ensure the API is being run on process.env.PORT in index.js. 
- If after deployment, the app shows “You do not have permission to view the directory or page”. The web.config file was probably not generated correctly. Redeploy the web app or recreate the web app from scratch. 
