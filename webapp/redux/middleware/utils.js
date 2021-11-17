const createFileName = (name) => name + getTimeStamp();

const getTimeStamp = () => new Date().toGMTString().replace(',', '').replace(/[ ,:]/g, '_');

const unescapeText = (text) => {
  text = text.replace(/\\\\/g, '\\').replace(/\\\'/g, "'").replace(/\\\"/g, '"').split('\\n')
    .join('\n')
    .substring(1);
  return text.substring(0, text.length - 1);
};

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

export const downloadPythonResponse = (textData) => {
  const filename = `${createFileName('NetPyNE_init_')}.py`;
  const blob = new Blob([unescapeText(textData)], { type: 'text/plain;charset=utf-8' });
  forceBlobDownload(blob, filename);
};
