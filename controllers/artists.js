'use strict'

module.exports = function(app, mongoose, router) {
	const Album = mongoose.model("Album");

	router.get('/artists', (req, res) => {
		Album
			.distinct('artist')
			.exec((err, artists) => {
				if (err) {
					res.status(400).json({ error: err.message });
				} else {
					res.json({ artists: artists });
				}
			});
	});

	router.get('/artists/:name', (req, res) => {
		Album
			.aggregate([
        {
          $match: {
            artist: req.params.name
          }
        }
      ])
			.exec((err, albums) => {
				if (err) {
					res.status(400).json({ error: err.message });
				} else {
					res.json({ artistsAlbums: albums });
				}
			});
	});
};
