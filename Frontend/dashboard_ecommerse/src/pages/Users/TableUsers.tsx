import { Table, Tag, Empty } from 'antd';
import { useState, useEffect } from 'react';
import type { UserType } from './Type';
import TableAction from '../../components/common/TableAction';
import type { ColumnsType } from 'antd/es/table';

type Props = {
  users: UserType[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const TableUsers = ({
  users,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onDelete,
  onEdit,
}: Props) => {
  const [loadingTip, setLoadingTip] = useState<string>('');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (loading) {
      timer = setTimeout(() => {
        setLoadingTip('Server đang khởi động, vui lòng chờ trong giây lát...');
      }, 5000);
    } else {
      setLoadingTip('');
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const columns: ColumnsType<UserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'volcano' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <TableAction
          showEdit={true}
          showDelete={true}
          onEdit={() => onEdit(record.id)}
          onDelete={() => onDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      bordered
      columns={columns}
      dataSource={users}
      rowKey="id"
      locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
      loading={
        { spinning: !!loading, tip: loadingTip }
      }
      pagination={{
        total,
        current: page,
        pageSize,
        onChange: onPageChange,
        showSizeChanger: true,
      }}
    />
  );
};

export default TableUsers;
