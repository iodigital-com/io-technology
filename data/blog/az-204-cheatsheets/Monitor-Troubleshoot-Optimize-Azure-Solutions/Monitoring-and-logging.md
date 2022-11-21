---
title: 'Monitoring And logging in Azure Cheatsheets'
date: '2022-11-07 15:20:00'
tags: ['azure', 'az-204', 'cheatsheet', 'certification', 'exam']
summary: ''
authors: ['saeed-salehi']
theme: 'blue'
serie: 'az-204-cheatsheets'
hideInArticleList: true
---

# Monitoring And logging in Azure

- Metrics
- Logs
- Distributed traces
- Changes

## Application Insights

- Request rates, response times, and failure rates
- Dependency rates, response times, and failure rates
- Exceptions
- Page views and load performance
- Performance counters
- Host diagnostics
- Diagnostic trace logs
- Custom events and metrics

ways to get started monitoring and analyzing app performance:

- At run time: without change in code
- At development time : add to code
- Instrument your web pages (client-side telemetry)
- Analyze mobile app usage (Visual Studio App Center)
- Availability tests : ping regularly from azure servers.

## log-based metrics

- log-based metrics : **_Kusto queries_** from stored events (require processig to produce the result)
- Standard metrics : pre-aggregated time series. (near real time)

## availability test

up to 100 availability tests per Application Insights resource

- URL ping test (classic) , relies on the DNS infrastructure of the public internet
- Standard test (Preview):
- Custom TrackAvailability test : use `TrackAvailability()` method to sned data to Applicaiton Insight
- Multi-step test: only available from visual studio , multi request or authentication test scenarios (Custom TrackAvailability works as well)

## Application Map

Troubleshoot app performance

- Components are different from "observed" external dependencies such as SQL, Event Hubs, etc. which your team/organization may not have access to (code or telemetry).
- Components run on any number of server/role/container instances.
- Components can be separate Application Insights instrumentation keys (even if subscriptions are different) or different roles reporting to a single Application Insights instrumentation key.

progressive discovery of the components

## Alert type

- **Metric alert**: Metric data is stored in the system already **pre-computed**. Metric alerts are useful when you want to be **alerted** about data that requires little or no manipulation. We recommend using metric alerts if the data you want to monitor is available in metric data. (**stateful - only notifying once when alert is fired and once when alert is resolved**)

- **Log alert**: Log alerts allow you to perform **advanced logic operations** on your data. (KQL for data manipulation using log alerts).
- **Activity Log alert**: Activity logs provide auditing of all actions that occurred on resources. Use activity log alerts to be alerted when a **specific event happens** to a resource, for example, a restart, a shutdown, or the creation or deletion of a resource. (Stateless)
- **Prometheus alerts (preview)** : Prometheus alerts are primarily used for alerting on performance and health of Kubernetes clusters (including AKS).
