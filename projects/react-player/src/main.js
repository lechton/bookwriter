import { mount } from 'svelte';
import '@fontsource-variable/inter';
import '@fontsource-variable/literata/opsz.css';
import './app.css';
import App from './App.svelte';

export default mount(App, { target: document.getElementById('app') });
