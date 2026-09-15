const DASHBOARD_TOKEN_KEY = 'campoterra_access_token';

function getSessionToken() {
    return sessionStorage.getItem(DASHBOARD_TOKEN_KEY)
        || localStorage.getItem(DASHBOARD_TOKEN_KEY);
}

function clearSession() {
    sessionStorage.removeItem(DASHBOARD_TOKEN_KEY);
    localStorage.removeItem(DASHBOARD_TOKEN_KEY);
    sessionStorage.removeItem('campoterra_username');
    localStorage.removeItem('campoterra_username');
}

function requireSession() {
    if (!getSessionToken()) {
        window.location.replace('login.html');
        return false;
    }
    return true;
}

async function authenticatedFetch(url, options = {}) {
    const token = getSessionToken();
    if (!token) {
        window.location.replace('login.html');
        throw new Error('Sesión no disponible');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        clearSession();
        window.location.replace('login.html');
    }
    return response;
}

function configureLogoutLinks() {
    document.querySelectorAll('a[href="login.html"]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            clearSession();
            window.location.replace('login.html');
        });
    });
}

if (requireSession()) {
    document.addEventListener('DOMContentLoaded', configureLogoutLinks);
}
