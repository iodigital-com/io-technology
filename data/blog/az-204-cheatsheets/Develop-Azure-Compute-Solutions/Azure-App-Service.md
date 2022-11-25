---
title: 'Azure App Service Cheatsheets'
date: '2022-11-07 14:20:00'
tags: ['azure', 'az-204', 'app service', 'cheatsheet', 'certification', 'exam']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

App Service can also host web apps natively on Linux for supported application stacks.

App Service on **Linux limitations**:

- App Service on Linux is not supported on Shared pricing tier.
- You **can't mix Windows and Linux** apps in the **same App Service plan**.
- you **could not mix Windows and Linux** apps in the **same resource group**.
- The Azure portal shows only features that currently work for Linux apps. As features are enabled,

`az webapp list-runtimes --os-type linux`

## App Service plans

Azure Functions also has the option of running in an App Service plan.

Each App Service plan defines:

- Region (West US, East US, etc.)
- Number of VM instances
- Size of VM instances (Small, Medium, Large)
- Pricing tier (Free, Shared, Basic, Standard, Premium, PremiumV2, PremiumV3, Isolated)

pricing tiers:

- **Shared compute**: Both Free and Shared share the resource pools of your apps **with the apps of other customers**. These tiers allocate **CPU quotas**. the resources **can't scale out**.

- **Dedicated compute**: The Basic, Standard, Premium, PremiumV2, and PremiumV3 tiers run apps on dedicated Azure VMs. **Only apps in the same App Service plan share the same compute resources**. The higher the tier, the more VM instances are available to you for scale-out.

- **Isolated**: This tier runs dedicated Azure VMs on dedicated Azure Virtual Networks. It provides **network isolation** on top of compute isolation to your apps. It provides the **maximum scale-out capabilities**.

- **Consumption**: This tier is **only available to function apps**. It scales the functions **dynamically** depending on workload.

deployment:

- Automated
  - Azure DevOps
  - GitHub
  - Bitbucket
- Manual
  - Git
  - CLI `az webapp up`
  - Zip Deploy `curl`
  - FTPS/s

### Sample reference

1. az group create
2. az appservice plan create
3. az webapp create
4. az webapp deployment source / az webapp config container set / ...

#### Github

```
az webapp deployment source config --name $webapp --resource-group $resourceGroup --repo-url $gitrepo --branch master --git-token $token
```

#### DockerHub

```
az webapp config container set --docker-custom-image-name $dockerHubContainerPath --name $webApp --resource-group $resourceGroup
```

### Slot

1. az group create
2. az appservice plan create
3. az webapp create
4. az webapp deployment slot create
5. az webapp deployment source config
6. az webapp deployment slot swap

#### deploy Private Endpoint

1. Create a VNet `az network vnet create.`
2. Configure the Subnet `az network vnet subnet update:`
3. Create the private endpoint `az network private-endpoint create`
4. Configure the private zone
   1. `az network private-dns zone create`
   2. `az network private-dns link vnet create`
   3. `az network private-endpoint dns-zone-group create`

## authentication and authorization

Identity providers

- Microsoft Identity Platform
- Facebook
- Google
- Twitter
- OpenID Connect providers

How It Works:

- Authenticates users with the specified provider
- Validates, stores, and refreshes tokens
- Manages the authenticated session
- Injects identity information into request headers

In **Linux and containers** the authentication and authorization module **runs in a separate container**, isolated from your application code. Because it does not run **in-process**

### networking behavior

**multitenant public service hosts** App Service plans in the Free, Shared, Basic, Standard, Premium, PremiumV2, and PremiumV3 pricing SKUs

**single-tenant App Service Environment (ASE) hosts** **Isolated** SKU App Service plans directly in your Azure virtual network

Multi-tenant App Service networking features:

**Inbound** features:

- App-assigned address
- Access restrictions
- Service endpoints
- Private endpoints

**Outbound** features:

- Hybrid Connections
- Gateway-required virtual network integration
- Virtual network integration

- free and Shared SKU:

  - host customer workloads on multitenant workers
  - all use the same worker VM typ

- Basic and higher plans
  - host customer workloads that are dedicated to only one App Service plan

When you change the VM family, you get a **different set of outbound addresses**

**Standard** to **PremiumV2**, your outbound addresses will change
**PremiumV2** to **PremiumV3**, your outbound addresses will change

### Find outbound IPs

```
az webapp show \
    --resource-group <group_name> \
    --name <app_name> \
    --query outboundIpAddresses \
    --output tsv
```

Query `possibleOutboundIpAddresses ` used for find all possible outbound IP addresses ,regardless of pricing tiers

## Create the web app

`az webapp up -g $resourceGroup -n $appName --html`

## CORS

`az webapp cors add --allowed-origins https://myapps.com --name MyWebApp --resource-group MyResourceGroup --subscription MySubscription`

### Configure application settings

app settings are variables passed as environment variable

App settings are always encrypted when stored (encrypted-at-rest).

`:` should be replaced by `__` (double underscore).`

general settings:

- Stack settings: language and SDK versions
- Platform settings
  - Bitness: 32 / 64 BIT
  - WebSocket Protocol: SignalR or socket.io
  - Always On: By default, Always On is not enabled (required for WebJobs)
  - Managed pipeline version (IIS Pipeline mode)
  - Http Version
  - ARR Affinity (ensure that the client is routed to the same instance for the life of the session,can set this option to Off for stateless applications)
- Debugging: This option turns off automatically after 48 hours.
- Incoming client certificates: TLS mutual authentication

### path mappings

- Windows apps (un-containerized)
  - Customize **IIS handler mappings** and **virtual applications** and **directories**
- Linux and containerized apps
  - Azure Storage Mount

### diagnostic logging

| Type                   | Platform       | Location                                           |
| ---------------------- | -------------- | -------------------------------------------------- |
| Application logging    | Windows, Linux | App Service file system and/or Azure Storage blobs |
| Web server logging     | Windows        | App Service file system or Azure Storage blobs     |
| Detailed error logging | Windows        | App Service file system                            |
| Failed request tracing | Windows        | App Service file system                            |
| Deployment logging     | Windows, Linux | App Service file system                            |

Any information written to files ending in .txt, .log, or .htm that are stored in the `/LogFiles` directory (d:/home/logfiles) is `streamed by App Service`.

Stream logs live

`az webapp log tail --name appname --resource-group myResourceGroup`

## security certificates

options you have for adding certificates in App Service:

- Create a free App Service managed certificate
- Purchase an App Service certificate
- Import a certificate from Key Vault
- Upload a private certificate
- Upload a public certificate

Private certificate requirements:

- Exported as a password-protected PFX file, encrypted using triple DES.
- Contains private key at least 2048 bits long
- Contains all intermediate certificates in the certificate chain

free managed certificate:

your App Service plan must be in the **Basic**, **Standard**, **Premium**, or **Isolated** tier. **Custom SSL** is not supported in the **F1** or **D1** tier.

Free certificate limitations:

- Does not support **wildcard** certificates.
- Does not support usage as a client certificate by **certificate thumbprint**.
- Is **not exportable**.
- Is not supported on **App Service Environment** (ASE).
- Is not supported with root domains that are integrated with Traffic Manager.
- If a certificate is for a CNAME-mapped domain, the CNAME must be mapped directly to `<app-name>`.azurewebsites.net.

## Autoscale

Autoscaling can be triggered according to a **schedule**, or by assessing whether the **system is running short on resources**

only changes the number of web servers.

### Autoscale conditions

- Scale **based on a metric** (across all instances)

  - CPU Percentage
  - Memory Percentage
  - Disk Queue Length
  - Http Queue Length (HTTP 408 - Timeout)
  - Data In (bytes received)
  - Data Out (bytes sent)
  - can also scale based on metrics for other Azure services

- Scale to a specific instance count according to a **schedule**

### scale-out or scale-in

A **scale-out** action **increases the number of instances**
**scale-in** action reduces the instance count

_cool down period_ , _threshold_ , **avoid "flapping"**

Not all pricing tiers support **autoscaling**. The development pricing tiers are either limited to a single instance **(the F1 and D1 tiers)**, or they only provide manual scaling **(the B1 tier)**. If you've selected one of these tiers, you must first scale up to the **S1** or any of the **P level production tiers**.

Autoscale supported on pricing tiers:

- **Standard**
- **Premium**
- **Isolated**

## Deployment Slots

Standard tier supports only five deployment slots.

Steps to ensure target slot doesn't experience downtime:

- Apply the **settings from the target** slot to all instances of the source slot (Any of these cases trigger all instances in the source slot to restart)
  - Slot-specific app settings and connection strings, if applicable.
  - Continuous deployment settings
  - App Service authentication settings, if enabled
- Wait for every instance in the source slot to **complete its restart**.
- If **local cache** is enabled, trigger local cache initialization by making an HTTP request to the application root ("/") on each instance of the source slot.
- If **auto swap** is enabled with **custom warm-up**, trigger Application Initiation by **making an HTTP request** to the application root ("/") on each instance of the source slot.
- swap the two slots by **switching the routing rules** for the two slots.

Settings that are swapped:

- General settings
- App settings
- Connection strings
- Handler mappings
- Public certificates
- **WebJobs content**

Settings that aren't swapped:

- Publishing endpoints
- Custom domain names
- Non-public certificates and TLS/SSL settings
- Scale settings
- **WebJobs schedulers**
- IP restrictions
- Always On
- Diagnostic log settings
- Cross-origin resource sharing **(CORS)**

To make swappable setting of specific slot: set `WEBSITE_OVERRIDE_PRESERVE_DEFAULT_STICKY_SLOT_SETTINGS` to `0 / false`

### custom warm-up

`applicationInitialization ` in `Web.Config

```xml
<system.webServer>
    <applicationInitialization>
        <add initializationPage="/" hostName="[app hostname]" />
        <add initializationPage="/Home/About" hostName="[app hostname]" />
    </applicationInitialization>
</system.webServer>
```

### Route production

**Traffic %**

`x-ms-routing-name` Cookie will be set / query string

By default, new slots are given a routing rule of `0%`
