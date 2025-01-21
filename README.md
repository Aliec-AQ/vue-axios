# Web Client API Plugin ![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?logo=vue.js&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A2D81?logo=axios&logoColor=white)

Created by: Amaury Quilliec

This plugin provides a simple way to integrate an API client into your web application using Axios. I made it for my personal projects, but feel free to use it in your own projects (at your own risk and may not be suitable for production).

## Installation

To install the plugin, follow these steps:

1. Add Axios to your project.
```bash
npm install axios
```

2. Register the plugin in your Vue application.

```javascript
import { createApp } from 'vue';
import api from './path/to/api';

const app = createApp(App);

app.use(api, {
    basePath: 'https://api.example.com',
    apiKey: 'your-api-key',
    authType: 'Bearer', // or 'key'
    defaultHeaders: {
        'Content-type': 'application/json',
    },
    storeLastDataPulled: true,
    storeLoadingState: true,
    timeout: 10000,
    retry: 3,
});

app.mount('#app');
```

## Methods

- **get(url, config)**: Make a GET request.
- **post(url, data, config)**: Make a POST request.
- **put(url, data, config)**: Make a PUT request.
- **delete(url, config)**: Make a DELETE request.
- **patch(url, data, config)**: Make a PATCH request.

## State Properties

- **lastDataPulled**: The last data pulled from the API. Throws an error if `storeLastDataPulled` is disabled.
- **isLoading**: The loading state of the requests. Throws an error if `storeLoadingState` is disabled.

## Configuration

### Options

- **basePath**: The base URL for the API.
- **apiKey**: The API key for authentication.
- **authType**: The type of authentication (`'none'`, `'key'`, `'Bearer'`).
- **defaultHeaders**: Default headers for all requests.
- **storeLastDataPulled**: Whether to store the last data pulled from the API. This is useful if you want to use the data in multiple pages without making multiple requests. But the security of the data is not guaranteed.
- **storeLoadingState**: Whether to store the loading state of the requests.
- **timeout**: The request timeout in milliseconds.
- **retry**: The number of retry attempts for failed requests.

### Default Options

```javascript
{
    basePath: '',
    apiKey: '',
    authType: 'none',
    defaultHeaders: {
        'Content-type': 'application/json',
    },
    storeLastDataPulled: false,
    storeLoadingState: false,
    timeout: 0,
    retry: 0,
}
```

## Examples

### Using get

```javascript
try {
    const response = await this.$api.get('/your-endpoint');
    this.data = response.data;
} catch (error) {
    console.error('Error fetching data:', error);
}
```

### Using post

```javascript
try {
    const response = await this.$api.post('/your-endpoint', { data: 'your-data' });
    console.log('Data posted:', response.data);
} catch (error) {
    console.error('Error posting data:', error);
}
```

### Using isLoading

```javascript
<template>
  <div>
    <button @click="fetchData">Fetch Data</button>
    <div v-if="$api.isLoading">Loading...</div>
    <div v-else>{{ data }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: null,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await this.$api.get('/your-endpoint');
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>
```
