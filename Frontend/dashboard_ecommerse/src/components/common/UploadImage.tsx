import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { useEffect, useState } from 'react';

interface ValueType {
  imageUrl: string;
  file?: File;
  publicId?: string;
}

interface Props {
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}

const UploadImage = ({ value, onChange }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value?.imageUrl);

  useEffect(() => {
    setPreviewUrl(value?.imageUrl);
  }, [value?.imageUrl]);

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      // Gửi cả link preview và file vật lý lên form
      onChange?.({
        imageUrl: url,
        file: file
      });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </div>
  );

  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      accept="image/*"
    >
      {previewUrl ? (
        <img 
          src={previewUrl} 
          alt="product" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default UploadImage;
