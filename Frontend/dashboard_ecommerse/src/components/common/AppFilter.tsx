import { Form, Input, Select, Space } from 'antd';
import React, { useState } from 'react';

type BaseFilter = {
  name: string;
  placeholder?: string;
  label?: string;
};

type InputFilter = BaseFilter & {
  type: 'input';
};

type FilterOptions = {
  value: string | number;
  label: string;
};

type SelectFilter = BaseFilter & {
  type: 'select';
  options: FilterOptions[];
};

export type FilterConfig = InputFilter | SelectFilter;

type FilterProps = {
  filters: FilterConfig[];
  onChange: (values: Record<string, any>) => void;
};

const AppFilter: React.FC<FilterProps> = ({ filters, onChange }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const handleChange = (name: string, value: any) => {
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
    onChange(newValues);
  };

  return (
    <div>
      <Space wrap>
        {filters.map((filter) => {
          switch (filter.type) {
            case 'input':
              return (
                <>
                  <Form.Item
                    key={filter.name}
                    label={filter.label || ''}
                    style={{ marginBottom: 0 }}
                    layout='vertical'
                  >
                    <Input
                      placeholder={filter.placeholder}
                      allowClear
                      onChange={(e) =>
                        handleChange(filter.name, e.target.value)
                      }
                      style={{
                        width: '200px',
                      }}
                    />
                  </Form.Item>
                </>
              );
            case 'select':
              return (
                <>
                  <Form.Item
                    key={filter.name}
                    label={filter.label || ''}
                    style={{ marginBottom: 0 }}
                    layout='vertical'
                  >
                    <Select
                      placeholder={filter.placeholder}
                      options={filter.options}
                      allowClear
                      onChange={(value) => handleChange(filter.name, value)}
                      style={{
                        width: '200px',
                      }}
                    />
                  </Form.Item>
                </>
              );
          }
        })}
      </Space>
    </div>
  );
};

export default AppFilter;
