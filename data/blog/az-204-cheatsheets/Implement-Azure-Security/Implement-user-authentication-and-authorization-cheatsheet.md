---
title: 'Microsoft Identity platform Cheatsheet'
date: '2022-11-07 15:10:00'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam', 'security']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

## Service Principals

- **Single tenant**: only accessible in your tenant
- **Multi-tenant**: accessible in other tenants

## Application object

**_global representation_** of your application for use across all tenants,

An application object is used as a template or blueprint to create one or more service principal objects.

the application object has some static properties that are applied to all the created service principals (or application instances).

## Service principal object

service principal is the **_local representation_** for use in a specific tenant.

The security principal defines the access policy and permissions for the user/application in the Azure Active Directory tenant.

Types of service principal:

- **Application** - This type of service principal is the local representation, or application instance, of a global application object in a single tenant or directory.
- **Managed identity**: Managed identities provide an identity for applications to use when connecting to resources that support Azure Active Directory
- **Legacy** - This type of service principal represents a legacy app, which is an app created before app registrations were introduced or an app created through legacy experiences

## Relation

An application object has:

- A `1:1` relationship with the software application,
- A `1:many` relationship with its corresponding service principal object(s).

## Permissions and Consent

Implements the OAuth 2.0 authorization protocol. (`scope` , `application ID URI`)
types of permissions:

- **Delegated permissions** are used by apps that have a signed-in user present.

- **Application permissions** are used by apps that run **without a signed-in** user present,like background services or daemons.
  **Only an administrator can consent to application permissions**.

## Consent types

- **Static user consent**
- **Incremental and dynamic user consent**
- **Admin consent**

## Static user consent

In the static user consent scenario, you must specify all the permissions it needs in the app's configuration in the Azure portal. If the user (or administrator, as appropriate) has not granted consent for this app, then Microsoft identity platform will prompt the user to provide consent at this time.

## Incremental and dynamic user consent

You can ask for a minimum set of permissions upfront and request more over time as the customer uses additional app features.

## Admin consent

Admin consent ensures that administrators have some additional controls before authorizing apps or users to access highly privileged data from the organization.

## Requesting individual user consent

OpenID Connect or OAuth 2.0 authorization request, an app can request the permissions it needs by using the **scope query parameter**.
scope parameter is a `space-separated` list of delegated permissions that

## Conditional access

- Multifactor authentication
- Allowing only Intune enrolled devices to access specific services
- Restricting user locations and IP ranges

the following scenarios require **code to handle Conditional Access challenges**:

- **Apps performing the on-behalf-of flow**
- Apps accessing multiple services/resources
- Single-page apps using MSAL.js
- Web apps calling a resource

## Microsoft Authentication Library (MSAL)

**Authentication flows**

| Authorization code | Native and web apps securely obtain tokens in the name of the user             |
| ------------------ | ------------------------------------------------------------------------------ |
| Client credentials | Service applications run without user interaction                              |
| On-behalf-of       | The application calls a service/web API, which in turns calls Microsoft Graph  |
| Implicit           | Used in browser-based applications                                             |
| Device code        | Enables sign-in to a device by using another device that has a browser         |
| Integrated Windows | Windows computers silently acquire an access token when they are domain joined |
| Interactive        | Mobile and desktops applications call Microsoft Graph in the name of a user    |
| Username/password  | The application signs in a user by using their username and password           |

Categories:

- **Public client applications**: Are apps that run on devices or desktop computers or in a web browser. They're not trusted to safely keep application secrets, so they only access web APIs **on behalf of the user**. (They support only public client flows.) they **don't have client secrets.**

- **Confidential client applications**: Are apps that run on servers (web apps, web API apps, or even service/daemon apps). They're considered difficult to access, and for that reason capable of keeping an application secret. Confidential clients can hold configuration-time secrets

## client applications

```csharp
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId).Build();

string redirectUri = "https://myapp.azurewebsites.net";
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithClientSecret(clientSecret)
    .WithRedirectUri(redirectUri )
    .Build();
```

Modifiers common to public and confidential client applications

| Modifier                                              | Description                                                                                                                                                                                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.WithAuthority()`                                    | Sets the application default authority to an Azure Active Directory authority, with the possibility of choosing the Azure Cloud, the audience, the tenant (tenant ID or domain name), or providing directly the authority URI. |
| .WithTenantId(string tenantId)                        | Overrides the tenant ID, or the tenant description.                                                                                                                                                                            |
| `.WithClientId(string)`                               | Overrides the client ID.                                                                                                                                                                                                       |
| `.WithRedirectUri(string redirectUri)`                | Overrides the default redirect URI. In the case of public client applications, this will be useful for scenarios requiring a broker.                                                                                           |
| `.WithComponent(string)`                              | Sets the name of the library using MSAL.NET (for telemetry reasons).                                                                                                                                                           |
| `.WithDebugLoggingCallback()`                         | If called, the application will call Debug.Write simply enabling debugging traces.                                                                                                                                             |
| `.WithLogging()`                                      | If called, the application will call a callback with debugging traces.                                                                                                                                                         |
| `.WithTelemetry(TelemetryCallback telemetryCallback)` | Sets the delegate used to send telemetry.                                                                                                                                                                                      |

Modifiers specific to confidential client applications
| Modifier | Description |
|------------------------------------------------|------------------------------------------------------------------------------------------------|
| `.WithCertificate(X509Certificate2 certificate)` | Sets the certificate identifying the application with Azure Active Directory. |
| `.WithClientSecret(string clientSecret)` | Sets the client secret (app password) identifying the application with Azure Active Directory. |

## Sample Code:

```csharp
private const string _clientId = "APPLICATION_CLIENT_ID";
        private const string _tenantId = "DIRECTORY_TENANT_ID";

        public static async Task Main(string[] args)
        {
            var app = PublicClientApplicationBuilder
                .Create(_clientId)
                .WithAuthority(AzureCloudInstance.AzurePublic, _tenantId)
                .WithRedirectUri("http://localhost")
                .Build();
            string[] scopes = { "user.read" };
            AuthenticationResult result = await app.AcquireTokenInteractive(scopes).ExecuteAsync();

            Console.WriteLine($"Token:\t{result.AccessToken}");
        }
```

## Shared Access Signatures (SAS)

A shared access signature (SAS) is a signed URI that points to one or more storage resources and includes a token that contains a special set of query parameters.

### Types of shared access signatures

- **User delegation SAS**: A user delegation SAS is secured with **Azure Active Directory credentials and also by the permissions specified for the SAS**. A user delegation SAS applies to **Blob storage only**.

- **Service SAS**: A service SAS is secured with the storage account key. A service SAS delegates access to a resource in the following Azure Storage services: **Blob storage**, **Queue storage**, **Table storage**, or **Azure Files**.

- **Account SAS**: An account SAS is secured with the **storage account** key. An account SAS delegates access to resources in one or more of the storage services. All of the operations available via a service or user delegation SAS are also available via an account SAS.

### Creating a stored access policy

```
az storage container policy create \
    --name <stored access policy identifier> \
    --container-name <container name> \
    --start <start time UTC datetime> \
    --expiry <expiry time UTC datetime> \
    --permissions <(a)dd, (c)reate, (d)elete, (l)ist, (r)ead, or (w)rite> \
    --account-key <storage account key> \
    --account-name <storage account name> \
```
