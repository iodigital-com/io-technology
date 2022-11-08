---
title: 'Implement IaaS in Azure Cheatsheets'
date: '2022-10-27'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Implement IaaS in Azure

Create and deploy virtual machine, deploy resources using Azure Resource Manager templates, and manage and deploy containers

### Design considerations for virtual machine creation

- Availability: Service Level Agreement of 99.9% (three-nines)
- VM Size: processing power, memory, and storage capacity
- VM limits : subscription has default quota limits. (Current: 20 VMs per region)
- VM image: `az vm image list`
- VM disks

  - standard disks: HDD , cost effective dev and test workload
  - Premium disks: SSD , Production workload

- disk storage:
  - Managed disks: managed by Azure , Easy to scale-out , up to 4 terabytes
  - Unmanaged disks: you’re responsible for the storage accounts, fixed-rate limit of 20,000 IO operation per second

### Availability Zone:

Physically separated within in a region, _3 availablily zone per region_

- Zonal Service : resource pinned to a specific zone
- Zone-Redundant : Azure automatically replicates accross zones

### Availability sets

Each availability set can be configured with up to **3 fault domains** and **20 update domains.**

logical grouping of VMs. protect against hardware failures and updates safely.

- Fault domains:
  group of underlying hardware that share a common power source and network switch
- Update Domain : ensures that at least one instance of your application always remains running

### Virtual machine scale sets

load balanced VMs based on defined schedule or response to demand.

### Azure Load Balancer

Layer-4 (TCP, UDP) load balancer , distributing incoming traffic among healthy VMs ( load balancer health probe monitors a given port on each VM )

### Azure CLI

Login to azure

`az login`

create a resource group

`az group create --name az204-vm-rg --location "<location>"`

create a vm

```
az vm create \
    --resource-group az204-vm-rg \
    --name az204vm \
    --image UbuntuLTS \
    --generate-ssh-keys \
    --admin-username azureuser \
    --public-ip-sku Standard
```

open specific port

```
az vm open-port --port 80 \
--resource-group az204-vm-rg \
--name az204vm
```

clean up a resource group
`az group delete --name az204-vm-rg --no-wait`

## Azure Resource Manager

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure subscription.

### Why ?

- Declarative syntax
- Repeatable results
- Orchestration

### Template file

- Parameters - values which used in deployment
- Variables - Define values reused templates (can be combined with parameters value).
- User-defined functions - customized functions.
- Resources - specify resource to be deployed
- Outputs - Return values from the deployed resources.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [],
  "outputs": {}
}
```

Resource Manager converts the template into REST API operations

Deploy template using:

- Azure portal
- Azure CLI
- PowerShell
- REST API
- Button in GitHub repository
- Azure Cloud Shell

### conditional deployment

When the value is true, the resource is created. otherwise isn't created.
can only be applied to whole resource.

Sample

**_Conditional deployment doesn't cascade to child resources_**

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "newOrExisting": {
      "type": "string",
      "defaultValue": "new",
      "allowedValues": ["new", "existing"]
    }
  },
  "functions": [],
  "resources": [
    {
      "condition": "[equals(parameters('newOrExisting'), 'new')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS",
        "tier": "Standard"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ]
}
```

### deployment mode

- Complete mode: **_deletes_** resources that exist in the resource group that aren't specified in the template.
- Incremental mode: **_leaves unchanged_** resources that exist in the resource group but aren't specified in the template. (default mode is incremental)

### Deploy Using Azure CLI

```
az deployment group create \
  --mode Complete \
  --name ExampleDeployment \
  --resource-group ExampleResourceGroup \
  --template-file storage.json
```

## Azure Container Registry

managed, private Docker registry service based on the open-source Docker Registry

service tiers:

- Basic: Cost-optmized for lower usage scenarios
- Standard: ncreased included storage and image throughput
- Premium: geo-replication,content trust

storage capabilities

- Encryption-at-rest
- Regional storage
- Zone redundancy (premium)
- Scalable storage

ACR Tasks

- Quick task: `docker build` and `docker push` in clouds
- Automatically triggered tasks :
  - source code update `az acr task create`
  - base image update
  - schedule
- Multi-step task: yaml based config file

### Create an Azure Container Registry

create a ACR resource

```
az acr create --resource-group az204-acr-rg \
    --name <myname> --sku Basic
```

build docker image using acr

`az acr build --image saeed:v1 --registry <myname> --file Dockerfile .`

list repositories
`az acr repository list --name <myname> --output table`

show tags on a specific repo

```
az acr repository show-tags --name <myname> \
    --repository saeed:v1 --output table
```

run image in ACR

```
az acr run --registry <myname> \
    --cmd '$Registry/saeed:v1' /dev/null
```

# Azure Container Instances (ACI)

offers the fastest and simplest way to run a container in Azure , billed by the second

## container group

collection of containers that shares lifecycle, resources, local network, and storage volumes. like **_POD_** in kubernetes
only supported in linux containers

### Deployment:

- ARM Template
- YAML file (pass `--file filename.yml`)

### Networking

containers within the group share an IP and port namespace

### Storage

Supported voulmes to mount :

- Azure file share
- Secret
- Empty directory
- Cloned git repo

Create a container

```
az container create --resource-group rg-test \
    --name mycontainer \
    --image mcr.microsoft.com/azuredocs/aci-helloworld \
    --ports 80 \
    --dns-name-label $DNS_NAME_LABEL --location <myLocation> \
```

Verify the container is running

```
az container show --resource-group rg-test \
    --name mycontainer \
    --query "{FQDN:ipAddress.fqdn,ProvisioningState:provisioningState}" \
    --out table \

```

### restart policies

- **Always** : default
- **Never** - one container must run within a group
- **OnFailure**: The containers are run **at least once**

pass paramater `--restart-policy` when creating a container

### Environment Variables

pass environment variable `--environment-variables 'NumWords'='5' 'MinLength'='8'\` when creating a container

### Azure file share in Azure Container Instances

fully managed file shares in the cloud that are accessible via the industry standard Server Message Block (SMB) protocol

Limitations:

- only availbale for **_Linux containers_**.
- requires the Linux container **_run as root_**.
- limited to **_CIFS support_**.

deploy container and mount a voulme

```
az container create \
    --resource-group $ACI_PERS_RESOURCE_GROUP \
    --name hellofiles \
    --image mcr.microsoft.com/azuredocs/aci-hellofiles \
    --dns-name-label aci-demo \
    --ports 80 \
    --azure-file-volume-account-name $ACI_PERS_STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
    --azure-file-volume-mount-path /aci/logs/
```

### Create Blob storage resources by using the .NET client library

```csharp
// Create a client that can authenticate with a connection string
BlobServiceClient blobServiceClient = new BlobServiceClient(storageConnectionString);
```

Create the container and return a container client object

```csharp
BlobContainerClient containerClient = await blobServiceClient.CreateBlobContainerAsync(containerName);
```

Get a reference to the blob

```csharp
BlobClient blobClient = containerClient.GetBlobClient(fileName);
```

List the blobs in a container

```csharp
containerClient.GetBlobsAsync()
```

Download the blob's contents

```csharp
BlobDownloadInfo download = await blobClient.DownloadAsync();
```

Fetch some container properties and write out their values.

```csharp
var properties = await container.GetPropertiesAsync();
```

```csharp
// Set the container's metadata.
await container.SetMetadataAsync(metadata);

var properties = await container.GetPropertiesAsync();
```

### set and get metadata by REST

`x-ms-meta-name:string-value `

HTTP headers supported **on containers**

- **ETag**
- **Last-Modified**

headers supported on blobs include

- **ETag**
- **Last-Modified**
- Content-Length
- Content-Type
- Content-MD5
- Content-Encoding
- Content-Language
- Cache-Control
- Origin
- Range
