# ---------------------------------------------------------------------------
# Custom Values
# ---------------------------------------------------------------------------

$location="centralus" #This is the region the service will be hosted in by Azure

$resourceGroup="ciobrainapi-rg-365631630" #EXAMPLE: ciobrain-api-rg#### (This must be unique, you can use any number of your choosing.)

$githubusername="tallow-io" #Enter the username to your github account

$appServicePlan="ciobrainapi-plan-365631630" #EXAMPLE: ciobrain-api-plan (This must be unique.)

$webapp="ciobrain-api-unqiue-name" #EXAMPLE: ciobrain-api-$randomIdentifier (This must also be unique.)

$reactapp="ciobrain" #EXAMPLE: ciobrain-frontend (This does NOT need to be unique.)

# ---------------------------------------------------------------------------
# Do not modify past this point.
# ---------------------------------------------------------------------------
$tag="deploy-github.sh"
$gitrepo="https://github.com/$githubusername/ciobrain-api"

# login to GitHub
gh auth login
#Login to Azure
az login

# ---------------------------------------------------------------------------
# CIOBrain API Application Deployment
# ---------------------------------------------------------------------------

# fork CIOBrain api repo
gh repo fork antonhi/ciobrain-api

# Create a resource group.
Write-Output "Creating $resourceGroup in "$location"..."
az group create --name $resourceGroup --location "$location" --tag $tag

# Create an App Service plan in `FREE` tier.
Write-Output "Creating $appServicePlan"
az appservice plan create --name $appServicePlan --resource-group $resourceGroup --sku FREE

# Create a web app.
Write-Output "Creating $webapp"
az webapp create --name $webapp --resource-group $resourceGroup --plan $appServicePlan

# Deploy code from a public GitHub repository. 
az webapp deployment source config --name $webapp --resource-group $resourceGroup --repo-url $gitrepo --branch master --manual-integration

$site="https://$webapp.azurewebsites.net"

# Set up continuous integration
Write-Output "Do you want to set up continuous integration for automatic deployments whenever your GitHub repository is updated? (Y/n) "
$continteg = Read-Host
if ( $continteg -eq "Y" -or $contineg -eq "y" ){
Write-Output " "
Write-Output "Generate a personal access token on GitHub to set up automatic deployments whenever the repository is updated. Go to https://github.com/settings/tokens?type=beta"
Write-Output "Input token here: "
$githubtoken = Read-Host
az webapp deployment source config --name $webapp --resource-group $resourceGroup --repo-url $gitrepo --branch master --git-token $githubtoken
}

# ---------------------------------------------------------------------------
# CIOBrain React Application Deployment
# ---------------------------------------------------------------------------

# fork CIOBrain frontend repo
gh repo fork antonhi/ciobrain

# open the Asset.js file in the forked repo
$fileloc="https://github.com/$githubusername/ciobrain/blob/master/src/URL.js"

Start-Process $fileloc

Write-Output "Please change the 'URL' value to: $site/asset"
Write-Output "When done, press enter."
Read-Host

# deploy static web app from the forked repo

az staticwebapp create --name $reactapp --resource-group $resourceGroup --source https://github.com/$githubusername/ciobrain --location $location --branch master --app-location "/"  --output-location "build"   --login-with-github

# output processing message
Start-Process "https://github.com/$githubusername/ciobrain/actions"
Write-Output "Azure is deploying CIOBrain on your account. Please wait until the workflow displays a green dot. When it does, return and press enter."
Read-Host

$finalurl = az staticwebapp show --name  $reactapp --query "defaultHostname"
$finalurl -replace '"', ""
Start-Process "https://"$finalurl

Write-Output " "
Write-Output " "
Write-Output "CIOBrain is completely deployed on your Azure account. Visit the above link to view it."




