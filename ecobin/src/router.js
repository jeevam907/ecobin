/**
 * EcoBin Universal Client-Side Router
 * Supports hash routes (#/), path parameters (e.g. /citizen/complaint/:id), route transitions & layout wrappers
 */

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.currentParams = {};

    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('popstate', () => this.handleRouting());
  }

  addRoute(pattern, handler) {
    this.routes[pattern] = handler;
  }

  getHashPath() {
    let hash = window.location.hash.slice(1);
    if (!hash || hash === '') hash = '/';
    // Remove query params if any
    const qIdx = hash.indexOf('?');
    return qIdx !== -1 ? hash.slice(0, qIdx) : hash;
  }

  match(path) {
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const regexPattern = '^' + pattern.replace(/:([a-zA-Z0-9_]+)/g, '([^/]+)') + '$';
      const match = path.match(new RegExp(regexPattern));

      if (match) {
        // Extract parameter names
        const paramNames = (pattern.match(/:([a-zA-Z0-9_]+)/g) || []).map(p => p.slice(1));
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { handler, params, pattern };
      }
    }
    return null;
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
  }

  handleRouting() {
    const path = this.getHashPath();
    const matched = this.match(path);

    if (matched) {
      this.currentRoute = path;
      this.currentParams = matched.params;
      matched.handler(matched.params);
    } else if (this.routes['*']) {
      this.routes['*']();
    } else {
      console.warn(`[EcoBin Router] No match for route: ${path}. Redirecting to /`);
      this.navigate('/');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  start() {
    this.handleRouting();
  }
}
