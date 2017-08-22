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

	router.get('/artists/byName', (req, res) => {
    console.log(req.query.name);
    let artistName = req.query.name;

		Album
			.aggregate(
        [
          { $match: { name: artistName } },
          { $group: { _id: "$name" } }
        ]
      )
			.exec((err, artists) => {
				if (err) {
					res.status(400).json({ error: err.message });
				} else {
					res.json({ artists: artists });
				}
			});
	});
};
