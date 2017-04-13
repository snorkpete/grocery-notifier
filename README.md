# Guide

This is a simple webtask that has 2 primary functions.

The first function is to act as an API for storing and retrieving a comma-delimited list of grocery items.

The second function is as a notifier - upon saving, a request is sent to NotifyMyAndroid to send a notification a specific NotifyMyAndroid account. The NotifyMyAndroid account that will be used is determined by the owner of the generated NOTIFY_API_KEY - a secret that is embedded in this webtask. 

So, the envisioned use case is to use the webtask-provided API as a backend API for a single page app, for example. But, upon saving any changes, all phones tied to the API key would be sent a notification of the update.

(The notification system from NotifyMyAndroid requires you to register an account with them, install their app on the Google Play Store and log into that app with your account info. Thus, any API keys generated in that Notify My Android account can then be used by the Grocery Notifier here to send updates to the grocery list to the Android device in question.  