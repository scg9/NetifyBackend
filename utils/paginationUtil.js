const paginate = async (model, query = {}, options = {}) => {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 15;
    const sort = options.sort || {};
    const select = options.select || null;
  
    // Calculate skip value
    const skip = (page - 1) * limit;
  
    // Fetch data and count total documents
    const [data, totalItems] = await Promise.all([
      model
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .select(select),
      model.countDocuments(query),
    ]);
  
    return {
      data,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    };
  };
  
  module.exports = paginate;
  