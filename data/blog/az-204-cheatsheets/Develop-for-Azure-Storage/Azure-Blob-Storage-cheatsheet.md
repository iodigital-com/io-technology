---
title: 'Develop solutions that use Blob storage Cheatsheets'
date: '2022-10-30'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'storage']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
---

# Develop solutions that use Blob storage

designed for:

- Serving images or documents directly to a browser.
- Storing files for distributed access.
- Streaming video and audio.
- Writing to log files.
- Storing data for backup and restore, disaster recovery, and archiving.
- Storing data for analysis by an on-premises or Azure-hosted service.

## Types of storage accounts

- **Standard** : Standard general-purpose v2
- **Premium** : higher performance by using solid-state drives

## Access tiers

- **Hot** : highest storage costs, but the lowest access costs
- **Cool** : storing large amounts of data that is infrequently accessed and stored for at least 30 days
- **Archive** : most cost-effective option for storing data, but accessing that data is more expensive than accessing data in the hot or cool tiers

## Blobs

- **Block blobs** : store text and binary data, up to **about 190.7 TB**
- **Append blobs** : logging data from virtual machines
- **Page blobs** : store random access files **up to 8 TB** in size,store virtual hard drive (VHD) files and serve as **disks for Azure virtual machines**.

Storage **encryption for data at rest**

Encryption key management:

- Microsoft-managed keys
- customer-managed
- customer-provided

Data in an Azure Storage account is **always replicated three times** in the **primary region**

- **Locally redundant storage (LRS)**: Copies your data synchronously **three times within a single physical location** in the primary region.
- **Zone-redundant storage (ZRS)**: Copies your data synchronously across three Azure availability zones in the primary region

Redundancy in a secondary region

- **Geo-redundant storage (GRS)** copies your data synchronously three times within a single physical location in the primary region using **LRS**. It then copies your data asynchronously to a **single physical location in the secondary region**.

- **Geo-zone-redundant storage (GZRS)** copies your data synchronously across three Azure availability zones in the primary region using **ZRS**. It then copies your data asynchronously to a **single physical location in the secondary region**. Within the secondary region, your data is copied synchronously three times using **LRS**.

Create the block blob storage account

```
az storage account create --resource-group az204-blob-rg --name \
<myStorageAcct> --location <myLocation> \
--kind BlockBlobStorage --sku Premium_LRS
```

data lifecycle

Azure Blob storage lifecycle management offers a rich, rule-based policy for General Purpose v2 and Blob storage accounts.

- Transition blobs to a cooler storage tier (hot to cool, hot to archive, or cool to - archive) to optimize for performance and cost
- Delete blobs at the end of their lifecycles
- Define rules to be run once per day at the storage account level
- Apply rules to containers or a subset of blobs (using prefixes as filters)

Data stored in a **premium block blob** storage account **cannot** be tiered to Hot, Cool, or Archive using Set Blob Tier or using Azure Blob Storage lifecycle management

To move data, you must synchronously copy blobs from the block blob storage account to the Hot tier in a different account

Sample Rule

```json
{
  "rules": [
    {
      "name": "ruleFoo",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["container1/foo"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
            "delete": { "daysAfterModificationGreaterThan": 2555 }
          },
          "snapshot": {
            "delete": { "daysAfterCreationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}
```

### Rule actions

- tierToCool
- enableAutoTierToHotFromCool
- tierToArchive
- delete

If you define more than one action on the same blob, lifecycle management applies the least expensive action to the blob.

### add a lifecycle management policy with Azure CLI

```
az storage account management-policy create \
    --account-name <storage-account> \
    --policy @policy.json \
    --resource-group <resource-group>
```

### Rehydrate blob data from the archive tier

- Copy an archived blob to an online tier `CopyBlob` or `Copy Blob from URL`
- Change a blob's access tier to an online tier `Set Blob Tier`

Rehydration priority

`x-ms-rehydrate-priority` header

- Standard priority : may take up to 15 hours.
- High priority: in under one hour for objects under 10 GB in size.

Changing a blob's tier doesn't affect its last modified time

## Create Blob storage resources by using the .NET client library

create a storage account

Your storage account name must be unique within Azure.

```console
az storage account create --resource-group az204-blob-rg --name <myStorageAcct> --location <myLocation> --sku Standard_LRS
```
