# AtlanticApps Marco-Client
[![NPM version](https://img.shields.io/npm/v/@atlanticapps/rt-client.svg)](https://www.npmjs.com/package/@atlanticapps/rt-client)

The Marco-Client (RtCl) library facilitates development of real-time applications connecting to RTEngine backed server systems. This allows client applications to replicate a collection of elements in real-time by retrieveing light delta updates. The library supports direct event listening, snapshot mode as well as custom delta update scenarios: 

- **Event listening** simply forwards the delta events in their raw form to the client application
- **Snapshot mode** forwards the complete updated collection to the client application on each update
  - The library also supports custom snapshot managers, which can be tailored to your application needs.

### Install RTClient 

We recommend installing the library using either `npm`, `yarn`. A `<script>` tag can also be used if your project does not make use of any package manager.

#### NPM

```
npm install --save @atlanticapps/rt-client
```

#### Yarn

```
yarn add @atlanticapps/rt-client
```

#### Alternative: Script Import

```
TODO
```



### Configure a Client Connection

The RtCl supports a few protocols out of the box, such as HTTP polling or SSE connections. In this guide we'll configure a SSE connection and populate an HTML list (`ul`) with the elements from a remote collection. We'll assume that the URL `example.com` points to a remote collection where a number is added each second. (**TODO: Create an example url on the backend to use?**) For this, we will initialize our client with an SSE backend with

```js
let client = new RTClient(EventSourceRTClientBackend());
```

We can now use our client instance to listen to a remote collection with the `listen` method. (By default, the `listen` method uses snapshot mode)

```js
let connection = client.listen<number>('example.com');
```

We now have initialized the connection to the remote collection, but our application does not connect to it right away. In order to establish the connection, we must subscribe to it and provide a callback to be run each time the collection is updated. For now, we'll populate a HTML list with the items provided:

First, in your HTML body, insert a list to use by inserting

```html
<ul id="myList"></ul>
```

we'll then populate this list using our connection by subscribing to it as follows:

```js
let session = connection.subscribe((items) => {
  let listElement = document.querySelector('#myList')
  // Snapshot mode gives us the entire list to show on each update, 
  // so let's clear the list first.
  listElement.innerHTML = ''
  for(const item of items){
    let node = document.createElement('li');
    node.innerHTML = item;
    listElement.appendChild(node);
  }
})
```

And simple as that, you should now have a page that displays the remove collection in real-time.

