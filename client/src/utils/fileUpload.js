import { message } from 'antd';
import axios from 'axios';
import compressImageFile from './compress';

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const getBase6 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const beforeUpload = file => {
  const isImage = file.type.includes('image/');
  const isPdf = file.type.includes('application/pdf');
  if (!isImage && !isPdf)
    message.error('You can only upload image or pdf file!');

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M)
    message.error('Image must smaller than 2MB!');

  return (isImage || isPdf) && isLt2M;
};

export const preview = async file => {
  if (!file.url && !file.preview && !file.thumbUrl) {
    file.preview = await getBase6(file.originFileObj);
    return file.preview;
  }
  return false;
};

export const compressAndUploadImage = async options => {
  const data = new FormData();
  let resizedFile = '';
  if (options.file.type !== 'application/pdf')
    resizedFile = await compressImageFile(options.file);

  data.append('file', resizedFile || options.file);
  axios.post(options.action, data).then((res) => {
    options.onSuccess(res.data, resizedFile || options.file);
  }).catch((err) => {
    console.log(err);
  });
};
