import { Base64 } from 'js-base64';

const getTimeStamp = () => new Date().toGMTString().replace(',', '').replace(/[ ,:]/g, '_');

const createFileName = (name) => name + getTimeStamp();

const forceBlobDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

export const downloadJsonResponse = (jsonData) => {
  let filename = createFileName('NetPyNE_Model_');

  if (jsonData.simConfig && jsonData.simConfig.filename) {
    filename = createFileName(`${jsonData.simConfig.filename}_`);
  }

  filename += '.json';

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  forceBlobDownload(blob, filename);
};

export const downloadPythonResponse = (exportInfo) => {
  const content = Base64.decode(exportInfo.fileContent);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  forceBlobDownload(blob, exportInfo.fileName);
};

export class PythonMessageFilter {
  errorIds = new Set();
  shouldLaunch(e) {
    const errorId = e.additionalInfo?.sim_id;
    if (!errorId) {
      return true;
    }
    if (errorId) {
      if (this.errorIds.has(errorId)) {
        return false;
      }
      this.errorIds.add(errorId);
      return true;
    }
  }
}

export const pythonCall = async ({
  cmd,
  args,
}) => {
  const response = await Utils.evalPythonMessage(cmd, [args]);
  const errorPayload = processError(response);
  // GEPPETTO.trigger(GEPPETTO.Events.Hide_spinner);

  if (errorPayload) {
    throw errorPayload;
  }

  return response;
};


export const processError = (response) => {
  const parsedResponse = Utils.getErrorResponse(response);
  if (parsedResponse) {
    Utils.captureSentryException(parsedResponse);
    return {
      errorMessage: parsedResponse.message,
      errorDetails: parsedResponse.details,
      additionalInfo: parsedResponse.additionalInfo,
    };
  }
  return false;
};

