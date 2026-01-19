import { Table, Tag } from 'antd';
import type { PhycoCategoryType } from './Type';
import TableAction from '../../components/common/TableAction';
import { useState } from 'react';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';

type Props = {
  categories: PhycoCategoryType[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number, pageSize: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const TablePhycoCategories = ({
  categories,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onDelete,
  onEdit,
}: Props) => {
  // Track expanded parent IDs
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  // Calculate total products including children
  const getTotalProducts = (category: PhycoCategoryType) => {
    const ownProducts = category._count?.products || 0;

    // Find all children from the categories array (not from category.children which is undefined)
    const children = categories.filter((cat) => cat.parentId === category.id);
    const childrenProducts = children.reduce(
      (sum, child) => sum + (child._count?.products || 0),
      0
    );

    return ownProducts + childrenProducts;
  };

  // Toggle expand/collapse
  const toggleExpand = (parentId: number) => {
    setExpandedKeys((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  };

  // Build flat hierarchical data: parents followed by their children (if expanded)
  const buildHierarchicalData = () => {
    const result: PhycoCategoryType[] = [];

    // Get only parent categories
    const parents = categories.filter(
      (cat) => cat.parentId === null || cat.parentId === undefined
    );

    parents.forEach((parent) => {
      // Add parent without children property to prevent tree mode
      result.push({
        ...parent,
        children: undefined,
      });

      // Add children only if parent is expanded
      if (expandedKeys.includes(parent.id)) {
        const children = categories.filter((cat) => cat.parentId === parent.id);
        children.forEach((child) => {
          result.push({
            ...child,
            children: undefined,
          });
        });
      }
    });

    return result;
  };

  const hierarchicalData = buildHierarchicalData();

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PhycoCategoryType) => {
        // Check if this is a parent with children
        const hasChildren = categories.some(
          (cat) => cat.parentId === record.id
        );
        const isExpanded = expandedKeys.includes(record.id);
        const isParent = !record.parentId;

        return (
          <div
            style={{
              paddingLeft: record.parentId ? 32 : 0,
              display: 'flex',
              alignItems: 'center',
              fontWeight: isParent && hasChildren ? 600 : 400,
            }}
          >
            {/* Expand icon for parents with children */}
            {isParent && hasChildren && (
              <span
                onClick={() => toggleExpand(record.id)}
                style={{
                  cursor: 'pointer',
                  marginRight: 12,
                  color: '#1890ff',
                  fontSize: 16,
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#40a9ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1890ff')}
              >
                {isExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />}
              </span>
            )}

            {/* Indent icon for children */}
            {record.parentId && (
              <span style={{ color: '#bfbfbf', marginRight: 8, fontSize: 14 }}>
                └─
              </span>
            )}

            <span style={{ color: record.parentId ? '#595959' : '#262626' }}>
              {text}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <p>{text || '-'}</p>,
    },
    {
      title: 'Số sản phẩm',
      dataIndex: '_count',
      key: 'productCount',
      render: (_count: any, record: PhycoCategoryType) => (
        <p>
          {record.parentId ? _count?.products || 0 : getTotalProducts(record)}
        </p>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Hoạt động' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record: any) => (
        <TableAction
          showEdit
          showDelete
          onEdit={() => onEdit(record.id)}
          onDelete={() => onDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={hierarchicalData}
      loading={loading}
      rowKey='id'
      rowClassName={(record) => {
        const hasChildren = categories.some(
          (cat) => cat.parentId === record.id
        );
        return !record.parentId && hasChildren ? 'parent-category-row' : '';
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPageChange,
      }}
    />
  );
};

export default TablePhycoCategories;
