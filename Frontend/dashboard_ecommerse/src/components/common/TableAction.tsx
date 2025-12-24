import { Popconfirm, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
type ExtraAction = {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  color?: string;
};

type Props = {
  showEdit?: boolean;
  showDelete?: boolean;
  showDetail?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onDetail?: () => void;
  extraAction?: ExtraAction[];
};

const TableAction = ({
  showEdit,
  showDelete,
  showDetail,
  onEdit,
  onDelete,
  onDetail,
  extraAction,
}: Props) => {
  return (
    <>
      <Space>
        {showDetail && (
          <Tooltip title='Xem chi tiết'>
            <EyeOutlined
              style={{ color: '#52c41a', cursor: 'pointer' }}
              onClick={onDetail}
            />
          </Tooltip>
        )}

        {showEdit && (
          <Tooltip title='Chỉnh sửa'>
            <EditOutlined
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={onEdit}
            />
          </Tooltip>
        )}

        {showDelete && (
          <Popconfirm
            title='Xác nhận xóa'
            description='Bạn có chắc chắn muốn xóa mục này không?'
            okText='Xóa'
            cancelText='Hủy'
            onConfirm={onDelete}
          >
            <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
          </Popconfirm>
        )}

        {/* {extraAction?.map((action) => (
          <Tooltip key={action.tooltip} title={action.tooltip}>
            <span
              style={{ color: action.color || '#1890ff', cursor: 'pointer' }}
              onClick={action.onClick}
            >
              {action.icon}
            </span>
          </Tooltip>
        ))} */}
      </Space>
    </>
  );
};

export default TableAction;
