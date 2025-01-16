// app/redux/Provider.js
"use client"; // This file should be treated as a client component
import { Provider } from 'react-redux';
import store from './store';

const ReduxProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
