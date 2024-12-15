const Show = require('../models/showModel');
const paginate = require('../utils/paginationUtil');

const getShows = async (req, res) => {
  try {
    const { page = 1, limit = 15, sort = null, keyword = "" } = req.query;
    const regex = keyword ? new RegExp(keyword, 'i') : null;
    // console.log(keyword ? { $or: [{ cast: regex }, { title: regex }] } : {})
    const result = await paginate(Show, keyword ? { $or: [{ cast: regex }, { title: regex }] } : {}, {
      page,
      limit,
      sort: sort ? JSON.parse(sort) : { createdAt: -1 },
    });
    // Send the response back with the shows and pagination details
    res.json(result);
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ message: 'Error fetching shows' });
  }
};

const getShowDetails = async (req, res) => {
  const { show_id } = req.params;

  const show = await Show.findOne({ show_id });
  if (!show) {
    return res.status(404).json({ message: 'Show not found' });
  }

  res.json(show);
};

module.exports = { getShows, getShowDetails };
