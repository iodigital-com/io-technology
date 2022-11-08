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

- Standard: encrypts with a software key
- Premium: hardware security module(HSM)-protected keys

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

types of managed identities:

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

# Azure App Configuration

Azure App Configuration encrypts sensitive information at rest using a 256-bit AES encryption key provided by Microsoft.

`*`, `,`, and `\.` These characters are reserved

Key values in App Configuration can **optionally** have a **label** attribut

### Version key values

App Configuration **doesn't version** key values automatically as they're modified. Use **labels** as a way to create multiple versions of a key value.

### Query key values

Each key value is uniquely identified by its key plus a label that can be null

### Values

Values assigned to keys are also unicode strings.

### Manage application features

- **Feature flag**: A feature flag is a variable with a binary state of on or off
- **Feature manager**: A feature manager is an application package that handles the lifecycle of all the feature flags in an application
- **Filter**: A filter is a rule for evaluating the state of a feature flag.

## Security

- customer-managed keys: encrypts sensitive information at rest using a **256-bit AES** encryption key
- private endpoints for Azure App Configuration : allow clients on a **virtual network (VNet)** to securely access data over a private link
- Private endpoints for App Configuration ( If you have multiple App Configuration stores, you need a separate private endpoint for each store)
- DNS changes for private endpoints
- Managed Identities
