'use strict'

module.exports = function(app, mongoose, router) {
	const Album = mongoose.model('Album');

	router.get('/genres/mostAlbums', (req, res) => {
    Album
      .aggregate([
  			{
  				$group: {
  					_id: '$genre',
            albums: { $push: '$title' }
  				}
  			},
  			{
  				$project: {
            _id: 0,
            genre: '$_id',
  					numberOfAlbums: { $size: '$albums' },
  				}
  			},
  			{
  				$sort: { numberOfAlbums: -1 }
  			}
  		])
			.exec((err, genres) => {
				if (err) {
					res.status(400).json({ error: err.message });
				} else {
					res.json({ genres: genres });
				}
			});
	});
};
