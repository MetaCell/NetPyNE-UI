const urljoin = require('url-join');


export const getCommandLineArg = (param, defaultValue) => {
  let value = process.argv.find(arg => arg.startsWith(param))
  
  if (value) {
    return value.replace(`${param}=`, '')
  } else {
    return defaultValue
  }
}

export const baseURL = getCommandLineArg('--url', 'http://localhost:8080/org.geppetto.frontend');

const getFullPath = (relativePath = 'geppetto?') => urljoin(baseURL, relativePath);

export const getUrlFromProjectId = (id = undefined) => urljoin(baseURL, 'geppetto?') + (id ? `load_project_from_id=${id}` : '');
export const getUrlFromProjectUrl = (url = undefined) => urljoin(baseURL, 'geppetto?') + (url ? `load_project_from_url=${url}` : '');
export const getProjectUrlFromId = id => getFullPath(`geppetto?load_project_from_id=${id}`);

export const getEmptySceneUrl = () => getFullPath();
