const fs = require('fs/promises');
const path = require('path');

const provincesPath = path.join(__dirname, '../../API/json/provinces.json');
const treePath = path.join(__dirname, '../../API/json/tree.json');

const getProvinces = async (req, res) => {
  try {
    const data = await fs.readFile(provincesPath, 'utf8');
    const provinces = JSON.parse(data);
    return res.status(200).json(provinces);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu tỉnh thành' });
  }
};

const getWardsByProvince = async (req, res) => {
  const { provinceCode } = req.params;
  try {
    const data = await fs.readFile(treePath, 'utf8');
    const tree = JSON.parse(data);
    
    const province = tree.find(p => p.code === provinceCode);
    if (!province) {
      return res.status(404).json({ message: 'Không tìm thấy tỉnh thành này' });
    }
    
    return res.status(200).json(province.wards || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu phường xã' });
  }
};

module.exports = {
  getProvinces,
  getWardsByProvince
};
