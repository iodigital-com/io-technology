---
title: 'Implement Azure Security Cheatsheet'
date: '2022-11-07 15:00:00'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'security']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Implement Azure Security

## Azure Key Vault

Supports **vaults** and managed **hardware security module(HSM)** pools

service tiers:

- **Standard**: encrypts with a software key
- **Premium**: hardware security module(HSM)-protected keys

### Authentication

To do any operations with Key Vault, you first need to authenticate to it

- Managed identities for Azure resources
- Service principal and certificate
- Service principal and secret

Create a key vault

`az keyvault create --name $myKeyVault --resource-group az204-vault-rg --location $myLocation`

Create a secret

`az keyvault secret set --vault-name $myKeyVault --name "ExamplePassword" --value "hVFkk965BuUv"`

retrieve the secret

`az keyvault secret show --name "ExamplePassword" --vault-name $myKeyVault`

# Managed identities

Types of managed identities:

- **system-assigned** managed identity
- **user-assigned** managed identity (independent lifecycle than a Azure resource)

### Create System-assigned managed identity

during creation of an resources by specifying these parameters:

```
 --assign-identity \
    --role contributor \
    --scope mySubscription \
```

system-assigned identity to an existing virtual machine:

`az vm identity assign -g myResourceGroup -n myVm`

### Create User-assigned managed identity

create identity
`az identity create -g myResourceGroup -n myUserAssignedIdentity`

assign to a resource by specifying these parameters:

```
--assign-identity <USER ASSIGNED IDENTITY NAME> \
--role <ROLE> \
--scope <SUBSCRIPTION>
```

or to an existing resource:

```
az vm identity assign \
    -g <RESOURCE GROUP> \
    -n <VM NAME> \
    --identities <USER ASSIGNED IDENTITY>
```

## Azure App Configuration

Azure App Configuration encrypts sensitive information at rest using a _256-bit AES_ encryption key provided by Microsoft.

`*`, `,`, and `\.` These characters are reserved

Key values in App Configuration can **optionally** have a **label** attribute

### Version key values

App Configuration **doesn't version** key values automatically as they're modified. Use **labels** as a way to create multiple versions of a key value.

### Query key values

Each key value is uniquely identified by its key plus a label that can be `null`

### Values

Values assigned to keys are also unicode strings.

### Manage application features

- **Feature flag**: A feature flag is a variable with a binary state of on or off
- **Feature manager**: A feature manager is an application package that handles the lifecycle of all the feature flags in an application
- **Filter**: A filter is a rule for evaluating the state of a feature flag.

## Secure app configuration data

### Encrypt configuration data by using customer-managed keys

Requirements:

- **Standard tier** Azure App Configuration instance
- Azure Key Vault with **soft-delete** and **purge-protection** features enabled
- An `RSA` or `RSA-HSM` key within the Key Vault: The key must not be expired, it must be enabled, and it must have both wrap and unwrap capabilities enabled

Allow Azure App Configuration to use the Key Vault key:

1. Assign a **managed identity** to the Azure App Configuration instance
2. Grant the identity `GET`, `WRAP`, and `UNWRAP` permissions in the target _Key Vault's access policy_.

### Use private endpoints for Azure App Configuration

Allow clients on a virtual network (VNet) to securely access data over a private link.

### Managed identities

A managed identity from Azure Active Directory (AAD) allows Azure App Configuration to easily access other _AAD-protected_ resources, such as _Azure Key Vault_.

The identity is managed by the Azure platform. It does not require you to provision or rotate any secrets.

Add a system-assigned identity

`az appconfig identity assign`

Assign the new user-assigned identity to the myTestAppConfigStore configuration store:

```
az appconfig identity assign --name myTestAppConfigStore \
    --resource-group myResourceGroup \
    --identities /subscriptions/[subscription id]/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUserAssignedIdentity
```
