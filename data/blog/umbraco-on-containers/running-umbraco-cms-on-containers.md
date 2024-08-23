---
title: 'Running Umbraco CMS on containers'
date: '2024-08-22'
tags: ['umbraco', 'docker', 'azure']
summary: 'How to set up Umbraco CMS using Docker containers'
authors: ['ivan-nikolov']
serie: umbraco-on-containers
--- 

Containers are getting increasingly popular over the last several years, because of the benefits they bring for developing and deploying applications. A container is an isolated unit of software running on top of an operating system that packages up code and all dependencies of an application so that it can run quickly and reliably in different environments. Containers have the following benefits:

- Consistent and rapid development environment
- Increased compatibility and maintainability 
- Continuous deployment and testing
- Simplicity and faster configurations

To offer insight into what effort goes into a container, I described the steps to set up an Umbraco application using a Docker container. Umbraco is an open-source content management system (CMS), based on Microsoft .Net framework. I wanted to investigate how containers can speed up development environment setup, make the application consistent through environments, and enable faster deployments. 

For containerization, I used Docker, which allows you to create images and containers running on Linux, Windows, and MacOS operating systems. Docker containerized software/applications are always the same, regardless of the infrastructure. 


## How does it work?

Let’s start with the steps to create an Umbraco CMS as a .Net application in a Docker container:

1. Install Docker Desktop for Windows/Linux/MacOS
2. Install Umbraco Template and create the project

```Shell
dotnet new install Umbraco.Templates::14.1.1

dotnet new sln --name "UmbracoOnContainers"
dotnet new umbraco -n "Umbraco.Web" 
dotnet sln add "Umbraco.Web"

dotnet run --project "Umbraco.Web"
```

At this point, I have a running Umbraco website and completing the standard setup wizard will create also the Umbraco local database.

3. Create Umbraco database in a container

I have now a local database created, which could be moved to a container and accessed from the website container later on. A new folder called "Umbraco.Database" is created to store the Dockerfile and two additional scripts needed to run the database in a container.
I have copied the database files (UmbracoDB.mdf and UmbracoDB_log.ldf) from Umbraco initial setup to the database folder since they will be needed to create the Umbraco database in the container. The folder structure should look like this:

![Folder structure of the database](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/Folder-structure-database.png)

The Dockerfile contains a definition of what steps are needed to create a Docker image for our database:

```Dockerfile
FROM mcr.microsoft.com/azure-sql-edge:latest

ENV ACCEPT_EULA=Y

USER root
 
RUN mkdir /var/opt/sqlserver
 
RUN chown mssql /var/opt/sqlserver
 
ENV MSSQL_BACKUP_DIR="/var/opt/mssql"
ENV MSSQL_DATA_DIR="/var/opt/mssql/data"
ENV MSSQL_LOG_DIR="/var/opt/mssql/log"

EXPOSE 1433/tcp

# Copy Setup SQL script
COPY setup.sql /
COPY startup.sh /

# Copy the database files to the container
# NOTE : This is not a recommendation for production use
COPY UmbracoDB.mdf /var/opt/sqlserver
COPY UmbracoDB_log.ldf /var/opt/sqlserver

ENTRYPOINT [ "/bin/bash", "startup.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]
```

It creates an SQL Server based on azure-sql-edge image and defines environmental variables to configure the paths to be used for databases. It also configures the ports to be exposed (1433) and copies two scripts into the container. These scripts are used to restore the database from the database files when the database container starts. That way when the website starts, it will already have a database in place and will not restore it (if already exists).

setup.sql:
```SQL
USE [master]
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'UmbracoDb')
BEGIN
    CREATE DATABASE [UmbracoDb] ON 
    ( FILENAME = N'/var/opt/sqlserver/UmbracoDB.mdf' ),
    ( FILENAME = N'/var/opt/sqlserver/UmbracoDB_log.ldf' )
    FOR ATTACH
END;
GO

USE UmbracoDb;
```


```Shell:startup.sh
#!/bin/bash
set -e

if [ "$1" = '/opt/mssql/bin/sqlservr' ]; then
  # If this is the container's first run, initialize the application database
  if [ ! -f /tmp/app-initialized ]; then
    # Initialize the application database asynchronously in a background process
    function initialize_app_database() {
      # Wait a bit for SQL Server to start
      sleep 15s
      # Execute the script to create the DB and the schema in the DB
      # Credentials are used here for demonstration purposes, not suitable for Production use
      /opt/mssql-tools/bin/sqlcmd -S localhost -U UmbracoBlogUser -P VeryStrongPassword -d master -i /setup.sql

      touch /tmp/app-initialized
    }
    initialize_app_database &
  fi
fi

exec "$@"
```
 

4. Create Umbraco website in a container

I have already Umbraco running locally, the next step is to create a container for it by defining a Docker image using the following Dockerfile (located in "Umbraco.Web" folder):

```Dockerfile
# Use the SDK image to build and publish the website
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Umbraco.Web.csproj", "."]
RUN dotnet restore "Umbraco.Web.csproj"
COPY . .
RUN dotnet publish "Umbraco.Web.csproj" -c Release -o /app/publish

# Copy published output to the final running image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final 
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Umbraco.Web.dll"]
```

The Dockerfile starts with defining the base image, which contains .Net 8 SDK to compile and host the project. There are also instructions to copy the working project to the image, download the dependencies, and compile/publish the output of the project. In the end, it defines an entry point to the binary output of the main project in order to run it.   

To be able to connect to the database container, I will need to update Umbraco connection string in "appsettings.Development.json" file as follows:

```Shell
"ConnectionStrings": {
  "umbracoDbDSN": "Server=umbraco_data;Database=UmbracoDb;User Id=UmbracoBlogUser;Password=VeryStrongPassword;TrustServerCertificate=true",
  "umbracoDbDSN_ProviderName": "Microsoft.Data.SqlClient"
}
```


5. Use Docker Compose to build and run the containers

In the previous steps, I have defined two Docker images that need to be built and run the corresponding containers - Umbraco Database and Umbraco Web. Let's see how all the above goes together. I will use Docker Compose to deploy both containers using the same network.  
Docker Compose is a tool used for defining and running multi-container Docker applications. It allows you to manage the configuration and orchestration of multiple Docker containers with a simple and declarative YAML file. This file, typically named docker-compose.yml, specifies the services (names of the container), networks, volumes, and environment variables required by each container.

In my case, I created a docker-compose.yml file in the main folder of the project.

![Folder structure of the main project](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/Folder-structure-main-project.png)


```Dockerfile
version: '3.8'

services:

  # This service defines Umbraco database container. It exposes a volume for storing SQL data and log files
  # outside of the container, written on the physical development machine
  umbdata_image:
    container_name: umbraco_data
    build:
      context: ./Umbraco.Database
    ports:
     - "1433:1433"
     - "1434:1434"
    volumes:
     - umb_database:/var/opt/mssql
    networks:
      - umbnet

  # This service defines Umbraco web container. It exposes port 80 to external port 5000 and stores media and logs
  # in a volume to be accessable outside the container. Volume for uSync can also be defined
  umbweb_cd_image:
    container_name: umbraco_web
    build:
      context: ./Umbraco.Web
      dockerfile: Dockerfile
    volumes:
      - umb_media:/app/wwwroot/media
      - umb_logs:/app/umbraco/Logs
     #- umb_usync:/app/uSync
    restart: always
    environment:
     - ASPNETCORE_ENVIRONMENT=Development
     - ASPNETCORE_URLS=http://+:80
    # Website is be visible on : http://localhost:5000/
    # Umbraco URL is: http://localhost:5000/umbraco
    ports:
      - "5000:80"
    depends_on:
      - umbdata_image
    networks:
      - umbnet          

volumes:
  umb_logs:
  umb_database:
 
  umb_media:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: c:/Projects/UmbracoOnContainersBlog/Umbraco.Web/wwwroot/media
  

# This defines the network, that the containers will be using
networks:
  umbnet:
    driver: bridge
```

In the Docker compose file I define two services (containers)
 - umbraco_data - points to the image I defined earlier in Umbraco.Database Dockerfile
 - umbraco_web  - points to the image I defined earlier in Umbraco.Web Dockerfile

Between them I create a shared network they will use to communicate with each other. I also create volumes for the database, media, and logs files to have persistent storage (similarly, the same could be done for uSync for example, storing its config files). 
That would mean that deleting and recreating the containers will not remove the database and media files as they are stored in the physical file system of my PC and not in the container itself. 

Now that I have everything described in the docker-compose, it is time to start things up using the following commands:


```Shell
docker compose build
```
 
This command will create the images, described in the docker-compose file. Once completed I can see them in Docker Desktop or by using the “docker images“ command in a terminal.

Docker images: 

![Docker images](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/Docker-images.png)

```Shell
docker compose up -d
```
 
This command will run the containers based on the previously created images. It will also create the volumes for the Umbraco database and images files.

Docker containers:

![Docker containers](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/Docker-containers.png)

Docker volumes:

![Docker volumes](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/Docker-volumes.png)


Great, I can browse the Umbraco website on address http://localhost:5000. It uses the Umbraco Web and Database containers and has persistent storage for its database, images, and logs. 


## What comes next?

I now have the Umbraco CMS application running in containers and setting up a development machine plus local development will be a lot easier than before. This however does not fully deliver all the benefits containers can bring. My next step would be to set up a process for continuous integration and deployment using containers. That involves having an image registry to be able to push new images with tags (versions) and deploy them to target environments. For that, I will use Azure Image Registry and Container Apps and will cover it in the next article.   

This process is visualized in the following diagram:


![Docker CI/CD](/articles/umbraco-on-containers/running-umbraco-cms-on-containers/ci-cd-docker.png)

