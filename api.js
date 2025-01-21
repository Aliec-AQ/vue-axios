import axios from 'axios';

const api = {};
const defaultOptions = {
    basePath: '',
    apiKey: '',
    authType: 'none', 
    defaultHeaders: {
        'Content-type': 'application/json',
    },
    storeLastDataPulled: true,
    storeLoadingState: true,
    timeout: 10000, 
    retry: 0, 
};

function getAuthHeader(authType, apiKey) {
    if (authType === 'key') {
        return { 'Authorization': `key=${apiKey}` };
    } else if (authType === 'Bearer') {
        return { 'Authorization': `Bearer ${apiKey}` };
    }
    return {};
}

api.install = function (app, options) {
    const mergedOptions = { ...defaultOptions, ...options };
    let instance = null;

    // Store the state of the plugin
    const state = {
        lastDataPulled: null,
        isLoading: false,
    };


    // Create an axios instance
    instance = axios.create({
        baseURL: mergedOptions.basePath,
        headers: {
            ...mergedOptions.defaultHeaders,
            ...getAuthHeader(mergedOptions.authType, mergedOptions.apiKey)
        },
        timeout: mergedOptions.timeout,
    });

    // Wrap the request methods
    const wrapRequest = (method) => {
        return async function (...args) {
            // Set the loading state
            if (mergedOptions.storeLoadingState) {
                state.isLoading = true;
            }
            // Retry the request if it fails
            let attempts = 0;
            while (attempts <= mergedOptions.retry) {
                try {
                    // Make the request
                    const response = await instance[method](...args);
                    if (mergedOptions.storeLastDataPulled) {
                        state.lastDataPulled = response.data;
                    }
                    return response;
                } catch (error) {
                    // Retry the request if it fails
                    if (attempts < mergedOptions.retry) {
                        attempts++;
                    } else {
                        throw error;
                    }
                } finally {
                    // Unset the loading state
                    if (mergedOptions.storeLoadingState) {
                        state.isLoading = false;
                    }
                }
            }
        };
    };

    // Add the API to the app
    app.config.globalProperties.$api = {
        get: wrapRequest('get'),
        post: wrapRequest('post'),
        put: wrapRequest('put'),
        delete: wrapRequest('delete'),
        patch: wrapRequest('patch'),
        get lastDataPulled() {
            if (!mergedOptions.storeLastDataPulled) {
                throw new Error('The storeLastDataPulled option is disabled');
            }
            return state.lastDataPulled;
        },
        get isLoading() {
            if (!mergedOptions.storeLoadingState) {
                throw new Error('The storeLoadingState option is disabled');
            }
            return state.isLoading;
        },
    };
};

export default api;
