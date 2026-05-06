const prisma = require('../lib/prisma');

const getSettings = async (req, res) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      // Create default setting if none exists
      setting = await prisma.setting.create({
        data: {
          countdownDate: new Date('2026-12-31T23:59:59'),
          socialLinks: { facebook: '', instagram: '', twitter: '' },
          contactInfo: { address: '', email: '', phone: '' }
        }
      });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

const updateSettings = async (req, res) => {
  const { logoUrl, socialLinks, countdownDate, contactInfo } = req.body;
  try {
    let setting = await prisma.setting.findFirst();
    if (setting) {
      setting = await prisma.setting.update({
        where: { id: setting.id },
        data: { logoUrl, socialLinks, countdownDate: countdownDate ? new Date(countdownDate) : null, contactInfo }
      });
    } else {
      setting = await prisma.setting.create({
        data: { logoUrl, socialLinks, countdownDate: countdownDate ? new Date(countdownDate) : null, contactInfo }
      });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
