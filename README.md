# ✅ Azure Serverless Feedback Form

A simple, modern, and serverless web app built using Azure. Users submit feedback through a static HTML form hosted on Azure Blob Storage. The backend is a Node.js Azure Function that stores feedback into Azure Table Storage.

---

## 🎯 Goal

Build a full-stack feedback form using:

- **Frontend**: HTML/CSS/JS
- **Backend**: Azure Function (Node.js)
- **Database**: Azure Table Storage
- **Hosting**: Azure Blob Storage
- **Infrastructure**: Azure CLI & Bash

---

## 💡 Tech Stack

| Layer        | Technology            |
|--------------|------------------------|
| Frontend     | HTML, CSS, JavaScript  |
| Backend      | Azure Function (Node.js) |
| Storage      | Azure Blob + Table     |
| Deployment   | Azure CLI + Bash       |

---

## ⚙️ Prerequisites

- ✅ Azure CLI installed
- ✅ Node.js installed
- ✅ Azure Subscription

---

## 🚀 Deploy with One Bash Script

If you want to deploy everything in one go, run the following full Bash script.

> You can also save this as `deploy.sh` and run:
> ```bash
> chmod +x deploy.sh
> ./deploy.sh
> ```

```bash
#!/bin/bash

RESOURCE_GROUP="feedbackRG"
LOCATION="eastus"
STORAGE_ACCOUNT="feedbackstorage$RANDOM"
FUNCTION_APP="azureFeedbackFunc$RANDOM"
FRONTEND_PATH="./front-end"
FUNCTION_PATH="./api"

echo "🔧 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "💾 Creating storage account..."
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

echo "🌐 Enabling static website hosting..."
az storage blob service-properties update \
  --account-name $STORAGE_ACCOUNT \
  --static-website \
  --index-document index.html \
  --404-document index.html

echo "📤 Uploading frontend files..."
az storage blob upload-batch \
  --account-name $STORAGE_ACCOUNT \
  --destination \$web \
  --source $FRONTEND_PATH

echo "⚙️ Creating Azure Function App..."
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --functions-version 4 \
  --name $FUNCTION_APP \
  --storage-account $STORAGE_ACCOUNT

echo "🔐 Fetching and setting keys..."
ACCOUNT_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query [0].value -o tsv)

az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
  "STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT" \
  "STORAGE_ACCOUNT_KEY=$ACCOUNT_KEY"

echo "📦 Deploying Azure Function..."
cd $FUNCTION_PATH && zip -r ../../function.zip . && cd ../..
az functionapp deployment source config-zip \
  --resource-group $RESOURCE_GROUP \
  --name $FUNCTION_APP \
  --src function.zip

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Frontend URL: https://${STORAGE_ACCOUNT}.z13.web.core.windows.net"
echo "🛠️ Backend API: https://${FUNCTION_APP}.azurewebsites.net/api/submitFeedback"

Frontend URL:
https://<your-storage-name>.z13.web.core.windows.net

Backend Endpoint:
https://<your-function-app>.azurewebsites.net/api/submitFeedback
